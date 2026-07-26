import "server-only";

import { getPrismaClient } from "@/src/server/db/client";
import { AppError } from "@/src/server/errors/app-error";
import { findActiveBusinessCategories, findActiveCountries, findActiveLocation, findActiveLocations } from "@/src/server/repositories/reference-data-repository";

export function listBusinessCategories() { return findActiveBusinessCategories(getPrismaClient()); }
export function listCountries() { return findActiveCountries(getPrismaClient()); }

export async function listDivisions(countryId: string) {
  const country = await getPrismaClient().country.findFirst({ where: { id: countryId, isActive: true }, select: { id: true } });
  if (!country) throw AppError.notFound("The selected country is unavailable.");
  return findActiveLocations(getPrismaClient(), { countryId, parentId: undefined, type: "division" });
}

export async function listDistricts(divisionId: string) {
  const division = await findActiveLocation(getPrismaClient(), divisionId, "division");
  if (!division) throw AppError.notFound("The selected division is unavailable.");
  return findActiveLocations(getPrismaClient(), { parentId: division.id, type: "district" });
}

export async function listUpazilas(districtId: string) {
  const district = await findActiveLocation(getPrismaClient(), districtId, "district");
  if (!district) throw AppError.notFound("The selected district is unavailable.");
  return findActiveLocations(getPrismaClient(), { parentId: district.id, type: "upazila" });
}
