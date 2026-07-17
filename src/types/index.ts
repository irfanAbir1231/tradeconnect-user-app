export type RequestType = "import" | "export" | "supply" | "technology";

export type OpportunityType = RequestType;

export type RequestStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "needs_information"
  | "matching"
  | "quotation_received"
  | "approved"
  | "completed"
  | "rejected"
  | "cancelled";

export type RequestPriority = "low" | "medium" | "high" | "urgent";

export type MarketplaceStatus = "draft" | "pending_review" | "published" | "paused" | "matched" | "closed";

export type VerificationStatus = "pending_review" | "approved" | "rejected" | "needs_information";

export type VerificationChecklistStatus = "complete" | "pending" | "failed" | "not_started";

export type VerificationDocumentStatus = "pending" | "approved" | "rejected" | "needs_replacement";

export type MarketplaceModerationStatus = "draft" | "pending_publication" | "published" | "paused" | "rejected" | "expired";

export type InquiryStatus = "new" | "contacted" | "qualified" | "introduced" | "negotiating" | "converted" | "closed" | "spam";

export type InquirySource = "marketplace" | "company_profile" | "product_demo" | "partnership_request";

export type InquiryType = "request_quotation" | "submit_interest" | "more_information" | "demo_request" | "partnership_inquiry";

export type OpportunityStatus = "open" | "under_review" | "matched" | "closed";

export type CompanyType = "supplier" | "exporter" | "buyer" | "technology_provider";

export type ProductCategory = "pos_software" | "inventory_management" | "ecommerce_system" | "custom_erp_crm";

export type ProductDeployment = "cloud" | "on_premise" | "hybrid";

export type SolutionSlug = "import" | "export" | "supply" | "technology";

export type SolutionIcon = "building" | "globe" | "laptop" | "package";

export interface SolutionConfig {
  slug: SolutionSlug;
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: SolutionIcon;
  audience: string[];
  benefits: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  formFields: string[];
  categories: string[];
  faqs: { question: string; answer: string }[];
}

export interface Opportunity {
  id: string;
  slug: string;
  type: OpportunityType;
  status: OpportunityStatus;
  title: string;
  description: string;
  category: string;
  companyId: string;
  companyName: string;
  location: string;
  targetMarkets: string[];
  tags: string[];
  verifiedCompany: boolean;
  quantity?: string;
  budget?: string;
  postedAt: string;
  closesAt?: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface CompanySummary {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  location: string;
  isVerified: boolean;
}

export interface AssignedTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface RequestDocument {
  id: string;
  name: string;
  type: string;
  status: "uploaded" | "pending" | "under_review" | "rejected";
  uploadedAt?: string;
}

export interface AdminNote {
  id: string;
  message: string;
  authorName: string;
  createdAt: string;
  isInternal?: boolean;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt?: string;
  status: VerificationDocumentStatus;
  reviewerNote?: string;
}

export interface VerificationChecklistItem {
  id: string;
  label: string;
  status: VerificationChecklistStatus;
  detail?: string;
}

export interface VerificationContact {
  name: string;
  email: string;
  phone: string;
}

export interface VerificationAddress {
  line: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface VerificationSocialLink {
  label: string;
  url: string;
}

export interface VerificationCase {
  id: string;
  company: Company;
  status: VerificationStatus;
  submittedAt: string;
  updatedAt: string;
  assignedReviewer: AssignedTeamMember | null;
  contact: VerificationContact;
  address: VerificationAddress;
  website?: string;
  socialLinks: VerificationSocialLink[];
  checklist: VerificationChecklistItem[];
  documents: VerificationDocument[];
  reviewerNotes: AdminNote[];
}

export interface RequestStatusHistory {
  id: string;
  status: RequestStatus;
  note?: string;
  updatedBy: string;
  createdAt: string;
}

export interface BusinessRequest {
  id: string;
  referenceNumber: string;
  slug: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  priority: RequestPriority;
  category: string;
  user: UserSummary;
  company: CompanySummary;
  sourceCountry?: string;
  destinationCountry?: string;
  location?: string;
  quantity: string;
  budgetRange: string;
  timeline: string;
  assignedTeamMember: AssignedTeamMember | null;
  documents: RequestDocument[];
  adminNotes: AdminNote[];
  statusHistory: RequestStatusHistory[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  marketplaceStatus: MarketplaceStatus;
}

export interface MarketplaceModerationListing {
  id: string;
  request: BusinessRequest;
  publicTitle: string;
  publicSummary: string;
  publicationStatus: MarketplaceModerationStatus;
  submittedAt: string;
  views: number;
  interests: number;
  publicFields: string[];
  privateFields: string[];
  moderationNotes: AdminNote[];
}

export interface InquiryRelated {
  kind: "opportunity" | "company" | "product" | "partnership";
  id: string;
  title: string;
  href: string;
}

export interface InquiryTimelineEvent {
  id: string;
  status: InquiryStatus;
  note: string;
  actor: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  referenceNumber: string;
  sender: UserSummary;
  company: CompanySummary;
  source: InquirySource;
  type: InquiryType;
  subject: string;
  message: string;
  related: InquiryRelated;
  status: InquiryStatus;
  assignedTeamMember: AssignedTeamMember | null;
  receivedAt: string;
  updatedAt: string;
  timeline: InquiryTimelineEvent[];
  internalNotes: AdminNote[];
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  type: CompanyType;
  businessType: string;
  description: string;
  location: string;
  foundedYear: number;
  categories: string[];
  countriesServed: string[];
  products: string[];
  services: string[];
  certifications: string[];
  isVerified: boolean;
  industries: string[];
  markets: string[];
  employeeRange: string;
  verified: boolean;
  website?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  problem: string;
  providerId: string;
  providerName: string;
  features: string[];
  targetUsers: string[];
  useCases: { title: string; text: string }[];
  implementationSteps: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  deployment: ProductDeployment;
  pricingNote: string;
  availability: string;
  featured: boolean;
}
