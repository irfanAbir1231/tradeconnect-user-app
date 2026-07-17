import { notFound } from "next/navigation";

import { RoleGate } from "@/src/components/auth/RoleGate";
import { MarketplaceModerationDetail } from "@/src/components/admin/MarketplaceModerationDetail";
import { marketplaceModerationListings } from "@/src/data/adminMarketplace";

type MarketplaceDetailPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return marketplaceModerationListings.map((listing) => ({ id: listing.id }));
}

export async function generateMetadata({ params }: MarketplaceDetailPageProps) {
  const { id } = await params;
  const listing = marketplaceModerationListings.find((item) => item.id === id);
  return listing ? { title: `${listing.publicTitle} · Marketplace moderation` } : { title: "Listing not found" };
}

export default async function AdminMarketplaceDetailPage({ params }: MarketplaceDetailPageProps) {
  const { id } = await params;
  const listing = marketplaceModerationListings.find((item) => item.id === id);
  if (!listing) notFound();
  return <RoleGate requiredPermission="moderate_marketplace" fallback={<p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--muted)]">You do not have permission to moderate marketplace listings.</p>}><MarketplaceModerationDetail listing={listing} /></RoleGate>;
}
