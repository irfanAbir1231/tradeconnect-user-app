const MAX_SLUG_LENGTH = 180;

/** Produces a URL-safe base slug; non-Latin-only names fall back to `company`. */
export function companySlugBase(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return (normalized || "company").slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, "") || "company";
}

export function companySlugCandidate(base: string, attempt: number) {
  if (attempt <= 0) return base;
  const suffix = `-${attempt + 1}`;
  return `${base.slice(0, MAX_SLUG_LENGTH - suffix.length).replace(/-+$/g, "")}${suffix}`;
}
