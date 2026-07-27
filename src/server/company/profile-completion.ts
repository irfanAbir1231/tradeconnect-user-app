export type CompanyProfileCompletionSource = {
  legalName: string;
  displayName: string;
  businessType: string;
  businessEmail: string | null;
  businessPhone: string | null;
  description: string | null;
  website: string | null;
  primaryProducts: string | null;
  addressLine1: string | null;
  registrationCountryId: string | null;
  primaryLocationId: string | null;
  categoriesCount: number;
};

export type CompanyProfileCompletion = {
  percentage: number;
  completed: string[];
  missing: string[];
  completedGroups: string[];
  incompleteGroups: string[];
  nextAction: string | null;
  profileComplete: boolean;
  verificationReady: boolean;
  verificationBlockers: string[];
};

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

const fields: Array<{ key: string; weight: number; complete: (company: CompanyProfileCompletionSource) => boolean }> = [
  { key: "legalName", weight: 10, complete: (company) => hasText(company.legalName) },
  { key: "displayName", weight: 10, complete: (company) => hasText(company.displayName) },
  { key: "businessType", weight: 10, complete: (company) => hasText(company.businessType) },
  { key: "businessEmail", weight: 10, complete: (company) => hasText(company.businessEmail) },
  { key: "registrationCountry", weight: 10, complete: (company) => hasText(company.registrationCountryId) },
  { key: "businessCategory", weight: 10, complete: (company) => company.categoriesCount > 0 },
  { key: "primaryLocation", weight: 10, complete: (company) => hasText(company.primaryLocationId) },
  { key: "businessAddress", weight: 10, complete: (company) => hasText(company.addressLine1) },
  { key: "description", weight: 10, complete: (company) => hasText(company.description) },
  { key: "productsOrServices", weight: 5, complete: (company) => hasText(company.primaryProducts) },
  { key: "businessPhone", weight: 5, complete: (company) => hasText(company.businessPhone) },
];

export function calculateCompanyProfileCompletion(company: CompanyProfileCompletionSource): CompanyProfileCompletion {
  const completed = fields.filter((field) => field.complete(company));
  const percentage = completed.reduce((total, field) => total + field.weight, 0);
  const missing = fields.filter((field) => !field.complete(company)).map((field) => field.key);
  const verificationRequired = ["legalName", "businessEmail", "registrationCountry", "businessCategory", "primaryLocation", "businessAddress"];
  const verificationBlockers = verificationRequired.filter((key) => !completed.some((field) => field.key === key));

  return {
    percentage,
    completed: completed.map((field) => field.key),
    missing,
    completedGroups: completed.map((field) => field.key),
    incompleteGroups: missing,
    nextAction: missing[0] ?? null,
    profileComplete: missing.length === 0,
    verificationReady: verificationBlockers.length === 0,
    verificationBlockers,
  };
}
