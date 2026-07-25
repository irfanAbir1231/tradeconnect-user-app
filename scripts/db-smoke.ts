import { config as loadDotEnv } from "dotenv";

loadDotEnv({ path: ".env.local" });
loadDotEnv({ path: ".env" });

import { PrismaNeon } from "@prisma/adapter-neon";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Database smoke test blocked: DATABASE_URL is not configured.");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: databaseUrl }) });

class SmokeRollback extends Error {}

function safeErrorSummary(error: unknown) {
  if (!error || typeof error !== "object") {
    return { name: typeof error };
  }

  const candidate = error as { name?: unknown; code?: unknown };
  return {
    name: typeof candidate.name === "string" ? candidate.name : "UnknownError",
    constructor: error.constructor?.name ?? "UnknownConstructor",
    kind: Object.prototype.toString.call(error),
    keys: Object.keys(error).sort().slice(0, 12),
    ...(typeof candidate.code === "string" ? { code: candidate.code } : {}),
  };
}

async function main() {
  await prisma.$queryRaw(Prisma.sql`SELECT 1`);

  const [role, permission, category, country] = await Promise.all([
    prisma.role.findUnique({ where: { slug: "admin" }, select: { id: true } }),
    prisma.permission.findUnique({ where: { slug: "manage_requests" }, select: { id: true } }),
    prisma.category.findFirst({ where: { isActive: true }, select: { id: true } }),
    prisma.country.findUnique({ where: { iso2: "BD" }, select: { id: true } }),
  ]);

  if (!role || !permission || !category || !country) {
    throw new Error("Expected reference seed data is missing.");
  }

  let rolledBack = false;
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw(Prisma.sql`SELECT 1`);
      throw new SmokeRollback("Intentional smoke-test rollback");
    });
  } catch (error) {
    rolledBack = error instanceof SmokeRollback;
  }

  if (!rolledBack) {
    throw new Error("Transaction rollback check did not complete as expected.");
  }

  console.info("Database smoke test passed: connectivity, reference seed, and transaction rollback.");
}

main()
  .catch((error: unknown) => {
    console.error("Database smoke test failed.", safeErrorSummary(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
