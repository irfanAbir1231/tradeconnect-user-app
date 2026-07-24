import "server-only";

import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";

import { getBetterAuthEnvironment, serverEnv } from "@/src/server/config/env";
import { getPrismaClient } from "@/src/server/db/client";

import { ensureDefaultUserRole } from "./roles";

const authEnvironment = getBetterAuthEnvironment();
const isProduction = serverEnv.nodeEnv === "production";

/**
 * Better Auth owns sessions, password hashes, verification records, and rate
 * limiting. TradeConnect remains the source of truth for roles, permissions,
 * companies, and business domain records.
 */
export const auth = betterAuth({
  appName: "TradeConnect",
  baseURL: authEnvironment.url,
  basePath: "/api/auth",
  secret: authEnvironment.secret,
  trustedOrigins: [authEnvironment.url],
  database: prismaAdapter(getPrismaClient(), { provider: "postgresql", transaction: true }),
  user: { modelName: "User", fields: { name: "fullName" } },
  session: { modelName: "AuthSession" },
  account: { modelName: "AuthAccount" },
  verification: { modelName: "AuthVerification" },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: !isProduction,
    // Public production sign-up stays closed until transactional email and
    // verification delivery are implemented in a later phase.
    disableSignUp: isProduction,
    requireEmailVerification: isProduction,
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
    useSecureCookies: isProduction,
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
