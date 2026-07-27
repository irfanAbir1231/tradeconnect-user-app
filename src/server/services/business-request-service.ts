import "server-only";

import { Prisma } from "@/src/generated/prisma/client";
import { writeBusinessRequestAuditEvent, type RequestAuditSnapshot } from "@/src/server/audit/business-request-audit";
import { requireBusinessRequestAccess, requireDraftRequestOwner } from "@/src/server/business-requests/policy";
import { businessRequestReference, businessRequestSlugBase, businessRequestSlugCandidate } from "@/src/server/business-requests/slug";
import { toBusinessRequestDetail, toBusinessRequestListItem } from "@/src/server/business-requests/request-view";
import { requestSubmissionErrors, type RequestSubmissionCandidate } from "@/src/server/business-requests/submission";
import type { BusinessRequestListInput, CreateBusinessRequestInput, UpdateBusinessRequestInput } from "@/src/server/validators/business-request";
import type { CurrentActor } from "@/src/server/auth/actor";
import { requireActorPermission } from "@/src/server/auth/require-permission";
import { getPrismaClient } from "@/src/server/db/client";
import { withTransaction } from "@/src/server/db/transaction";
import { AppError } from "@/src/server/errors/app-error";
import {
  createBusinessRequest,
  findActiveBusinessRequestById,
  listActiveBusinessRequestsForCompany,
  softDeleteBusinessRequestWithExpectedVersion,
  updateBusinessRequestWithExpectedVersion,
  type BusinessRequestRecord,
} from "@/src/server/repositories/business-request-repository";
import { findActiveCategoriesByIds, findActiveCompanyById, findActiveCountryById, findActiveLocationById } from "@/src/server/repositories/company-repository";

type ServiceContext = { requestId: string };

function requestSnapshot(request: BusinessRequestRecord): RequestAuditSnapshot {
  return {
    id: request.id,
    companyId: request.companyId,
    status: request.status,
    version: request.version,
    requestType: request.requestType,
    title: request.title,
    description: request.description,
    priority: request.priority,
    categoryId: request.categoryId,
    sourceCountryId: request.sourceCountryId,
    destinationCountryId: request.destinationCountryId,
    locationId: request.locationId,
    quantityValue: request.quantityValue,
    quantityUnit: request.quantityUnit,
    quantityFrequency: request.quantityFrequency,
    budgetMin: request.budgetMin,
    budgetMax: request.budgetMax,
    budgetCurrencyCode: request.budgetCurrencyCode,
    budgetUnit: request.budgetUnit,
    timeline: request.timeline,
  };
}

function primaryCompanyId(actor: CurrentActor) {
  const primaryMembership = actor.companyMemberships.find((membership) => membership.isPrimary);
  if (!primaryMembership) throw AppError.invalidState("Create or select a primary company before creating a request.");
  return primaryMembership.companyId;
}

async function validateReferences(
  db: Parameters<typeof findActiveCountryById>[0],
  input: Pick<CreateBusinessRequestInput, "categoryId" | "sourceCountryId" | "destinationCountryId" | "locationId">,
) {
  if (input.categoryId) {
    const categories = await findActiveCategoriesByIds(db, [input.categoryId]);
    if (categories.length !== 1) throw AppError.validation("Please correct the highlighted fields.", { categoryId: "Select an active business category." });
  }
  if (input.sourceCountryId && !await findActiveCountryById(db, input.sourceCountryId)) {
    throw AppError.validation("Please correct the highlighted fields.", { sourceCountryId: "Select an active source country." });
  }
  if (input.destinationCountryId && !await findActiveCountryById(db, input.destinationCountryId)) {
    throw AppError.validation("Please correct the highlighted fields.", { destinationCountryId: "Select an active destination country." });
  }
  if (input.locationId && !await findActiveLocationById(db, input.locationId)) {
    throw AppError.validation("Please correct the highlighted fields.", { locationId: "Select an active location." });
  }
}

function createData(actor: CurrentActor, companyId: string, input: CreateBusinessRequestInput, slug: string): Prisma.BusinessRequestCreateInput {
  return {
    referenceNumber: businessRequestReference(),
    slug,
    title: input.title,
    description: input.description,
    requestType: input.requestType,
    priority: input.priority,
    company: { connect: { id: companyId } },
    creator: { connect: { id: actor.id } },
    ...(input.categoryId ? { category: { connect: { id: input.categoryId } } } : {}),
    ...(input.sourceCountryId ? { sourceCountry: { connect: { id: input.sourceCountryId } } } : {}),
    ...(input.destinationCountryId ? { destinationCountry: { connect: { id: input.destinationCountryId } } } : {}),
    ...(input.locationId ? { location: { connect: { id: input.locationId } } } : {}),
    ...(input.quantityValue ? { quantityValue: input.quantityValue } : {}),
    ...(input.quantityUnit ? { quantityUnit: input.quantityUnit } : {}),
    ...(input.quantityFrequency ? { quantityFrequency: input.quantityFrequency } : {}),
    ...(input.budgetMin ? { budgetMin: input.budgetMin } : {}),
    ...(input.budgetMax ? { budgetMax: input.budgetMax } : {}),
    ...(input.budgetCurrencyCode ? { budgetCurrencyCode: input.budgetCurrencyCode } : {}),
    ...(input.budgetUnit ? { budgetUnit: input.budgetUnit } : {}),
    ...(input.timeline ? { timeline: input.timeline } : {}),
  };
}

