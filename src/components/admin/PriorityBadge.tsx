import type { RequestPriority } from "@/src/types";

const labels: Record<RequestPriority, string> = { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" };
const classes: Record<RequestPriority, string> = { low: "bg-slate-100 text-slate-600", medium: "bg-[#e8f0fa] text-[#31658e]", high: "bg-[#fff4db] text-[#9b6b28]", urgent: "bg-[#fcebea] text-[#a3423a]" };

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[.68rem] font-bold ${classes[priority]}`}>{labels[priority]}</span>;
}

