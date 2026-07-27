import type { BusinessRequestDetail, BusinessRequestListItem, BusinessRequestStatus, BusinessRequestType } from "@/src/types/business-requests";
import type { CurrentActor } from "@/src/server/auth/actor";
import type { BusinessRequestRecord } from "@/src/server/repositories/business-request-repository";

function decimalValue(value: { toString(): string } | null) {
  return value?.toString() ?? null;
}

function listItem(actor: CurrentActor, request: BusinessRequestRecord): BusinessRequestListItem {
  return {
    id: request.id,
    referenceNumber: request.referenceNumber,
    slug: request.slug,
    title: request.title,
    requestType: request.requestType as BusinessRequestType,
    status: request.status as BusinessRequestStatus,
    priority: request.priority,
    category: request.category,
    company: request.company,
    canEdit: request.status === "draft" && request.creatorId === actor.id,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    version: request.version,
  };
}

export function toBusinessRequestListItem(actor: CurrentActor, request: BusinessRequestRecord) {
  return listItem(actor, request);
}

/** Authenticated tenant view; it deliberately excludes contact data, documents, and internal notes. */
export function toBusinessRequestDetail(actor: CurrentActor, request: BusinessRequestRecord): BusinessRequestDetail {
  return {
    ...listItem(actor, request),
    description: request.description,
    sourceCountry: request.sourceCountry,
    destinationCountry: request.destinationCountry,
    location: request.location,
    quantityValue: decimalValue(request.quantityValue),
    quantityUnit: request.quantityUnit,
    quantityFrequency: request.quantityFrequency,
    budgetMin: decimalValue(request.budgetMin),
    budgetMax: decimalValue(request.budgetMax),
    budgetCurrencyCode: request.budgetCurrencyCode,
    budgetUnit: request.budgetUnit,
    timeline: request.timeline,
    statusHistory: request.statusHistory.map((entry) => ({
      id: entry.id,
      fromStatus: entry.fromStatus as BusinessRequestStatus | null,
      toStatus: entry.toStatus as BusinessRequestStatus,
      createdAt: entry.createdAt.toISOString(),
    })),
  };
}