function updateData(input: UpdateBusinessRequestInput): Prisma.BusinessRequestUpdateInput {
  const data: Prisma.BusinessRequestUpdateInput = { version: { increment: 1 } };
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.priority !== undefined) data.priority = input.priority;
  if (input.categoryId !== undefined) data.category = input.categoryId ? { connect: { id: input.categoryId } } : { disconnect: true };
  if (input.sourceCountryId !== undefined) data.sourceCountry = input.sourceCountryId ? { connect: { id: input.sourceCountryId } } : { disconnect: true };
  if (input.destinationCountryId !== undefined) data.destinationCountry = input.destinationCountryId ? { connect: { id: input.destinationCountryId } } : { disconnect: true };
  if (input.locationId !== undefined) data.location = input.locationId ? { connect: { id: input.locationId } } : { disconnect: true };
  if (input.quantityValue !== undefined) data.quantityValue = input.quantityValue;
  if (input.quantityUnit !== undefined) data.quantityUnit = input.quantityUnit;
  if (input.quantityFrequency !== undefined) data.quantityFrequency = input.quantityFrequency;
  if (input.budgetMin !== undefined) data.budgetMin = input.budgetMin;
  if (input.budgetMax !== undefined) data.budgetMax = input.budgetMax;
  if (input.budgetCurrencyCode !== undefined) data.budgetCurrencyCode = input.budgetCurrencyCode;
  if (input.budgetUnit !== undefined) data.budgetUnit = input.budgetUnit;
  if (input.timeline !== undefined) data.timeline = input.timeline;
  return data;
}

function mergedReferenceInput(before: BusinessRequestRecord, update: UpdateBusinessRequestInput): Pick<CreateBusinessRequestInput, "categoryId" | "sourceCountryId" | "destinationCountryId" | "locationId"> {
  return {
    categoryId: update.categoryId === undefined ? before.categoryId ?? undefined : update.categoryId ?? undefined,
    sourceCountryId: update.sourceCountryId === undefined ? before.sourceCountryId ?? undefined : update.sourceCountryId ?? undefined,
    destinationCountryId: update.destinationCountryId === undefined ? before.destinationCountryId ?? undefined : update.destinationCountryId ?? undefined,
    locationId: update.locationId === undefined ? before.locationId ?? undefined : update.locationId ?? undefined,
  };
}

function mergedSubmissionCandidate(before: BusinessRequestRecord, update?: UpdateBusinessRequestInput): RequestSubmissionCandidate {
  return {
    requestType: before.requestType,
    title: update?.title ?? before.title,
    description: update?.description ?? before.description,
    categoryId: update?.categoryId === undefined ? before.categoryId : update.categoryId,
    sourceCountryId: update?.sourceCountryId === undefined ? before.sourceCountryId : update.sourceCountryId,
    destinationCountryId: update?.destinationCountryId === undefined ? before.destinationCountryId : update.destinationCountryId,
    locationId: update?.locationId === undefined ? before.locationId : update.locationId,
    quantityValue: update?.quantityValue === undefined ? before.quantityValue?.toString() ?? null : update.quantityValue,
    quantityUnit: update?.quantityUnit === undefined ? before.quantityUnit : update.quantityUnit,
    timeline: update?.timeline === undefined ? before.timeline : update.timeline,
  };
}

function assertMergedBudgetRange(before: BusinessRequestRecord, update: UpdateBusinessRequestInput) {
  const minimum = update.budgetMin === undefined ? before.budgetMin?.toString() ?? null : update.budgetMin;
  const maximum = update.budgetMax === undefined ? before.budgetMax?.toString() ?? null : update.budgetMax;
  if (minimum && maximum && Number(minimum) > Number(maximum)) {
    throw AppError.validation("Please correct the highlighted fields.", { budgetMax: "Budget maximum must be greater than or equal to budget minimum." });
  }
}

export async function createBusinessRequestDraft(actor: CurrentActor, input: CreateBusinessRequestInput, context: ServiceContext) {
  requireActorPermission(actor, "submit_request");
  const companyId = primaryCompanyId(actor);
  const baseSlug = businessRequestSlugBase(input.title);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const request = await withTransaction(async (db) => {
        if (!await findActiveCompanyById(db, companyId)) throw AppError.invalidState("Your selected company is no longer available.");
        await validateReferences(db, input);
        const created = await createBusinessRequest(db, createData(actor, companyId, input, businessRequestSlugCandidate(baseSlug, attempt)));
        await db.requestStatusHistory.create({ data: { requestId: created.id, toStatus: "draft", changedById: actor.id } });
        const complete = await findActiveBusinessRequestById(db, created.id);
        if (!complete) throw AppError.notFound();
        await writeBusinessRequestAuditEvent(db, { actor, action: "business_request.created", request: requestSnapshot(complete), requestId: context.requestId });
        return complete;
      });
      return toBusinessRequestDetail(actor, request);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue;
      throw error;
    }
  }
  throw AppError.conflict("Unable to reserve a unique request reference. Please try again.");
}

