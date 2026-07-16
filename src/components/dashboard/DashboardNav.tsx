"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { HomeIcon, type HomeIconName } from "@/src/components/home/HomeIcon";
import { dashboardUser } from "@/src/data/dashboard";

const dashboardItems: { label: string; href: string; icon: HomeIconName }[] = [
  { label: "Overview", href: "/dashboard", icon: "chart" },
  { label: "My Requests", href: "/dashboard/requests", icon: "package" },
  { label: "Inquiries", href: "/dashboard/inquiries", icon: "users" },
  { label: "Company Profile", href: "/dashboard/company", icon: "building" },
  { label: "Documents", href: "/dashboard/documents", icon: "package" },
  { label: "Verification", href: "/dashboard/verification", icon: "shield" },
  { label: "Settings", href: "/dashboard/settings", icon: "spark" },
];

function DashboardLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return <nav aria-label="Dashboard navigation" className="space-y-1">{dashboardItems.map((item) => { const isActive = pathname === item.href; return <Link aria-current={isActive ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-[var(--navy)] text-white" : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--navy)]"}`} href={item.href} key={item.href} onClick={onNavigate}><HomeIcon name={item.icon} className="size-[1.05rem]" />{item.label}</Link>; })}</nav>;
}

export function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false);

  return <>
    <aside className="sticky top-[5.5rem] hidden h-[calc(100vh-7rem)] w-60 shrink-0 flex-col rounded-2xl border border-[var(--line)] bg-white p-4 lg:flex"><div className="mb-8 flex items-center gap-3 border-b border-[var(--line)] pb-5"><span className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-[var(--navy)]">{dashboardUser.initials}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--navy)]">{dashboardUser.name}</p><p className="truncate text-xs text-[var(--muted)]">{dashboardUser.companyName}</p></div></div><DashboardLinks /><div className="mt-auto rounded-xl bg-[var(--surface)] p-3.5"><p className="text-xs font-semibold text-[var(--navy)]">Profile completion</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white"><span className="block h-full rounded-full bg-[var(--accent-deep)]" style={{ width: `${dashboardUser.profileCompletion}%` }} /></div><p className="mt-2 text-xs text-[var(--muted)]">{dashboardUser.profileCompletion}% complete</p></div></aside>
    <div className="mb-5 lg:hidden"><div className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white p-3"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-[var(--accent)] text-xs font-bold text-[var(--navy)]">{dashboardUser.initials}</span><div><p className="text-sm font-semibold text-[var(--navy)]">{dashboardUser.name}</p><p className="text-xs text-[var(--muted)]">Dashboard</p></div></div><button aria-expanded={isOpen} aria-label={isOpen ? "Close dashboard navigation" : "Open dashboard navigation"} className="rounded-lg p-2 text-[var(--navy)] hover:bg-[var(--surface)]" onClick={() => setIsOpen((open) => !open)} type="button"><HomeIcon name={isOpen ? "check" : "package"} className="size-5" /></button></div>{isOpen ? <div className="mt-2 rounded-2xl border border-[var(--line)] bg-white p-3"><DashboardLinks onNavigate={() => setIsOpen(false)} /></div> : null}</div>
  </>;
}
