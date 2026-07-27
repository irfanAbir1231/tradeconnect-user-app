import "server-only";

import type { DatabaseClient } from "@/src/server/db/types";

export function findActiveBusinessCategories(db: DatabaseClient) {
  return db.category.findMany({ where: { isActive: true, deletedAt: null }, select: { id: true, name: true, scope: true, slug: true }, orderBy: [{ scope: "asc" }, { sortOrder: "asc" }, { name: "asc" }] });
}

export function findActiveCountries(db: DatabaseClient) {
  return db.country.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } });
}

export function findActiveLocation(db: DatabaseClient, id: string, type: string) {
  return db.location.findFirst({ where: { id, type, isActive: true, deletedAt: null }, select: { id: true, countryId: true, parentId: true, name: true, type: true } });
}

export function findActiveLocations(db: DatabaseClient, where: { countryId?: string; parentId?: string; type: string }) {
  return db.location.findMany({ where: { ...where, isActive: true, deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } });
}
