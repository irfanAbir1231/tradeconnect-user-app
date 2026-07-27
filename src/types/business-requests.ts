/**
 * Authenticated business-request API contract. These types intentionally stay
 * separate from the legacy mock-data interfaces in `src/types/index.ts`.
 */
export const businessRequestTypes = ["import", "export", "supply", "technology"] as const;
export type BusinessRequestType = (typeof businessRequestTypes)[number];

export const businessRequestStatuses = [
  "draft",
  "submitted",
  "under_review",
  "needs_information",
  "matching",
  "quotation_received",
  "approved",
  "completed",
  "rejected",
  "cancelled",
] as const;
export type BusinessRequestStatus = (typeof businessRequestStatuses)[number];

export const businessRequestPriorities = ["low", "medium", "high", "urgent"] as const;
export type BusinessRequestPriority = (typeof businessRequestPriorities)[number];

export type BusinessRequestReference = { id: string; name: string };

export type BusinessRequestListItem = {
  id: string;
  referenceNumber: string;
  slug: string;
  title: string;
  requestType: BusinessRequestType;
  status: BusinessRequestStatus;
  priority: BusinessRequestPriority;
  category: BusinessRequestReference | null;
  company: { id: string; displayName: string };
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type BusinessRequestDetail = BusinessRequestListItem & {
  description: string;
  sourceCountry: BusinessRequestReference | null;
  destinationCountry: BusinessRequestReference | null;
  location: BusinessRequestReference | null;
  quantityValue: string | null;
  quantityUnit: string | null;
  quantityFrequency: string | null;
  budgetMin: string | null;
  budgetMax: string | null;
  budgetCurrencyCode: string | null;
  budgetUnit: string | null;
  timeline: string | null;
  statusHistory: Array<{
    id: string;
    fromStatus: BusinessRequestStatus | null;
    toStatus: BusinessRequestStatus;
    createdAt: string;
  }>;
};
