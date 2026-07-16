"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { HomeIcon } from "@/src/components/home/HomeIcon";
import { adminNavigation, type AdminNavItem } from "@/src/data/admin";

type AdminSidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

function activeHref(pathname: string) {
  return adminNavigation.filter((item) => item.href === "/admin" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)).sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

function NavigationLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const currentHref = activeHref(pathname);

  return <nav aria-label="Admin navigation" className="space-y-1">{adminNavigation.map((item: AdminNavItem) => { const isActive = item.href === currentHref; return <div key={item.href}>{item.section ? <p className="mb-2 mt-5 px-3 text-[.62rem] font-bold uppercase tracking-[.16em] text-white/35">{item.section}</p> : null}<Link aria-current={isActive ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-[var(--accent)] text-[var(--navy)] shadow-[0_10px_20px_-15px_var(--accent)]" : "text-white/60 hover:bg-white/10 hover:text-white"}`} href={item.href} onClick={onNavigate}><HomeIcon name={item.icon} className="size-[1.05rem]" />{item.label}</Link></div>; })}</nav>;
}

export function AdminSidebar({ mobile = false, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return <aside className={mobile ? "flex h-full w-[min(20rem,88vw)] flex-col bg-[var(--navy)] p-4 text-white" : "sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[var(--navy)] p-4 text-white lg:flex"}><div className="flex items-center gap-3 border-b border-white/10 px-2 pb-5"><span className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--navy)]"><HomeIcon name="chart" className="size-5" /></span><div><p className="text-sm font-bold tracking-[-.02em]">TradeConnect</p><p className="mt-0.5 text-[.65rem] font-semibold uppercase tracking-[.12em] text-white/45">Admin console</p></div></div><div className="mt-6 flex-1 overflow-y-auto pr-1"><NavigationLinks onNavigate={onNavigate} pathname={pathname} /></div><div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3.5"><p className="text-xs font-semibold text-white/80">Operations workspace</p><p className="mt-1 text-xs leading-5 text-white/45">Mock data · Admin preview</p></div></aside>;
}
