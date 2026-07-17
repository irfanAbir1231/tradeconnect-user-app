"use client";

import { useState } from "react";

import type { VerificationDocument, VerificationDocumentStatus } from "@/src/types";

type DocumentReviewCardProps = { document: VerificationDocument; onStatusChange: (id: string, status: VerificationDocumentStatus) => void };

const labels: Record<VerificationDocumentStatus, string> = { pending: "Pending review", approved: "Approved", rejected: "Rejected", needs_replacement: "Replacement requested" };

function statusClass(status: VerificationDocumentStatus) {
  if (status === "approved") return "bg-[var(--accent-soft)] text-[var(--accent-deep)]";
  if (status === "rejected") return "bg-[#fcebea] text-[#a3423a]";
  return "bg-[#fff4db] text-[#9b6b28]";
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "Not uploaded";
}

export function DocumentReviewCard({ document, onStatusChange }: DocumentReviewCardProps) {
  const [feedback, setFeedback] = useState("");
  const update = (status: VerificationDocumentStatus, message: string) => { onStatusChange(document.id, status); setFeedback(message); window.setTimeout(() => setFeedback(""), 2500); };
  return <article className="rounded-xl border border-[var(--line)] bg-[#fbfdfc] p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-[var(--navy)]">{document.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{document.type} · Uploaded {formatDate(document.uploadedAt)}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[.64rem] font-bold ${statusClass(document.status)}`}>{labels[document.status]}</span></div>{document.reviewerNote ? <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs leading-5 text-[var(--muted)]">{document.reviewerNote}</p> : null}<div className="mt-4 flex flex-wrap gap-2"><button className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--surface)]" onClick={() => setFeedback("View placeholder opened.")} type="button">View</button><button className="rounded-lg bg-[var(--accent-deep)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--navy)]" onClick={() => update("approved", "Document approved for this session.")} type="button">Approve</button><button className="rounded-lg border border-[#e89187]/30 px-3 py-2 text-xs font-semibold text-[#a3423a] hover:bg-[#fcebea]" onClick={() => update("rejected", "Document rejected for this session.")} type="button">Reject</button><button className="rounded-lg border border-[#ecd39c] px-3 py-2 text-xs font-semibold text-[#9b6b28] hover:bg-[#fff4db]" onClick={() => update("needs_replacement", "Replacement requested for this session.")} type="button">Request replacement</button></div><p className="mt-3 min-h-4 text-xs font-semibold text-[var(--accent-deep)]" role="status">{feedback}</p></article>;
}

