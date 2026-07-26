import assert from "node:assert/strict";

import { primaryCompanyMembership, truncateUserLabel, userDisplayName, userFirstName, userInitials } from "../src/lib/user-identity";
import type { AuthenticatedUserView } from "../src/types/auth";

function user(overrides: Partial<AuthenticatedUserView> = {}): AuthenticatedUserView {
  return {
    id: "user-test",
    name: "Md Irfan Hakim Bhuiyan",
    email: "irfan@example.test",
    emailVerified: false,
    roles: ["business_user"],
    permissions: ["submit_request"],
    companyMemberships: [],
    ...overrides,
  };
}

const namedUser = user();
assert.equal(userDisplayName(namedUser), "Md Irfan Hakim Bhuiyan");
assert.equal(userFirstName(namedUser), "Md");
assert.equal(userInitials(namedUser), "MI");
assert.equal(userInitials(user({ name: "Nusrat" })), "N");
assert.equal(userInitials(user({ name: "  আরিফ   হাসান  " })), "আহ");
assert.equal(userDisplayName(user({ name: "   ", email: "contact.person@example.test" })), "contact.person");
assert.equal(userFirstName(user({ name: "", email: "" })), "TradeConnect User");
assert.equal(truncateUserLabel("a".repeat(40), 12), "a".repeat(11) + "…");

const companyUser = user({ companyMemberships: [
  { companyId: "secondary", companyName: "Secondary Company", membershipRole: "member", isPrimary: false },
  { companyId: "primary", companyName: "Primary Company", membershipRole: "owner", isPrimary: true },
] });
assert.equal(primaryCompanyMembership(companyUser)?.companyName, "Primary Company");
assert.equal(primaryCompanyMembership(user()), null);
assert.equal("sessionToken" in namedUser, false, "safe user props must not include session tokens");

console.info("Authenticated frontend identity tests passed.");
