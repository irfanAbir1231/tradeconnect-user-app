import type { Metadata } from "next";

import { Footer } from "@/src/components/layout/Footer";
import { Header } from "@/src/components/layout/Header";
import { SiteChrome } from "@/src/components/layout/SiteChrome";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TradeConnect | Move business forward",
    template: "%s | TradeConnect",
  },
  description: "A connected platform for smarter trade, stronger partnerships, and confident business growth.",
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
