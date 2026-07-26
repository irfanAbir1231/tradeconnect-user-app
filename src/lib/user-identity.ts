import type { AuthenticatedUserView, CompanyMembershipView } from "@/src/types/auth";

const fallbackName = "TradeConnect User";

function normalizedWords(value: string | null | undefined) {
  return value?.trim().split(/\s+/u).filter(Boolean) ?? [];
}

function emailLocalPart(email: string | null | undefined) {
  const value = email?.trim();
  const localPart = value?.split("@", 1)[0]?.trim();
  return localPart || "";
}

/** Returns a safe UI label without changing the stored account name. */
export function userDisplayName(user: Pick<AuthenticatedUserView, "name" | "email">) {
  const name = normalizedWords(user.name).join(" ");
  return name || emailLocalPart(user.email) || fallbackName;
}

export function userFirstName(user: Pick<AuthenticatedUserView, "name" | "email">) {
  return normalizedWords(user.name)[0] || emailLocalPart(user.email) || fallbackName;
}

/** Handles one-word, multi-word, Unicode, and missing names without exposing extra account data. */
export function userInitials(user: Pick<AuthenticatedUserView, "name" | "email">) {
  const words = normalizedWords(userDisplayName(user));
  const initials = words.slice(0, 2).map((word) => Array.from(word)[0] ?? "").join("");
  return (initials || "TC").toLocaleUpperCase();
}

export function truncateUserLabel(value: string, limit = 32) {
  const characters = Array.from(value);
  return characters.length > limit ? `${characters.slice(0, limit - 1).join("")}…` : value;
}

export function primaryCompanyMembership(user: Pick<AuthenticatedUserView, "companyMemberships">): CompanyMembershipView | null {
  return user.companyMemberships.find((membership) => membership.isPrimary) ?? user.companyMemberships[0] ?? null;
}

export function roleLabel(role: string) {
  return role.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
