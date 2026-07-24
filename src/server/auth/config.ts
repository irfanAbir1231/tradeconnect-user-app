import "server-only";

import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";

import { getBetterAuthEnvironment, serverEnv } from "@/src/server/config/env";
import { getPrismaClient } from "@/src/server/db/client";

import { buildAuthAllowedHosts } from "./origins";
import { ensureDefaultUserRole } from "./roles";

const authEnvironment = getBetterAuthEnvironment();
// Vercel runs Preview builds with NODE_ENV=production. Public sign-up should be
// closed only on the actual production deployment until email delivery exists.
const isProductionDeployment = serverEnv.vercelEnv === "production";
const isVercelDeployment = Boolean(serverEnv.vercelEnv);
const allowedHosts = buildAuthAllowedHosts({
  isVercelDeployment,
  localOrigin: authEnvironment.localUrl,
  vercelUrl: serverEnv.vercelUrl,
  vercelBranchUrl: serverEnv.vercelBranchUrl,
});

/**
 * Better Auth owns sessions, password hashes, verification records, and rate
 * limiting. TradeConnect remains the source of truth for roles, permissions,
 * companies, and business domain records.
 */
export const auth = betterAuth({
  appName: "TradeConnect",
  // Dynamic base URLs validate the forwarded/request host against this explicit
  // allowlist before constructing redirects, callbacks, cookie settings, or
  // trusted origins. Unknown hosts fail closed; no request origin is appended.
  baseURL: {
    allowedHosts,
    protocol: isVercelDeployment ? "https" : "http",
  },
  basePath: "/api/auth",
  secret: authEnvironment.secret,
  database: prismaAdapter(getPrismaClient(), { provider: "postgresql", transaction: true }),
  user: { modelName: "User", fields: { name: "fullName" } },
  session: { modelName: "AuthSession" },
  account: { modelName: "AuthAccount" },
  verification: { modelName: "AuthVerification" },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: !isProductionDeployment,
    // Public production sign-up stays closed until transactional email and
    // verification delivery are implemented in a later phase.
    disableSignUp: isProductionDeployment,
    requireEmailVerification: isProductionDeployment,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "AuthRateLimit",
    window: 60,
    max: 20,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 3600, max: 5 },
      "/get-session": { window: 60, max: 60 },
    },
  },
  advanced: {
    database: { generateId: "uuid" },
    // Dynamic baseURL validates proxy-derived hosts against allowedHosts before
    // use. Vercel supplies these headers for deployed HTTPS requests.
    trustedProxyHeaders: true,
    useSecureCookies: isVercelDeployment,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await ensureDefaultUserRole(user.id);
        },
      },
    },
  },
});
