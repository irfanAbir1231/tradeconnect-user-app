import assert from "node:assert/strict";

import { resetLocationForCountry, resetLocationForDistrict, resetLocationForDivision } from "../src/types/company-onboarding";

const country = resetLocationForCountry("country-bd");
assert.deepEqual(country, { countryId: "country-bd", divisionId: "", districtId: "", upazilaId: "" });
const division = resetLocationForDivision({ ...country, districtId: "old-district", upazilaId: "old-upazila" }, "division-dhaka");
assert.deepEqual(division, { countryId: "country-bd", divisionId: "division-dhaka", districtId: "", upazilaId: "" });
const district = resetLocationForDistrict({ ...division, upazilaId: "old-upazila" }, "district-dhaka");
assert.deepEqual(district, { countryId: "country-bd", divisionId: "division-dhaka", districtId: "district-dhaka", upazilaId: "" });

console.info("Company onboarding location-reset tests passed.");
