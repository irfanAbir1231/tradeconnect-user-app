import { notFound } from "next/navigation";

import { RoleGate } from "@/src/components/auth/RoleGate";
import { VerificationDetail } from "@/src/components/admin/VerificationDetail";
import { verificationCases, verificationReviewers } from "@/src/data/adminVerification";

type VerificationDetailPageProps = { params: Promise<{ companyId: string }> };

export function generateStaticParams() {
  return verificationCases.map((item) => ({ companyId: item.company.id }));
}

export async function generateMetadata({ params }: VerificationDetailPageProps) {
  const { companyId } = await params;
  const item = verificationCases.find((verificationCase) => verificationCase.company.id === companyId);
  return item ? { title: `${item.company.name} · Verification` } : { title: "Verification case not found" };
}

export default async function AdminVerificationDetailPage({ params }: VerificationDetailPageProps) {
  const { companyId } = await params;
  const verificationCase = verificationCases.find((item) => item.company.id === companyId);
  if (!verificationCase) notFound();
  return <RoleGate requiredPermission="review_verifications" fallback={<p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--muted)]">You do not have permission to review verification cases.</p>}><VerificationDetail reviewers={verificationReviewers} verificationCase={verificationCase} /></RoleGate>;
}
