import { requirePermissionPage } from "@/src/server/auth/page-guard";

export default async function AdminCompaniesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePermissionPage("manage_companies", "/admin/companies");
  return children;
}
