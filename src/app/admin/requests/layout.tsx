import { requirePermissionPage } from "@/src/server/auth/page-guard";

export default async function AdminRequestsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePermissionPage("manage_requests", "/admin/requests");
  return children;
}
