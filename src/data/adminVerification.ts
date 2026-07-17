import { companies } from "@/src/data/companies";
import type { AssignedTeamMember, Company, VerificationCase } from "@/src/types";

const tradeReviewer: AssignedTeamMember = { id: "team-trade-desk", name: "Nusrat Jahan", role: "Senior Trade Desk Manager", email: "nusrat@tradeconnect.example" };
const technologyReviewer: AssignedTeamMember = { id: "team-technology-desk", name: "Farhan Kabir", role: "Technology Solutions Lead", email: "farhan@tradeconnect.example" };

function getCompany(id: string): Company {
  const company = companies.find((item) => item.id === id);
  if (!company) throw new Error(`Missing verification company fixture: ${id}`);
  return company;
}

export const verificationCases: VerificationCase[] = [
  {
    id: "verification-delta-industrial",
    company: getCompany("company-delta-industrial"),
    status: "pending_review",
    submittedAt: "2026-07-16",
    updatedAt: "2026-07-17",
    assignedReviewer: tradeReviewer,
    contact: { name: "Tanvir Ahmed", email: "tanvir@deltaindustrial.example", phone: "+880 1712 456 789" },
    address: { line: "Plot 18, BSCIC Industrial Estate", city: "Narayanganj", country: "Bangladesh", postalCode: "1400" },
    website: "https://example.com/delta-industrial",
    socialLinks: [{ label: "LinkedIn", url: "https://linkedin.com/company/delta-industrial" }, { label: "Facebook", url: "https://facebook.com/deltaindustrial" }],
    checklist: [
      { id: "delta-email", label: "Email verified", status: "complete", detail: "Business email confirmed" },
      { id: "delta-phone", label: "Phone verified", status: "complete", detail: "Contact number confirmed" },
      { id: "delta-profile", label: "Company profile", status: "complete", detail: "Profile details submitted" },
      { id: "delta-address", label: "Business address", status: "complete", detail: "Address matches submitted profile" },
      { id: "delta-license", label: "Trade license", status: "pending", detail: "Awaiting reviewer approval" },
      { id: "delta-tax", label: "Tax/VAT document", status: "complete", detail: "TIN and VAT documents uploaded" },
      { id: "delta-catalog", label: "Product catalog", status: "complete", detail: "Catalog received" },
      { id: "delta-admin", label: "Admin review", status: "pending", detail: "Final reviewer decision pending" },
    ],
    documents: [
      { id: "delta-doc-license", name: "Trade license 2026.pdf", type: "Trade license", uploadedAt: "2026-07-16", status: "pending" },
      { id: "delta-doc-profile", name: "Delta company profile.pdf", type: "Company profile", uploadedAt: "2026-07-16", status: "approved" },
      { id: "delta-doc-tax", name: "TIN and VAT certificate.pdf", type: "Tax/VAT document", uploadedAt: "2026-07-16", status: "approved" },
      { id: "delta-doc-catalog", name: "Industrial supplies catalog.pdf", type: "Product catalog", uploadedAt: "2026-07-16", status: "approved" },
    ],
    reviewerNotes: [{ id: "delta-note-1", message: "Company profile and tax documents look consistent. Please complete the trade license review before making a decision.", authorName: tradeReviewer.name, createdAt: "2026-07-17", isInternal: true }],
  },
  {
    id: "verification-riverstone-leather",
    company: getCompany("company-riverstone-leather"),
    status: "approved",
    submittedAt: "2026-07-04",
    updatedAt: "2026-07-10",
    assignedReviewer: tradeReviewer,
    contact: { name: "Salma Hossain", email: "salma@riverstone.example", phone: "+880 1819 234 567" },
    address: { line: "Export Processing Zone, South Halishahar", city: "Chattogram", country: "Bangladesh", postalCode: "4223" },
    website: "https://example.com/riverstone-leather",
    socialLinks: [{ label: "LinkedIn", url: "https://linkedin.com/company/riverstone-leather" }],
    checklist: [
      { id: "river-email", label: "Email verified", status: "complete" },
      { id: "river-phone", label: "Phone verified", status: "complete" },
      { id: "river-profile", label: "Company profile", status: "complete" },
      { id: "river-address", label: "Business address", status: "complete" },
      { id: "river-license", label: "Trade license", status: "complete" },
      { id: "river-tax", label: "Tax/VAT document", status: "complete" },
      { id: "river-catalog", label: "Product catalog", status: "complete" },
      { id: "river-admin", label: "Admin review", status: "complete", detail: "Approved July 10, 2026" },
    ],
    documents: [
      { id: "river-doc-license", name: "Trade license 2026.pdf", type: "Trade license", uploadedAt: "2026-07-04", status: "approved" },
      { id: "river-doc-profile", name: "Riverstone company profile.pdf", type: "Company profile", uploadedAt: "2026-07-04", status: "approved" },
      { id: "river-doc-tax", name: "TIN and VAT certificate.pdf", type: "Tax/VAT document", uploadedAt: "2026-07-05", status: "approved" },
      { id: "river-doc-catalog", name: "Leather goods catalog.pdf", type: "Product catalog", uploadedAt: "2026-07-05", status: "approved" },
      { id: "river-doc-bsc", name: "BSCI audit summary.pdf", type: "Certification", uploadedAt: "2026-07-06", status: "approved" },
    ],
    reviewerNotes: [{ id: "river-note-1", message: "All required documents matched the company profile. Approved for public directory visibility.", authorName: tradeReviewer.name, createdAt: "2026-07-10", isInternal: true }],
  },
  {
    id: "verification-bengal-homeware",
    company: getCompany("company-bengal-homeware"),
    status: "needs_information",
    submittedAt: "2026-07-14",
    updatedAt: "2026-07-16",
    assignedReviewer: technologyReviewer,
    contact: { name: "Ahsan Rahman", email: "ahsan@bengalhomeware.example", phone: "+880 1611 987 654" },
    address: { line: "House 42, Road 11, Banani", city: "Dhaka", country: "Bangladesh", postalCode: "1213" },
    socialLinks: [{ label: "LinkedIn", url: "https://linkedin.com/company/bengal-homeware" }, { label: "Facebook", url: "https://facebook.com/bengalhomeware" }],
    checklist: [
      { id: "bengal-email", label: "Email verified", status: "complete" },
      { id: "bengal-phone", label: "Phone verified", status: "complete" },
      { id: "bengal-profile", label: "Company profile", status: "complete" },
      { id: "bengal-address", label: "Business address", status: "pending", detail: "Please confirm registered office address" },
      { id: "bengal-license", label: "Trade license", status: "failed", detail: "Uploaded scan is not legible" },
      { id: "bengal-tax", label: "Tax/VAT document", status: "pending", detail: "Not uploaded" },
      { id: "bengal-catalog", label: "Product catalog", status: "complete" },
      { id: "bengal-admin", label: "Admin review", status: "pending" },
    ],
    documents: [
      { id: "bengal-doc-license", name: "Trade license scan.pdf", type: "Trade license", uploadedAt: "2026-07-14", status: "needs_replacement", reviewerNote: "Please upload a clearer scan with all corners visible." },
      { id: "bengal-doc-profile", name: "Retail group profile.pdf", type: "Company profile", uploadedAt: "2026-07-14", status: "approved" },
      { id: "bengal-doc-catalog", name: "Homeware product catalog.pdf", type: "Product catalog", uploadedAt: "2026-07-14", status: "approved" },
    ],
    reviewerNotes: [{ id: "bengal-note-1", message: "Request a replacement trade license scan and the current TIN/VAT document before continuing review.", authorName: technologyReviewer.name, createdAt: "2026-07-16", isInternal: true }],
  },
  {
    id: "verification-nextwave-digital",
    company: getCompany("company-nextwave-digital"),
    status: "rejected",
    submittedAt: "2026-06-28",
    updatedAt: "2026-07-03",
    assignedReviewer: technologyReviewer,
    contact: { name: "Farhan Kabir", email: "farhan@nextwave.example", phone: "+880 1912 345 890" },
    address: { line: "Level 7, ICT Tower, Agargaon", city: "Dhaka", country: "Bangladesh", postalCode: "1207" },
    website: "https://example.com/nextwave-digital",
    socialLinks: [{ label: "LinkedIn", url: "https://linkedin.com/company/nextwave-digital" }, { label: "Website", url: "https://example.com/nextwave-digital" }],
    checklist: [
      { id: "wave-email", label: "Email verified", status: "complete" },
      { id: "wave-phone", label: "Phone verified", status: "complete" },
      { id: "wave-profile", label: "Company profile", status: "complete" },
      { id: "wave-address", label: "Business address", status: "failed", detail: "Address proof did not match registered details" },
      { id: "wave-license", label: "Trade license", status: "failed", detail: "Document expired" },
      { id: "wave-tax", label: "Tax/VAT document", status: "complete" },
      { id: "wave-catalog", label: "Product catalog", status: "complete" },
      { id: "wave-admin", label: "Admin review", status: "failed", detail: "Verification rejected July 3, 2026" },
    ],
    documents: [
      { id: "wave-doc-license", name: "Trade license 2025.pdf", type: "Trade license", uploadedAt: "2026-06-28", status: "rejected", reviewerNote: "The submitted license has expired." },
      { id: "wave-doc-profile", name: "NextWave company profile.pdf", type: "Company profile", uploadedAt: "2026-06-28", status: "approved" },
      { id: "wave-doc-tax", name: "TIN certificate.pdf", type: "Tax/VAT document", uploadedAt: "2026-06-29", status: "approved" },
      { id: "wave-doc-catalog", name: "Technology solutions catalog.pdf", type: "Product catalog", uploadedAt: "2026-06-29", status: "approved" },
      { id: "wave-doc-address", name: "Office address proof.pdf", type: "Address proof", uploadedAt: "2026-06-30", status: "rejected", reviewerNote: "Address does not match the registered office details." },
    ],
    reviewerNotes: [{ id: "wave-note-1", message: "Verification rejected because the trade license was expired and address proof did not match. A new submission can be reviewed after correction.", authorName: technologyReviewer.name, createdAt: "2026-07-03", isInternal: true }],
  },
];

export const verificationReviewers = [tradeReviewer, technologyReviewer];
