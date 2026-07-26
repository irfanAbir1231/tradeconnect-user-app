import Link from "next/link";

import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { HomeIcon } from "@/src/components/home/HomeIcon";
import { primaryCompanyMembership, userDisplayName, userInitials } from "@/src/lib/user-identity";
import { requireAuthenticatedPage } from "@/src/server/auth/page-guard";
import { toAuthenticatedUserView } from "@/src/server/auth/user-view";

export default async function DashboardCompanyPage() {
  const user = toAuthenticatedUserView(await requireAuthenticatedPage("/dashboard/company"));
  const company = primaryCompanyMembership(user);

  if (!company) {
    return <div className="space-y-6"><DashboardHeader title="Company profile" description="Add your business details when you are ready to begin your TradeConnect company profile." /><section className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-white p-6 sm:p-8"><span aria-label={`${userDisplayName(user)} initials`} className="flex size-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-bold text-[var(--navy)]">{userInitials(user)}</span><p className="eyebrow mt-6">Company workspace</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">No company profile yet</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">Your authenticated account is ready. Company ownership, location, verification status, and profile completion will appear after the company profile workflow is connected.</p><Link className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white" href="#company-profile">Complete your company profile <HomeIcon name="arrow" className="size-4" /></Link></section><section className="rounded-2xl bg-[var(--surface)] p-5 sm:p-6" id="company-profile"><p className="eyebrow">Coming next</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Company profile workflow</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Company creation and editing remain a future business API workflow. No fictional company information is shown for your account.</p></section></div>;
  }

  return <div className="space-y-6"><DashboardHeader title="Company profile" description="Your account is connected to the company membership shown below." /><section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6"><div className="flex items-center gap-4"><span aria-label={`${userDisplayName(user)} initials`} className="flex size-14 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-bold text-[var(--navy)]">{userInitials(user)}</span><div className="min-w-0"><p className="eyebrow">Company membership</p><h2 className="mt-2 truncate text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">{company.companyName}</h2><p className="mt-1 text-sm capitalize text-[var(--muted)]">{company.membershipRole} membership</p></div></div><p className="mt-6 rounded-xl bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]">Business profile details, location, and verification status will appear here when the company profile API is connected.</p></section></div>;
}
