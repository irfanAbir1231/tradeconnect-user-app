import { DashboardNav } from "@/src/components/dashboard/DashboardNav";
import { requireAuthenticatedPage } from "@/src/server/auth/page-guard";
import { toAuthenticatedUserView } from "@/src/server/auth/user-view";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const actor = await requireAuthenticatedPage("/dashboard");
  const user = toAuthenticatedUserView(actor);

  return <div className="bg-[#f5f8f7] py-6 sm:py-8"><div className="container-shell flex items-start gap-6"><DashboardNav user={user} /><div className="min-w-0 flex-1">{children}</div></div></div>;
}
