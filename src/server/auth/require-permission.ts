import "server-only";

import type { Permission, UserRole } from "@/src/types/auth";
import { AppError } from "@/src/server/errors/app-error";

import type { CurrentActor } from "./actor";
import { getCurrentActor } from "./actor";

export async function requireCurrentActor() {
  const actor = await getCurrentActor();

  if (!actor) {
    throw AppError.unauthenticated();
  }

  return actor;
}

export function requireActorPermission(actor: CurrentActor | null | undefined, permission: Permission) {
  if (!actor) {
    throw AppError.unauthenticated();
  }

  if (!actor.permissions.includes(permission)) {
    throw AppError.forbidden();
  }

  return actor;
}

export function requireActorRole(actor: CurrentActor | null | undefined, roles: readonly UserRole[]) {
  if (!actor) {
    throw AppError.unauthenticated();
  }

  if (!actor.roles.some((role) => roles.includes(role))) {
    throw AppError.forbidden();
  }

  return actor;
}
