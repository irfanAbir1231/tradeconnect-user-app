import "server-only";

import type { PrismaClient } from "@/src/generated/prisma/client";
import type { DatabaseTransaction } from "@/src/server/db/transaction";

export type DatabaseClient = PrismaClient;
export type DatabaseTransactionClient = DatabaseTransaction;

/**
 * Public projections must be declared explicitly. Never serialize a complete
 * Prisma model when a listing, company, request, or product crosses an API boundary.
 */
export type PublicMarketplaceProjection = {
  slug: string;
  title: string;
  summary: string;
  requestType: "import" | "export" | "supply" | "technology";
  category: string;
  location: string | null;
  companyName: string;
  companyVerified: boolean;
};
