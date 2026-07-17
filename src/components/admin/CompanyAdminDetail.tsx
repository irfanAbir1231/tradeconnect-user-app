"use client";

import Link from "next/link";
import { useState } from "react";

import { AdminNotesPanel } from "@/src/components/admin/AdminNotesPanel";
import { PriorityBadge } from "@/src/components/admin/PriorityBadge";
import { RequestStatusBadge } from "@/src/components/admin/RequestStatusBadge";
import type { AdminNote, CompanyAdminRecord, CompanyAccountStatus, CompanyActivityEvent, VerificationDocumentStatus, VerificationStatus } from "@/src/types";

type Props = { record: CompanyAdminRecord };

const verificationLabels: Record<VerificationStatus, string> = { pending_review: "Pending review", approved: "Approved", rejected: "Rejected", needs_information: "Needs information" };
const accountLabels: Record<CompanyAccountStatus, string> = { active: "Active", pending: "Pending", suspended: "Suspended" };
const documentLabels: Record<VerificationDocumentStatus, string> = { pending: "Pending", approved: "Approved", rejected: "Rejected", needs_replacement: "Needs replacement" };

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function statusClass(status: VerificationStatus | CompanyAccountStatus | VerificationDocumentStatus) {
  if (status === "approved" || status === "active") return "bg-[var(--accent-soft)] text-[var(--accent-deep)]";
  if (status === "rejected" || status === "suspended") return "bg-[#fcebea] text-[#a3423a]";
  return "bg-[#fff4db] text-[#9b6b28]";
}

const panelClass = "rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7";
const actionClass = "rounded-xl border border-[var(--line-strong)] px-4 py-3 text-sm font-semibold text-[var(--navy)] transition-colors hover:border-[var(--accent-deep)] hover:text-[var(--accent-deep)]";

