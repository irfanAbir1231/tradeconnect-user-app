import assert from "node:assert/strict";

import {
  nonProductionSignupRateLimit,
  productionSignupRateLimit,
  signupRateLimitFor,
} from "../src/server/auth/rate-limit";

assert.deepEqual(signupRateLimitFor(undefined), nonProductionSignupRateLimit);
assert.deepEqual(signupRateLimitFor("preview"), nonProductionSignupRateLimit);
assert.deepEqual(signupRateLimitFor("production"), productionSignupRateLimit);
assert.equal(nonProductionSignupRateLimit.max, productionSignupRateLimit.max);
assert.ok(nonProductionSignupRateLimit.window < productionSignupRateLimit.window);

console.info("Better Auth signup rate-limit policy tests passed.");
