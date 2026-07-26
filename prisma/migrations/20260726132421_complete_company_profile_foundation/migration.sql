-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "addressLine1" VARCHAR(240),
ADD COLUMN     "addressLine2" VARCHAR(240),
ADD COLUMN     "businessEmail" VARCHAR(254),
ADD COLUMN     "businessPhone" VARCHAR(40),
ADD COLUMN     "primaryProducts" TEXT,
ADD COLUMN     "registrationCountryId" UUID,
ADD COLUMN     "registrationNumber" VARCHAR(120),
ADD COLUMN     "taxVatNumber" VARCHAR(120),
ADD COLUMN     "tradeLicenseNumber" VARCHAR(120),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "companies_registrationCountryId_idx" ON "companies"("registrationCountryId");

-- Each active user has at most one selected primary company. This is a partial
-- index because inactive or soft-deleted memberships must not block selection.
CREATE UNIQUE INDEX "company_members_one_active_primary_per_user"
ON "company_members"("userId")
WHERE "isPrimary" = true AND "status" = 'active' AND "deletedAt" IS NULL;

-- A company can select several categories, but only one may be primary.
CREATE UNIQUE INDEX "company_categories_one_primary_per_company"
ON "company_categories"("companyId")
WHERE "isPrimary" = true;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_registrationCountryId_fkey" FOREIGN KEY ("registrationCountryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
