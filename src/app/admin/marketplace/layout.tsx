import { requirePermissionPage } from "@/src/server/auth/page-guard";

export default async function AdminMarketplaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePermissionPage("moderate_marketplace", "/admin/marketplace");
  return children;
}
