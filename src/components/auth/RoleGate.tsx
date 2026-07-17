"use client";

import type { ReactNode } from "react";

import { currentUser } from "@/src/data/current-user";
import { hasPermission, hasRole } from "@/src/lib/permissions";
import type { Permission, UserRole } from "@/src/types/auth";

type RoleGateProps = {
  allowedRoles?: readonly UserRole[];
  requiredPermission?: Permission;
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * Frontend UI gating only. This component is not a security boundary: a user can inspect
 * client code or call APIs directly. Real authorization must later be enforced by the backend/API.
 */
export function RoleGate({ allowedRoles, requiredPermission, fallback = null, children }: RoleGateProps) {
  const roleAllowed = !allowedRoles?.length || hasRole(currentUser.role, allowedRoles);
  const permissionAllowed = !requiredPermission || hasPermission(currentUser.role, requiredPermission);

  return roleAllowed && permissionAllowed ? <>{children}</> : <>{fallback}</>;
}
