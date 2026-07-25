import "server-only";

import type { Permission, UserRole } from "@/src/types/auth";

import { AppError } from "@/src/server/errors/app-error";

import { actorHasPermission, type AuthorizationActor } from "./permissions";

export function requireAuthenticated(actor: AuthorizationActor | null | undefined): asserts actor is AuthorizationActor {
  if (!actor) {
    throw AppError.unauthenticated();
  }
}

export function requirePermission(actor: AuthorizationActor | null | undefined, permission: Permission) {
  requireAuthenticated(actor);

  if (!actorHasPermission(actor, permission)) {
    throw AppError.forbidden();
  }
}

export function requireRole(actor: AuthorizationActor | null | undefined, roles: readonly UserRole[]) {
  requireAuthenticated(actor);

  if (!actor.roles.some((role) => roles.includes(role))) {
    throw AppError.forbidden();
  }
}

export function requireCompanyScope(actor: AuthorizationActor | null | undefined, companyId: string) {
  requireAuthenticated(actor);

  if (!actor.companyIds?.includes(companyId) && !actor.roles.includes("admin") && !actor.roles.includes("super_admin")) {
    throw AppError.forbidden();
  }
}
