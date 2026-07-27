function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
}

export function businessRequestSlugBase(title: string) {
  return normalize(title) || "business-request";
}

export function businessRequestSlugCandidate(base: string, attempt: number) {
  return attempt === 0 ? base : `${base}-${attempt + 1}`;
}

export function businessRequestReference() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `REQ-${timestamp}-${suffix}`;
}
