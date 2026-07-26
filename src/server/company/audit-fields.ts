import type { CompanyOwnerRecord } from "@/src/server/repositories/company-repository";

/** Returns field names only; no business values are suitable for audit payloads. */
export function companyAuditChangedFieldNames(before: CompanyOwnerRecord | undefined, after: CompanyOwnerRecord) {
  if (!before) return [];
  const fields: Array<keyof Pick<CompanyOwnerRecord, "legalName" | "displayName" | "businessType" | "businessEmail" | "businessPhone" | "description" | "website" | "primaryProducts" | "addressLine1" | "addressLine2" | "registrationNumber" | "tradeLicenseNumber" | "taxVatNumber" | "registrationCountryId" | "primaryLocationId" | "foundedYear" | "employeeRange">> = [
    "legalName", "displayName", "businessType", "businessEmail", "businessPhone", "description", "website", "primaryProducts", "addressLine1", "addressLine2", "registrationNumber", "tradeLicenseNumber", "taxVatNumber", "registrationCountryId", "primaryLocationId", "foundedYear", "employeeRange",
  ];
  const changed: string[] = fields.filter((field) => before[field] !== after[field]);
  if (before.categories.map((entry) => `${entry.category.id}:${entry.isPrimary}`).join(",") !== after.categories.map((entry) => `${entry.category.id}:${entry.isPrimary}`).join(",")) changed.push("categories");
  if (before.countriesServed.map((entry) => `${entry.country.id}:${entry.relationship}`).join(",") !== after.countriesServed.map((entry) => `${entry.country.id}:${entry.relationship}`).join(",")) changed.push("countriesServed");
  return changed;
}
