import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";
import { getPrismaClient } from "@/src/server/db/client";

export type DatabaseTransaction = Prisma.TransactionClient;

export function withTransaction<T>(callback: (transaction: DatabaseTransaction) => Promise<T>) {
  return getPrismaClient().$transaction(callback);
}
