import assert from "node:assert/strict";

import { businessRequestAuditChangedFieldNames } from "../src/server/business-requests/audit-fields";
import type { RequestAuditSnapshot } from "../src/server/audit/business-request-audit";
import { requireBusinessRequestAccess, requireDraftRequestOwner } from "../src/server/business-requests/policy";
import { businessRequestSlugBase, businessRequestSlugCandidate } from "../src/server/business-requests/slug";
import { requestSubmissionErrors } from "../src/server/business-requests/submission";
import { AppError } from "../src/server/errors/app-error";
import { parseCreateBusinessRequestInput, parseUpdateBusinessRequestInput } from "../src/server/validators/business-request";
import type { CurrentActor } from "../src/server/auth/actor";

const companyId = "11111111-1111-4111-8111-111111111111";
const otherCompanyId = "22222222-2222-4222-822222222222";
const actor: CurrentActor = {
  id: "33333333-3333-4333-8333-333333333333", email: "requester@example.test", fullName: "Request Creator", emailVerified: false,
  roles: ["business_user"], permissions: ["submit_request", "view_own_requests"],
  companyMemberships: [{ companyId, companyName: "Test Trade Company", membershipRole: "owner", isPrimary: true }],
};

const validInput = {
  requestType: "import", title: "Industrial packaging supply", description: "A clear Bangladesh import requirement.", categoryId: "44444444-4444-4444-8444-444444444444",
  sourceCountryId: "55555555-5555-4555-8555-555555555555", destinationCountryId: "66666666-6666-4666-8666-666666666666",
  quantityValue: "1000", quantityUnit: "pieces", timeline: "Within 60 days",
};

assert.equal(parseCreateBusinessRequestInput(validInput).requestType, "import");
assert.throws(() => parseCreateBusinessRequestInput({ ...validInput, unexpected: true }), (error: unknown) => error instanceof AppError && error.code === "VALIDATION_ERROR");
assert.throws(() => parseUpdateBusinessRequestInput({ version: 1 }), (error: unknown) => error instanceof AppError && error.code === "VALIDATION_ERROR");
assert.throws(() => parseUpdateBusinessRequestInput({ version: 1, budgetMin: "200", budgetMax: "100" }), (error: unknown) => error instanceof AppError && error.code === "VALIDATION_ERROR");

assert.deepEqual(requestSubmissionErrors({
  requestType: "import", title: validInput.title, description: validInput.description, categoryId: validInput.categoryId,
  sourceCountryId: validInput.sourceCountryId, destinationCountryId: validInput.destinationCountryId, locationId: null,
  quantityValue: validInput.quantityValue, quantityUnit: validInput.quantityUnit, timeline: validInput.timeline,
}), {});
assert.equal(requestSubmissionErrors({ requestType: "supply", title: "Supply", description: "Need local supply", categoryId: null, sourceCountryId: null, destinationCountryId: null, locationId: null, quantityValue: null, quantityUnit: null, timeline: null }).locationId !== undefined, true);

const draft = { companyId, creatorId: actor.id, status: "draft" as const };
assert.equal(requireBusinessRequestAccess(actor, draft), draft);
assert.equal(requireDraftRequestOwner(actor, draft), draft);
assert.throws(() => requireBusinessRequestAccess(actor, { ...draft, companyId: otherCompanyId }), (error: unknown) => error instanceof AppError && error.code === "NOT_FOUND");
assert.throws(() => requireDraftRequestOwner(actor, { ...draft, creatorId: "77777777-7777-4777-8777-777777777777" }), (error: unknown) => error instanceof AppError && error.code === "FORBIDDEN");
assert.throws(() => requireDraftRequestOwner(actor, { ...draft, status: "submitted" as const }), (error: unknown) => error instanceof AppError && error.code === "INVALID_STATE_TRANSITION");

assert.equal(businessRequestSlugBase("Bangladesh Packaging Requirement"), "bangladesh-packaging-requirement");
assert.equal(businessRequestSlugCandidate("request", 2), "request-3");

const before: RequestAuditSnapshot = { id: "request-a", companyId, status: "draft", version: 1, requestType: "import", title: "Private title", description: "Private description", priority: "medium", categoryId: null, sourceCountryId: null, destinationCountryId: null, locationId: null, quantityValue: null, quantityUnit: null, quantityFrequency: null, budgetMin: null, budgetMax: null, budgetCurrencyCode: null, budgetUnit: null, timeline: null };
const after: RequestAuditSnapshot = { ...before, version: 2, description: "Changed private description", timeline: "Within 30 days" };
const changedFields = businessRequestAuditChangedFieldNames(before, after);
assert.deepEqual(changedFields, ["description", "timeline"]);
assert.equal(JSON.stringify(changedFields).includes("Changed private description"), false);

console.info("Business request workflow tests passed.");
