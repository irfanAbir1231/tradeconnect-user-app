import "server-only";

import { redirect } from "next/navigation";

import type { Permission } from "@/src/types/auth";

import { getCurrentActor } from "./actor";

function loginUrl(nextPath: string) {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

/** Server-component guard. This is the authorization boundary for protected UI routes. */
export async function requireAuthenticatedPage(nextPath: string) {
  const actor = await getCurrentActor();

  if (!actor) {
    redirect(loginUrl(nextPath));
  }

  return actor;
}

/** Server-component permission guard. It complements, but never delegates to, client UI gates. */
export async function requirePermissionPage(permission: Permission, nextPath: string) {
  const actor = await requireAuthenticatedPage(nextPath);

  if (!actor.permissions.includes(permission)) {
    redirect("/unauthorized");
  }

  return actor;
}
