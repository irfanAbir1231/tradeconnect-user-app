import assert from "node:assert/strict";

import { defaultBusinessUserRoleSlug, ensureSingleDefaultRoleAssignment } from "../src/server/auth/default-role-assignment";
import { signupRateLimitFor } from "../src/server/auth/rate-limit";
import { emailPasswordPolicyFor } from "../src/server/auth/signup-policy";
import { actorHasPermission } from "../src/server/permissions/policy";

for (const environment of ["preview", "production"] as const) {
  const policy = emailPasswordPolicyFor(environment);

  assert.equal(policy.enabled, true, `${environment} must enable email/password authentication`);
  assert.equal(policy.disableSignUp, false, `${environment} must permit public signup`);
  assert.equal(policy.requireEmailVerification, false, `${environment} must defer email verification`);
  assert.equal(policy.autoSignIn, true, `${environment} signup must create a database session`);
}

assert.deepEqual(signupRateLimitFor("production"), { window: 3600, max: 5 });
assert.equal(defaultBusinessUserRoleSlug, "business_user");

async function main() {
  let assignment: { id: string } | null = null;
  let createCalls = 0;
  const ensureAssignment = () => ensureSingleDefaultRoleAssignment({
    findExisting: async () => assignment,
    create: async () => {
      createCalls += 1;
      assignment = { id: "role-assignment" };
      return assignment;
    },
  });

  await ensureAssignment();
  await ensureAssignment();
  assert.equal(createCalls, 1, "the default business_user role must be assigned exactly once");

  const ordinaryBusinessUser = {
    permissions: ["submit_request", "view_own_requests", "manage_own_company", "submit_inquiry"] as const,
  };
  assert.equal(actorHasPermission(ordinaryBusinessUser, "view_admin_dashboard"), false, "ordinary users must not access admin");

  console.info("Better Auth public signup policy tests passed.");
}

void main();
