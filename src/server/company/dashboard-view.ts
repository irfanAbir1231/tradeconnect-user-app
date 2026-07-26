import "server-only";

import type { CompanyMembershipSummary } from "@/src/server/auth/actor";
import { isCompanyAdministrator, isPlatformCompanyAdministrator } from "@/src/server/company/authorization";
import type { CurrentActor } from "@/src/server/auth/actor";
import type { CompanyMemberProfileView, CompanyNavigationView, CompanyOwnerView } from "@/src/types/company-profile";

/**
 * Narrows the private owner DTO to the data that belongs in authenticated
 * dashboard UI. Members never receive registration identifiers or contact data.
 */
export function toCompanyMemberProfileView(
  actor: CurrentActor,
  company: CompanyOwnerView,
  membership: CompanyMembershipSummary,
): CompanyMemberProfileView {
  const canEdit = isCompanyAdministrator(actor, company.id) || isPlatformCompanyAdministrator(actor);
  const { contact, registration, ...memberVisibleCompany } = company;

  return {
    ...memberVisibleCompany,
    membershipRole: membership.membershipRole,
    canEdit,
    ...(canEdit ? { contact } : {}),
    registration: { country: registration.country },
  };
}

/** Compact safe projection for the client-side dashboard navigation only. */
export function toCompanyNavigationView(profile: CompanyMemberProfileView): CompanyNavigationView {
  return {
    displayName: profile.displayName,
    membershipRole: profile.membershipRole,
    profileCompletion: profile.profileCompletion.percentage,
    verificationStatus: profile.verification.status,
    canEdit: profile.canEdit,
  };
}
