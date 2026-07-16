import type { OpportunityType } from "@/src/types";

export type DashboardRequestStatus = "open" | "under_review" | "need_more_information" | "matching_in_progress" | "quotation_received" | "completed";

export interface DashboardRequest {
  id: string;
  title: string;
  type: OpportunityType;
  status: DashboardRequestStatus;
  category: string;
  location: string;
  description: string;
  quantity: string;
  budget: string;
  submittedDate: string;
  lastUpdated: string;
  assignedStatus: string;
  adminNote: string;
  companyName: string;
  documents: { name: string; status: string }[];
}

export const dashboardRequests: DashboardRequest[] = [
  {
    id: "req-import-jute-001",
    title: "Import compostable jute packaging for retail distribution",
    type: "import",
    status: "under_review",
    category: "Packaging & materials",
    location: "Dhaka, Bangladesh",
    description: "A recurring sourcing request for compostable jute shopping bags and gift packaging for a 2026 retail store rollout.",
    quantity: "50,000 units per quarter",
    budget: "৳45–60 per unit",
    submittedDate: "2026-07-08",
    lastUpdated: "2026-07-15",
    assignedStatus: "Assigned to trade desk",
    adminNote: "Please confirm your preferred bag dimensions and print specifications.",
    companyName: "Bengal Homeware Retail Group",
    documents: [{ name: "Product specification brief", status: "Uploaded" }, { name: "Packaging reference images", status: "Uploaded" }, { name: "Trade license", status: "Pending" }],
  },
  {
    id: "req-export-leather-002",
    title: "Bangladesh leather goods manufacturer seeking EU buyers",
    type: "export",
    status: "matching_in_progress",
    category: "Leather & fashion goods",
    location: "Chattogram, Bangladesh",
    description: "An export opportunity for private-label wallets, belts, and small leather accessories for established European buyers.",
    quantity: "5,000–20,000 pieces per order",
    budget: "Quoted against final specification",
    submittedDate: "2026-07-11",
    lastUpdated: "2026-07-16",
    assignedStatus: "Matching in progress",
    adminNote: "Two potential EU buyer profiles are being reviewed against your target order volume.",
    companyName: "Riverstone Leather Exports Ltd.",
    documents: [{ name: "Company profile", status: "Uploaded" }, { name: "Product catalog", status: "Uploaded" }, { name: "Export certifications", status: "Under review" }],
  },
  {
    id: "req-supply-fasteners-003",
    title: "Local supply partner for industrial fasteners",
    type: "supply",
    status: "need_more_information",
    category: "Industrial supplies",
    location: "Gazipur, Bangladesh",
    description: "A local manufacturing project needs stainless steel bolts, nuts, and washers with consistent monthly delivery and documentation.",
    quantity: "8,000–12,000 kg per month",
    budget: "Negotiable against specification",
    submittedDate: "2026-07-14",
    lastUpdated: "2026-07-16",
    assignedStatus: "Waiting for your reply",
    adminNote: "The trade desk needs the required grade and delivery schedule before contacting suppliers.",
    companyName: "Delta Packaging & Industrial Supplies Ltd.",
    documents: [{ name: "Technical requirement sheet", status: "Uploaded" }, { name: "Delivery schedule", status: "Missing" }],
  },
  {
    id: "req-technology-erp-004",
    title: "Technology partner for a multi-location ERP rollout",
    type: "technology",
    status: "quotation_received",
    category: "Business technology",
    location: "Dhaka, Bangladesh",
    description: "An implementation request covering inventory, sales, procurement, and finance workflows across six Bangladesh locations.",
    quantity: "6 locations · 85 users",
    budget: "৳18–25 lakh implementation budget",
    submittedDate: "2026-07-15",
    lastUpdated: "2026-07-17",
    assignedStatus: "Quotation received",
    adminNote: "NextWave Digital Systems has shared an initial implementation scope for your review.",
    companyName: "NextWave Digital Systems",
    documents: [{ name: "Workflow overview", status: "Uploaded" }, { name: "Location and user list", status: "Uploaded" }, { name: "Initial quotation", status: "Received" }],
  },
];
