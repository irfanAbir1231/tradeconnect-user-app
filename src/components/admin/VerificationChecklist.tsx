import { HomeIcon } from "@/src/components/home/HomeIcon";
import type { VerificationChecklistItem, VerificationChecklistStatus } from "@/src/types";

type VerificationChecklistProps = { items: VerificationChecklistItem[]; onStatusChange?: (id: string, status: VerificationChecklistStatus) => void };

const labels: Record<VerificationChecklistStatus, string> = { complete: "Complete", pending: "Pending", failed: "Needs attention", not_started: "Not started" };

function statusClass(status: VerificationChecklistStatus) {
  if (status === "complete") return "bg-[var(--accent-soft)] text-[var(--accent-deep)]";
  if (status === "failed") return "bg-[#fcebea] text-[#a3423a]";
  return "bg-[#fff4db] text-[#9b6b28]";
}

export function VerificationChecklist({ items, onStatusChange }: VerificationChecklistProps) {
  return <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div><p className="eyebrow">Review controls</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Verification checklist</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Confirm each identity, business, and document requirement before making a final decision.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{items.map((item) => <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] p-4" key={item.id}><span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${item.status === "complete" ? "bg-[var(--accent-deep)] text-white" : item.status === "failed" ? "bg-[#fcebea] text-[#a3423a]" : "bg-[var(--surface)] text-[var(--muted)]"}`}>{item.status === "complete" ? <HomeIcon name="check" className="size-4" /> : <HomeIcon name="shield" className="size-4" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold text-[var(--navy)]">{item.label}</p><span className={`rounded-full px-2 py-1 text-[.62rem] font-bold ${statusClass(item.status)}`}>{labels[item.status]}</span></div><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.detail ?? "Review this requirement before final approval."}</p>{item.status !== "complete" && onStatusChange ? <button className="mt-3 text-xs font-semibold text-[var(--accent-deep)] hover:underline" onClick={() => onStatusChange(item.id, "complete")} type="button">Mark complete</button> : null}</div></div>)}</div></section>;
}

