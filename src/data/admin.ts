import type { HomeIconName } from "@/src/components/home/HomeIcon";
import type { OpportunityType } from "@/src/types";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: HomeIconName;
  section?: string;
};

export const adminNavigation: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: "chart" },
  { label: "All Requests", href: "/admin/requests", icon: "package", section: "Requests" },
  { label: "Import Requests", href: "/admin/requests/import", icon: "package" },
  { label: "Export Requests", href: "/admin/requests/export", icon: "globe" },
  { label: "Supply Requests", href: "/admin/requests/supply", icon: "building" },
  { label: "Technology Requests", href: "/admin/requests/technology", icon: "laptop" },
  { label: "Marketplace Listings", href: "/admin/marketplace", icon: "spark", section: "Network" },
  { label: "Companies", href: "/admin/companies", icon: "building" },
  { label: "Verification Queue", href: "/admin/verification", icon: "shield" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "users" },
  { label: "Documents", href: "/admin/documents", icon: "package" },
  { label: "Users", href: "/admin/users", icon: "users", section: "Workspace" },
  { label: "Team Members", href: "/admin/team", icon: "users" },
  { label: "Categories", href: "/admin/categories", icon: "spark" },
  { label: "Analytics", href: "/admin/analytics", icon: "chart" },
  { label: "Settings", href: "/admin/settings", icon: "shield" },
];

export const adminStats = [
  { label: "New requests", value: "28", detail: "+12% vs last week", icon: "package" as const, tone: "accent" },
  { label: "Pending verification", value: "14", detail: "6 need documents", icon: "shield" as const, tone: "amber" },
  { label: "Open inquiries", value: "36", detail: "9 awaiting assignment", icon: "users" as const, tone: "blue" },
  { label: "Active marketplace listings", value: "184", detail: "+18 this month", icon: "spark" as const, tone: "purple" },
  { label: "Completed matches", value: "67", detail: "+8 this month", icon: "check" as const, tone: "accent" },
  { label: "Technology leads", value: "22", detail: "5 demo requests", icon: "laptop" as const, tone: "blue" },
] as const;

export const requestVolume = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 58 },
  { label: "Wed", value: 47 },
  { label: "Thu", value: 72 },
  { label: "Fri", value: 64 },
  { label: "Sat", value: 31 },
  { label: "Sun", value: 25 },
] as const;

export const requestTypeBreakdown: { type: OpportunityType; label: string; count: number; percentage: number; color: string }[] = [
  { type: "import", label: "Import", count: 124, percentage: 42, color: "bg-[var(--accent-deep)]" },
  { type: "export", label: "Export", count: 86, percentage: 29, color: "bg-[#31658e]" },
  { type: "supply", label: "Supply", count: 52, percentage: 18, color: "bg-[#9b6b28]" },
  { type: "technology", label: "Technology", count: 32, percentage: 11, color: "bg-[#7154a4]" },
];

export const recentAdminRequests = [
  { id: "REQ-1048", title: "Import compostable jute packaging", type: "Import", company: "Bengal Homeware Retail Group", submitted: "Today, 10:42 AM", status: "New", statusTone: "accent" },
  { id: "REQ-1047", title: "ERP rollout for six locations", type: "Technology", company: "Eastern Distribution Co.", submitted: "Today, 09:18 AM", status: "Under review", statusTone: "amber" },
  { id: "REQ-1046", title: "Local supply partner for fasteners", type: "Supply", company: "Gazipur Industrial Works", submitted: "Yesterday", status: "Needs info", statusTone: "amber" },
  { id: "REQ-1045", title: "Leather goods buyers for EU market", type: "Export", company: "Riverstone Leather Exports Ltd.", submitted: "Yesterday", status: "Matching", statusTone: "blue" },
  { id: "REQ-1044", title: "Retail POS implementation partner", type: "Technology", company: "Narayanganj Retail Network", submitted: "Jul 15, 2026", status: "Assigned", statusTone: "purple" },
] as const;

export const verificationQueue = [
  { company: "Delta Packaging & Industrial Supplies Ltd.", type: "Supplier", submitted: "18 min ago", documents: "4 of 5 documents", tone: "amber" },
  { company: "Bengal Homeware Retail Group", type: "Buyer", submitted: "2 hours ago", documents: "Profile complete", tone: "accent" },
  { company: "Mitali Foods & Commodities", type: "Exporter", submitted: "Yesterday", documents: "3 of 5 documents", tone: "amber" },
  { company: "NextWave Digital Systems", type: "Technology provider", submitted: "Yesterday", documents: "Ready for review", tone: "blue" },
] as const;

export const recentAdminActivity = [
  { title: "Request REQ-1045 moved to matching", detail: "You assigned Riverstone Leather Exports to the export desk.", time: "12 minutes ago", icon: "users" as const },
  { title: "Company profile submitted", detail: "Bengal Homeware Retail Group is ready for verification.", time: "2 hours ago", icon: "shield" as const },
  { title: "New technology lead received", detail: "Narayanganj Retail Network requested a POS demo.", time: "4 hours ago", icon: "laptop" as const },
  { title: "Marketplace listing published", detail: "A new industrial supply listing is now live.", time: "Yesterday", icon: "spark" as const },
] as const;

export const adminQuickActions = [
  { label: "Review requests", href: "/admin/requests", icon: "package" as const },
  { label: "Verify companies", href: "/admin/verification", icon: "shield" as const },
  { label: "Manage listings", href: "/admin/marketplace", icon: "spark" as const },
  { label: "View inquiries", href: "/admin/inquiries", icon: "users" as const },
] as const;
