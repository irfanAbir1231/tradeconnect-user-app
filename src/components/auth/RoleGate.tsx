"use client";

import type { ReactNode } from "react";

import { hasRole, rolePermissions } from "@/src/lib/permissions";
import type { Permission, UserRole } from "@/src/types/auth";

type RoleGateProps = {
  allowedRoles?: readonly UserRole[];
  requiredPermission?: Permission;
  roles?: readonly UserRole[];
  permissions?: readonly Permission[];
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * Frontend UI gating only. This component is not a security boundary: a user can inspect
 * client code or call APIs directly. Real authorization must later be enforced by the backend/API.
 */
export function RoleGate({ allowedRoles, requiredPermission, roles, permissions, fallback = null, children }: RoleGateProps) {
  const availableRoles = roles ?? [];
  const availablePermissions = permissions ?? availableRoles.flatMap((role) => rolePermissions[role]);
  const roleAllowed = !allowedRoles?.length || availableRoles.some((role) => hasRole(role, allowedRoles));
  const permissionAllowed = !requiredPermission || availablePermissions.includes(requiredPermission);

  return roleAllowed && permissionAllowed ? <>{children}</> : <>{fallback}</>;
}
