import "server-only";

import type { CurrentActor } from "@/src/server/auth/actor";
import { companyAuditChangedFieldNames } from "@/src/server/company/audit-fields";
import type { DatabaseTransactionClient } from "@/src/server/db/types";
import type { CompanyOwnerRecord } from "@/src/server/repositories/company-repository";

export { companyAuditChangedFieldNames } from "@/src/server/company/audit-fields";

export function writeCompanyAuditEvent(
  db: DatabaseTransactionClient,
  input: { actor: CurrentActor; action: "company.created" | "company.updated" | "company.primary_selected"; company: CompanyOwnerRecord; requestId: string; before?: CompanyOwnerRecord },
) {
  return db.auditLog.create({
    data: {
      actorUserId: input.actor.id,
      actorRole: input.actor.roles[0] ?? null,
      action: input.action,
      resourceType: "company",
      resourceId: input.company.id,
      companyId: input.company.id,
      // Keep audit records useful without retaining company contact, address, or registration values.
      beforeJson: input.before ? { version: input.before.version } : undefined,
      afterJson: { version: input.company.version, changedFields: companyAuditChangedFieldNames(input.before, input.company) },
      requestId: input.requestId,
    },
  });
}
