import "server-only";

import { getPrismaClient } from "@/src/server/db/client";
import { logger } from "@/src/server/logging/logger";

const defaultRoleSlug = "business_user";

/**
 * Assigns the least-privileged role for a new account. This is intentionally
 * idempotent because Better Auth database hooks run outside its user transaction.
 */
export async function ensureDefaultUserRole(userId: string) {
  const prisma = getPrismaClient();
  const role = await prisma.role.findUnique({ where: { slug: defaultRoleSlug }, select: { id: true } });

  if (!role) {
    throw new Error("The canonical business_user role has not been seeded.");
  }

  const existing = await prisma.userRole.findFirst({
    where: { userId, roleId: role.id, companyId: null, revokedAt: null },
    select: { id: true },
  });

  if (existing) {
    return existing;
  }

  try {
    const assignment = await prisma.$transaction(async (transaction) => {
      const created = await transaction.userRole.create({
        data: { userId, roleId: role.id },
        select: { id: true },
      });

      await transaction.auditLog.create({
        data: {
          actorUserId: userId,
          actorRole: defaultRoleSlug,
          action: "auth.default_role_assigned",
          resourceType: "user",
          resourceId: userId,
          afterJson: { role: defaultRoleSlug, source: "auth_signup" },
        },
      });

      return created;
    });

    logger.info("auth.default_role_assigned", { userId, role: defaultRoleSlug });
    return assignment;
  } catch (error) {
    // The migration's partial index is the concurrency backstop. If another
    // request won the race, return its assignment instead of granting twice.
    const racedAssignment = await prisma.userRole.findFirst({
      where: { userId, roleId: role.id, companyId: null, revokedAt: null },
      select: { id: true },
    });

    if (racedAssignment) {
      return racedAssignment;
    }

    throw error;
  }
}
