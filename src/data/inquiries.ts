import { companies } from "@/src/data/companies";
import { opportunities } from "@/src/data/opportunities";
import { products } from "@/src/data/products";
import type { AssignedTeamMember, CompanySummary, Inquiry, InquiryRelated, Product, UserSummary } from "@/src/types";

const tradeDesk: AssignedTeamMember = { id: "team-trade-desk", name: "Nusrat Jahan", role: "Senior Trade Desk Manager", email: "nusrat@tradeconnect.example" };
const technologyDesk: AssignedTeamMember = { id: "team-technology-desk", name: "Farhan Kabir", role: "Technology Solutions Lead", email: "farhan@tradeconnect.example" };

function companySummary(id: string): CompanySummary {
  const company = companies.find((item) => item.id === id);
  if (!company) throw new Error(`Missing inquiry company fixture: ${id}`);
  return { id: company.id, name: company.name, slug: company.slug, businessType: company.businessType, location: company.location, isVerified: company.isVerified };
}

function opportunityRelated(slug: string): InquiryRelated {
  const opportunity = opportunities.find((item) => item.slug === slug);
  if (!opportunity) throw new Error(`Missing inquiry opportunity fixture: ${slug}`);
  return { kind: "opportunity", id: opportunity.id, title: opportunity.title, href: `/marketplace/${opportunity.slug}` };
}

function productRelated(slug: string): InquiryRelated {
  const product = products.find((item: Product) => item.slug === slug);
  if (!product) throw new Error(`Missing inquiry product fixture: ${slug}`);
  return { kind: "product", id: product.id, title: product.name, href: `/products/${product.slug}` };
}

function companyRelated(id: string): InquiryRelated {
  const company = companies.find((item) => item.id === id);
  if (!company) throw new Error(`Missing related company fixture: ${id}`);
  return { kind: "company", id: company.id, title: company.name, href: `/directory/${company.slug}` };
}

const sender = (id: string, name: string, email: string, role: string, phone: string): UserSummary => ({ id, name, email, role, phone });

