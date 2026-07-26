import type { BusinessCategoryOption, ReferenceOption } from "@/src/types/company-onboarding";

type ApiEnvelope<T> = { data: T };

async function getReferenceData<T>(path: string, signal?: AbortSignal) {
  const response = await fetch(path, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Reference data is currently unavailable.");
  return (await response.json() as ApiEnvelope<T>).data;
}

export const loadBusinessCategories = (signal?: AbortSignal) => getReferenceData<BusinessCategoryOption[]>("/api/v1/reference/business-categories", signal);
export const loadCountries = (signal?: AbortSignal) => getReferenceData<ReferenceOption[]>("/api/v1/reference/countries", signal);
export const loadDivisions = (countryId: string, signal?: AbortSignal) => getReferenceData<ReferenceOption[]>(`/api/v1/reference/divisions?countryId=${encodeURIComponent(countryId)}`, signal);
export const loadDistricts = (divisionId: string, signal?: AbortSignal) => getReferenceData<ReferenceOption[]>(`/api/v1/reference/districts?divisionId=${encodeURIComponent(divisionId)}`, signal);
export const loadUpazilas = (districtId: string, signal?: AbortSignal) => getReferenceData<ReferenceOption[]>(`/api/v1/reference/upazilas?districtId=${encodeURIComponent(districtId)}`, signal);
