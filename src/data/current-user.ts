import type { MockCurrentUser } from "@/src/types/auth";

/**
 * Mock session only. Replace this fixture with the authenticated session returned by the
 * future auth layer; do not treat this object as proof of identity or authorization.
 */
export const currentUser: MockCurrentUser = {
  id: "mock-admin-sadia",
  name: "Sadia Ahmed",
  email: "sadia@tradeconnect.example",
  role: "admin",
};
