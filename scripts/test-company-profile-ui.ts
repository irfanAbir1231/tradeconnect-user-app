import assert from "node:assert/strict";

import { locationSelectionFromPrimaryLocation, membershipCanEdit, type CompanyLocationView } from "../src/types/company-profile";

const country = { id: "country-bd", iso2: "BD", name: "Bangladesh" };
const division: CompanyLocationView = { id: "division-dhaka", name: "Dhaka", type: "division", country };
const district: CompanyLocationView = { id: "district-dhaka", name: "Dhaka", type: "district", country, parent: division };
const upazila: CompanyLocationView = { id: "upazila-savar", name: "Savar", type: "upazila", country, parent: district };

assert.deepEqual(locationSelectionFromPrimaryLocation(upazila, country.id), {
  countryId: "country-bd",
  divisionId: "division-dhaka",
  districtId: "district-dhaka",
  upazilaId: "upazila-savar",
});
assert.deepEqual(locationSelectionFromPrimaryLocation(null, country.id), {
  countryId: "country-bd",
  divisionId: "",
  districtId: "",
  upazilaId: "",
});

assert.equal(membershipCanEdit({ membershipRole: "owner" }), true);
assert.equal(membershipCanEdit({ membershipRole: "admin" }), true);
assert.equal(membershipCanEdit({ membershipRole: "member" }), false);
assert.equal(membershipCanEdit(null), false);

console.info("Company profile UI projection tests passed.");
