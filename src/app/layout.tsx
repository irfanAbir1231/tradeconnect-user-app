import type { Metadata } from "next";

import { Footer } from "@/src/components/layout/Footer";
import { Header } from "@/src/components/layout/Header";
import { SiteChrome } from "@/src/components/layout/SiteChrome";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bhuiyan Genesis | TradeConnect",
    template: "%s | Bhuiyan Genesis",
  },
  description: "Official website of Bhuiyan Genesis, a Bangladesh-based import, supply, and business technology enterprise behind TradeConnect.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <SiteChrome footer={<Footer />} header={<Header />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
