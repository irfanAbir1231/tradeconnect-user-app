import { companies } from "@/src/data/companies";
import { inquiries } from "@/src/data/inquiries";
import { marketplaceModerationListings } from "@/src/data/adminMarketplace";
import { businessRequests } from "@/src/data/requests";
import { verificationCases } from "@/src/data/adminVerification";
import type { CompanyAdminRecord, CompanyContactUser } from "@/src/types";

const fallbackContacts: Record<string, CompanyContactUser> = {
  "company-delta-industrial": { id: "contact-delta-primary", name: "Tanvir Ahmed", email: "tanvir@deltaindustrial.example", phone: "+880 1712 456 789", role: "Operations Director", isPrimary: true },
  "company-riverstone-leather": { id: "contact-riverstone-primary", name: "Salma Hossain", email: "salma@riverstone.example", phone: "+880 1819 234 567", role: "Export Director", isPrimary: true },
  "company-bengal-homeware": { id: "contact-bengal-primary", name: "Ahsan Rahman", email: "ahsan@bengalhomeware.example", phone: "+880 1611 987 654", role: "Procurement Manager", isPrimary: true },
  "company-nextwave-digital": { id: "contact-nextwave-primary", name: "Farhan Kabir", email: "farhan@nextwave.example", phone: "+880 1912 345 890", role: "Technology Solutions Lead", isPrimary: true },
};

function getContacts(id: string): CompanyContactUser[] {
  const primary = fallbackContacts[id];
  const relatedContacts = [...businessRequests.filter((request) => request.company.id === id).map((request) => ({ id: request.user.id, name: request.user.name, email: request.user.email, phone: request.user.phone ?? "Not provided", role: request.user.role, isPrimary: false })), ...inquiries.filter((inquiry) => inquiry.company.id === id).map((inquiry) => ({ id: inquiry.sender.id, name: inquiry.sender.name, email: inquiry.sender.email, phone: inquiry.sender.phone ?? "Not provided", role: inquiry.sender.role, isPrimary: false }))];
  return [primary, ...relatedContacts.filter((contact, index, contacts) => contact.id !== primary.id && contacts.findIndex((candidate) => candidate.id === contact.id) === index)].slice(0, 4);
}

export const adminCompanies: CompanyAdminRecord[] = companies.map((company) => {
  const verification = verificationCases.find((item) => item.company.id === company.id);
  return {
    company,
    primaryCategory: company.categories[0] ?? "General business",
    accountStatus: company.id === "company-nextwave-digital" ? "suspended" : company.id === "company-bengal-homeware" ? "pending" : "active",
    verificationStatus: verification?.status ?? (company.isVerified ? "approved" : "pending_review"),
    joinedAt: company.id === "company-riverstone-leather" ? "2026-05-18" : company.id === "company-nextwave-digital" ? "2026-06-02" : "2026-06-12",
    contacts: getContacts(company.id),
    activeRequests: businessRequests.filter((request) => request.company.id === company.id && !["completed", "rejected", "cancelled"].includes(request.status)),
    marketplaceListings: marketplaceModerationListings.filter((listing) => listing.request.company.id === company.id),
    inquiries: inquiries.filter((inquiry) => inquiry.company.id === company.id),
    documents: verification?.documents ?? [],
    internalNotes: verification?.reviewerNotes ?? [],
    activityHistory: [
      { id: `${company.id}-activity-1`, title: "Company profile created", detail: `${company.name} joined the TradeConnect network.`, actor: "System", createdAt: company.id === "company-riverstone-leather" ? "2026-05-18" : "2026-06-12" },
      ...(verification ? [{ id: `${company.id}-activity-2`, title: "Verification case updated", detail: `Verification is currently ${verification.status.replaceAll("_", " ")}.`, actor: verification.assignedReviewer?.name ?? "System", createdAt: verification.updatedAt }] : []),
      ...(company.id === "company-nextwave-digital" ? [{ id: `${company.id}-activity-3`, title: "Account suspended", detail: "Public access was paused pending a fresh verification submission.", actor: "Sadia Ahmed", createdAt: "2026-07-03" }] : []),
    ],
    isFeatured: company.id === "company-riverstone-leather",
  };
});
