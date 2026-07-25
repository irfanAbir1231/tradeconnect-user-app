import type { Permission } from "@/src/types/auth";

export type PermissionActor = {
  permissions: readonly Permission[];
};

/** Pure permission predicate used by server-side authorization guards. */
export function actorHasPermission(actor: PermissionActor | null | undefined, permission: Permission) {
  return actor?.permissions.includes(permission) ?? false;
}
