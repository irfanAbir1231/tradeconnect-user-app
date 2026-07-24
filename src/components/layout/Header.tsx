import Link from "next/link";

import { navItems } from "@/src/data/nav";

import { MobileNav } from "./MobileNav";

function TradeConnectMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--navy)] shadow-[0_8px_18px_-8px_var(--accent)]">
      <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
        <path d="M5 7.5h14M5 12h9M5 16.5h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.25" />
        <path d="m17 14 2 2 3-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
      </svg>
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:var(--background)/.9] backdrop-blur-xl">
      <div className="container-shell flex h-[4.5rem] items-center justify-between">
        <Link aria-label="TradeConnect home" className="flex items-center gap-3" href="/">
          <TradeConnectMark />
          <span className="text-[1.08rem] font-semibold tracking-[-0.03em] text-[var(--navy)]">TradeConnect</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navItems.map((item) => (
            <Link className="whitespace-nowrap text-[.8rem] font-medium text-[var(--muted)] transition-colors hover:text-[var(--navy)]" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link className="text-sm font-semibold text-[var(--navy)] transition-colors hover:text-[var(--accent-deep)]" href="/login">Login</Link>
          <Link className="rounded-full bg-[var(--accent-deep)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_var(--accent-deep)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--navy)]" href="/submit">
            Submit Request
          </Link>
        </div>

        <MobileNav items={navItems} />
      </div>
    </header>
  );
}