export const inquiries: Inquiry[] = [
  {
    id: "inq-001",
    referenceNumber: "TC-INQ-2026-0001",
    sender: sender("user-ahsan-rahman", "Ahsan Rahman", "ahsan@bengalhomeware.example", "Procurement Manager", "+880 1611 987 654"),
    company: companySummary("company-bengal-homeware"),
    source: "marketplace",
    type: "request_quotation",
    subject: "Quotation request for compostable jute packaging",
    message: "We are interested in receiving supplier quotations for quarterly jute bag requirements. Please share production lead time, print options, and delivery terms for Dhaka.",
    related: opportunityRelated("import-compostable-jute-packaging"),
    status: "new",
    assignedTeamMember: tradeDesk,
    receivedAt: "2026-07-17",
    updatedAt: "2026-07-17",
    timeline: [{ id: "inq-001-event-1", status: "new", note: "Inquiry received from the marketplace listing.", actor: "System", createdAt: "2026-07-17" }],
    internalNotes: [],
  },
  {
    id: "inq-002",
    referenceNumber: "TC-INQ-2026-0002",
    sender: sender("user-elisabeth-meyer", "Elisabeth Meyer", "elisabeth@rheinretail.example", "Sourcing Director", "+49 151 555 0182"),
    company: { ...companySummary("company-riverstone-leather"), name: "Rhein Retail Partners GmbH", slug: "rhein-retail-partners", businessType: "European retail buyer", location: "Dusseldorf, Germany", isVerified: false },
    source: "marketplace",
    type: "submit_interest",
    subject: "EU buyer interest in private-label leather goods",
    message: "Our retail group is evaluating private-label wallet and belt suppliers for an autumn collection. We would like to review a product sample range and export documentation.",
    related: opportunityRelated("export-bangladesh-leather-goods"),
    status: "contacted",
    assignedTeamMember: tradeDesk,
    receivedAt: "2026-07-16",
    updatedAt: "2026-07-17",
    timeline: [{ id: "inq-002-event-1", status: "new", note: "Buyer submitted interest from the export opportunity.", actor: "System", createdAt: "2026-07-16" }, { id: "inq-002-event-2", status: "contacted", note: "Trade desk sent an introductory response and sampling questions.", actor: tradeDesk.name, createdAt: "2026-07-17" }],
    internalNotes: [{ id: "inq-002-note-1", message: "Buyer requested samples before confirming an opening order volume.", authorName: tradeDesk.name, createdAt: "2026-07-17", isInternal: true }],
  },
  {
    id: "inq-003",
    referenceNumber: "TC-INQ-2026-0003",
    sender: sender("user-mohammad-kabir", "Mohammad Kabir", "kabir@atlasmanufacturing.example", "Operations Manager", "+880 1812 444 901"),
    company: companySummary("company-delta-industrial"),
    source: "company_profile",
    type: "more_information",
    subject: "Industrial fastener supply capability",
    message: "Please share your available fastener grades, monthly capacity, and whether you can deliver to our Gazipur production site on a scheduled contract.",
    related: companyRelated("company-delta-industrial"),
    status: "qualified",
    assignedTeamMember: tradeDesk,
    receivedAt: "2026-07-15",
    updatedAt: "2026-07-16",
    timeline: [{ id: "inq-003-event-1", status: "new", note: "Inquiry received from a company profile.", actor: "System", createdAt: "2026-07-15" }, { id: "inq-003-event-2", status: "contacted", note: "Supplier profile owner replied with initial capacity information.", actor: tradeDesk.name, createdAt: "2026-07-15" }, { id: "inq-003-event-3", status: "qualified", note: "Buyer need and supplier capability are a relevant match.", actor: tradeDesk.name, createdAt: "2026-07-16" }],
    internalNotes: [{ id: "inq-003-note-1", message: "Good fit for the local supply network. Introduce after the buyer confirms material grade.", authorName: tradeDesk.name, createdAt: "2026-07-16", isInternal: true }],
  },
  {
    id: "inq-004",
    referenceNumber: "TC-INQ-2026-0004",
    sender: sender("user-nadia-karim", "Nadia Karim", "nadia@urbantable.example", "Supply Chain Manager", "+880 1718 220 119"),
    company: companySummary("company-bengal-homeware"),
    source: "product_demo",
    type: "demo_request",
    subject: "POS Software demo for twelve cafe outlets",
    message: "We would like a practical demo covering recipe-level inventory, branch sales reporting, and integrations for local payment collection.",
    related: productRelated("pos-software"),
    status: "new",
    assignedTeamMember: technologyDesk,
    receivedAt: "2026-07-17",
    updatedAt: "2026-07-17",
    timeline: [{ id: "inq-004-event-1", status: "new", note: "Demo request received from the POS Software product page.", actor: "System", createdAt: "2026-07-17" }],
    internalNotes: [],
  },
  {
    id: "inq-005",
    referenceNumber: "TC-INQ-2026-0005",
    sender: sender("user-farhan-kabir", "Farhan Kabir", "farhan@nextwave.example", "Technology Solutions Lead", "+880 1912 345 890"),
    company: companySummary("company-nextwave-digital"),
    source: "partnership_request",
    type: "partnership_inquiry",
    subject: "Implementation partnership for Bangladesh ERP projects",
    message: "We are looking for a trade and business network partner who can help qualify ERP leads and connect us with distribution and manufacturing clients.",
    related: companyRelated("company-nextwave-digital"),
    status: "negotiating",
    assignedTeamMember: technologyDesk,
    receivedAt: "2026-07-10",
    updatedAt: "2026-07-16",
    timeline: [{ id: "inq-005-event-1", status: "new", note: "Partnership request submitted by a technology provider.", actor: "System", createdAt: "2026-07-10" }, { id: "inq-005-event-2", status: "qualified", note: "Partnership scope and target customer profile reviewed.", actor: technologyDesk.name, createdAt: "2026-07-12" }, { id: "inq-005-event-3", status: "negotiating", note: "Teams are discussing referral and implementation handoff terms.", actor: technologyDesk.name, createdAt: "2026-07-16" }],
    internalNotes: [{ id: "inq-005-note-1", message: "Schedule a follow-up with the technology desk after the draft partnership outline is ready.", authorName: "Sadia Ahmed", createdAt: "2026-07-16", isInternal: true }],
  },
  {
    id: "inq-006",
    referenceNumber: "TC-INQ-2026-0006",
    sender: sender("user-priya-sen", "Priya Sen", "priya@harborretail.example", "Category Buyer", "+91 98300 11882"),
    company: { ...companySummary("company-bengal-homeware"), name: "Harbor Retail Collective", slug: "harbor-retail-collective", businessType: "Regional retail buyer", location: "Kolkata, India", isVerified: false },
    source: "marketplace",
    type: "submit_interest",
    subject: "Interest in reusable pallet supply",
    message: "We are expanding a cross-border distribution program and would like to understand the pallet specifications, volume availability, and delivery coverage.",
    related: opportunityRelated("local-supply-industrial-fasteners"),
    status: "introduced",
    assignedTeamMember: tradeDesk,
    receivedAt: "2026-07-09",
    updatedAt: "2026-07-15",
    timeline: [{ id: "inq-006-event-1", status: "new", note: "Interest received through a local supply listing.", actor: "System", createdAt: "2026-07-09" }, { id: "inq-006-event-2", status: "qualified", note: "Buyer volume and delivery region confirmed.", actor: tradeDesk.name, createdAt: "2026-07-11" }, { id: "inq-006-event-3", status: "introduced", note: "Buyer introduced to a relevant Bangladesh supplier profile.", actor: tradeDesk.name, createdAt: "2026-07-15" }],
    internalNotes: [],
  },
  {
    id: "inq-007",
    referenceNumber: "TC-INQ-2026-0007",
    sender: sender("user-rakib-chowdhury", "Rakib Chowdhury", "rakib@easterndistribution.example", "Head of Operations", "+880 1819 332 476"),
    company: companySummary("company-nextwave-digital"),
    source: "product_demo",
    type: "demo_request",
    subject: "Custom ERP/CRM discovery call completed",
    message: "Thank you for the discovery session. We are reviewing the proposed rollout scope internally and will return with the final user and branch list.",
    related: productRelated("custom-erp-crm"),
    status: "converted",
    assignedTeamMember: technologyDesk,
    receivedAt: "2026-06-25",
    updatedAt: "2026-07-08",
    timeline: [{ id: "inq-007-event-1", status: "new", note: "Demo request received from the Custom ERP/CRM page.", actor: "System", createdAt: "2026-06-25" }, { id: "inq-007-event-2", status: "contacted", note: "Technology desk scheduled discovery call.", actor: technologyDesk.name, createdAt: "2026-06-26" }, { id: "inq-007-event-3", status: "converted", note: "Discovery progressed into an implementation opportunity.", actor: technologyDesk.name, createdAt: "2026-07-08" }],
    internalNotes: [{ id: "inq-007-note-1", message: "Converted to a technology lead. Keep the account connected to the ERP request record.", authorName: technologyDesk.name, createdAt: "2026-07-08", isInternal: true }],
  },
  {
    id: "inq-008",
    referenceNumber: "TC-INQ-2026-0008",
    sender: sender("user-promo-bot", "Online Promotion Desk", "offers@unknown.example", "Unknown", "+880 1000 000000"),
    company: { ...companySummary("company-delta-industrial"), name: "Unverified Promotion Account", slug: "unverified-promotion-account", businessType: "Unverified sender", location: "Unknown", isVerified: false },
    source: "company_profile",
    type: "partnership_inquiry",
    subject: "Bulk promotional message",
    message: "Buy guaranteed traffic and social reach for your company profile. Reply with payment details to activate your package.",
    related: companyRelated("company-delta-industrial"),
    status: "spam",
    assignedTeamMember: null,
    receivedAt: "2026-07-06",
    updatedAt: "2026-07-06",
    timeline: [{ id: "inq-008-event-1", status: "new", note: "Message received from a company profile.", actor: "System", createdAt: "2026-07-06" }, { id: "inq-008-event-2", status: "spam", note: "Marked as promotional spam by admin.", actor: "Sadia Ahmed", createdAt: "2026-07-06" }],
    internalNotes: [{ id: "inq-008-note-1", message: "Do not contact. Promotional spam with no relevant business request.", authorName: "Sadia Ahmed", createdAt: "2026-07-06", isInternal: true }],
  },
];

export const inquiryTeamMembers = [tradeDesk, technologyDesk];
