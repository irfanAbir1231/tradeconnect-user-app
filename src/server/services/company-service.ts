import "server-only";

import { Prisma } from "@/src/generated/prisma/client";
import { writeCompanyAuditEvent } from "@/src/server/audit/company-audit";
import { requireCompanyAccess, requireCompanyAdministrator } from "@/src/server/company/authorization";
import { toCompanyMemberProfileView } from "@/src/server/company/dashboard-view";
import { companySlugBase, companySlugCandidate } from "@/src/server/company/slug";
import type { CurrentActor } from "@/src/server/auth/actor";
import { requireActorPermission } from "@/src/server/auth/require-permission";
import { getPrismaClient } from "@/src/server/db/client";
import { withTransaction } from "@/src/server/db/transaction";
import { AppError } from "@/src/server/errors/app-error";
import { createOwnerMembership, setPrimaryMembership } from "@/src/server/repositories/company-membership-repository";
import {
  createCompany,
  findActiveCategoriesByIds,
  findActiveCompanyById,
  findActiveCompanyBySlug,
  findActiveCountryById,
  findActiveLocationById,
  listActiveCompaniesForUser,
  updateCompanyWithExpectedVersion,
} from "@/src/server/repositories/company-repository";
import type { CreateCompanyInput, UpdateCompanyInput } from "@/src/server/validators/company";

import { toCompanySummaryView, toOwnerCompanyView } from "../company/company-view";

type ServiceContext = { requestId: string };

function hasValidLocationHierarchy(location: NonNullable<Awaited<ReturnType<typeof findActiveLocationById>>>, countryId: string) {
  if (location.countryId !== countryId) return false;
  if (location.type === "division") return location.parent === null;
  if (location.type === "district") return Boolean(location.parent && location.parent.type === "division" && location.parent.countryId === countryId && location.parent.isActive && !location.parent.deletedAt);
  if (location.type === "upazila") return Boolean(
    location.parent
    && location.parent.type === "district"
    && location.parent.countryId === countryId
    && location.parent.isActive
    && !location.parent.deletedAt
    && location.parent.parent
    && location.parent.parent.type === "division"
    && location.parent.parent.countryId === countryId
    && location.parent.parent.isActive
    && !location.parent.parent.deletedAt,
  );
  return true;
}

