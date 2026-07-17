import type { HomeIconName } from "@/src/components/home/HomeIcon";
import { businessRequests } from "@/src/data/requests";
import type { RequestType } from "@/src/types";
import type { Permission } from "@/src/types/auth";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: HomeIconName;
  section?: string;
  requiredPermission?: Permission;
};

export const adminNavigation: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: "chart", requiredPermission: "view_admin_dashboard" },
  { label: "All Requests", href: "/admin/requests", icon: "package", section: "Requests", requiredPermission: "manage_requests" },
  { label: "Import Requests", href: "/admin/requests/import", icon: "package", requiredPermission: "manage_requests" },
  { label: "Export Requests", href: "/admin/requests/export", icon: "globe", requiredPermission: "manage_requests" },
  { label: "Supply Requests", href: "/admin/requests/supply", icon: "building", requiredPermission: "manage_requests" },
  { label: "Technology Requests", href: "/admin/requests/technology", icon: "laptop", requiredPermission: "manage_requests" },
  { label: "Marketplace Listings", href: "/admin/marketplace", icon: "spark", section: "Network", requiredPermission: "moderate_marketplace" },
  { label: "Companies", href: "/admin/companies", icon: "building", requiredPermission: "manage_companies" },
  { label: "Verification Queue", href: "/admin/verifications", icon: "shield", requiredPermission: "review_verifications" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "users", requiredPermission: "view_admin_dashboard" },
  { label: "Documents", href: "/admin/documents", icon: "package", requiredPermission: "review_verifications" },
  { label: "Users", href: "/admin/users", icon: "users", section: "Workspace", requiredPermission: "manage_companies" },
  { label: "Team Members", href: "/admin/team", icon: "users", requiredPermission: "manage_team" },
  { label: "Categories", href: "/admin/categories", icon: "spark", requiredPermission: "manage_settings" },
  { label: "Analytics", href: "/admin/analytics", icon: "chart", requiredPermission: "view_analytics" },
  { label: "Settings", href: "/admin/settings", icon: "shield", requiredPermission: "manage_settings" },
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

const requestTypeColors: Record<RequestType, string> = { import: "bg-[var(--accent-deep)]", export: "bg-[#31658e]", supply: "bg-[#9b6b28]", technology: "bg-[#7154a4]" };
const requestTypeLabels: Record<RequestType, string> = { import: "Import", export: "Export", supply: "Supply", technology: "Technology" };

export const requestTypeBreakdown = (Object.keys(requestTypeLabels) as RequestType[]).map((type) => {
  const count = businessRequests.filter((request) => request.type === type).length;
  const percentage = Math.round((count / businessRequests.length) * 100);
  return { type, label: requestTypeLabels[type], count, percentage, color: requestTypeColors[type] };
});

export const recentAdminRequests = businessRequests.slice(0, 5);

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
  { label: "Verify companies", href: "/admin/verifications", icon: "shield" as const },
  { label: "Manage listings", href: "/admin/marketplace", icon: "spark" as const },
  { label: "View inquiries", href: "/admin/inquiries", icon: "users" as const },
] as const;
