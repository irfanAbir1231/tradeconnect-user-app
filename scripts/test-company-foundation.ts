import assert from "node:assert/strict";

import { canAccessCompany, isCompanyAdministrator } from "../src/server/company/authorization";
import { calculateCompanyProfileCompletion } from "../src/server/company/profile-completion";
import { companySlugBase, companySlugCandidate } from "../src/server/company/slug";
import type { CurrentActor } from "../src/server/auth/actor";

const actor: CurrentActor = {
  id: "11111111-1111-4111-8111-111111111111", email: "owner@example.test", fullName: "Company Owner", emailVerified: false,
  roles: ["business_user"], permissions: ["manage_own_company"],
  companyMemberships: [{ companyId: "company-a", companyName: "Company A", membershipRole: "owner", isPrimary: true }],
};

assert.equal(companySlugBase("TradeConnect Bangladesh Ltd."), "tradeconnect-bangladesh-ltd");
assert.equal(companySlugBase("বাংলা ব্যবসা"), "company");
assert.equal(companySlugCandidate("tradeconnect", 0), "tradeconnect");
assert.equal(companySlugCandidate("tradeconnect", 2), "tradeconnect-3");

const incomplete = calculateCompanyProfileCompletion({
  legalName: "TradeConnect Bangladesh Ltd.", displayName: "TradeConnect", businessType: "importer", businessEmail: "contact@example.test",
  businessPhone: null, description: null, website: null, primaryProducts: null, addressLine1: null, registrationCountryId: "country-bd", primaryLocationId: null, categoriesCount: 1,
});
assert.equal(incomplete.percentage, 60);
assert.equal(incomplete.verificationReady, false);

const complete = calculateCompanyProfileCompletion({
  legalName: "TradeConnect Bangladesh Ltd.", displayName: "TradeConnect", businessType: "importer", businessEmail: "contact@example.test",
  businessPhone: "+880 1700 000000", description: "Business trade platform", website: "https://example.test", primaryProducts: "Trade services",
  addressLine1: "Dhaka", registrationCountryId: "country-bd", primaryLocationId: "location-dhaka", categoriesCount: 1,
});
assert.equal(complete.percentage, 100);
assert.equal(complete.verificationReady, true);
assert.equal(canAccessCompany(actor, "company-a"), true);
assert.equal(canAccessCompany(actor, "company-b"), false);
assert.equal(isCompanyAdministrator(actor, "company-a"), true);
assert.equal(isCompanyAdministrator(actor, "company-b"), false);

console.info("Company profile foundation tests passed.");
