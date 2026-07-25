import "server-only";

import type { Permission, UserRole } from "@/src/types/auth";
import { getPrismaClient } from "@/src/server/db/client";
import { serverPermissions, serverRoles } from "@/src/server/permissions/permissions";

import { getSession } from "./session";

export type CompanyMembershipSummary = {
  companyId: string;
  companyName: string;
  membershipRole: "owner" | "admin" | "member";
  isPrimary: boolean;
};

export type CurrentActor = {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  roles: UserRole[];
  permissions: Permission[];
  companyMemberships: CompanyMembershipSummary[];
};

function isCanonicalRole(value: string): value is UserRole {
  return (serverRoles as readonly string[]).includes(value);
}

function isCanonicalPermission(value: string): value is Permission {
  return (serverPermissions as readonly string[]).includes(value);
}

/**
 * Resolves a trusted server-side actor from the Better Auth session plus the
 * canonical TradeConnect role, permission, and membership records.
 */
export async function getCurrentActor(): Promise<CurrentActor | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await getPrismaClient().user.findFirst({
    where: { id: session.user.id, status: "active", deletedAt: null },
    select: {
      id: true,
      email: true,
      fullName: true,
      emailVerified: true,
      roleAssignments: {
        where: { revokedAt: null },
        select: {
          role: {
            select: {
              slug: true,
              permissions: { select: { permission: { select: { slug: true } } } },
            },
          },
        },
      },
      companyMemberships: {
        where: { status: "active", deletedAt: null },
        select: {
          companyId: true,
          membershipRole: true,
          isPrimary: true,
          company: { select: { displayName: true } },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const roles = [...new Set(user.roleAssignments.map((assignment) => assignment.role.slug).filter(isCanonicalRole))];
  const permissions = [...new Set(user.roleAssignments.flatMap((assignment) => assignment.role.permissions.map((rolePermission) => rolePermission.permission.slug)).filter(isCanonicalPermission))];

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    emailVerified: user.emailVerified,
    roles,
    permissions,
    companyMemberships: user.companyMemberships.map((membership) => ({
      companyId: membership.companyId,
      companyName: membership.company.displayName,
      membershipRole: membership.membershipRole,
      isPrimary: membership.isPrimary,
    })),
  };
}
