"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/src/components/layout/Footer";
import { Header } from "@/src/components/layout/Header";

export function SiteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) return <>{children}</>;

  return <><Header /><main className="flex-1">{children}</main><Footer /></>;
}
