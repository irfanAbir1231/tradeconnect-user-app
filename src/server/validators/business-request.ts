import type { BusinessRequestPriority, BusinessRequestStatus, BusinessRequestType } from "@/src/types/business-requests";
import { businessRequestPriorities, businessRequestStatuses, businessRequestTypes } from "@/src/types/business-requests";
import { AppError } from "@/src/server/errors/app-error";
import { parsePagination, type PaginationInput } from "@/src/server/validators/common";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;
const DECIMAL_PATTERN = /^(?:0|[1-9]\d{0,13})(?:\.\d{1,4})?$/;

type OptionalString = string | null | undefined;

export type CreateBusinessRequestInput = {
  requestType: BusinessRequestType;
  title: string;
  description: string;
  priority: BusinessRequestPriority;
  categoryId?: string;
  sourceCountryId?: string;
  destinationCountryId?: string;
  locationId?: string;
  quantityValue?: string;
  quantityUnit?: string;
  quantityFrequency?: string;
  budgetMin?: string;
  budgetMax?: string;
  budgetCurrencyCode?: string;
  budgetUnit?: string;
  timeline?: string;
};

export type UpdateBusinessRequestInput = {
  version: number;
  title?: string;
  description?: string;
  priority?: BusinessRequestPriority;
  categoryId?: string | null;
  sourceCountryId?: string | null;
  destinationCountryId?: string | null;
  locationId?: string | null;
  quantityValue?: string | null;
  quantityUnit?: string | null;
  quantityFrequency?: string | null;
  budgetMin?: string | null;
  budgetMax?: string | null;
  budgetCurrencyCode?: string | null;
  budgetUnit?: string | null;
  timeline?: string | null;
};

export type BusinessRequestListInput = PaginationInput & {
  requestType?: BusinessRequestType;
  status?: BusinessRequestStatus;
};

function validation(field: string, message: string): never {
  throw AppError.validation("Please correct the highlighted fields.", { [field]: message });
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return validation("body", "Send a JSON object.");
  return value as Record<string, unknown>;
}

function rejectUnknownFields(input: Record<string, unknown>, allowed: readonly string[]) {
  const unknown = Object.keys(input).find((key) => !allowed.includes(key));
  if (unknown) validation(unknown, "This field is not supported.");
}

function requiredText(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string") return validation(field, "This field is required.");
  const text = value.trim();
  if (!text) return validation(field, "This field is required.");
  if (text.length > maxLength) return validation(field, `Use ${maxLength} characters or fewer.`);
  return text;
}

function optionalText(value: unknown, field: string, maxLength: number): OptionalString {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return validation(field, "Use text for this field.");
  const text = value.trim();
  if (!text) return null;
  if (text.length > maxLength) return validation(field, `Use ${maxLength} characters or fewer.`);
  return text;
}

function requiredId(value: unknown, field: string) {
  const id = requiredText(value, field, 36);
  if (!UUID_PATTERN.test(id)) return validation(field, "Use a valid identifier.");
  return id;
}

function optionalId(value: unknown, field: string): OptionalString {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return requiredId(value, field);
}

function optionalDecimal(value: unknown, field: string): OptionalString {
  const decimal = optionalText(value, field, 18);
  if (decimal === undefined || decimal === null) return decimal;
  if (!DECIMAL_PATTERN.test(decimal)) return validation(field, "Use a positive amount with up to four decimal places.");
  return decimal;
}

function optionalCurrency(value: unknown): OptionalString {
  const currency = optionalText(value, "budgetCurrencyCode", 3);
  if (currency === undefined || currency === null) return currency;
  const normalized = currency.toUpperCase();
  if (!CURRENCY_PATTERN.test(normalized)) return validation("budgetCurrencyCode", "Use a three-letter ISO currency code.");
  return normalized;
}

function enumValue<T extends readonly string[]>(value: unknown, field: string, values: T): T[number] {
  if (typeof value !== "string" || !values.includes(value)) return validation(field, "Select a supported value.");
  return value as T[number];
}

function optionalEnum<T extends readonly string[]>(value: string | null, field: string, values: T) {
  if (value === null) return null;
  return enumValue(value, field, values);
}

function validateBudgetRange(min: OptionalString, max: OptionalString) {
  if (min !== undefined && min !== null && max !== undefined && max !== null && Number(min) > Number(max)) {
    validation("budgetMax", "Budget maximum must be greater than or equal to budget minimum.");
  }
}

const editableFields = [
  "title", "description", "priority", "categoryId", "sourceCountryId", "destinationCountryId", "locationId",
  "quantityValue", "quantityUnit", "quantityFrequency", "budgetMin", "budgetMax", "budgetCurrencyCode", "budgetUnit", "timeline",
] as const;
const createFields = ["requestType", ...editableFields] as const;
const updateFields = ["version", ...editableFields] as const;

