import { MarketplaceModerationTable } from "@/src/components/admin/MarketplaceModerationTable";
import { marketplaceModerationListings } from "@/src/data/adminMarketplace";

export default function AdminMarketplacePage() {
  return <MarketplaceModerationTable listings={marketplaceModerationListings} />;
}

