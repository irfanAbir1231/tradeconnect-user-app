import type { CompanyMembershipView } from "@/src/types/auth";
import type { BusinessCategoryOption, LocationSelection, ReferenceOption } from "@/src/types/company-onboarding";

export type CompanyLocationView = {
  id: string;
  name: string;
  type: string;
  country: { id: string; iso2: string; name: string };
  parent?: CompanyLocationView | null;
};

export type CompanyCategoryView = {
  id: string;
  scope: string;
  slug: string;
  name: string;
  isPrimary: boolean;
};

export type CompanyProfileCompletionView = {
  percentage: number;
  completed: string[];
  missing: string[];
  verificationReady: boolean;
};

export type CompanyOwnerView = {
  id: string;
  slug: string;
  legalName: string;
  displayName: string;
  businessType: string;
  contact: { businessEmail: string | null; businessPhone: string | null };
  profile: {
    description: string | null;
    website: string | null;
    primaryProducts: string | null;
    foundedYear: number | null;
    employeeRange: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
  };
  registration: {
    country: { id: string; iso2: string; iso3: string; name: string } | null;
    registrationNumber: string | null;
    tradeLicenseNumber: string | null;
    taxVatNumber: string | null;
  };
  primaryLocation: CompanyLocationView | null;
  categories: CompanyCategoryView[];
  countriesServed: Array<{ id: string; iso2: string; iso3: string; name: string; relationship: string }>;
  verification: { status: string; ready: boolean };
  accountStatus: string;
  profileCompletion: CompanyProfileCompletionView;
  version: number;
  createdAt: string;
  updatedAt: string;
};

/** Minimal, member-safe company data for dashboard UI. It deliberately omits registration identifiers. */
export type CompanyMemberProfileView = Omit<CompanyOwnerView, "registration" | "contact"> & {
  membershipRole: CompanyMembershipView["membershipRole"];
  canEdit: boolean;
  contact?: CompanyOwnerView["contact"];
  registration: Pick<CompanyOwnerView["registration"], "country">;
};

export type CompanyNavigationView = {
  displayName: string;
  membershipRole: CompanyMembershipView["membershipRole"];
  profileCompletion: number;
  verificationStatus: string;
  canEdit: boolean;
};

export type CompanyEditFormProps = {
  company: CompanyOwnerView;
  categories: BusinessCategoryOption[];
  countries: ReferenceOption[];
};

export function locationSelectionFromPrimaryLocation(location: CompanyLocationView | null, registrationCountryId: string): LocationSelection {
  const selection: LocationSelection = { countryId: registrationCountryId, divisionId: "", districtId: "", upazilaId: "" };
  let current = location;

  while (current) {
    if (current.type === "division") selection.divisionId = current.id;
    if (current.type === "district") selection.districtId = current.id;
    if (current.type === "upazila") selection.upazilaId = current.id;
    current = current.parent ?? null;
  }

  return selection;
}

export function membershipCanEdit(membership: Pick<CompanyMembershipView, "membershipRole"> | null | undefined) {
  return membership?.membershipRole === "owner" || membership?.membershipRole === "admin";
}
