import { HomeIcon } from "@/src/components/home/HomeIcon";
import type { RequestStatus, RequestStatusHistory } from "@/src/types";

type RequestStatusTimelineProps = { currentStatus: RequestStatus; history: RequestStatusHistory[] };

const stages: { status: RequestStatus; label: string }[] = [{ status: "submitted", label: "Submitted" }, { status: "under_review", label: "Under review" }, { status: "needs_information", label: "Needs information" }, { status: "matching", label: "Matching" }, { status: "quotation_received", label: "Quotation received" }, { status: "completed", label: "Completed" }];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function RequestStatusTimeline({ currentStatus, history }: RequestStatusTimelineProps) {
  const historyByStatus = new Map(history.map((event) => [event.status, event]));
  const currentHistoryIndex = history.reduce((latest, event, index) => event.status === currentStatus ? index : latest, -1);
  const latestEvent = history[history.length - 1];

  return <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="eyebrow">Workflow history</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Request status timeline</h2></div><p className="text-xs text-[var(--muted)]">Latest update: {latestEvent ? formatDate(latestEvent.createdAt) : "Not available"}</p></div><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stages.map((stage, index) => { const event = historyByStatus.get(stage.status); const isCurrent = event?.status === currentStatus || (!event && currentStatus === stage.status); const isComplete = Boolean(event) && !isCurrent; const hasPassed = currentHistoryIndex > -1 && history.slice(0, currentHistoryIndex).some((item) => item.status === stage.status); return <div className={`rounded-xl border p-4 ${isCurrent ? "border-[#ecd39c] bg-[#fffaf0]" : isComplete || hasPassed ? "border-[var(--accent)] bg-[var(--accent-soft)]/40" : "border-[var(--line)]"}`} key={stage.status}><div className="flex items-center gap-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isCurrent ? "bg-[#f8eac4] text-[#9b6b28]" : isComplete || hasPassed ? "bg-[var(--accent-deep)] text-white" : "bg-[var(--surface)] text-[var(--muted)]"}`}>{isComplete || hasPassed ? <HomeIcon name="check" className="size-4" /> : String(index + 1).padStart(2, "0")}</span><div><p className="text-sm font-semibold text-[var(--navy)]">{stage.label}</p><p className="mt-1 text-xs text-[var(--muted)]">{isCurrent ? "Current stage" : event ? formatDate(event.createdAt) : "Upcoming"}</p></div></div>{event?.note ? <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{event.note}</p> : null}</div>; })}</div>{!stages.some((stage) => stage.status === currentStatus) ? <div className="mt-5 rounded-xl bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">Current request state: <strong className="font-semibold capitalize text-[var(--navy)]">{currentStatus.replaceAll("_", " ")}</strong>. The timeline above reflects the standard trade workflow.</div> : null}</section>;
}

