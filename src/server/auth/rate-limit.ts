import type { DeploymentEnvironment } from "@/src/server/config/env";

export const productionSignupRateLimit = { window: 3600, max: 5 } as const;
export const nonProductionSignupRateLimit = { window: 300, max: 5 } as const;

/** Production remains strict; development and Preview stay testable without disabling limits. */
export function signupRateLimitFor(vercelEnv: DeploymentEnvironment | undefined) {
  return vercelEnv === "production" ? productionSignupRateLimit : nonProductionSignupRateLimit;
}
