import "server-only";

import { Prisma } from "@/src/generated/prisma/client";
import { getPrismaClient } from "@/src/server/db/client";

export async function checkDatabaseHealth() {
  const database = getPrismaClient();
  await database.$queryRaw(Prisma.sql`SELECT 1`);
  return true;
}
