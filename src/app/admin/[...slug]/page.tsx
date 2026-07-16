import Link from "next/link";

import { HomeIcon } from "@/src/components/home/HomeIcon";
import { adminNavigation } from "@/src/data/admin";

type AdminModulePageProps = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return adminNavigation.filter((item) => item.href !== "/admin").map((item) => ({ slug: item.href.replace("/admin/", "").split("/") }));
}

export default async function AdminModulePage({ params }: AdminModulePageProps) {
  const { slug } = await params;
  const label = slug.join(" /").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return <div className="mx-auto max-w-3xl"><div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-center shadow-[0_20px_48px_-35px_rgba(8,38,63,.45)] sm:p-12"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-deep)]"><HomeIcon name="spark" className="size-7" /></span><p className="eyebrow mt-6">Admin module preview</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] text-[var(--navy)]">{label}</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[var(--muted)]">This workspace module is scaffolded and ready for its mock data table and workflows in a future admin iteration.</p><Link className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]" href="/admin">Back to overview <HomeIcon name="arrow" className="size-4" /></Link></div></div>;
}