export function CompanyAdminDetail({ record: initialRecord }: Props) {
  const [record, setRecord] = useState<CompanyAdminRecord>(() => ({
    ...initialRecord,
    company: { ...initialRecord.company, categories: [...initialRecord.company.categories], products: [...initialRecord.company.products], services: [...initialRecord.company.services] },
    contacts: [...initialRecord.contacts],
    activeRequests: [...initialRecord.activeRequests],
    marketplaceListings: [...initialRecord.marketplaceListings],
    inquiries: [...initialRecord.inquiries],
    documents: [...initialRecord.documents],
    internalNotes: [...initialRecord.internalNotes],
    activityHistory: [...initialRecord.activityHistory],
  }));
  const [feedback, setFeedback] = useState("");
  const [showSuspendWarning, setShowSuspendWarning] = useState(false);
  const [editingCategories, setEditingCategories] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");

  const announce = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 3500);
  };
  const addActivity = (title: string, detail: string) => {
    const event: CompanyActivityEvent = { id: `activity-${Date.now()}`, title, detail, actor: "Sadia Ahmed", createdAt: "2026-07-17" };
    setRecord((current) => ({ ...current, activityHistory: [event, ...current.activityHistory] }));
  };
  const updateVerification = (status: VerificationStatus) => {
    setRecord((current) => ({ ...current, verificationStatus: status, company: { ...current.company, isVerified: status === "approved", verified: status === "approved" } }));
    addActivity("Verification status updated", `Company verification marked ${verificationLabels[status].toLowerCase()}.`);
    announce(`Verification marked ${verificationLabels[status].toLowerCase()}.`);
  };
  const suspendCompany = () => {
    setRecord((current) => ({ ...current, accountStatus: "suspended" }));
    addActivity("Account suspended", "Public access and marketplace visibility were paused by an administrator.");
    setShowSuspendWarning(false);
    announce("Company account suspended in this session.");
  };
  const restoreCompany = () => {
    setRecord((current) => ({ ...current, accountStatus: "active" }));
    addActivity("Account restored", "Company access was restored by an administrator.");
    announce("Company account restored in this session.");
  };
  const saveCategories = () => {
    const nextCategory = categoryInput.trim();
    if (!nextCategory || record.company.categories.includes(nextCategory)) return;
    setRecord((current) => ({ ...current, primaryCategory: current.primaryCategory || nextCategory, company: { ...current.company, categories: [...current.company.categories, nextCategory] } }));
    setCategoryInput("");
    announce("Category added locally.");
  };
  const addNote = (message: string) => {
    const note: AdminNote = { id: `company-note-${Date.now()}`, message, authorName: "Sadia Ahmed", createdAt: "2026-07-17", isInternal: true };
    setRecord((current) => ({ ...current, internalNotes: [note, ...current.internalNotes] }));
    addActivity("Internal note added", "An administrator added a private note to the company record.");
  };

  return <div className="space-y-6">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <Link className="text-sm font-semibold text-[var(--accent-deep)] hover:underline" href="/admin/companies">← Back to companies</Link>
        <div className="mt-4 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">Company admin</span>{record.isFeatured ? <span className="rounded-full bg-[#eee8f7] px-3 py-1 text-xs font-semibold text-[#7154a4]">Featured</span> : null}</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] text-[var(--navy)] sm:text-4xl">{record.company.name}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{record.company.businessType} · {record.company.location} · Joined {dateLabel(record.joinedAt)}</p>
        <div className="mt-4 flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(record.verificationStatus)}`}>{verificationLabels[record.verificationStatus]}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(record.accountStatus)}`}>{accountLabels[record.accountStatus]}</span></div>
      </div>
      <div className="flex flex-wrap gap-2"><Link className={actionClass} href={`/directory/${record.company.slug}`}>View public profile</Link><button className="rounded-xl bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-deep)]" onClick={() => announce("Message composer placeholder opened.")} type="button">Send message</button></div>
    </div>
    {feedback ? <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--accent-deep)]" role="status">{feedback}</div> : null}

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(19rem,.6fr)]">
      <div className="space-y-6">
        <section className={panelClass}><p className="eyebrow">Business profile</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Company information</h2><p className="mt-4 text-sm leading-7 text-[var(--muted)]">{record.company.description}</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Business type</p><p className="mt-2 text-sm font-semibold text-[var(--navy)]">{record.company.businessType}</p></div><div><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Primary category</p><p className="mt-2 text-sm font-semibold text-[var(--navy)]">{record.primaryCategory}</p></div><div><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Markets</p><p className="mt-2 text-sm text-[var(--navy)]">{record.company.markets.join(", ")}</p></div><div><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Countries served</p><p className="mt-2 text-sm text-[var(--navy)]">{record.company.countriesServed.join(", ")}</p></div></div><div className="mt-6 flex flex-wrap gap-2">{record.company.categories.map((category) => <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]" key={category}>{category}</span>)}</div>{editingCategories ? <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><p className="text-xs font-semibold text-[var(--navy)]">Edit categories locally</p><div className="mt-3 flex flex-col gap-2 sm:flex-row"><input className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-[var(--accent-deep)]" onChange={(event) => setCategoryInput(event.target.value)} placeholder="Add a category" value={categoryInput} /><button className="rounded-lg bg-[var(--navy)] px-3 py-2 text-xs font-semibold text-white" onClick={saveCategories} type="button">Add category</button></div></div> : null}</section>

        <section className={panelClass}><p className="eyebrow">Admin-only contacts</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Contact users</h2><div className="mt-5 space-y-3">{record.contacts.map((contact) => <div className="rounded-xl border border-[var(--line)] p-4" key={contact.id}><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-sm font-semibold text-[var(--navy)]">{contact.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{contact.role}</p></div>{contact.isPrimary ? <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[.68rem] font-bold text-[var(--accent-deep)]">Primary</span> : null}</div><div className="mt-3 grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-2"><span>{contact.email}</span><span>{contact.phone}</span></div></div>)}</div></section>

        <section className={panelClass}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Trust and compliance</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Verification details</h2></div><Link className="text-xs font-semibold text-[var(--accent-deep)] hover:underline" href={`/admin/verifications/${record.company.id}`}>Open verification case →</Link></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-[var(--surface)] p-4"><p className="text-xs text-[var(--muted)]">Status</p><p className="mt-2 text-sm font-semibold text-[var(--navy)]">{verificationLabels[record.verificationStatus]}</p></div><div className="rounded-xl bg-[var(--surface)] p-4"><p className="text-xs text-[var(--muted)]">Documents</p><p className="mt-2 text-sm font-semibold text-[var(--navy)]">{record.documents.length} submitted</p></div><div className="rounded-xl bg-[var(--surface)] p-4"><p className="text-xs text-[var(--muted)]">Public trust badge</p><p className="mt-2 text-sm font-semibold text-[var(--navy)]">{record.company.isVerified ? "Visible" : "Hidden"}</p></div></div></section>

        <section className={panelClass}><p className="eyebrow">Network offering</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Products and services</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Products</p><ul className="mt-3 space-y-2 text-sm text-[var(--navy)]">{record.company.products.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><p className="text-xs font-semibold uppercase tracking-[.08em] text-[var(--muted)]">Services</p><ul className="mt-3 space-y-2 text-sm text-[var(--navy)]">{record.company.services.map((item) => <li key={item}>• {item}</li>)}</ul></div></div></section>

        <section className={panelClass}><p className="eyebrow">Request activity</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Active requests</h2><div className="mt-5 space-y-3">{record.activeRequests.length ? record.activeRequests.map((request) => <Link className="block rounded-xl border border-[var(--line)] p-4 hover:border-[var(--accent)]" href={`/admin/requests/${request.id}`} key={request.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold text-[var(--accent-deep)]">{request.referenceNumber}</p><p className="mt-1 text-sm font-semibold text-[var(--navy)]">{request.title}</p></div><div className="flex gap-2"><RequestStatusBadge status={request.status} /><PriorityBadge priority={request.priority} /></div></div></Link>) : <p className="text-sm text-[var(--muted)]">No active requests.</p>}</div></section>

        <section className={panelClass}><p className="eyebrow">Public visibility</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Marketplace listings</h2><div className="mt-5 space-y-3">{record.marketplaceListings.length ? record.marketplaceListings.map((listing) => <Link className="block rounded-xl border border-[var(--line)] p-4 hover:border-[var(--accent)]" href={`/admin/marketplace/${listing.id}`} key={listing.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--navy)]">{listing.publicTitle}</p><p className="mt-1 text-xs text-[var(--muted)]">{listing.views} views · {listing.interests} interests</p></div><span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[.68rem] font-bold capitalize text-[var(--muted)]">{listing.publicationStatus.replaceAll("_", " ")}</span></div></Link>) : <p className="text-sm text-[var(--muted)]">No marketplace listings for this company.</p>}</div></section>

        <section className={panelClass}><p className="eyebrow">Lead activity</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Inquiries</h2><div className="mt-5 space-y-3">{record.inquiries.length ? record.inquiries.map((inquiry) => <Link className="block rounded-xl border border-[var(--line)] p-4 hover:border-[var(--accent)]" href={`/admin/inquiries/${inquiry.id}`} key={inquiry.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--navy)]">{inquiry.subject}</p><p className="mt-1 text-xs text-[var(--muted)]">{inquiry.sender.name} · {dateLabel(inquiry.receivedAt)}</p></div><span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[.68rem] font-bold capitalize text-[var(--muted)]">{inquiry.status}</span></div></Link>) : <p className="text-sm text-[var(--muted)]">No inquiries connected to this company.</p>}</div></section>

        <section className={panelClass}><p className="eyebrow">Compliance files</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Documents</h2><div className="mt-5 divide-y divide-[var(--line)]">{record.documents.length ? record.documents.map((document) => <div className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between" key={document.id}><div><p className="text-sm font-semibold text-[var(--navy)]">{document.name}</p><p className="mt-1 text-xs text-[var(--muted)]">{document.type} · Uploaded {document.uploadedAt ? dateLabel(document.uploadedAt) : "Not dated"}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-[.68rem] font-bold ${statusClass(document.status)}`}>{documentLabels[document.status]}</span><button className="text-xs font-semibold text-[var(--accent-deep)]" onClick={() => announce(`Preview placeholder opened for ${document.name}.`)} type="button">View</button></div></div>) : <p className="py-2 text-sm text-[var(--muted)]">No documents submitted.</p>}</div></section>

        <AdminNotesPanel notes={record.internalNotes} onAddNote={addNote} />
        <section className={panelClass}><p className="eyebrow">Audit trail</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Activity history</h2><div className="mt-6 space-y-5">{record.activityHistory.map((event, index) => <div className="relative flex gap-4" key={event.id}><div className="flex flex-col items-center"><span className="mt-1 size-2.5 rounded-full bg-[var(--accent-deep)]" />{index < record.activityHistory.length - 1 ? <span className="mt-1 h-full w-px bg-[var(--line)]" /> : null}</div><div className="pb-1"><p className="text-sm font-semibold text-[var(--navy)]">{event.title}</p><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{event.detail}</p><p className="mt-2 text-xs text-[var(--muted)]">{event.actor} · {dateLabel(event.createdAt)}</p></div></div>)}</div></section>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start"><section className={panelClass}><p className="eyebrow">Admin controls</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Company actions</h2><div className="mt-5 space-y-2"><button className="w-full rounded-xl bg-[var(--accent-deep)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--navy)]" onClick={() => updateVerification("approved")} type="button">Approve verification</button>{record.accountStatus === "suspended" ? <button className={`w-full ${actionClass}`} onClick={restoreCompany} type="button">Restore company</button> : <button className="w-full rounded-xl border border-[#e5b0aa] px-4 py-3 text-sm font-semibold text-[#a3423a] hover:bg-[#fcebea]" onClick={() => setShowSuspendWarning(true)} type="button">Suspend company</button>}<button className={`w-full ${actionClass}`} onClick={() => setEditingCategories((current) => !current)} type="button">{editingCategories ? "Close category editor" : "Edit categories"}</button><button className={`w-full ${actionClass}`} onClick={() => { setRecord((current) => ({ ...current, isFeatured: !current.isFeatured })); announce(record.isFeatured ? "Company removed from featured rotation." : "Company featured in this session."); }} type="button">{record.isFeatured ? "Remove featured status" : "Feature company"}</button><button className={`w-full ${actionClass}`} onClick={() => announce("Message composer placeholder opened.")} type="button">Send message</button><Link className="block w-full rounded-xl border border-[var(--line-strong)] px-4 py-3 text-center text-sm font-semibold text-[var(--navy)] hover:border-[var(--accent-deep)] hover:text-[var(--accent-deep)]" href={`/directory/${record.company.slug}`}>View public profile</Link></div>{showSuspendWarning ? <div className="mt-5 rounded-xl border border-[#e5b0aa] bg-[#fff6f5] p-4" role="alert"><p className="text-sm font-semibold text-[#8f3932]">Suspend this company?</p><p className="mt-2 text-xs leading-5 text-[#8f3932]">This will pause marketplace visibility and restrict the company account in this mock admin session.</p><div className="mt-4 flex gap-2"><button className="rounded-lg bg-[#a3423a] px-3 py-2 text-xs font-semibold text-white" onClick={suspendCompany} type="button">Confirm suspension</button><button className="rounded-lg border border-[#e5b0aa] px-3 py-2 text-xs font-semibold text-[#8f3932]" onClick={() => setShowSuspendWarning(false)} type="button">Cancel</button></div></div> : null}</section><section className={panelClass}><p className="eyebrow">Record snapshot</p><div className="mt-5 space-y-4"><div><p className="text-xs text-[var(--muted)]">Company ID</p><p className="mt-1 break-all text-sm font-semibold text-[var(--navy)]">{record.company.id}</p></div><div><p className="text-xs text-[var(--muted)]">Website</p><p className="mt-1 text-sm font-semibold text-[var(--navy)]">{record.company.website ?? "Not provided"}</p></div><div><p className="text-xs text-[var(--muted)]">Certifications</p><p className="mt-1 text-sm text-[var(--navy)]">{record.company.certifications.join(", ") || "Not provided"}</p></div></div></section></aside>
    </div>
  </div>;
}
