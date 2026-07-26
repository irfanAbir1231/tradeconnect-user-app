import assert from "node:assert/strict";

import { companyAuditChangedFieldNames } from "../src/server/company/audit-fields";
import { canAccessCompany, isCompanyAdministrator, isPlatformCompanyAdministrator } from "../src/server/company/authorization";
import { calculateCompanyProfileCompletion } from "../src/server/company/profile-completion";
import type { CurrentActor } from "../src/server/auth/actor";
import type { CompanyOwnerRecord } from "../src/server/repositories/company-repository";

const baseActor: CurrentActor = {
  id: "11111111-1111-4111-8111-111111111111", email: "owner@example.test", fullName: "Owner", emailVerified: false,
  roles: ["business_user"], permissions: ["manage_own_company"],
  companyMemberships: [{ companyId: "company-a", companyName: "Company A", membershipRole: "owner", isPrimary: true }],
};

const memberActor: CurrentActor = { ...baseActor, id: "22222222-2222-4222-8222-222222222222", companyMemberships: [{ companyId: "company-a", companyName: "Company A", membershipRole: "member", isPrimary: true }] };
const platformAdmin: CurrentActor = { ...baseActor, id: "33333333-3333-4333-8333-333333333333", roles: ["admin"], permissions: ["manage_companies"], companyMemberships: [] };

assert.equal(isCompanyAdministrator(baseActor, "company-a"), true);
assert.equal(isCompanyAdministrator(memberActor, "company-a"), false);
assert.equal(canAccessCompany(memberActor, "company-a"), true);
assert.equal(canAccessCompany(memberActor, "company-b"), false);
assert.equal(isPlatformCompanyAdministrator(platformAdmin), true);
assert.equal(canAccessCompany(platformAdmin, "company-b"), true);

const whitespaceOnly = calculateCompanyProfileCompletion({
  legalName: " ", displayName: " ", businessType: " ", businessEmail: " ", businessPhone: " ", description: " ", website: null, primaryProducts: " ", addressLine1: " ", registrationCountryId: " ", primaryLocationId: " ", categoriesCount: 0,
});
assert.equal(whitespaceOnly.percentage, 0);
assert.equal(whitespaceOnly.profileComplete, false);
assert.equal(whitespaceOnly.verificationReady, false);
assert.deepEqual(whitespaceOnly.verificationBlockers, ["legalName", "businessEmail", "registrationCountry", "businessCategory", "primaryLocation", "businessAddress"]);

const ready = calculateCompanyProfileCompletion({
  legalName: "বাংলা ট্রেড লিমিটেড", displayName: "Bangla Trade", businessType: "exporter", businessEmail: "trade@example.test", businessPhone: null, description: "Export services", website: null, primaryProducts: "Jute goods", addressLine1: "Dhaka", registrationCountryId: "country-bd", primaryLocationId: "location-dhaka", categoriesCount: 1,
});
assert.equal(ready.percentage, 95);
assert.equal(ready.verificationReady, true);
assert.equal(ready.profileComplete, false);
assert.equal(ready.nextAction, "businessPhone");
assert.equal(JSON.stringify(ready).includes("trade@example.test"), false);

const before = {
  version: 4, legalName: "Private Legal Name", displayName: "Trading Name", businessType: "supplier", businessEmail: "before@example.test", businessPhone: "+8801700000000", description: "Before", website: null, primaryProducts: "Products", addressLine1: "Private address", addressLine2: null, registrationNumber: "REG-1", tradeLicenseNumber: "LIC-1", taxVatNumber: "TIN-1", registrationCountryId: "country-bd", primaryLocationId: "location-dhaka", foundedYear: 2020, employeeRange: "11-50", categories: [{ category: { id: "category-a" }, isPrimary: true }], countriesServed: [],
} as unknown as CompanyOwnerRecord;
const after = { ...before, version: 5, businessEmail: "after@example.test", addressLine1: "Another private address" } as CompanyOwnerRecord;
const changed = companyAuditChangedFieldNames(before, after);
assert.deepEqual(changed, ["businessEmail", "addressLine1"]);
assert.equal(JSON.stringify(changed).includes("after@example.test"), false);
assert.equal(JSON.stringify(changed).includes("Another private address"), false);

console.info("Company domain hardening tests passed.");
