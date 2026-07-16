"use client";

import Link from "next/link";
import { useState } from "react";

import type { NavItem } from "@/src/data/nav";

type MobileNavProps = {
  items: NavItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button aria-expanded={isOpen} aria-label={isOpen ? "Close menu" : "Open menu"} className="rounded-lg p-2 text-[var(--navy)] hover:bg-[var(--surface)]" onClick={() => setIsOpen((open) => !open)} type="button">
        <span className="sr-only">Menu</span>
        <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
          {isOpen ? <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /> : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />}
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute inset-x-4 top-[4.5rem] rounded-2xl border border-[var(--line)] bg-white p-3 shadow-xl lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {items.map((item) => (
              <Link className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--navy)] hover:bg-[var(--surface)]" href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[var(--line)] pt-3">
              <Link className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-[var(--navy)] hover:bg-[var(--surface)]" href="#login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link className="rounded-xl bg-[var(--accent-deep)] px-4 py-3 text-center text-sm font-semibold text-white" href="/submit" onClick={() => setIsOpen(false)}>Submit Request</Link>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
