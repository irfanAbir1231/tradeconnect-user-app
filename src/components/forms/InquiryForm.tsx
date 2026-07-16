"use client";

import { useState } from "react";

import { HomeIcon } from "@/src/components/home/HomeIcon";

type InquiryFormProps = {
  context?: string;
  title?: string;
};

const inputClass = "h-11 w-full rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3.5 text-sm text-[var(--navy)] outline-none transition-colors placeholder:text-[var(--muted)]/60 focus:border-[var(--accent-deep)] focus:bg-white";
const textareaClass = "min-h-28 w-full resize-y rounded-xl border border-[var(--line)] bg-[#fbfdfc] px-3.5 py-3 text-sm text-[var(--navy)] outline-none transition-colors placeholder:text-[var(--muted)]/60 focus:border-[var(--accent-deep)] focus:bg-white";

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return <label className="block"><span className="text-sm font-semibold text-[var(--navy)]">{label}<span className="ml-1 text-[var(--accent-deep)]">*</span></span><span className="mt-2 block">{children}</span></label>;
}

export function InquiryForm({ context, title = "Start an inquiry" }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <div className="rounded-[1.5rem] border border-[var(--accent)] bg-[var(--accent-soft)] p-7 text-center sm:p-10" role="status"><span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[var(--accent-deep)] text-white"><HomeIcon name="check" className="size-6" /></span><p className="eyebrow mt-5">Inquiry ready</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">Thanks — your inquiry is ready to send.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">This is a frontend preview. Once connected, the TradeConnect team will route your message to the right business.</p><button className="mt-6 rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm font-semibold text-[var(--navy)]" onClick={() => setSubmitted(false)} type="button">Send another inquiry</button></div>;

  return <form className="rounded-[1.5rem] border border-[var(--line)] bg-white p-5 shadow-[0_25px_55px_-35px_rgba(8,38,63,.55)] sm:p-7" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><div className="border-b border-[var(--line)] pb-5"><p className="eyebrow">{context ?? "TradeConnect network"}</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-[var(--navy)]">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Share a little context so the conversation starts in the right place.</p></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Name"><input className={inputClass} placeholder="Your full name" required /></Field><Field label="Company name"><input className={inputClass} placeholder="Your company" required /></Field><Field label="Email"><input className={inputClass} placeholder="you@company.com" required type="email" /></Field><Field label="Phone"><input className={inputClass} placeholder="+880 1700 000000" required type="tel" /></Field><label className="block sm:col-span-2"><span className="text-sm font-semibold text-[var(--navy)]">Inquiry type<span className="ml-1 text-[var(--accent-deep)]">*</span></span><select className={`${inputClass} mt-2`} defaultValue="" required><option disabled value="">Choose an inquiry type</option><option>Request quotation</option><option>Submit interest</option><option>Ask for more information</option><option>Partnership inquiry</option></select></label><Field label="Message"><textarea className={`${textareaClass} sm:col-span-2`} placeholder="What would you like to discuss?" required /></Field></div><div className="mt-7 flex flex-col gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[var(--muted)]"><span className="text-[var(--accent-deep)]">*</span> Required fields</p><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" type="submit">Continue inquiry <HomeIcon name="arrow" className="size-4" /></button></div></form>;
}
