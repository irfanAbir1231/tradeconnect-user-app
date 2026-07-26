/**
 * Shared UI-facing authorization vocabulary for the future TradeConnect auth layer.
 * These types describe product roles and capabilities; they do not authenticate anyone.
 */
export type UserRole = "guest" | "business_user" | "verified_business" | "team_member" | "admin" | "super_admin";

export type Permission =
  | "submit_request"
  | "view_own_requests"
  | "manage_own_company"
  | "submit_inquiry"
  | "view_admin_dashboard"
  | "manage_requests"
  | "review_verifications"
  | "moderate_marketplace"
  | "manage_companies"
  | "view_analytics"
  | "manage_team"
  | "manage_settings";

export interface CompanyMembershipView {
  companyId: string;
  companyName: string;
  membershipRole: "owner" | "admin" | "member";
  isPrimary: boolean;
}

/** Safe, serializable identity data permitted in server-to-client UI props. */
export interface AuthenticatedUserView {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  roles: UserRole[];
  permissions: Permission[];
  companyMemberships: CompanyMembershipView[];
}
