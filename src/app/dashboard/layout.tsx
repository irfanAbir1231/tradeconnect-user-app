import { DashboardNav } from "@/src/components/dashboard/DashboardNav";
import { requireAuthenticatedPage } from "@/src/server/auth/page-guard";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAuthenticatedPage("/dashboard");

  return <div className="bg-[#f5f8f7] py-6 sm:py-8"><div className="container-shell flex items-start gap-6"><DashboardNav /><div className="min-w-0 flex-1">{children}</div></div></div>;
}
