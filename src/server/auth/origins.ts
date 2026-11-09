const maximumHostnameLength = 253;
const vercelHostnamePattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+vercel\.app$/i;

/** The Vercel Production alias currently assigned to the TradeConnect project. */
export const canonicalProductionHost = "bhuiyan-genesis.vercel.app";
/**
 * Retain the former project hostname explicitly while DNS/browser sessions
 * converge. This is an exact hostname—not a wildcard—and can be removed once
 * the previous alias is no longer in use.
 */
export const legacyProductionHosts = ["tradeconnect-user-app.vercel.app"] as const;
export const localDevelopmentHost = "localhost:3000";

/** Validates only server-provided Vercel deployment hostnames. */
export function optionalVercelSystemHost(name: "VERCEL_URL" | "VERCEL_BRANCH_URL", value: string | undefined) {
  if (!value) {
    return undefined;
  }

  if (value.length > maximumHostnameLength || !vercelHostnamePattern.test(value)) {
    throw new Error(`${name} must be a Vercel deployment hostname without a protocol, port, path, query, or fragment.`);
  }

  return value.toLowerCase();
}

function localHostFromOrigin(origin: string | undefined, isVercelDeployment: boolean) {
  if (!origin || isVercelDeployment) {
    return undefined;
  }

  const url = new URL(origin);
  return url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1") ? url.host : undefined;
}

export function buildAuthAllowedHosts(input: {
  isVercelDeployment: boolean;
  localOrigin?: string;
  vercelUrl?: string;
  vercelBranchUrl?: string;
}) {
  return [...new Set([
    localDevelopmentHost,
    canonicalProductionHost,
    ...legacyProductionHosts,
    input.vercelUrl,
    input.vercelBranchUrl,
    localHostFromOrigin(input.localOrigin, input.isVercelDeployment),
  ].filter((host): host is string => Boolean(host)))];
}
