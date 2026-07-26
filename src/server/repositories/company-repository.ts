import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";
import type { DatabaseClient, DatabaseTransactionClient } from "@/src/server/db/types";

type DatabaseExecutor = DatabaseClient | DatabaseTransactionClient;

export const companyOwnerSelect = {
  id: true,
  slug: true,
  legalName: true,
  displayName: true,
  businessType: true,
  businessEmail: true,
  businessPhone: true,
  description: true,
  website: true,
  primaryProducts: true,
  addressLine1: true,
  addressLine2: true,
  registrationNumber: true,
  tradeLicenseNumber: true,
  taxVatNumber: true,
  registrationCountryId: true,
  primaryLocationId: true,
  foundedYear: true,
  employeeRange: true,
  verificationStatus: true,
  accountStatus: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  registrationCountry: { select: { id: true, iso2: true, iso3: true, name: true } },
  primaryLocation: {
    select: {
      id: true,
      name: true,
      type: true,
      country: { select: { id: true, iso2: true, name: true } },
      parent: {
        select: {
          id: true,
          name: true,
          type: true,
          country: { select: { id: true, iso2: true, name: true } },
          parent: {
            select: {
              id: true,
              name: true,
              type: true,
              country: { select: { id: true, iso2: true, name: true } },
            },
          },
        },
      },
    },
  },
  categories: {
    select: {
      isPrimary: true,
      category: { select: { id: true, scope: true, slug: true, name: true } },
    },
    orderBy: { category: { name: "asc" } },
  },
  countriesServed: {
    select: { relationship: true, country: { select: { id: true, iso2: true, iso3: true, name: true } } },
    orderBy: { country: { name: "asc" } },
  },
} satisfies Prisma.CompanySelect;

export type CompanyOwnerRecord = Prisma.CompanyGetPayload<{ select: typeof companyOwnerSelect }>;

export const companySummarySelect = {
  id: true,
  slug: true,
  displayName: true,
  businessType: true,
  verificationStatus: true,
  accountStatus: true,
  updatedAt: true,
  version: true,
} satisfies Prisma.CompanySelect;

export type CompanySummaryRecord = Prisma.CompanyGetPayload<{ select: typeof companySummarySelect }>;

export function findActiveCompanyById(db: DatabaseExecutor, id: string) {
  return db.company.findFirst({ where: { id, deletedAt: null }, select: companyOwnerSelect });
}

export function findActiveCompanyBySlug(db: DatabaseExecutor, slug: string) {
  return db.company.findFirst({ where: { slug, deletedAt: null }, select: companyOwnerSelect });
}

export function listActiveCompaniesForUser(db: DatabaseExecutor, userId: string) {
  return db.company.findMany({
    where: { deletedAt: null, members: { some: { userId, status: "active", deletedAt: null } } },
    select: companySummarySelect,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
  });
}

export function findActiveCountryById(db: DatabaseExecutor, id: string) {
  return db.country.findFirst({ where: { id, isActive: true }, select: { id: true, iso2: true, name: true } });
}

export function findActiveLocationById(db: DatabaseExecutor, id: string) {
  return db.location.findFirst({
    where: { id, isActive: true, deletedAt: null },
    select: {
      id: true,
      countryId: true,
      name: true,
      type: true,
      parent: {
        select: {
          id: true,
          countryId: true,
          type: true,
          isActive: true,
          deletedAt: true,
          parent: {
            select: { id: true, countryId: true, type: true, isActive: true, deletedAt: true },
          },
        },
      },
    },
  });
}

export function findActiveCategoriesByIds(db: DatabaseExecutor, ids: string[]) {
  return db.category.findMany({
    where: { id: { in: ids }, isActive: true, deletedAt: null },
    select: { id: true },
  });
}

export function createCompany(db: DatabaseExecutor, data: Prisma.CompanyCreateInput) {
  return db.company.create({ data, select: companyOwnerSelect });
}

export function updateCompany(db: DatabaseExecutor, id: string, data: Prisma.CompanyUpdateInput) {
  return db.company.update({ where: { id }, data, select: companyOwnerSelect });
}

/** Atomically applies an update only when the caller's expected version remains current. */
export async function updateCompanyWithExpectedVersion(db: DatabaseExecutor, id: string, expectedVersion: number, data: Prisma.CompanyUpdateInput) {
  const result = await db.company.updateMany({ where: { id, version: expectedVersion, deletedAt: null }, data });
  if (result.count !== 1) return null;
  return findActiveCompanyById(db, id);
}
