import { AdminHeader } from "@/src/components/admin/AdminHeader";
import { AdminMobileNav } from "@/src/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-[#eef3f1] text-[var(--navy)]"><div className="flex min-h-screen"><AdminSidebar /><div className="min-w-0 flex-1"><AdminMobileNav /><AdminHeader /><main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main></div></div></div>;
}