function isUniqueConstraint(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function validateReferences(
  db: Parameters<typeof findActiveCountryById>[0],
  input: Pick<CreateCompanyInput, "registrationCountryId" | "primaryLocationId" | "categoryIds" | "countriesServed">,
) {
  const country = await findActiveCountryById(db, input.registrationCountryId);
  if (!country) throw AppError.validation("Please correct the highlighted fields.", { registrationCountryId: "Select an active country." });

  if (input.primaryLocationId) {
    const location = await findActiveLocationById(db, input.primaryLocationId);
    if (!location || !hasValidLocationHierarchy(location, country.id)) {
      throw AppError.validation("Please correct the highlighted fields.", { primaryLocationId: "Select an active location in the registration country and its valid hierarchy." });
    }
  }

  const categoryIds = input.categoryIds ?? [];
  if (categoryIds.length > 0) {
    const categories = await findActiveCategoriesByIds(db, categoryIds);
    if (categories.length !== categoryIds.length) {
      throw AppError.validation("Please correct the highlighted fields.", { categoryIds: "One or more selected categories are unavailable." });
    }
  }

  for (const countryRelationship of input.countriesServed ?? []) {
    const servedCountry = await findActiveCountryById(db, countryRelationship.countryId);
    if (!servedCountry) {
      throw AppError.validation("Please correct the highlighted fields.", { countriesServed: "One or more selected countries are unavailable." });
    }
  }
}

function companyCreateData(actor: CurrentActor, input: CreateCompanyInput, slug: string): Prisma.CompanyCreateInput {
  return {
    slug,
    legalName: input.legalName,
    displayName: input.displayName,
    businessType: input.businessType,
    businessEmail: input.businessEmail ?? actor.email,
    businessPhone: input.businessPhone,
    description: input.description,
    website: input.website,
    primaryProducts: input.primaryProducts,
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2,
    registrationNumber: input.registrationNumber,
    tradeLicenseNumber: input.tradeLicenseNumber,
    taxVatNumber: input.taxVatNumber,
    foundedYear: input.foundedYear,
    employeeRange: input.employeeRange,
    createdBy: { connect: { id: actor.id } },
    registrationCountry: { connect: { id: input.registrationCountryId } },
    ...(input.primaryLocationId ? { primaryLocation: { connect: { id: input.primaryLocationId } } } : {}),
    categories: { create: input.categoryIds.map((categoryId) => ({ categoryId, isPrimary: categoryId === input.primaryCategoryId })) },
    countriesServed: {
      create: (input.countriesServed ?? []).map((entry) => ({ countryId: entry.countryId, relationship: entry.relationship })),
    },
    // Establishes readiness state without starting the verification workflow.
    verification: { create: {} },
  };
}

function updateCompanyData(actor: CurrentActor, input: UpdateCompanyInput): Prisma.CompanyUpdateInput {
  const data: Prisma.CompanyUpdateInput = { version: { increment: 1 } };
  if (input.legalName !== undefined) data.legalName = input.legalName;
  if (input.displayName !== undefined) data.displayName = input.displayName;
  if (input.businessType !== undefined) data.businessType = input.businessType;
  if (input.businessPhone !== undefined) data.businessPhone = input.businessPhone;
  if (input.description !== undefined) data.description = input.description;
  if (input.website !== undefined) data.website = input.website;
  if (input.primaryProducts !== undefined) data.primaryProducts = input.primaryProducts;
  if (input.addressLine1 !== undefined) data.addressLine1 = input.addressLine1;
  if (input.addressLine2 !== undefined) data.addressLine2 = input.addressLine2;
  if (input.registrationNumber !== undefined) data.registrationNumber = input.registrationNumber;
  if (input.tradeLicenseNumber !== undefined) data.tradeLicenseNumber = input.tradeLicenseNumber;
  if (input.taxVatNumber !== undefined) data.taxVatNumber = input.taxVatNumber;
  if (input.foundedYear !== undefined) data.foundedYear = input.foundedYear;
  if (input.employeeRange !== undefined) data.employeeRange = input.employeeRange;
  if (input.businessEmail !== undefined) data.businessEmail = input.businessEmail ?? actor.email;
  if (input.registrationCountryId !== undefined) data.registrationCountry = { connect: { id: input.registrationCountryId } };
  if (input.primaryLocationId !== undefined) data.primaryLocation = input.primaryLocationId ? { connect: { id: input.primaryLocationId } } : { disconnect: true };
  return data;
}

async function createWithUniqueSlug(actor: CurrentActor, input: CreateCompanyInput, context: ServiceContext) {
  const baseSlug = companySlugBase(input.displayName || input.legalName);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      return await withTransaction(async (db) => {
        await validateReferences(db, input);
        const company = await createCompany(db, companyCreateData(actor, input, companySlugCandidate(baseSlug, attempt)));
        await createOwnerMembership(db, company.id, actor.id);
        await setPrimaryMembership(db, actor.id, company.id);
        const completeCompany = await findActiveCompanyById(db, company.id);
        if (!completeCompany) throw AppError.notFound();
        await writeCompanyAuditEvent(db, { actor, action: "company.created", company: completeCompany, requestId: context.requestId });
        return completeCompany;
      });
    } catch (error) {
      if (isUniqueConstraint(error)) continue;
      throw error;
    }
  }
  throw AppError.conflict("Unable to reserve a unique company URL. Please try again.");
}

export async function createCompanyForActor(actor: CurrentActor, input: CreateCompanyInput, context: ServiceContext) {
  requireActorPermission(actor, "manage_own_company");
  return toOwnerCompanyView(await createWithUniqueSlug(actor, input, context));
}

export async function listCompaniesForActor(actor: CurrentActor) {
  requireActorPermission(actor, "manage_own_company");
  const companies = await listActiveCompaniesForUser(getPrismaClient(), actor.id);
  return companies.map(toCompanySummaryView);
}

async function getOwnerCompanyForActor(actor: CurrentActor, companyId: string) {
  const company = await findActiveCompanyById(getPrismaClient(), companyId);
  if (!company) throw AppError.notFound();
  requireCompanyAccess(actor, company.id);
  return toOwnerCompanyView(company);
}

