import Link from "next/link";

import { RoleGate } from "@/src/components/auth/RoleGate";
import { AdminHeader } from "@/src/components/admin/AdminHeader";
import { AdminMobileNav } from "@/src/components/admin/AdminMobileNav";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RoleGate allowedRoles={["team_member", "admin", "super_admin"]} fallback={<main className="container-shell flex min-h-screen items-center justify-center py-16"><section className="max-w-lg rounded-2xl border border-[var(--line)] bg-white p-8 text-center"><p className="eyebrow">Admin console</p><h1 className="mt-3 text-2xl font-semibold text-[var(--navy)]">Admin access required</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">This preview hides the admin workspace for users without an admin role.</p><Link className="mt-6 inline-flex rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white" href="/unauthorized">View access details</Link></section></main>}><div className="min-h-screen bg-[#eef3f1] text-[var(--navy)]"><div className="flex min-h-screen"><AdminSidebar /><div className="min-w-0 flex-1"><AdminMobileNav /><AdminHeader /><main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main></div></div></div></RoleGate>;
}
