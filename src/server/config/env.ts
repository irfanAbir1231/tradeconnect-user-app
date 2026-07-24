import "server-only";

export type ServerEnvironment = "development" | "preview" | "production" | "test";
export type DeploymentEnvironment = "development" | "preview" | "production";

const serverEnvironments = ["development", "preview", "production", "test"] as const;
const deploymentEnvironments = ["development", "preview", "production"] as const;

function requiredSafeValue(name: string, value: string | undefined, maxLength: number) {
  if (!value) {
    return undefined;
  }

  if (value.length > maxLength || /[\r\n]/.test(value)) {
    throw new Error(`${name} contains an invalid value.`);
  }

  return value;
}

function optionalDatabaseUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  if (value.length > 2048 || /[\r\n]/.test(value) || !/^postgres(?:ql)?:\/\//i.test(value)) {
    throw new Error("DATABASE_URL contains an invalid value.");
  }

  return value;
}

function optionalBetterAuthSecret(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  if (value.length < 32 || value.length > 1024 || /[\r\n]/.test(value)) {
    throw new Error("BETTER_AUTH_SECRET contains an invalid value.");
  }

  return value;
}

function optionalBetterAuthUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  if (value.length > 2048 || /[\r\n]/.test(value)) {
    throw new Error("BETTER_AUTH_URL contains an invalid value.");
  }

  try {
    const parsed = new URL(value);

    if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
      throw new Error();
    }

    return parsed.origin;
  } catch {
    throw new Error("BETTER_AUTH_URL must be an absolute HTTP(S) origin without a path.");
  }
}

function parseEnvironment(name: string, value: string | undefined, allowed: readonly string[], fallback: ServerEnvironment) {
  const candidate = value ?? fallback;

  if (!allowed.includes(candidate)) {
    throw new Error(`${name} must be one of: ${allowed.join(", ")}.`);
  }

  return candidate as ServerEnvironment;
}

function parseDeploymentEnvironment(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  if (!deploymentEnvironments.includes(value as DeploymentEnvironment)) {
    throw new Error(`VERCEL_ENV must be one of: ${deploymentEnvironments.join(", ")}.`);
  }

  return value as DeploymentEnvironment;
}

/**
 * Server-only runtime metadata. Future database/auth/storage/email settings should
 * be added here one phase at a time, with explicit validation and without exposing
 * secrets through a NEXT_PUBLIC_* module.
 */
export const serverEnv = Object.freeze({
  nodeEnv: parseEnvironment("NODE_ENV", process.env.NODE_ENV, serverEnvironments, "development"),
  vercelEnv: parseDeploymentEnvironment(process.env.VERCEL_ENV),
  vercelUrl: requiredSafeValue("VERCEL_URL", process.env.VERCEL_URL, 255),
  version: requiredSafeValue("VERCEL_GIT_COMMIT_SHA", process.env.VERCEL_GIT_COMMIT_SHA, 80) ?? "development",
  databaseUrl: optionalDatabaseUrl(process.env.DATABASE_URL),
  betterAuthSecret: optionalBetterAuthSecret(process.env.BETTER_AUTH_SECRET),
  betterAuthUrl: optionalBetterAuthUrl(process.env.BETTER_AUTH_URL),
  serviceName: "tradeconnect",
  runtime: "nodejs" as const,
});

export type ServerEnv = typeof serverEnv;

/**
 * Auth routes call this at runtime. Keeping these values optional in `serverEnv`
 * means static marketing pages can still build without loading auth configuration.
 */
export function getBetterAuthEnvironment() {
  if (!serverEnv.betterAuthSecret || !serverEnv.betterAuthUrl) {
    throw new Error("Authentication is not configured. Set BETTER_AUTH_SECRET and BETTER_AUTH_URL on the server.");
  }

  return { secret: serverEnv.betterAuthSecret, url: serverEnv.betterAuthUrl };
}
