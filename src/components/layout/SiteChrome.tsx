"use client";

import { usePathname } from "next/navigation";

export function SiteChrome({ children, header, footer }: Readonly<{ children: React.ReactNode; header: React.ReactNode; footer: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) return <>{children}</>;

  return <>{header}<main className="flex-1">{children}</main>{footer}</>;
}
