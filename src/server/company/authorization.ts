import type { CurrentActor } from "@/src/server/auth/actor";
import { AppError } from "@/src/server/errors/app-error";

export type CompanyMembershipRole = "owner" | "admin" | "member";

export function isPlatformCompanyAdministrator(actor: CurrentActor) {
  return actor.permissions.includes("manage_companies");
}

export function isCompanyAdministrator(actor: CurrentActor, companyId: string) {
  return actor.companyMemberships.some((membership) => companyId === membership.companyId && (membership.membershipRole === "owner" || membership.membershipRole === "admin"));
}

export function canAccessCompany(actor: CurrentActor, companyId: string) {
  return isPlatformCompanyAdministrator(actor) || actor.companyMemberships.some((membership) => membership.companyId === companyId);
}

export function requireCompanyAccess(actor: CurrentActor, companyId: string) {
  if (!canAccessCompany(actor, companyId)) throw AppError.notFound();
  return actor;
}

export function requireCompanyAdministrator(actor: CurrentActor, companyId: string) {
  if (isPlatformCompanyAdministrator(actor) || isCompanyAdministrator(actor, companyId)) return actor;
  // Deliberately return 404 for an unrelated company to reduce resource enumeration.
  if (!actor.companyMemberships.some((membership) => membership.companyId === companyId)) throw AppError.notFound();
  throw AppError.forbidden("An owner or company administrator is required.");
}
