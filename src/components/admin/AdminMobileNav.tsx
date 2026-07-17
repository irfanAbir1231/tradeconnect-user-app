"use client";

import { useState } from "react";

import { AdminSidebar } from "@/src/components/admin/AdminSidebar";

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return <div className="border-b border-white/10 bg-[var(--navy)] px-4 py-3 lg:hidden"><div className="flex items-center justify-between"><div className="flex items-center gap-2.5 text-white"><span className="flex size-8 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--navy)]"><span className="text-xs font-black">TC</span></span><span className="text-sm font-bold">Admin console</span></div><button aria-controls="admin-mobile-dialog" aria-expanded={isOpen} aria-label={isOpen ? "Close admin navigation" : "Open admin navigation"} className="rounded-lg border border-white/15 p-2 text-white" onClick={() => setIsOpen((open) => !open)} type="button"><svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24"><path d={isOpen ? "m6 6 12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg></button></div>{isOpen ? <div aria-label="Admin navigation" aria-modal="true" className="fixed inset-0 z-50 bg-[rgba(3,18,31,.55)]" id="admin-mobile-dialog" onClick={() => setIsOpen(false)} onKeyDown={(event) => { if (event.key === "Escape") setIsOpen(false); }} role="dialog" tabIndex={-1}><div className="h-full" onClick={(event) => event.stopPropagation()}><AdminSidebar mobile onNavigate={() => setIsOpen(false)} /></div></div> : null}</div>;
}
