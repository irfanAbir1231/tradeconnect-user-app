import type { CurrentActor } from "@/src/server/auth/actor";
import { AppError } from "@/src/server/errors/app-error";

export type RequestOwnershipRecord = {
  companyId: string;
  creatorId: string;
  status: "draft" | "submitted" | "under_review" | "needs_information" | "matching" | "quotation_received" | "approved" | "completed" | "rejected" | "cancelled";
};

export function requireBusinessRequestAccess(actor: CurrentActor, request: RequestOwnershipRecord) {
  // This is the business-user surface: even a platform administrator must use
  // the future admin request workflow, not bypass company tenancy here.
  if (!actor.companyMemberships.some((membership) => membership.companyId === request.companyId)) throw AppError.notFound();
  return request;
}

export function requireDraftRequestOwner(actor: CurrentActor, request: RequestOwnershipRecord) {
  requireBusinessRequestAccess(actor, request);
  if (request.creatorId !== actor.id) {
    throw AppError.forbidden("Only the request creator can change this draft.");
  }
  if (request.status !== "draft") {
    throw AppError.invalidState("Only draft requests can be changed or deleted.");
  }
  return request;
}
