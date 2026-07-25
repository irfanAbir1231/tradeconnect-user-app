import type { DeploymentEnvironment } from "@/src/server/config/env";

/**
 * Public registration is deliberately enabled in every deployment environment.
 * Email verification delivery is a later phase, so Better Auth must not mark an
 * account verified or require a verification email before allowing sign-in.
 */
const publicEmailPasswordPolicy = {
  enabled: true,
  minPasswordLength: 12,
  maxPasswordLength: 128,
  autoSignIn: true,
  disableSignUp: false,
  requireEmailVerification: false,
} as const;

export function emailPasswordPolicyFor(environment: DeploymentEnvironment | undefined) {
  if (environment === "production") {
    return publicEmailPasswordPolicy;
  }

  return publicEmailPasswordPolicy;
}
