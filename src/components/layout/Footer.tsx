import Link from "next/link";

import { footerNavGroups } from "@/src/data/nav";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white" id="about">
      <div className="container-shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2.7fr]">
          <div className="max-w-xs">
            <Link aria-label="TradeConnect home" className="flex items-center gap-3" href="/">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--navy)]">
                <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20"><path d="M5 7.5h14M5 12h9M5 16.5h6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.25" /><path d="m17 14 2 2 3-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" /></svg>
              </span>
              <span className="text-[1.08rem] font-semibold tracking-[-0.03em] text-[var(--navy)]">TradeConnect</span>
            </Link>
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">The connected platform for smarter trade, trusted partnerships, and confident business growth.</p>
            <Link className="mt-6 inline-flex text-sm font-semibold text-[var(--accent-deep)] transition-colors hover:text-[var(--navy)]" href="/submit">Talk to our team <span aria-hidden="true" className="ml-2">↗</span></Link>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {footerNavGroups.map((group) => (
              <div key={group.label}>
                <h2 className="text-xs font-bold uppercase tracking-[.12em] text-[var(--navy)]">{group.label}</h2>
                <ul className="mt-5 space-y-3.5">
                  {group.items.map((item) => (
                    <li key={`${group.label}-${item.label}`}><Link className="text-sm leading-5 text-[var(--muted)] transition-colors hover:text-[var(--accent-deep)]" href={item.href}>{item.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TradeConnect. All rights reserved.</p>
          <div className="flex gap-5"><Link className="transition-colors hover:text-[var(--navy)]" href="/#terms">Terms</Link><Link className="transition-colors hover:text-[var(--navy)]" href="/#privacy">Privacy</Link></div>
        </div>
      </div>
    </footer>
  );
}
