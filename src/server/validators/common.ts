import { AppError } from "@/src/server/errors/app-error";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface SearchInput {
  search?: string;
}

export interface SortInput {
  sort?: string;
  direction: "asc" | "desc";
}

function fail(field: string, message: string): never {
  throw AppError.validation("Please correct the highlighted fields.", { [field]: message });
}

function text(value: string, field: string, maxLength: number, required = true) {
  const trimmed = value.trim();

  if (!trimmed && required) {
    return fail(field, "This field is required.");
  }

  if (trimmed.length > maxLength) {
    return fail(field, `Use ${maxLength} characters or fewer.`);
  }

  return trimmed || undefined;
}

export function parsePage(value: string | null) {
  if (value === null || value === "") {
    return DEFAULT_PAGE;
  }

  if (!/^\d+$/.test(value)) {
    return fail("page", "Page must be a positive integer.");
  }

  const page = Number(value);

  if (!Number.isSafeInteger(page) || page < 1) {
    return fail("page", "Page must be a positive integer.");
  }

  return page;
}

export function parsePageSize(value: string | null) {
  if (value === null || value === "") {
    return DEFAULT_PAGE_SIZE;
  }

  if (!/^\d+$/.test(value)) {
    return fail("page_size", "Page size must be a positive integer.");
  }

  const pageSize = Number(value);

  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    return fail("page_size", `Page size must be between 1 and ${MAX_PAGE_SIZE}.`);
  }

  return pageSize;
}

export function parsePagination(searchParams: URLSearchParams): PaginationInput {
  return { page: parsePage(searchParams.get("page")), pageSize: parsePageSize(searchParams.get("page_size")) };
}

export function parseSearch(value: string | null): SearchInput {
  return { search: value === null ? undefined : text(value, "search", 120, false) };
}

export function parseSortDirection(value: string | null): SortInput["direction"] {
  if (!value || value === "asc" || value === "desc") {
    return value === "desc" ? "desc" : "asc";
  }

  return fail("direction", "Direction must be asc or desc.");
}

export function parseSort(value: string | null, allowed: readonly string[] = []) {
  if (!value) {
    return undefined;
  }

  const sort = text(value, "sort", 64);

  if (allowed.length > 0 && !allowed.includes(sort ?? "")) {
    return fail("sort", "Sort field is not supported.");
  }

  return sort;
}

export function parseId(value: string, field = "id") {
  const id = text(value, field, 128);

  if (!id || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(id)) {
    return fail(field, "Use a valid identifier.");
  }

  return id;
}

export function parseSlug(value: string) {
  const slug = text(value, "slug", 180);

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return fail("slug", "Use a lowercase URL-safe slug.");
  }

  return slug;
}

export function parseEmail(value: string) {
  const email = text(value, "email", 254);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("email", "Enter a valid email address.");
  }

  return email.toLowerCase();
}

export function parsePhone(value: string) {
  const phone = text(value, "phone", 40);

  if (!phone || !/^\+?[0-9 ()-]{7,39}$/.test(phone)) {
    return fail("phone", "Enter a valid phone number.");
  }

  return phone;
}

export function parseIsoDateTime(value: string, field = "date") {
  const date = text(value, field, 40);

  if (!date || Number.isNaN(Date.parse(date))) {
    return fail(field, "Use a valid ISO date or date-time.");
  }

  return date;
}

export function parseRequestId(value: string | null) {
  if (value === null || value === "") {
    return undefined;
  }

  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(value)) {
    return fail("request_id", "Request ID contains invalid characters or is too long.");
  }

  return value;
}

export const commonValidationLimits = Object.freeze({ maxPageSize: MAX_PAGE_SIZE, maxSearchLength: 120, maxSlugLength: 180 });
