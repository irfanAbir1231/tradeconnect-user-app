import "server-only";

import type { DatabaseClient, DatabaseTransactionClient } from "@/src/server/db/types";

type DatabaseExecutor = DatabaseClient | DatabaseTransactionClient;

export function findActiveMembership(db: DatabaseExecutor, userId: string, companyId: string) {
  return db.companyMember.findFirst({
    where: { userId, companyId, status: "active", deletedAt: null },
    select: { id: true, companyId: true, membershipRole: true, isPrimary: true },
  });
}

export function createOwnerMembership(db: DatabaseExecutor, companyId: string, userId: string) {
  return db.companyMember.create({
    // It becomes primary in a second transactional step after any existing
    // primary membership is unset, preserving the partial-unique invariant.
    data: { companyId, userId, membershipRole: "owner", status: "active", isPrimary: false },
    select: { id: true, companyId: true, membershipRole: true, isPrimary: true },
  });
}

/** Sets one active membership as the user's primary company inside the caller's transaction. */
export async function setPrimaryMembership(db: DatabaseExecutor, userId: string, companyId: string) {
  const membership = await findActiveMembership(db, userId, companyId);
  if (!membership) return null;

  await db.companyMember.updateMany({
    where: { userId, status: "active", deletedAt: null, isPrimary: true },
    data: { isPrimary: false },
  });
  return db.companyMember.update({
    where: { id: membership.id },
    data: { isPrimary: true },
    select: { id: true, companyId: true, membershipRole: true, isPrimary: true },
  });
}
