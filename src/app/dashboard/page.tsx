import Link from "next/link";

import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { HomeIcon } from "@/src/components/home/HomeIcon";
import { dashboardUser } from "@/src/data/dashboard";
import { opportunities } from "@/src/data/opportunities";

const typeLabels = { import: "Import", export: "Export", supply: "Supply", technology: "Technology" } as const;

function statusClass(status: string) {
  if (status === "Open") return "bg-[#e5f7ef] text-[#15785f]";
  if (status === "Under review") return "bg-[#fff4db] text-[#9b6b28]";
  return "bg-[var(--surface)] text-[var(--muted)]";
}

function statusLabel(status: string) {
  return status === "under_review" ? "Under review" : status === "open" ? "Open" : status.replace("_", " ");
}

const nextSteps = [
  { title: "Complete company profile", text: "Add your business details so partners know what you do best.", href: "/dashboard/company", icon: "building" as const, status: "72% complete" },
  { title: "Upload trade license", text: "Add a current copy to move your verification review forward.", href: "/dashboard/documents", icon: "package" as const, status: "Action needed" },
  { title: "Respond to inquiry", text: "Riverstone Leather Exports is waiting for your response.", href: "/dashboard/inquiries", icon: "users" as const, status: "1 new" },
];

export default function DashboardPage() {
  const recentRequests = opportunities.slice(0, 3);
  const recommendations = opportunities.slice(1, 4);

  return <div className="space-y-6"><DashboardHeader eyebrow={`Good morning, ${dashboardUser.name.split(" ")[0]}`} title="Your business dashboard" description={`${dashboardUser.companyName} · ${dashboardUser.location}`} action={<Link className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href="/marketplace">Explore marketplace <HomeIcon name="arrow" className="size-4" /></Link>} />
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "My Requests", value: "12", detail: "+3 this month", icon: "package" as const }, { label: "Open Inquiries", value: "08", detail: "3 need your reply", icon: "users" as const }, { label: "Verification Status", value: "Reviewing", detail: "Trade license needed", icon: "shield" as const }, { label: "Matched Opportunities", value: "05", detail: "+2 this week", icon: "spark" as const }].map((stat) => <div className="rounded-2xl border border-[var(--line)] bg-white p-5" key={stat.label}><div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">{stat.label}</p><span className="flex size-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-deep)]"><HomeIcon name={stat.icon} className="size-4" /></span></div><p className="mt-5 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">{stat.value}</p><p className="mt-1 text-xs text-[var(--muted)]">{stat.detail}</p></div>)}</section>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Activity</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Recent requests</h2></div><Link className="text-sm font-semibold text-[var(--accent-deep)]" href="/dashboard/requests">View all <span aria-hidden="true">→</span></Link></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[42rem] text-left"><thead><tr className="border-b border-[var(--line)] text-xs uppercase tracking-[.08em] text-[var(--muted)]"><th className="pb-3 pr-4 font-semibold">Request</th><th className="pb-3 pr-4 font-semibold">Type</th><th className="pb-3 pr-4 font-semibold">Location</th><th className="pb-3 font-semibold">Status</th></tr></thead><tbody>{recentRequests.map((request) => <tr className="border-b border-[var(--line)] last:border-0" key={request.id}><td className="py-4 pr-4"><Link className="block max-w-sm text-sm font-semibold text-[var(--navy)] hover:text-[var(--accent-deep)]" href={`/marketplace/${request.slug}`}>{request.title}</Link><span className="mt-1 block text-xs text-[var(--muted)]">{request.category}</span></td><td className="py-4 pr-4 text-sm text-[var(--muted)]">{typeLabels[request.type]}</td><td className="py-4 pr-4 text-sm text-[var(--muted)]">{request.location}</td><td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(statusLabel(request.status))}`}>{statusLabel(request.status)}</span></td></tr>)}</tbody></table></div></section>

    <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">For you</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Recommended matches</h2></div><Link className="text-sm font-semibold text-[var(--accent-deep)]" href="/marketplace">Explore all</Link></div><div className="mt-5 space-y-3">{recommendations.map((match) => <Link className="flex items-start gap-3 rounded-xl border border-[var(--line)] p-3.5 transition-colors hover:border-[var(--line-strong)] hover:bg-[#fbfdfc]" href={`/marketplace/${match.slug}`} key={match.id}><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-deep)]"><HomeIcon name={match.type === "technology" ? "laptop" : match.type === "export" ? "globe" : "building"} className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-[.08em] text-[var(--accent-deep)]">{typeLabels[match.type]} · {match.category}</span><span className="mt-1 block text-sm font-semibold leading-5 text-[var(--navy)]">{match.title}</span><span className="mt-1 block text-xs text-[var(--muted)]">{match.location}</span></span><HomeIcon name="arrow" className="mt-1 size-4 shrink-0 text-[var(--muted)]" /></Link>)}</div></section><section className="rounded-2xl border border-[var(--line)] bg-[var(--navy)] p-5 text-white sm:p-6"><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--accent)]">Keep moving</p><h2 className="mt-3 text-xl font-semibold tracking-[-.03em]">Your next steps</h2><div className="mt-5 space-y-3">{nextSteps.map((step) => <Link className="flex items-center gap-3 rounded-xl bg-white/10 p-3.5 transition-colors hover:bg-white/15" href={step.href} key={step.title}><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--navy)]"><HomeIcon name={step.icon} className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{step.title}</span><span className="mt-1 block text-xs leading-4 text-white/55">{step.text}</span></span><span className="shrink-0 text-[.65rem] font-semibold text-[var(--accent)]">{step.status}</span></Link>)}</div></section></div>
  </div>;
}
