export type OpportunityType = "import" | "export" | "supply" | "technology";

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

export interface Company {
  id: string;
  name: string;
  slug: string;
  type: CompanyType;
  description: string;
  location: string;
  foundedYear: number;
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
  providerId: string;
  providerName: string;
  features: string[];
  deployment: ProductDeployment;
  pricingNote: string;
  availability: string;
  featured: boolean;
}
