import { requirePermissionPage } from "@/src/server/auth/page-guard";

export default async function AdminVerificationsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requirePermissionPage("review_verifications", "/admin/verifications");
  return children;
}
