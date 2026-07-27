import "server-only";

import type { CurrentActor } from "@/src/server/auth/actor";
import { businessRequestAuditChangedFieldNames } from "@/src/server/business-requests/audit-fields";
import type { DatabaseTransactionClient } from "@/src/server/db/types";

export { businessRequestAuditChangedFieldNames } from "@/src/server/business-requests/audit-fields";

export type RequestAuditSnapshot = {
  id: string;
  companyId: string;
  status: string;
  version: number;
  requestType: string;
  title: string;
  description: string;
  priority: string;
  categoryId: string | null;
  sourceCountryId: string | null;
  destinationCountryId: string | null;
  locationId: string | null;
  quantityValue: unknown;
  quantityUnit: string | null;
  quantityFrequency: string | null;
  budgetMin: unknown;
  budgetMax: unknown;
  budgetCurrencyCode: string | null;
  budgetUnit: string | null;
  timeline: string | null;
};

export function writeBusinessRequestAuditEvent(
  db: DatabaseTransactionClient,
  input: {
    actor: CurrentActor;
    action: "business_request.created" | "business_request.updated" | "business_request.submitted" | "business_request.deleted";
    request: RequestAuditSnapshot;
    requestId: string;
    before?: RequestAuditSnapshot;
    isDeleted?: boolean;
  },
) {
  return db.auditLog.create({
    data: {
      actorUserId: input.actor.id,
      actorRole: input.actor.roles[0] ?? null,
      action: input.action,
      resourceType: "business_request",
      resourceId: input.request.id,
      companyId: input.request.companyId,
      beforeJson: input.before ? { status: input.before.status, version: input.before.version } : undefined,
      afterJson: {
        status: input.request.status,
        version: input.request.version,
        requestType: input.request.requestType,
        changedFields: businessRequestAuditChangedFieldNames(input.before, input.request),
        ...(input.isDeleted ? { deleted: true } : {}),
      },
      requestId: input.requestId,
    },
  });
}
