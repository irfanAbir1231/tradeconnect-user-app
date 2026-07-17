import type { Permission, UserRole } from "@/src/types/auth";

/**
 * Frontend-only role mapping for shaping the UI before a real authorization API exists.
 * Backend/API authorization must independently enforce every permission later.
 */
export const rolePermissions: Record<UserRole, readonly Permission[]> = {
  guest: [],
  business_user: ["submit_request", "view_own_requests", "submit_inquiry"],
  verified_business: ["submit_request", "view_own_requests", "manage_own_company", "submit_inquiry"],
  team_member: ["view_admin_dashboard", "manage_requests", "review_verifications", "moderate_marketplace", "view_analytics"],
  admin: ["view_admin_dashboard", "manage_requests", "review_verifications", "moderate_marketplace", "manage_companies", "view_analytics"],
  super_admin: ["view_admin_dashboard", "manage_requests", "review_verifications", "moderate_marketplace", "manage_companies", "view_analytics", "manage_team", "manage_settings"],
};

export function hasRole(role: UserRole, allowedRoles: readonly UserRole[]) {
  return allowedRoles.includes(role);
}

export function hasPermission(role: UserRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function can(role: UserRole, permission: Permission) {
  return hasPermission(role, permission);
}
