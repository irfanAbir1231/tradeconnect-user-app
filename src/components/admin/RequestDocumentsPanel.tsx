"use client";

import { useState } from "react";

import { HomeIcon } from "@/src/components/home/HomeIcon";
import type { RequestDocument } from "@/src/types";

type RequestDocumentsPanelProps = { documents: RequestDocument[] };

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "Not uploaded";
}

function statusClass(status: RequestDocument["status"]) {
  if (status === "uploaded") return "bg-[var(--accent-soft)] text-[var(--accent-deep)]";
  if (status === "under_review") return "bg-[#fff4db] text-[#9b6b28]";
  if (status === "rejected") return "bg-[#fcebea] text-[#a3423a]";
  return "bg-slate-100 text-slate-600";
}

export function RequestDocumentsPanel({ documents }: RequestDocumentsPanelProps) {
  const [feedback, setFeedback] = useState("");
  const handleAction = (action: string, document: RequestDocument) => { setFeedback(`${action} placeholder opened for ${document.name}.`); window.setTimeout(() => setFeedback(""), 3000); };
  return <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Request files</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Documents</h2></div><span className="text-xs text-[var(--muted)]">{documents.length} files</span></div>{feedback ? <p className="mt-4 rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-xs font-semibold text-[var(--accent-deep)]" role="status">{feedback}</p> : null}{documents.length > 0 ? <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[42rem] text-left"><thead><tr className="border-b border-[var(--line)] text-[.66rem] uppercase tracking-[.08em] text-[var(--muted)]"><th className="pb-3 pr-4 font-semibold">Document</th><th className="pb-3 pr-4 font-semibold">Type</th><th className="pb-3 pr-4 font-semibold">Uploaded</th><th className="pb-3 pr-4 font-semibold">Verification</th><th className="pb-3 font-semibold">Actions</th></tr></thead><tbody>{documents.map((document) => <tr className="border-b border-[var(--line)] last:border-0" key={document.id}><td className="py-4 pr-4"><span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)]"><span className="flex size-8 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--accent-deep)]"><HomeIcon name="package" className="size-4" /></span>{document.name}</span></td><td className="py-4 pr-4 text-sm text-[var(--muted)]">{document.type}</td><td className="whitespace-nowrap py-4 pr-4 text-sm text-[var(--muted)]">{formatDate(document.uploadedAt)}</td><td className="py-4 pr-4"><span className={`rounded-full px-2.5 py-1 text-[.68rem] font-bold ${statusClass(document.status)}`}>{document.status.replaceAll("_", " ")}</span></td><td className="py-4"><div className="flex gap-2"><button className="rounded-lg border border-[var(--line)] px-2.5 py-2 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--surface)]" onClick={() => handleAction("View", document)} type="button">View</button><button className="rounded-lg border border-[var(--line)] px-2.5 py-2 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--surface)]" onClick={() => handleAction("Download", document)} type="button">Download</button></div></td></tr>)}</tbody></table></div> : <p className="mt-6 rounded-xl border border-dashed border-[var(--line-strong)] px-4 py-8 text-sm text-[var(--muted)]">No documents have been attached to this request.</p>}</section>;
}

