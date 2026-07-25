-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspended', 'archived');

-- CreateEnum
CREATE TYPE "CompanyMemberStatus" AS ENUM ('pending', 'active', 'suspended', 'removed');

-- CreateEnum
CREATE TYPE "CompanyMemberRole" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "CompanyVerificationStatus" AS ENUM ('not_started', 'submitted', 'under_review', 'needs_information', 'approved', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "CompanyAccountStatus" AS ENUM ('active', 'suspended', 'archived');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('import', 'export', 'supply', 'technology');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('draft', 'submitted', 'under_review', 'needs_information', 'matching', 'quotation_received', 'approved', 'completed', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "MarketplaceRequestStatus" AS ENUM ('not_requested', 'draft', 'pending_review', 'published', 'paused', 'matched', 'closed');

-- CreateEnum
CREATE TYPE "MarketplaceListingStatus" AS ENUM ('draft', 'pending_publication', 'published', 'paused', 'rejected', 'expired', 'archived');

-- CreateEnum
CREATE TYPE "DocumentResourceType" AS ENUM ('company', 'request', 'verification', 'product');

-- CreateEnum
CREATE TYPE "DocumentScanStatus" AS ENUM ('pending', 'clean', 'infected', 'failed');

-- CreateEnum
CREATE TYPE "DocumentReviewStatus" AS ENUM ('pending', 'approved', 'rejected', 'replacement_requested');

-- CreateEnum
CREATE TYPE "VerificationChecklistStatus" AS ENUM ('pending', 'approved', 'rejected', 'needs_information');

-- CreateEnum
CREATE TYPE "VerificationDocumentDecision" AS ENUM ('approved', 'rejected', 'replacement_requested');

-- CreateEnum
CREATE TYPE "InquirySource" AS ENUM ('marketplace_opportunity', 'company_profile', 'technology_product', 'partnership');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('request_quotation', 'submit_interest', 'ask_information', 'partnership_inquiry');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('new', 'contacted', 'qualified', 'introduced', 'negotiating', 'converted', 'closed', 'spam');

-- CreateEnum
CREATE TYPE "TechnologyProductStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "NotificationDeliveryStatus" AS ENUM ('pending', 'sent', 'failed');

-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('in_progress', 'completed', 'failed', 'expired');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "fullName" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40),
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "legalName" VARCHAR(240) NOT NULL,
    "displayName" VARCHAR(240) NOT NULL,
    "businessType" VARCHAR(64) NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "verificationStatus" "CompanyVerificationStatus" NOT NULL DEFAULT 'not_started',
    "accountStatus" "CompanyAccountStatus" NOT NULL DEFAULT 'active',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "foundedYear" INTEGER,
    "employeeRange" VARCHAR(64),
    "primaryLocationId" UUID,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_members" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "membershipRole" "CompanyMemberRole" NOT NULL DEFAULT 'member',
    "status" "CompanyMemberStatus" NOT NULL DEFAULT 'pending',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "invitedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "company_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "companyId" UUID,
    "assignedById" UUID,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "scope" VARCHAR(48) NOT NULL,
    "parentId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "iso2" CHAR(2) NOT NULL,
    "iso3" CHAR(3) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "countryId" UUID NOT NULL,
    "parentId" UUID,
    "name" VARCHAR(160) NOT NULL,
    "type" VARCHAR(48) NOT NULL,
    "postalCode" VARCHAR(32),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_categories" (
    "companyId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "company_categories_pkey" PRIMARY KEY ("companyId","categoryId")
);

-- CreateTable
CREATE TABLE "company_countries" (
    "companyId" UUID NOT NULL,
    "countryId" UUID NOT NULL,
    "relationship" VARCHAR(48) NOT NULL,

    CONSTRAINT "company_countries_pkey" PRIMARY KEY ("companyId","countryId","relationship")
);

