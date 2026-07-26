"use client";

import Link from "next/link";

export default function CompanyProfileEditError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="rounded-2xl border border-[#edc7c2] bg-[#fff3f1] p-6"><h1 className="text-xl font-semibold text-[var(--navy)]">Company profile editing is temporarily unavailable</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Your existing company profile has not been changed. Try reloading the edit form or return to your company workspace.</p><div className="mt-5 flex flex-wrap gap-3"><button className="rounded-xl bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white" onClick={reset} type="button">Try again</button><Link className="rounded-xl border border-[var(--line-strong)] px-4 py-2.5 text-sm font-semibold text-[var(--navy)]" href="/dashboard/company">Back to company</Link></div></section>;
}
