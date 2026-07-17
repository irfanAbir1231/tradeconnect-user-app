import { businessRequests } from "@/src/data/requests";
import type { MarketplaceModerationListing } from "@/src/types";

function getRequest(id: string) {
  const request = businessRequests.find((item) => item.id === id);
  if (!request) throw new Error(`Missing marketplace moderation request fixture: ${id}`);
  return request;
}

const publicFields = ["Listing title", "Public summary", "Request type", "Category", "Company name", "Company verification status", "Country or service location", "Quantity or requirement"];
const privateFields = ["User email and phone", "Exact budget range", "Private documents", "Internal admin notes", "Assigned reviewer"];

export const marketplaceModerationListings: MarketplaceModerationListing[] = [
  {
    id: "listing-import-jute-001",
    request: getRequest("req-import-jute-001"),
    publicTitle: "Sourcing partner wanted for compostable jute retail packaging",
    publicSummary: "A verified Bangladesh retail group is seeking dependable suppliers of compostable jute shopping bags and gift packaging for recurring quarterly distribution.",
    publicationStatus: "pending_publication",
    submittedAt: "2026-07-08",
    views: 84,
    interests: 7,
    publicFields,
    privateFields,
    moderationNotes: [{ id: "market-note-001", message: "Confirm the product dimensions are ready for public supplier matching before publishing.", authorName: "Sadia Ahmed", createdAt: "2026-07-16", isInternal: true }],
  },
  {
    id: "listing-export-leather-002",
    request: getRequest("req-export-leather-002"),
    publicTitle: "Bangladesh leather goods exporter seeking EU retail buyers",
    publicSummary: "A verified Chattogram exporter has private-label capacity for wallets, belts, and small leather accessories for established European buyers.",
    publicationStatus: "published",
    submittedAt: "2026-07-11",
    views: 312,
    interests: 24,
    publicFields,
    privateFields,
    moderationNotes: [{ id: "market-note-002", message: "Listing approved after company verification and catalog review.", authorName: "Nusrat Jahan", createdAt: "2026-07-13", isInternal: true }],
  },
  {
    id: "listing-supply-fasteners-003",
    request: getRequest("req-supply-fasteners-003"),
    publicTitle: "Local industrial fastener supply partner required",
    publicSummary: "A Gazipur manufacturing project is looking for a Bangladesh-based supplier of stainless steel bolts, nuts, and washers with reliable monthly delivery.",
    publicationStatus: "paused",
    submittedAt: "2026-07-14",
    views: 127,
    interests: 5,
    publicFields,
    privateFields,
    moderationNotes: [{ id: "market-note-003", message: "Paused until the requester confirms the required steel grade and delivery schedule.", authorName: "Nusrat Jahan", createdAt: "2026-07-16", isInternal: true }],
  },
  {
    id: "listing-technology-erp-004",
    request: getRequest("req-technology-erp-004"),
    publicTitle: "Technology partner for multi-location ERP rollout",
    publicSummary: "A growing Bangladesh distribution business is exploring partners for inventory, sales, procurement, and finance workflows across six locations.",
    publicationStatus: "rejected",
    submittedAt: "2026-07-15",
    views: 41,
    interests: 1,
    publicFields,
    privateFields,
    moderationNotes: [{ id: "market-note-004", message: "Keep this listing private until the company profile verification is completed.", authorName: "Farhan Kabir", createdAt: "2026-07-16", isInternal: true }],
  },
  {
    id: "listing-supply-pallets-011",
    request: getRequest("req-supply-plastic-pallets-011"),
    publicTitle: "Reusable plastic pallets for FMCG distribution",
    publicSummary: "A Dhaka distribution network is seeking reusable plastic pallets to improve warehouse handling and regional delivery efficiency.",
    publicationStatus: "expired",
    submittedAt: "2026-07-13",
    views: 268,
    interests: 16,
    publicFields,
    privateFields,
    moderationNotes: [{ id: "market-note-005", message: "Listing reached its review window. Confirm whether the requirement is still active before republishing.", authorName: "Sadia Ahmed", createdAt: "2026-07-17", isInternal: true }],
  },
  {
    id: "listing-supply-pharma-007",
    request: getRequest("req-supply-pharma-cartons-007"),
    publicTitle: "Printed pharmaceutical carton supply opportunity",
    publicSummary: "A Bangladesh pharmaceutical manufacturer is looking for a dependable local packaging partner for printed cartons and regular quality checks.",
    publicationStatus: "draft",
    submittedAt: "2026-07-10",
    views: 0,
    interests: 0,
    publicFields,
    privateFields,
    moderationNotes: [],
  },
];
