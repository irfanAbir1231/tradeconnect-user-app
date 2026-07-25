import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CompanyAdminDetail } from "@/src/components/admin/CompanyAdminDetail";
import { adminCompanies } from "@/src/data/adminCompanies";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return adminCompanies.map((record) => ({ slug: record.company.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = adminCompanies.find((item) => item.company.slug === slug);
  return { title: record ? `${record.company.name} | Admin | TradeConnect` : "Company not found | Admin | TradeConnect" };
}

export default async function AdminCompanyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const record = adminCompanies.find((item) => item.company.slug === slug);
  if (!record) notFound();
  return <CompanyAdminDetail record={record} />;
}
