"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/requests": "All Requests",
  "/admin/requests/import": "Import Requests",
  "/admin/requests/export": "Export Requests",
  "/admin/requests/supply": "Supply Requests",
  "/admin/requests/technology": "Technology Requests",
  "/admin/marketplace": "Marketplace Listings",
  "/admin/companies": "Companies",
  "/admin/verifications": "Verification Queue",
  "/admin/inquiries": "Inquiries",
  "/admin/documents": "Documents",
  "/admin/users": "Users",
  "/admin/team": "Team Members",
  "/admin/categories": "Categories",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Admin module";

  return <header className="border-b border-[var(--line)] bg-white"><div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--accent-deep)]">TradeConnect operations</p><h1 className="mt-2 text-2xl font-semibold tracking-[-.045em] text-[var(--navy)] sm:text-3xl">{title}</h1></div><div className="flex items-center gap-3"><label className="relative min-w-0 flex-1 lg:w-72 lg:flex-none"><span className="sr-only">Search admin workspace</span><svg aria-hidden="true" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" fill="none" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" /><path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg><input className="h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] pl-10 pr-3 text-sm text-[var(--navy)] outline-none placeholder:text-[var(--muted)]/70 focus:border-[var(--accent-deep)]" placeholder="Search workspace" type="search" /></label><button aria-label="View notifications" className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-[var(--navy)] transition-colors hover:bg-[var(--surface)]" type="button"><svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24"><path d="M6.5 10.5a5.5 5.5 0 0 1 11 0c0 6 2.2 6.5 2.2 6.5H4.3s2.2-.5 2.2-6.5ZM10 20h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg><span className="absolute right-2 top-2 size-2 rounded-full bg-[var(--accent-deep)] ring-2 ring-white" /></button><div className="hidden items-center gap-3 border-l border-[var(--line)] pl-3 sm:flex"><span className="flex size-10 items-center justify-center rounded-xl bg-[var(--navy)] text-xs font-bold text-[var(--accent)]">SA</span><div className="hidden xl:block"><p className="text-sm font-semibold text-[var(--navy)]">Sadia Ahmed</p><p className="text-xs text-[var(--muted)]">Platform admin</p></div></div></div></div></header>;
}
