import "server-only";

import { AppError } from "@/src/server/errors/app-error";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BUSINESS_TYPE_PATTERN = /^[a-z][a-z0-9_-]{1,63}$/;

export type CompanyCountryInput = {
  countryId: string;
  relationship: string;
};

export type CompanyIdInput = { companyId: string };
export type CompanySlugInput = { slug: string };

export type CreateCompanyInput = {
  legalName: string;
  displayName: string;
  businessType: string;
  businessEmail?: string;
  businessPhone?: string;
  description?: string;
  website?: string;
  primaryProducts?: string;
  addressLine1?: string;
  addressLine2?: string;
  registrationNumber?: string;
  tradeLicenseNumber?: string;
  taxVatNumber?: string;
  registrationCountryId: string;
  primaryLocationId?: string;
  foundedYear?: number;
  employeeRange?: string;
  categoryIds: string[];
  primaryCategoryId: string;
  countriesServed?: CompanyCountryInput[];
};

export type UpdateCompanyInput = {
  version: number;
  legalName?: string;
  displayName?: string;
  businessType?: string;
  businessEmail?: string | null;
  businessPhone?: string | null;
  description?: string | null;
  website?: string | null;
  primaryProducts?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  registrationNumber?: string | null;
  tradeLicenseNumber?: string | null;
  taxVatNumber?: string | null;
  registrationCountryId?: string;
  primaryLocationId?: string | null;
  foundedYear?: number | null;
  employeeRange?: string | null;
  categoryIds?: string[];
  primaryCategoryId?: string;
  countriesServed?: CompanyCountryInput[];
};

function validation(field: string, message: string): never {
  throw AppError.validation("Please correct the highlighted fields.", { [field]: message });
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return validation("body", "Send a JSON object.");
  }

  return value as Record<string, unknown>;
}

function rejectUnknownFields(input: Record<string, unknown>, allowed: readonly string[]) {
  const unknown = Object.keys(input).find((key) => !allowed.includes(key));
  if (unknown) {
    return validation(unknown, "This field is not supported.");
  }
}

function requiredText(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string") return validation(field, "This field is required.");
  const trimmed = value.trim();
  if (!trimmed) return validation(field, "This field is required.");
  if (trimmed.length > maxLength) return validation(field, `Use ${maxLength} characters or fewer.`);
  return trimmed;
}

function optionalText(value: unknown, field: string, maxLength: number) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return validation(field, "Use text for this field.");
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > maxLength) return validation(field, `Use ${maxLength} characters or fewer.`);
  return trimmed;
}

function requiredId(value: unknown, field: string) {
  const id = requiredText(value, field, 36);
  if (!UUID_PATTERN.test(id)) return validation(field, "Use a valid identifier.");
  return id;
}

function optionalId(value: unknown, field: string) {
  if (value === undefined || value === null || value === "") return value === null ? null : undefined;
  return requiredId(value, field);
}

function optionalEmail(value: unknown, field: string) {
  const email = optionalText(value, field, 254);
  if (email === undefined || email === null) return email;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return validation(field, "Enter a valid email address.");
  return email.toLowerCase();
}

function optionalPhone(value: unknown, field: string) {
  const phone = optionalText(value, field, 40);
  if (phone === undefined || phone === null) return phone;
  if (!/^\+?[0-9 ()-]{7,39}$/.test(phone)) return validation(field, "Enter a valid phone number.");
  return phone;
}

function optionalWebsite(value: unknown, field: string) {
  const website = optionalText(value, field, 500);
  if (website === undefined || website === null) return website;
  try {
    const url = new URL(website);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("unsupported protocol");
  } catch {
    return validation(field, "Enter a valid http or https URL.");
  }
  return website;
}

function optionalYear(value: unknown, field: string): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1800 || value > new Date().getFullYear()) {
    return validation(field, "Enter a valid founding year.");
  }
  return value;
}

function requiredBusinessType(value: unknown) {
  const businessType = requiredText(value, "businessType", 64).toLowerCase();
  if (!BUSINESS_TYPE_PATTERN.test(businessType)) {
    return validation("businessType", "Use lowercase letters, numbers, underscores, or hyphens.");
  }
  return businessType;
}

function optionalCategories(value: unknown, required: boolean) {
  if (value === undefined && !required) return undefined;
  if (!Array.isArray(value) || value.length === 0) return validation("categoryIds", "Select at least one business category.");
  if (value.length > 12) return validation("categoryIds", "Select 12 categories or fewer.");
  const categoryIds = value.map((item) => requiredId(item, "categoryIds"));
  if (new Set(categoryIds).size !== categoryIds.length) return validation("categoryIds", "Categories cannot be duplicated.");
  return categoryIds;
}

function optionalCountriesServed(value: unknown, required: boolean) {
  if (value === undefined && !required) return undefined;
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 20) return validation("countriesServed", "Use a list of up to 20 countries.");

  const countries = value.map((item, index) => {
    const entry = object(item);
    rejectUnknownFields(entry, ["countryId", "relationship"]);
    const relationship = requiredText(entry.relationship, `countriesServed.${index}.relationship`, 48).toLowerCase();
    if (!/^[a-z][a-z0-9_-]{1,47}$/.test(relationship)) {
      return validation(`countriesServed.${index}.relationship`, "Use a valid relationship label.");
    }
    return { countryId: requiredId(entry.countryId, `countriesServed.${index}.countryId`), relationship };
  });
  const keys = countries.map((entry) => `${entry.countryId}:${entry.relationship}`);
  if (new Set(keys).size !== keys.length) return validation("countriesServed", "Country relationships cannot be duplicated.");
  return countries;
}

