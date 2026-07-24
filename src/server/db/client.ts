import "server-only";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/src/generated/prisma/client";
import { serverEnv } from "@/src/server/config/env";

type PrismaGlobal = typeof globalThis & {
  tradeConnectPrisma?: PrismaClient;
};

let prisma: PrismaClient | undefined;

function createPrismaClient() {
  const connectionString = serverEnv.databaseUrl;

  if (!connectionString) {
    throw new Error("Database runtime is not configured.");
  }

  // DATABASE_URL is the pooled Neon connection used by request-time Node.js code.
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

/**
 * Returns the one Prisma client used by this server process. The global reference
 * avoids a client per hot-reload module evaluation during local development.
 * Serverless invocations may be short-lived, so the client is intentionally lazy
 * and is not disconnected after each request; the runtime can reuse its pool.
 */
export function getPrismaClient() {
  const globalWithPrisma = globalThis as PrismaGlobal;

  if (prisma) {
    return prisma;
  }

  if (serverEnv.nodeEnv === "development" && globalWithPrisma.tradeConnectPrisma) {
    prisma = globalWithPrisma.tradeConnectPrisma;
    return prisma;
  }

  prisma = createPrismaClient();

  if (serverEnv.nodeEnv === "development") {
    globalWithPrisma.tradeConnectPrisma = prisma;
  }

  return prisma;
}

/** Only standalone CLI processes should call this when they finish. */
export async function disconnectPrismaClient() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = undefined;
  }
}