-- CreateTable
CREATE TABLE "business_requests" (
    "id" UUID NOT NULL,
    "referenceNumber" VARCHAR(40) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "description" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'draft',
    "priority" "RequestPriority" NOT NULL DEFAULT 'medium',
    "companyId" UUID NOT NULL,
    "creatorId" UUID NOT NULL,
    "categoryId" UUID,
    "sourceCountryId" UUID,
    "destinationCountryId" UUID,
    "locationId" UUID,
    "quantityValue" DECIMAL(18,4),
    "quantityUnit" VARCHAR(48),
    "quantityFrequency" VARCHAR(48),
    "budgetMin" DECIMAL(18,4),
    "budgetMax" DECIMAL(18,4),
    "budgetCurrencyCode" CHAR(3),
    "budgetUnit" VARCHAR(48),
    "timeline" VARCHAR(120),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "marketplaceStatus" "MarketplaceRequestStatus" NOT NULL DEFAULT 'not_requested',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "business_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_status_history" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "fromStatus" "RequestStatus",
    "toStatus" "RequestStatus" NOT NULL,
    "reason" TEXT,
    "changedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_assignments" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "teamMemberId" UUID,
    "assignedById" UUID,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    "reason" TEXT,

    CONSTRAINT "request_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_admin_notes" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "request_admin_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "uploaderId" UUID NOT NULL,
    "companyId" UUID,
    "resourceType" "DocumentResourceType" NOT NULL,
    "resourceId" UUID NOT NULL,
    "documentType" VARCHAR(64) NOT NULL,
    "originalFileName" VARCHAR(255) NOT NULL,
    "safeFileName" VARCHAR(255) NOT NULL,
    "contentType" VARCHAR(120) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "checksumSha256" CHAR(64),
    "storageKey" TEXT NOT NULL,
    "storageProvider" VARCHAR(48) NOT NULL,
    "scanStatus" "DocumentScanStatus" NOT NULL DEFAULT 'pending',
    "reviewStatus" "DocumentReviewStatus" NOT NULL DEFAULT 'pending',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retentionUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_documents" (
    "requestId" UUID NOT NULL,
    "documentId" UUID NOT NULL,

    CONSTRAINT "request_documents_pkey" PRIMARY KEY ("requestId","documentId")
);

