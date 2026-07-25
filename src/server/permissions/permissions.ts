import "server-only";

import type { Permission, UserRole } from "@/src/types/auth";

export { actorHasPermission } from "./policy";

/** Canonical server permission vocabulary currently shared with the UI contract. */
export const serverPermissions = [
  "submit_request",
  "view_own_requests",
  "manage_own_company",
  "submit_inquiry",
  "view_admin_dashboard",
  "manage_requests",
  "review_verifications",
  "moderate_marketplace",
  "manage_companies",
  "view_analytics",
  "manage_team",
  "manage_settings",
] as const satisfies readonly Permission[];

export type ServerPermission = (typeof serverPermissions)[number];

export const serverRoles = ["guest", "business_user", "verified_business", "team_member", "admin", "super_admin"] as const satisfies readonly UserRole[];

export interface AuthorizationActor {
  id: string;
  roles: readonly UserRole[];
  companyIds?: readonly string[];
  permissions: readonly Permission[];
}