export function parseCreateBusinessRequestInput(value: unknown): CreateBusinessRequestInput {
  const input = object(value);
  rejectUnknownFields(input, createFields);
  const budgetMin = optionalDecimal(input.budgetMin, "budgetMin");
  const budgetMax = optionalDecimal(input.budgetMax, "budgetMax");
  validateBudgetRange(budgetMin, budgetMax);

  return {
    requestType: enumValue(input.requestType, "requestType", businessRequestTypes),
    title: requiredText(input.title, "title", 240),
    description: requiredText(input.description, "description", 6000),
    priority: input.priority === undefined ? "medium" : enumValue(input.priority, "priority", businessRequestPriorities),
    categoryId: optionalId(input.categoryId, "categoryId") ?? undefined,
    sourceCountryId: optionalId(input.sourceCountryId, "sourceCountryId") ?? undefined,
    destinationCountryId: optionalId(input.destinationCountryId, "destinationCountryId") ?? undefined,
    locationId: optionalId(input.locationId, "locationId") ?? undefined,
    quantityValue: optionalDecimal(input.quantityValue, "quantityValue") ?? undefined,
    quantityUnit: optionalText(input.quantityUnit, "quantityUnit", 48) ?? undefined,
    quantityFrequency: optionalText(input.quantityFrequency, "quantityFrequency", 48) ?? undefined,
    budgetMin: budgetMin ?? undefined,
    budgetMax: budgetMax ?? undefined,
    budgetCurrencyCode: optionalCurrency(input.budgetCurrencyCode) ?? undefined,
    budgetUnit: optionalText(input.budgetUnit, "budgetUnit", 48) ?? undefined,
    timeline: optionalText(input.timeline, "timeline", 120) ?? undefined,
  };
}

export function parseUpdateBusinessRequestInput(value: unknown): UpdateBusinessRequestInput {
  const input = object(value);
  rejectUnknownFields(input, updateFields);
  if (!Number.isInteger(input.version) || (input.version as number) < 1) validation("version", "Use the current request version.");

  const result: UpdateBusinessRequestInput = { version: input.version as number };
  const assign = <K extends keyof Omit<UpdateBusinessRequestInput, "version">>(key: K, fieldValue: UpdateBusinessRequestInput[K] | undefined) => {
    if (fieldValue !== undefined) result[key] = fieldValue;
  };

  assign("title", input.title === undefined ? undefined : requiredText(input.title, "title", 240));
  assign("description", input.description === undefined ? undefined : requiredText(input.description, "description", 6000));
  assign("priority", input.priority === undefined ? undefined : enumValue(input.priority, "priority", businessRequestPriorities));
  assign("categoryId", optionalId(input.categoryId, "categoryId"));
  assign("sourceCountryId", optionalId(input.sourceCountryId, "sourceCountryId"));
  assign("destinationCountryId", optionalId(input.destinationCountryId, "destinationCountryId"));
  assign("locationId", optionalId(input.locationId, "locationId"));
  assign("quantityValue", optionalDecimal(input.quantityValue, "quantityValue"));
  assign("quantityUnit", optionalText(input.quantityUnit, "quantityUnit", 48));
  assign("quantityFrequency", optionalText(input.quantityFrequency, "quantityFrequency", 48));
  assign("budgetMin", optionalDecimal(input.budgetMin, "budgetMin"));
  assign("budgetMax", optionalDecimal(input.budgetMax, "budgetMax"));
  assign("budgetCurrencyCode", input.budgetCurrencyCode === undefined ? undefined : optionalCurrency(input.budgetCurrencyCode));
  assign("budgetUnit", optionalText(input.budgetUnit, "budgetUnit", 48));
  assign("timeline", optionalText(input.timeline, "timeline", 120));

  if (Object.keys(result).length === 1) validation("body", "Provide at least one request field to update.");
  validateBudgetRange(result.budgetMin, result.budgetMax);
  return result;
}

export function parseBusinessRequestId(value: string) {
  return requiredId(value, "requestId");
}

export function parseBusinessRequestVersionInput(value: unknown) {
  const input = object(value);
  rejectUnknownFields(input, ["version"]);
  if (!Number.isInteger(input.version) || (input.version as number) < 1) validation("version", "Use the current request version.");
  return input.version as number;
}

export function parseBusinessRequestListInput(searchParams: URLSearchParams): BusinessRequestListInput {
  const requestType = searchParams.get("type");
  const status = searchParams.get("status");
  return {
    ...parsePagination(searchParams),
    ...(requestType ? { requestType: enumValue(requestType, "type", businessRequestTypes) } : {}),
    ...(status ? { status: enumValue(status, "status", businessRequestStatuses) } : {}),
  };
}

export function validateRequestStatus(value: string | null) {
  return value === null ? undefined : optionalEnum(value, "status", businessRequestStatuses);
}
