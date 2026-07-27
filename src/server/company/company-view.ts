import type { CompanyOwnerRecord, CompanySummaryRecord } from "@/src/server/repositories/company-repository";
import type { CompanyOwnerView } from "@/src/types/company-profile";

import { calculateCompanyProfileCompletion } from "./profile-completion";

export function toOwnerCompanyView(company: CompanyOwnerRecord): CompanyOwnerView {
  const profileCompletion = calculateCompanyProfileCompletion({
    legalName: company.legalName,
    displayName: company.displayName,
    businessType: company.businessType,
    businessEmail: company.businessEmail,
    businessPhone: company.businessPhone,
    description: company.description,
    website: company.website,
    primaryProducts: company.primaryProducts,
    addressLine1: company.addressLine1,
    registrationCountryId: company.registrationCountryId,
    primaryLocationId: company.primaryLocationId,
    categoriesCount: company.categories.length,
  });

  return {
    id: company.id,
    slug: company.slug,
    legalName: company.legalName,
    displayName: company.displayName,
    businessType: company.businessType,
    contact: { businessEmail: company.businessEmail, businessPhone: company.businessPhone },
    profile: {
      description: company.description,
      website: company.website,
      primaryProducts: company.primaryProducts,
      foundedYear: company.foundedYear,
      employeeRange: company.employeeRange,
      addressLine1: company.addressLine1,
      addressLine2: company.addressLine2,
    },
    registration: {
      country: company.registrationCountry,
      registrationNumber: company.registrationNumber,
      tradeLicenseNumber: company.tradeLicenseNumber,
      taxVatNumber: company.taxVatNumber,
    },
    primaryLocation: company.primaryLocation,
    categories: company.categories.map((entry) => ({ ...entry.category, isPrimary: entry.isPrimary })),
    countriesServed: company.countriesServed.map((entry) => ({ ...entry.country, relationship: entry.relationship })),
    verification: { status: company.verificationStatus, ready: profileCompletion.verificationReady },
    accountStatus: company.accountStatus,
    profileCompletion,
    version: company.version,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}

export function toCompanySummaryView(company: CompanySummaryRecord) {
  return {
    id: company.id,
    slug: company.slug,
    displayName: company.displayName,
    businessType: company.businessType,
    verificationStatus: company.verificationStatus,
    accountStatus: company.accountStatus,
    version: company.version,
    updatedAt: company.updatedAt.toISOString(),
  };
}
