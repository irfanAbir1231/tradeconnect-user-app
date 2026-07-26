export type ReferenceOption = { id: string; name: string };
export type BusinessCategoryOption = ReferenceOption & { scope: string; slug: string };
export type LocationSelection = { countryId: string; divisionId: string; districtId: string; upazilaId: string };

export function resetLocationForCountry(countryId: string): LocationSelection { return { countryId, divisionId: "", districtId: "", upazilaId: "" }; }
export function resetLocationForDivision(selection: LocationSelection, divisionId: string): LocationSelection { return { ...selection, divisionId, districtId: "", upazilaId: "" }; }
export function resetLocationForDistrict(selection: LocationSelection, districtId: string): LocationSelection { return { ...selection, districtId, upazilaId: "" }; }
