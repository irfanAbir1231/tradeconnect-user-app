"use client";

import { useState } from "react";

import type { AdminNote } from "@/src/types";

type AdminNotesPanelProps = { notes: AdminNote[]; onAddNote: (message: string) => void };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function AdminNotesPanel({ notes, onAddNote }: AdminNotesPanelProps) {
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const handleSubmit = () => { const trimmed = message.trim(); if (!trimmed) return; onAddNote(trimmed); setMessage(""); setFeedback("Internal note added to this request."); window.setTimeout(() => setFeedback(""), 3000); };

  return <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Internal workspace</p><h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[var(--navy)]">Admin notes</h2></div><span className="rounded-full bg-[#fff4db] px-2.5 py-1 text-[.68rem] font-bold text-[#9b6b28]">Internal only</span></div>{notes.length > 0 ? <div className="mt-6 space-y-3">{notes.map((note) => <div className="rounded-xl bg-[var(--surface)] p-4" key={note.id}><p className="text-sm leading-6 text-[var(--navy)]">{note.message}</p><p className="mt-3 text-xs text-[var(--muted)]">{note.authorName} · {formatDate(note.createdAt)}</p></div>)}</div> : <p className="mt-6 rounded-xl border border-dashed border-[var(--line-strong)] px-4 py-5 text-sm text-[var(--muted)]">No internal notes have been added yet.</p>}<div className="mt-6 border-t border-[var(--line)] pt-6"><label className="block text-xs font-semibold text-[var(--navy)]" htmlFor="admin-note">Add internal note<span className="mt-1 block font-normal text-[var(--muted)]">This note will be visible to admins only.</span></label><textarea className="mt-3 min-h-28 w-full resize-y rounded-xl border border-[var(--line)] bg-[#fbfdfc] p-3 text-sm text-[var(--navy)] outline-none placeholder:text-[var(--muted)]/70 focus:border-[var(--accent-deep)]" id="admin-note" onChange={(event) => setMessage(event.target.value)} placeholder="Write a review note or next step..." value={message} /><div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="text-xs text-[var(--accent-deep)]">{feedback}</p><button className="rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:opacity-50" disabled={!message.trim()} onClick={handleSubmit} type="button">Add note</button></div></div></section>;
}

