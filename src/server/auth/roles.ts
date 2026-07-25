import "server-only";

import { getPrismaClient } from "@/src/server/db/client";
import { logger } from "@/src/server/logging/logger";

import { defaultBusinessUserRoleSlug, ensureSingleDefaultRoleAssignment } from "./default-role-assignment";

/**
 * Assigns the least-privileged role for a new account. This is intentionally
 * idempotent because Better Auth database hooks run outside its user transaction.
 */
export async function ensureDefaultUserRole(userId: string) {
  const prisma = getPrismaClient();
  const role = await prisma.role.findUnique({ where: { slug: defaultBusinessUserRoleSlug }, select: { id: true } });

  if (!role) {
    throw new Error("The canonical business_user role has not been seeded.");
  }

  const assignment = await ensureSingleDefaultRoleAssignment({
    findExisting: () => prisma.userRole.findFirst({
      where: { userId, roleId: role.id, companyId: null, revokedAt: null },
      select: { id: true },
    }),
    create: async () => {
      const created = await prisma.$transaction(async (transaction) => {
        const assignment = await transaction.userRole.create({
          data: { userId, roleId: role.id },
          select: { id: true },
        });

        await transaction.auditLog.create({
          data: {
            actorUserId: userId,
            actorRole: defaultBusinessUserRoleSlug,
            action: "auth.default_role_assigned",
            resourceType: "user",
            resourceId: userId,
            afterJson: { role: defaultBusinessUserRoleSlug, source: "auth_signup" },
          },
        });

        return assignment;
      });

      logger.info("auth.default_role_assigned", { userId, role: defaultBusinessUserRoleSlug });
      return created;
    },
  });

  return assignment;
}
