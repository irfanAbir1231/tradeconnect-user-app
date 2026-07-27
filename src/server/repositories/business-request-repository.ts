import "server-only";

import type { Prisma, RequestStatus, RequestType } from "@/src/generated/prisma/client";
import type { DatabaseClient, DatabaseTransactionClient } from "@/src/server/db/types";

type DatabaseExecutor = DatabaseClient | DatabaseTransactionClient;

export const businessRequestSelect = {
  id: true,
  referenceNumber: true,
  slug: true,
  title: true,
  description: true,
  requestType: true,
  status: true,
  priority: true,
  companyId: true,
  creatorId: true,
  categoryId: true,
  sourceCountryId: true,
  destinationCountryId: true,
  locationId: true,
  quantityValue: true,
  quantityUnit: true,
  quantityFrequency: true,
  budgetMin: true,
  budgetMax: true,
  budgetCurrencyCode: true,
  budgetUnit: true,
  timeline: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  company: { select: { id: true, displayName: true } },
  category: { select: { id: true, name: true } },
  sourceCountry: { select: { id: true, name: true } },
  destinationCountry: { select: { id: true, name: true } },
  location: { select: { id: true, name: true } },
  statusHistory: {
    select: { id: true, fromStatus: true, toStatus: true, createdAt: true },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  },
} satisfies Prisma.BusinessRequestSelect;

export type BusinessRequestRecord = Prisma.BusinessRequestGetPayload<{ select: typeof businessRequestSelect }>;

export function findActiveBusinessRequestById(db: DatabaseExecutor, id: string) {
  return db.businessRequest.findFirst({ where: { id, deletedAt: null }, select: businessRequestSelect });
}

export function listActiveBusinessRequestsForCompany(
  db: DatabaseExecutor,
  input: { companyId: string; page: number; pageSize: number; requestType?: RequestType; status?: RequestStatus },
) {
  const where: Prisma.BusinessRequestWhereInput = {
    companyId: input.companyId,
    deletedAt: null,
    ...(input.requestType ? { requestType: input.requestType } : {}),
    ...(input.status ? { status: input.status } : {}),
  };

  return Promise.all([
    db.businessRequest.findMany({
      where,
      select: businessRequestSelect,
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      skip: (input.page - 1) * input.pageSize,
      take: input.pageSize,
    }),
    db.businessRequest.count({ where }),
  ]);
}

export function createBusinessRequest(db: DatabaseExecutor, data: Prisma.BusinessRequestCreateInput) {
  return db.businessRequest.create({ data, select: businessRequestSelect });
}

export async function updateBusinessRequestWithExpectedVersion(
  db: DatabaseExecutor,
  id: string,
  expectedVersion: number,
  data: Prisma.BusinessRequestUpdateInput,
) {
  const result = await db.businessRequest.updateMany({ where: { id, version: expectedVersion, status: "draft", deletedAt: null }, data });
  if (result.count !== 1) return null;
  return findActiveBusinessRequestById(db, id);
}

export async function softDeleteBusinessRequestWithExpectedVersion(db: DatabaseExecutor, id: string, expectedVersion: number) {
  const result = await db.businessRequest.updateMany({
    where: { id, version: expectedVersion, status: "draft", deletedAt: null },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
  return result.count === 1;
}