/** API-facing member projection. Owners/admins receive private fields; members do not. */
export async function getCompanyForActor(actor: CurrentActor, companyId: string) {
  const company = await getOwnerCompanyForActor(actor, companyId);
  const membership = actor.companyMemberships.find((entry) => entry.companyId === companyId);
  if (!membership && !actor.permissions.includes("manage_companies")) throw AppError.notFound();
  return membership ? toCompanyMemberProfileView(actor, company, membership) : company;
}

export async function getCompanyBySlugForActor(actor: CurrentActor, slug: string) {
  const company = await findActiveCompanyBySlug(getPrismaClient(), slug);
  if (!company) throw AppError.notFound();
  requireCompanyAccess(actor, company.id);
  const ownerView = toOwnerCompanyView(company);
  const membership = actor.companyMemberships.find((entry) => entry.companyId === company.id);
  if (!membership && !actor.permissions.includes("manage_companies")) throw AppError.notFound();
  return membership ? toCompanyMemberProfileView(actor, ownerView, membership) : ownerView;
}

export async function getPrimaryCompanyForActor(actor: CurrentActor) {
  const membership = actor.companyMemberships.find((entry) => entry.isPrimary);
  if (!membership) return null;
  return getOwnerCompanyForActor(actor, membership.companyId);
}

export async function updateCompanyForActor(actor: CurrentActor, companyId: string, input: UpdateCompanyInput, context: ServiceContext) {
  requireActorPermission(actor, "manage_own_company");
  requireCompanyAdministrator(actor, companyId);

  const company = await withTransaction(async (db) => {
    const before = await findActiveCompanyById(db, companyId);
    if (!before) throw AppError.notFound();
    if (before.version !== input.version) throw AppError.companyVersionConflict();

    const effectiveInput = {
      registrationCountryId: input.registrationCountryId ?? before.registrationCountryId,
      primaryLocationId: input.primaryLocationId === undefined ? before.primaryLocationId : input.primaryLocationId,
      // Historical inactive categories remain readable. They must be reselected
      // only when the caller changes the category relationship.
      categoryIds: input.categoryIds ?? [],
      countriesServed: input.countriesServed,
    };
    if (!effectiveInput.registrationCountryId) throw AppError.validation("Please correct the highlighted fields.", { registrationCountryId: "Select an active country." });
    await validateReferences(db, effectiveInput as CreateCompanyInput);

    if (input.categoryIds && input.primaryCategoryId) {
      await db.companyCategory.deleteMany({ where: { companyId } });
      await db.companyCategory.createMany({ data: input.categoryIds.map((categoryId) => ({ companyId, categoryId, isPrimary: categoryId === input.primaryCategoryId })) });
    }
    if (input.countriesServed !== undefined) {
      await db.companyCountry.deleteMany({ where: { companyId } });
      if (input.countriesServed.length > 0) {
        await db.companyCountry.createMany({ data: input.countriesServed.map((entry) => ({ companyId, countryId: entry.countryId, relationship: entry.relationship })) });
      }
    }

    try {
      const updated = await updateCompanyWithExpectedVersion(db, companyId, input.version, updateCompanyData(actor, input));
      if (!updated) throw AppError.companyVersionConflict();
      await writeCompanyAuditEvent(db, { actor, action: "company.updated", company: updated, before, requestId: context.requestId });
      return updated;
    } catch (error) {
      if (isUniqueConstraint(error)) throw AppError.companyRegistrationConflict();
      throw error;
    }
  });

  return toOwnerCompanyView(company);
}

export async function setPrimaryCompanyForActor(actor: CurrentActor, companyId: string, context: ServiceContext) {
  requireActorPermission(actor, "manage_own_company");
  const company = await withTransaction(async (db) => {
    const membership = await setPrimaryMembership(db, actor.id, companyId);
    if (!membership) throw AppError.notFound();
    const record = await findActiveCompanyById(db, companyId);
    if (!record) throw AppError.notFound();
    await writeCompanyAuditEvent(db, { actor, action: "company.primary_selected", company: record, requestId: context.requestId });
    return record;
  });
  return toOwnerCompanyView(company);
}
