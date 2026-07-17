import { notFound } from "next/navigation";

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
  return <MarketplaceModerationDetail listing={listing} />;
}