function parsePrimaryCategory(input: Record<string, unknown>, categoryIds: string[] | undefined, required: boolean) {
  if (input.primaryCategoryId === undefined && !required) return undefined;
  const primaryCategoryId = requiredId(input.primaryCategoryId, "primaryCategoryId");
  if (categoryIds && !categoryIds.includes(primaryCategoryId)) {
    return validation("primaryCategoryId", "The primary category must be selected in categoryIds.");
  }
  return primaryCategoryId;
}

const createFields = [
  "legalName", "displayName", "businessType", "businessEmail", "businessPhone", "description", "website", "primaryProducts",
  "addressLine1", "addressLine2", "registrationNumber", "tradeLicenseNumber", "taxVatNumber", "registrationCountryId",
  "primaryLocationId", "foundedYear", "employeeRange", "categoryIds", "primaryCategoryId", "countriesServed",
] as const;

const updateFields = [...createFields, "version"] as const;

export function parseCreateCompanyInput(value: unknown): CreateCompanyInput {
  const input = object(value);
  rejectUnknownFields(input, createFields);
  const categoryIds = optionalCategories(input.categoryIds, true)!;

  return {
    legalName: requiredText(input.legalName, "legalName", 240),
    displayName: requiredText(input.displayName, "displayName", 240),
    businessType: requiredBusinessType(input.businessType),
    businessEmail: optionalEmail(input.businessEmail, "businessEmail") ?? undefined,
    businessPhone: optionalPhone(input.businessPhone, "businessPhone") ?? undefined,
    description: optionalText(input.description, "description", 4000) ?? undefined,
    website: optionalWebsite(input.website, "website") ?? undefined,
    primaryProducts: optionalText(input.primaryProducts, "primaryProducts", 2000) ?? undefined,
    addressLine1: optionalText(input.addressLine1, "addressLine1", 240) ?? undefined,
    addressLine2: optionalText(input.addressLine2, "addressLine2", 240) ?? undefined,
    registrationNumber: optionalText(input.registrationNumber, "registrationNumber", 120) ?? undefined,
    tradeLicenseNumber: optionalText(input.tradeLicenseNumber, "tradeLicenseNumber", 120) ?? undefined,
    taxVatNumber: optionalText(input.taxVatNumber, "taxVatNumber", 120) ?? undefined,
    registrationCountryId: requiredId(input.registrationCountryId, "registrationCountryId"),
    primaryLocationId: optionalId(input.primaryLocationId, "primaryLocationId") ?? undefined,
    foundedYear: optionalYear(input.foundedYear, "foundedYear") ?? undefined,
    employeeRange: optionalText(input.employeeRange, "employeeRange", 64) ?? undefined,
    categoryIds,
    primaryCategoryId: parsePrimaryCategory(input, categoryIds, true)!,
    countriesServed: optionalCountriesServed(input.countriesServed, true),
  };
}

export function parseUpdateCompanyInput(value: unknown): UpdateCompanyInput {
  const input = object(value);
  rejectUnknownFields(input, updateFields);
  if (!Number.isInteger(input.version) || (input.version as number) < 1) return validation("version", "Use the current profile version.");

  const categoryIds = optionalCategories(input.categoryIds, false);
  const primaryCategoryId = parsePrimaryCategory(input, categoryIds, input.primaryCategoryId !== undefined);
  if ((categoryIds === undefined) !== (primaryCategoryId === undefined)) {
    return validation("categoryIds", "Update categoryIds and primaryCategoryId together.");
  }

  const result: UpdateCompanyInput = { version: input.version as number };
  const assign = <K extends keyof UpdateCompanyInput>(key: K, value: UpdateCompanyInput[K] | undefined) => {
    if (value !== undefined) result[key] = value;
  };

  assign("legalName", input.legalName === undefined ? undefined : requiredText(input.legalName, "legalName", 240));
  assign("displayName", input.displayName === undefined ? undefined : requiredText(input.displayName, "displayName", 240));
  assign("businessType", input.businessType === undefined ? undefined : requiredBusinessType(input.businessType));
  assign("businessEmail", optionalEmail(input.businessEmail, "businessEmail"));
  assign("businessPhone", optionalPhone(input.businessPhone, "businessPhone"));
  assign("description", optionalText(input.description, "description", 4000));
  assign("website", optionalWebsite(input.website, "website"));
  assign("primaryProducts", optionalText(input.primaryProducts, "primaryProducts", 2000));
  assign("addressLine1", optionalText(input.addressLine1, "addressLine1", 240));
  assign("addressLine2", optionalText(input.addressLine2, "addressLine2", 240));
  assign("registrationNumber", optionalText(input.registrationNumber, "registrationNumber", 120));
  assign("tradeLicenseNumber", optionalText(input.tradeLicenseNumber, "tradeLicenseNumber", 120));
  assign("taxVatNumber", optionalText(input.taxVatNumber, "taxVatNumber", 120));
  assign("registrationCountryId", input.registrationCountryId === undefined ? undefined : requiredId(input.registrationCountryId, "registrationCountryId"));
  assign("primaryLocationId", optionalId(input.primaryLocationId, "primaryLocationId"));
  assign("foundedYear", optionalYear(input.foundedYear, "foundedYear"));
  assign("employeeRange", optionalText(input.employeeRange, "employeeRange", 64));
  assign("categoryIds", categoryIds);
  assign("primaryCategoryId", primaryCategoryId);
  assign("countriesServed", optionalCountriesServed(input.countriesServed, false));

  if (Object.keys(result).length === 1) return validation("body", "Provide at least one profile field to update.");
  return result;
}

export function parseCompanyId(value: string) {
  return requiredId(value, "companyId");
}

export function parseCompanySlug(value: string) {
  const slug = requiredText(value, "slug", 180);
  if (!SLUG_PATTERN.test(slug)) return validation("slug", "Use a lowercase URL-safe slug.");
  return slug;
}
