import "server-only";

import type { AuthenticatedUserView } from "@/src/types/auth";

import type { CurrentActor } from "./actor";

/** Maps a verified server actor to the only identity shape client UI may receive. */
export function toAuthenticatedUserView(actor: CurrentActor): AuthenticatedUserView {
  return {
    id: actor.id,
    name: actor.fullName,
    email: actor.email,
    emailVerified: actor.emailVerified,
    roles: actor.roles,
    permissions: actor.permissions,
    companyMemberships: actor.companyMemberships.map((membership) => ({
      companyId: membership.companyId,
      companyName: membership.companyName,
      membershipRole: membership.membershipRole,
      isPrimary: membership.isPrimary,
    })),
  };
}
