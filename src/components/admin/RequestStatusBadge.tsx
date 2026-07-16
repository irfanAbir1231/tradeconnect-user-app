import type { RequestStatus } from "@/src/types";

const labels: Record<RequestStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  needs_information: "Needs information",
  matching: "Matching",
  quotation_received: "Quotation received",
  approved: "Approved",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const classes: Record<RequestStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-[var(--accent-soft)] text-[var(--accent-deep)]",
  under_review: "bg-[#fff4db] text-[#9b6b28]",
  needs_information: "bg-[#fff4db] text-[#9b6b28]",
  matching: "bg-[#e8f0fa] text-[#31658e]",
  quotation_received: "bg-[#eee8f7] text-[#7154a4]",
  approved: "bg-[var(--accent-soft)] text-[var(--accent-deep)]",
  completed: "bg-slate-100 text-slate-600",
  rejected: "bg-[#fcebea] text-[#a3423a]",
  cancelled: "bg-slate-100 text-slate-500",
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[.68rem] font-bold ${classes[status]}`}>{labels[status]}</span>;
}

