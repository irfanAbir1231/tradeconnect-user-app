import { AdminHeader } from "@/src/components/admin/AdminHeader";
import { AdminMobileNav } from "@/src/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { requirePermissionPage } from "@/src/server/auth/page-guard";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const actor = await requirePermissionPage("view_admin_dashboard", "/admin");

  return <div className="min-h-screen bg-[#eef3f1] text-[var(--navy)]"><div className="flex min-h-screen"><AdminSidebar permissions={actor.permissions} /><div className="min-w-0 flex-1"><AdminMobileNav permissions={actor.permissions} /><AdminHeader adminName={actor.fullName} /><main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main></div></div></div>;
}
