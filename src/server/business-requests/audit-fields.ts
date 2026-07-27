import type { RequestAuditSnapshot } from "@/src/server/audit/business-request-audit";

const auditedFields = [
  "title", "description", "priority", "categoryId", "sourceCountryId", "destinationCountryId", "locationId",
  "quantityValue", "quantityUnit", "quantityFrequency", "budgetMin", "budgetMax", "budgetCurrencyCode", "budgetUnit", "timeline",
] as const;

/** Returns only changed field names; request values never belong in audit payloads. */
export function businessRequestAuditChangedFieldNames(before: RequestAuditSnapshot | undefined, after: RequestAuditSnapshot) {
  if (!before) return [];
  return auditedFields.filter((field) => String(before[field]) !== String(after[field]));
}