export async function listBusinessRequestsForActor(actor: CurrentActor, input: BusinessRequestListInput) {
  requireActorPermission(actor, "view_own_requests");
  const companyId = primaryCompanyId(actor);
  const [requests, total] = await listActiveBusinessRequestsForCompany(getPrismaClient(), { companyId, ...input });
  const totalPages = Math.max(1, Math.ceil(total / input.pageSize));
  return {
    data: requests.map((request) => toBusinessRequestListItem(actor, request)),
    pagination: {
      page: input.page,
      pageSize: input.pageSize,
      total,
      totalPages,
      hasNext: input.page < totalPages,
      hasPrevious: input.page > 1,
    },
  };
}

export async function getBusinessRequestForActor(actor: CurrentActor, requestId: string) {
  requireActorPermission(actor, "view_own_requests");
  const request = await findActiveBusinessRequestById(getPrismaClient(), requestId);
  if (!request) throw AppError.notFound();
  requireBusinessRequestAccess(actor, request);
  return toBusinessRequestDetail(actor, request);
}

export async function updateBusinessRequestDraft(actor: CurrentActor, requestId: string, input: UpdateBusinessRequestInput, context: ServiceContext) {
  requireActorPermission(actor, "submit_request");
  const request = await withTransaction(async (db) => {
    const before = await findActiveBusinessRequestById(db, requestId);
    if (!before) throw AppError.notFound();
    requireDraftRequestOwner(actor, before);
    if (before.version !== input.version) throw AppError.conflict("This request changed. Refresh before saving your draft.");
    await validateReferences(db, mergedReferenceInput(before, input));
    assertMergedBudgetRange(before, input);
    const updated = await updateBusinessRequestWithExpectedVersion(db, requestId, input.version, updateData(input));
    if (!updated) throw AppError.conflict("This request changed. Refresh before saving your draft.");
    await writeBusinessRequestAuditEvent(db, { actor, action: "business_request.updated", request: requestSnapshot(updated), before: requestSnapshot(before), requestId: context.requestId });
    return updated;
  });
  return toBusinessRequestDetail(actor, request);
}

export async function deleteBusinessRequestDraft(actor: CurrentActor, requestId: string, version: number, context: ServiceContext) {
  requireActorPermission(actor, "submit_request");
  await withTransaction(async (db) => {
    const before = await findActiveBusinessRequestById(db, requestId);
    if (!before) throw AppError.notFound();
    requireDraftRequestOwner(actor, before);
    if (before.version !== version) throw AppError.conflict("This request changed. Refresh before deleting your draft.");
    if (!await softDeleteBusinessRequestWithExpectedVersion(db, requestId, version)) {
      throw AppError.conflict("This request changed. Refresh before deleting your draft.");
    }
    await writeBusinessRequestAuditEvent(db, { actor, action: "business_request.deleted", request: requestSnapshot(before), before: requestSnapshot(before), requestId: context.requestId, isDeleted: true });
  });
}

export async function submitBusinessRequestDraft(actor: CurrentActor, requestId: string, version: number, context: ServiceContext) {
  requireActorPermission(actor, "submit_request");
  const request = await withTransaction(async (db) => {
    const before = await findActiveBusinessRequestById(db, requestId);
    if (!before) throw AppError.notFound();
    requireDraftRequestOwner(actor, before);
    if (before.version !== version) throw AppError.conflict("This request changed. Refresh before submitting.");
    await validateReferences(db, {
      categoryId: before.categoryId ?? undefined,
      sourceCountryId: before.sourceCountryId ?? undefined,
      destinationCountryId: before.destinationCountryId ?? undefined,
      locationId: before.locationId ?? undefined,
    });
    const errors = requestSubmissionErrors(mergedSubmissionCandidate(before));
    if (Object.keys(errors).length > 0) throw AppError.validation("Complete the required fields before submitting.", errors);

    const result = await db.businessRequest.updateMany({
      where: { id: requestId, version, status: "draft", deletedAt: null },
      data: { status: "submitted", version: { increment: 1 } },
    });
    if (result.count !== 1) throw AppError.conflict("This request changed. Refresh before submitting.");
    await db.requestStatusHistory.create({ data: { requestId, fromStatus: "draft", toStatus: "submitted", changedById: actor.id } });
    const submitted = await findActiveBusinessRequestById(db, requestId);
    if (!submitted) throw AppError.notFound();
    await writeBusinessRequestAuditEvent(db, { actor, action: "business_request.submitted", request: requestSnapshot(submitted), before: requestSnapshot(before), requestId: context.requestId });
    return submitted;
  });
  return toBusinessRequestDetail(actor, request);
}
