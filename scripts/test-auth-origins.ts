import assert from "node:assert/strict";

import { resolveDynamicBaseURL } from "better-auth";

import {
  buildAuthAllowedHosts,
  canonicalProductionHost,
  legacyProductionHosts,
  localDevelopmentHost,
  optionalVercelSystemHost,
} from "../src/server/auth/origins";

const deploymentHost = "tradeconnect-user-app-preview-abc123.vercel.app";
const branchHost = "tradeconnect-user-app-git-feature-auth.vercel.app";

const allowedHosts = buildAuthAllowedHosts({
  isVercelDeployment: true,
  vercelUrl: optionalVercelSystemHost("VERCEL_URL", deploymentHost),
  vercelBranchUrl: optionalVercelSystemHost("VERCEL_BRANCH_URL", branchHost),
});

assert.deepEqual(allowedHosts, [localDevelopmentHost, canonicalProductionHost, ...legacyProductionHosts, deploymentHost, branchHost]);
assert.equal(new Set(allowedHosts).size, allowedHosts.length);
assert.ok(allowedHosts.includes(deploymentHost));
assert.ok(allowedHosts.includes(branchHost));
assert.ok(allowedHosts.includes(canonicalProductionHost));
assert.ok(legacyProductionHosts.every((host) => allowedHosts.includes(host)));
assert.deepEqual(buildAuthAllowedHosts({ isVercelDeployment: true, vercelUrl: deploymentHost, vercelBranchUrl: deploymentHost }), [localDevelopmentHost, canonicalProductionHost, ...legacyProductionHosts, deploymentHost]);

const localAllowedHosts = buildAuthAllowedHosts({ isVercelDeployment: false, localOrigin: "http://localhost:3000" });
assert.ok(localAllowedHosts.includes(localDevelopmentHost));

for (const [name, value] of [
  ["VERCEL_URL", "https://not-allowed.vercel.app"],
  ["VERCEL_BRANCH_URL", "branch.vercel.app/path"],
] as const) {
  assert.throws(() => optionalVercelSystemHost(name, value));
}

const baseURL = { allowedHosts, protocol: "https" as const };
const localBaseURL = { allowedHosts: localAllowedHosts, protocol: "http" as const };
assert.equal(resolveDynamicBaseURL(baseURL, new Headers({ "x-forwarded-host": deploymentHost, "x-forwarded-proto": "https" }), "/api/auth", true), `https://${deploymentHost}/api/auth`);
assert.equal(resolveDynamicBaseURL(baseURL, new Headers({ "x-forwarded-host": branchHost, "x-forwarded-proto": "https" }), "/api/auth", true), `https://${branchHost}/api/auth`);
assert.equal(resolveDynamicBaseURL(baseURL, new Headers({ "x-forwarded-host": canonicalProductionHost, "x-forwarded-proto": "https" }), "/api/auth", true), `https://${canonicalProductionHost}/api/auth`);
for (const legacyHost of legacyProductionHosts) {
  assert.equal(resolveDynamicBaseURL(baseURL, new Headers({ "x-forwarded-host": legacyHost, "x-forwarded-proto": "https" }), "/api/auth", true), `https://${legacyHost}/api/auth`);
}
assert.equal(resolveDynamicBaseURL(localBaseURL, new Headers({ host: localDevelopmentHost }), "/api/auth", false), `http://${localDevelopmentHost}/api/auth`);
assert.throws(() => resolveDynamicBaseURL(baseURL, new Headers({ "x-forwarded-host": "unrelated-project.vercel.app", "x-forwarded-proto": "https" }), "/api/auth", true));
assert.throws(() => resolveDynamicBaseURL(baseURL, new Headers({ "x-forwarded-host": "unapproved.example.invalid", "x-forwarded-proto": "https" }), "/api/auth", true));

console.info("Better Auth origin tests passed.");