-- CreateTable
CREATE TABLE "company_verifications" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "status" "CompanyVerificationStatus" NOT NULL DEFAULT 'not_started',
    "submittedById" UUID,
    "assignedReviewerId" UUID,
    "decisionById" UUID,
    "submittedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "decisionReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "company_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_checklist_items" (
    "id" UUID NOT NULL,
    "verificationId" UUID NOT NULL,
    "itemKey" VARCHAR(64) NOT NULL,
    "status" "VerificationChecklistStatus" NOT NULL DEFAULT 'pending',
    "reviewerId" UUID,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_document_reviews" (
    "id" UUID NOT NULL,
    "verificationId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "decision" "VerificationDocumentDecision" NOT NULL DEFAULT 'replacement_requested',
    "reviewerId" UUID NOT NULL,
    "note" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_document_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_listings" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "publicTitle" VARCHAR(240) NOT NULL,
    "publicSummary" TEXT NOT NULL,
    "publicationStatus" "MarketplaceListingStatus" NOT NULL DEFAULT 'draft',
    "publicFields" JSONB NOT NULL,
    "viewsCount" BIGINT NOT NULL DEFAULT 0,
    "interestsCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "moderatedById" UUID,
    "moderationReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "marketplace_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_interests" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "inquiryId" UUID NOT NULL,
    "submittedByUserId" UUID,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "marketplace_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" UUID NOT NULL,
    "inquiryNumber" VARCHAR(40) NOT NULL,
    "source" "InquirySource" NOT NULL,
    "inquiryType" "InquiryType" NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'new',
    "senderUserId" UUID,
    "senderName" VARCHAR(160) NOT NULL,
    "senderEmail" VARCHAR(254) NOT NULL,
    "senderPhone" VARCHAR(40),
    "companyId" UUID,
    "relatedListingId" UUID,
    "relatedCompanyId" UUID,
    "relatedProductId" UUID,
    "message" TEXT NOT NULL,
    "assignedToId" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_activities" (
    "id" UUID NOT NULL,
    "inquiryId" UUID NOT NULL,
    "activityType" VARCHAR(48) NOT NULL,
    "body" TEXT,
    "fromStatus" "InquiryStatus",
    "toStatus" "InquiryStatus",
    "actorId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiry_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technology_products" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "providerCompanyId" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "categoryId" UUID NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "targetUsers" JSONB NOT NULL,
    "useCases" JSONB NOT NULL,
    "implementationSteps" JSONB NOT NULL,
    "faq" JSONB NOT NULL,
    "pricingNote" TEXT NOT NULL,
    "status" "TechnologyProductStatus" NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "technology_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_requests" (
    "id" UUID NOT NULL,
    "inquiryId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "businessType" VARCHAR(80) NOT NULL,
    "preferredDemoTime" TIMESTAMP(3),
    "existingSystem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "demo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "body" TEXT NOT NULL,
    "resourceType" VARCHAR(48),
    "resourceId" UUID,
    "readAt" TIMESTAMP(3),
    "deliveryStatus" "NotificationDeliveryStatus" NOT NULL DEFAULT 'pending',
    "dedupeKey" VARCHAR(180),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "preferences" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "actorRole" VARCHAR(64),
    "action" VARCHAR(100) NOT NULL,
    "resourceType" VARCHAR(64) NOT NULL,
    "resourceId" UUID,
    "companyId" UUID,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "reason" TEXT,
    "requestId" VARCHAR(80),
    "ipAddress" VARCHAR(64),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" UUID NOT NULL,
    "key" VARCHAR(180) NOT NULL,
    "scope" VARCHAR(120) NOT NULL,
    "actorUserId" UUID,
    "requestFingerprint" CHAR(64) NOT NULL,
    "status" "IdempotencyStatus" NOT NULL DEFAULT 'in_progress',
    "responseStatus" INTEGER,
    "responseJson" JSONB,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_emailVerifiedAt_idx" ON "users"("emailVerifiedAt");

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "companies_verificationStatus_idx" ON "companies"("verificationStatus");

-- CreateIndex
CREATE INDEX "companies_accountStatus_idx" ON "companies"("accountStatus");

-- CreateIndex
CREATE INDEX "companies_businessType_idx" ON "companies"("businessType");

-- CreateIndex
CREATE INDEX "companies_primaryLocationId_idx" ON "companies"("primaryLocationId");

-- CreateIndex
CREATE INDEX "company_members_companyId_status_idx" ON "company_members"("companyId", "status");

-- CreateIndex
CREATE INDEX "company_members_userId_status_idx" ON "company_members"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "company_members_companyId_userId_key" ON "company_members"("companyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "user_roles_userId_revokedAt_idx" ON "user_roles"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "user_roles_companyId_idx" ON "user_roles"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_companyId_key" ON "user_roles"("userId", "roleId", "companyId");

-- CreateIndex
CREATE INDEX "categories_scope_isActive_sortOrder_idx" ON "categories"("scope", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_scope_slug_key" ON "categories"("scope", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso2_key" ON "countries"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso3_key" ON "countries"("iso3");

-- CreateIndex
CREATE INDEX "countries_name_idx" ON "countries"("name");

-- CreateIndex
CREATE INDEX "locations_countryId_name_idx" ON "locations"("countryId", "name");

-- CreateIndex
CREATE INDEX "locations_parentId_idx" ON "locations"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "locations_countryId_parentId_name_type_key" ON "locations"("countryId", "parentId", "name", "type");

-- CreateIndex
CREATE INDEX "company_categories_categoryId_idx" ON "company_categories"("categoryId");

-- CreateIndex
CREATE INDEX "company_countries_countryId_idx" ON "company_countries"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "business_requests_referenceNumber_key" ON "business_requests"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "business_requests_slug_key" ON "business_requests"("slug");

-- CreateIndex
CREATE INDEX "business_requests_requestType_status_idx" ON "business_requests"("requestType", "status");

-- CreateIndex
CREATE INDEX "business_requests_status_priority_idx" ON "business_requests"("status", "priority");

-- CreateIndex
CREATE INDEX "business_requests_companyId_status_idx" ON "business_requests"("companyId", "status");

-- CreateIndex
CREATE INDEX "business_requests_creatorId_createdAt_idx" ON "business_requests"("creatorId", "createdAt");

-- CreateIndex
CREATE INDEX "business_requests_createdAt_idx" ON "business_requests"("createdAt");

-- CreateIndex
CREATE INDEX "business_requests_marketplaceStatus_idx" ON "business_requests"("marketplaceStatus");

-- CreateIndex
CREATE INDEX "request_status_history_requestId_createdAt_idx" ON "request_status_history"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "request_status_history_toStatus_idx" ON "request_status_history"("toStatus");

-- CreateIndex
CREATE UNIQUE INDEX "request_assignments_requestId_key" ON "request_assignments"("requestId");

-- CreateIndex
CREATE INDEX "request_assignments_teamMemberId_unassignedAt_idx" ON "request_assignments"("teamMemberId", "unassignedAt");

-- CreateIndex
CREATE INDEX "request_assignments_requestId_unassignedAt_idx" ON "request_assignments"("requestId", "unassignedAt");

-- CreateIndex
CREATE INDEX "request_admin_notes_requestId_createdAt_idx" ON "request_admin_notes"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "request_admin_notes_authorId_idx" ON "request_admin_notes"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "documents_storageKey_key" ON "documents"("storageKey");

-- CreateIndex
CREATE INDEX "documents_resourceType_resourceId_idx" ON "documents"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "documents_companyId_reviewStatus_idx" ON "documents"("companyId", "reviewStatus");

-- CreateIndex
CREATE INDEX "documents_scanStatus_reviewStatus_idx" ON "documents"("scanStatus", "reviewStatus");

-- CreateIndex
CREATE INDEX "request_documents_documentId_idx" ON "request_documents"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "company_verifications_companyId_key" ON "company_verifications"("companyId");

-- CreateIndex
CREATE INDEX "company_verifications_status_submittedAt_idx" ON "company_verifications"("status", "submittedAt");

-- CreateIndex
CREATE INDEX "company_verifications_assignedReviewerId_status_idx" ON "company_verifications"("assignedReviewerId", "status");

-- CreateIndex
CREATE INDEX "verification_checklist_items_verificationId_status_idx" ON "verification_checklist_items"("verificationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "verification_checklist_items_verificationId_itemKey_key" ON "verification_checklist_items"("verificationId", "itemKey");

-- CreateIndex
CREATE INDEX "verification_document_reviews_documentId_idx" ON "verification_document_reviews"("documentId");

-- CreateIndex
CREATE INDEX "verification_document_reviews_reviewerId_reviewedAt_idx" ON "verification_document_reviews"("reviewerId", "reviewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "verification_document_reviews_verificationId_documentId_key" ON "verification_document_reviews"("verificationId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_listings_requestId_key" ON "marketplace_listings"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_listings_slug_key" ON "marketplace_listings"("slug");

-- CreateIndex
CREATE INDEX "marketplace_listings_publicationStatus_publishedAt_idx" ON "marketplace_listings"("publicationStatus", "publishedAt");

-- CreateIndex
CREATE INDEX "marketplace_listings_companyId_publicationStatus_idx" ON "marketplace_listings"("companyId", "publicationStatus");

-- CreateIndex
CREATE INDEX "marketplace_listings_expiresAt_idx" ON "marketplace_listings"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "marketplace_interests_inquiryId_key" ON "marketplace_interests"("inquiryId");

-- CreateIndex
CREATE INDEX "marketplace_interests_listingId_createdAt_idx" ON "marketplace_interests"("listingId", "createdAt");

-- CreateIndex
CREATE INDEX "marketplace_interests_submittedByUserId_idx" ON "marketplace_interests"("submittedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "inquiries_inquiryNumber_key" ON "inquiries"("inquiryNumber");

-- CreateIndex
CREATE INDEX "inquiries_status_source_idx" ON "inquiries"("status", "source");

-- CreateIndex
CREATE INDEX "inquiries_assignedToId_status_idx" ON "inquiries"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "inquiries_companyId_idx" ON "inquiries"("companyId");

-- CreateIndex
CREATE INDEX "inquiries_createdAt_idx" ON "inquiries"("createdAt");

-- CreateIndex
CREATE INDEX "inquiry_activities_inquiryId_createdAt_idx" ON "inquiry_activities"("inquiryId", "createdAt");

-- CreateIndex
CREATE INDEX "inquiry_activities_activityType_idx" ON "inquiry_activities"("activityType");

-- CreateIndex
CREATE UNIQUE INDEX "technology_products_slug_key" ON "technology_products"("slug");

-- CreateIndex
CREATE INDEX "technology_products_providerCompanyId_status_idx" ON "technology_products"("providerCompanyId", "status");

-- CreateIndex
CREATE INDEX "technology_products_categoryId_status_idx" ON "technology_products"("categoryId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "demo_requests_inquiryId_key" ON "demo_requests"("inquiryId");

-- CreateIndex
CREATE INDEX "demo_requests_productId_createdAt_idx" ON "demo_requests"("productId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_dedupeKey_key" ON "notifications"("dedupeKey");

-- CreateIndex
CREATE INDEX "notifications_userId_readAt_idx" ON "notifications"("userId", "readAt");

-- CreateIndex
CREATE INDEX "notifications_deliveryStatus_createdAt_idx" ON "notifications"("deliveryStatus", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_resourceType_resourceId_createdAt_idx" ON "audit_logs"("resourceType", "resourceId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_actorUserId_createdAt_idx" ON "audit_logs"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_companyId_createdAt_idx" ON "audit_logs"("companyId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_requestId_idx" ON "audit_logs"("requestId");

-- CreateIndex
CREATE INDEX "idempotency_keys_actorUserId_idx" ON "idempotency_keys"("actorUserId");

-- CreateIndex
CREATE INDEX "idempotency_keys_expiresAt_idx" ON "idempotency_keys"("expiresAt");

-- CreateIndex
CREATE INDEX "idempotency_keys_status_idx" ON "idempotency_keys"("status");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_scope_key_key" ON "idempotency_keys"("scope", "key");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_primaryLocationId_fkey" FOREIGN KEY ("primaryLocationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_categories" ADD CONSTRAINT "company_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_categories" ADD CONSTRAINT "company_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_countries" ADD CONSTRAINT "company_countries_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_countries" ADD CONSTRAINT "company_countries_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_requests" ADD CONSTRAINT "business_requests_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_requests" ADD CONSTRAINT "business_requests_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_requests" ADD CONSTRAINT "business_requests_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_requests" ADD CONSTRAINT "business_requests_sourceCountryId_fkey" FOREIGN KEY ("sourceCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_requests" ADD CONSTRAINT "business_requests_destinationCountryId_fkey" FOREIGN KEY ("destinationCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_requests" ADD CONSTRAINT "business_requests_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_status_history" ADD CONSTRAINT "request_status_history_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "business_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_status_history" ADD CONSTRAINT "request_status_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_assignments" ADD CONSTRAINT "request_assignments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "business_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_assignments" ADD CONSTRAINT "request_assignments_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_assignments" ADD CONSTRAINT "request_assignments_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_admin_notes" ADD CONSTRAINT "request_admin_notes_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "business_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_admin_notes" ADD CONSTRAINT "request_admin_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_documents" ADD CONSTRAINT "request_documents_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "business_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_documents" ADD CONSTRAINT "request_documents_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_verifications" ADD CONSTRAINT "company_verifications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_verifications" ADD CONSTRAINT "company_verifications_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_verifications" ADD CONSTRAINT "company_verifications_assignedReviewerId_fkey" FOREIGN KEY ("assignedReviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_verifications" ADD CONSTRAINT "company_verifications_decisionById_fkey" FOREIGN KEY ("decisionById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_checklist_items" ADD CONSTRAINT "verification_checklist_items_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "company_verifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_checklist_items" ADD CONSTRAINT "verification_checklist_items_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_document_reviews" ADD CONSTRAINT "verification_document_reviews_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "company_verifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_document_reviews" ADD CONSTRAINT "verification_document_reviews_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_document_reviews" ADD CONSTRAINT "verification_document_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "business_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_interests" ADD CONSTRAINT "marketplace_interests_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "marketplace_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_interests" ADD CONSTRAINT "marketplace_interests_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_interests" ADD CONSTRAINT "marketplace_interests_submittedByUserId_fkey" FOREIGN KEY ("submittedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_relatedListingId_fkey" FOREIGN KEY ("relatedListingId") REFERENCES "marketplace_listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_relatedCompanyId_fkey" FOREIGN KEY ("relatedCompanyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_relatedProductId_fkey" FOREIGN KEY ("relatedProductId") REFERENCES "technology_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_activities" ADD CONSTRAINT "inquiry_activities_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_activities" ADD CONSTRAINT "inquiry_activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology_products" ADD CONSTRAINT "technology_products_providerCompanyId_fkey" FOREIGN KEY ("providerCompanyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology_products" ADD CONSTRAINT "technology_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_requests" ADD CONSTRAINT "demo_requests_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "inquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demo_requests" ADD CONSTRAINT "demo_requests_productId_fkey" FOREIGN KEY ("productId") REFERENCES "technology_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idempotency_keys" ADD CONSTRAINT "idempotency_keys_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
