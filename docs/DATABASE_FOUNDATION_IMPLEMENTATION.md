# TradeConnect Database Foundation Implementation

## Scope and status

This document records Phase 2 only. The foundation is implemented, but the initial migration and live seed/smoke run are pending a safe development Neon database configuration. No credentials are stored, printed, or committed.

## Stack and package versions

- PostgreSQL managed by Neon.
- Prisma ORM/client `7.9.0`.
- `@prisma/adapter-neon` `7.9.0` with the pooled runtime `DATABASE_URL`.
- Node.js `v22.12.0` and TypeScript `5.9.3`.
- `tsx` and `dotenv` are development-only CLI support packages.

## Files

Created: `prisma/schema.prisma`, `prisma/seed.ts`, `prisma.config.ts`, `scripts/db-smoke.ts`, `.env.example`, `src/server/db/client.ts`, `health.ts`, `transaction.ts`, `types.ts`, `README.md`, and `src/app/api/v1/health/ready/route.ts`.

Modified: `package.json`, `package-lock.json`, `src/server/config/env.ts`, error contracts, and the database/API/serverless/integration planning documents.

`src/generated/prisma` is generated output and must never be hand-edited.

## Models

`User`, `Company`, `CompanyMember`, `Role`, `Permission`, `RolePermission`, `UserRole`, `Category`, `Country`, `Location`, `CompanyCategory`, `CompanyCountry`, `BusinessRequest`, `RequestStatusHistory`, `RequestAssignment`, `RequestAdminNote`, `Document`, `RequestDocument`, `CompanyVerification`, `VerificationChecklistItem`, `VerificationDocumentReview`, `MarketplaceListing`, `MarketplaceInterest`, `Inquiry`, `InquiryActivity`, `TechnologyProduct`, `DemoRequest`, `Notification`, `NotificationPreference`, `AuditLog`, and `IdempotencyKey`.

There are no provider-specific authentication tables. `User` intentionally has no password storage in this phase.

## Enums

`UserStatus`, `CompanyMemberStatus`, `CompanyMemberRole`, `CompanyVerificationStatus`, `CompanyAccountStatus`, `RequestType`, `RequestStatus`, `RequestPriority`, `MarketplaceRequestStatus`, `MarketplaceListingStatus`, `DocumentResourceType`, `DocumentScanStatus`, `DocumentReviewStatus`, `VerificationChecklistStatus`, `VerificationDocumentDecision`, `InquirySource`, `InquiryType`, `InquiryStatus`, `TechnologyProductStatus`, `NotificationDeliveryStatus`, and `IdempotencyStatus`.

Request and inquiry values exactly match the frozen frontend contract. Request marketplace state and listing publication state remain separate.

## Relationship and deletion decisions

Business records, status history, assignments, notes, verification records, documents, listings, inquiries, interests, products, and their history use `Restrict` where deleting a parent could erase business history. Optional actor/reviewer/assignee links use `SetNull`, preserving the domain record if a user is later removed. Association rows are also restricted so an audit trail cannot be detached accidentally. Soft deletion is present only on entities where recovery/redaction or archival is useful; audit logs are append-only and have no delete path.

`RequestAssignment` is the current assignment boundary (`requestId` unique); assignment changes must later be written to the audit log. A future migration may add an append-only assignment-history table if operations require historical assignment reporting.

## Constraints and indexes

UUID primary keys, unique normalized-at-application email, company/product/listing slugs, role and permission slugs, country ISO2/ISO3 codes, request references/slugs, membership pairs, role-permission pairs, verification case per company, listing per request, inquiry number, document storage key, notification dedupe key, and idempotency scope/key are enforced. Operational indexes cover request type/status/priority/company/creator/date, verification status/reviewer, listing publication/company/date, inquiry status/assignee/date, document owner/status, notification user/read status, and audit actor/resource/time.

Prisma does not express a partial unique index for active soft-deleted rows in the schema DSL; the current design uses globally unique slugs/keys. Any future partial-index optimization must be an explicit reviewed SQL migration.

## Money, quantity, and references

Requests use `Decimal(18,4)` range fields, ISO currency codes, and explicit quantity units. API serializers must convert Prisma Decimal values to strings. `referenceNumber` is separate from the UUID and is unique; a future request service must generate an opaque, collision-safe reference with a database uniqueness retry rather than a counter or record count.

## Seed

The seed is idempotent. Stable seed data includes 6 roles, 12 permissions, 11 categories, 8 countries, 6 Bangladesh city locations, and 4 clearly marked development technology catalogue records anchored to a demo provider company. It completed successfully against the aligned development branch. `SEED_DEMO_DATA=true` only updates the already-marked demo fixture; it creates no users, passwords, real contacts, documents, or storage URLs.

## Health and readiness

`GET /api/v1/health` is liveness-only. `GET /api/v1/health/ready` is a Node.js, no-store route that runs `SELECT 1`, returns a safe 200 ready response, or a safe 503 `SERVICE_UNAVAILABLE` response. Request ID and timestamp are included; connection strings, hosts, raw Prisma errors, provider internals, and stacks are not returned. Local activation verification returned 200 for both liveness and readiness, with readiness reporting the database available.

## Migration status and deviations

**Phase 3A update (supersedes the earlier auth deferral below):** migration `20260724135836_add_auth_core` was reviewed and applied additively. It adds Better Auth session/account/verification/rate-limit tables, user verification/image fields, and a partial unique index for active platform-level role grants. See `AUTH_MIGRATION_REVIEW.md` and `BETTER_AUTH_SCHEMA_MAPPING.md`.

Migration `20260721190410_init_domain` was generated, inspected, and applied successfully to the configured direct Neon development branch. Prisma reported that branch up to date. The generated SQL contains 31 tables, 21 enums, 90 indexes, 67 foreign keys, three `Decimal(18,4)` columns, and no `ON DELETE CASCADE` clauses. The pooled runtime `DATABASE_URL` was subsequently aligned to the same branch; the seed and rollback-only smoke test completed successfully. The schema draft’s provider-neutral status strings are implemented as Prisma enums for the frozen stable lifecycle values. The draft’s auth-provider session/token tables and password hash are deferred to the authentication phase.

## Unresolved decisions

Authentication/session design, email normalization strategy (`citext` versus application normalization), storage and malware scanning provider, retention/legal hold policy, queue/outbox design, active-assignment history, and analytics materialization remain deferred. These are not blockers for the database boundary or authentication design phase, but must be decided before business APIs go live.
