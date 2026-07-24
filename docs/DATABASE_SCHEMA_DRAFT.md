# TradeConnect PostgreSQL Database Schema Draft

Planning document and Phase 2 implementation contract. The implemented foundation uses PostgreSQL on Neon, Prisma ORM v7, UUID identifiers, and UTC timestamps. The first migration remains pending until a safe `DIRECT_URL` is configured.

## Phase 2 implementation decisions

- Runtime uses pooled `DATABASE_URL` through `@prisma/adapter-neon`; Prisma CLI migration/schema operations use direct `DIRECT_URL` from `prisma.config.ts`.
- The generated Prisma client is written to `src/generated/prisma`; application code reaches it only through `src/server/db`.
- Stable workflow values use Prisma enums and exact canonical spellings. Categories, countries, locations, roles, and permissions remain lookup tables.
- Phase 3A adds Better Auth's `auth_sessions`, `auth_accounts`, `auth_verifications`, and `auth_rate_limits` tables. Password hashes belong only in `auth_accounts.password`; `users` remains the canonical profile table and has no password field.
- OAuth, password reset, and delivered email-verification workflows remain deferred.

## Design conventions

- Primary keys are `uuid` or ULID-compatible `text`; the final choice must be consistent across the service. This draft uses `uuid` for clarity.
- Every durable table has `id`, `created_at timestamptz not null`, and `updated_at timestamptz not null`. `deleted_at timestamptz null` is added only where soft deletion is useful.
- User-facing statuses are application-level constrained strings backed by server runtime validators and database `CHECK` constraints during the first release. Use PostgreSQL enums only for values that are extremely stable and queried heavily; lookup tables are preferred for categories, countries, locations, permissions, and future admin-configurable values.
- Financial quantities should use `numeric(18,4)` plus an explicit `currency_code char(3)` and unit fields. Do not store human-readable budget strings as the canonical value.
- All foreign keys should use `ON DELETE RESTRICT` for business records. Use `ON DELETE CASCADE` only for private dependent records that have no independent audit value, such as membership invitations after a company is deleted.
- Unique constraints should be scoped with partial indexes where soft deletion is present, e.g. unique active company slug.
- Audit events are append-only. Domain tables should also store actor IDs for mutations where the actor is part of the business record.

## Serverless PostgreSQL recommendation

Use managed PostgreSQL with a serverless-compatible pooled connection strategy. Candidate providers may include Neon, Supabase Postgres, or another managed PostgreSQL service with a pooled/serverless driver. This is a planning comparison, not a provider selection:

| Option | Strengths | Tradeoffs to verify |
| --- | --- | --- |
| Neon/serverless Postgres | Branching/preview-friendly workflows, pooled connections, PostgreSQL compatibility | Branch lifecycle, provider limits, region/latency, storage/compute pricing |
| Supabase Postgres | Managed database plus optional auth/storage ecosystem and familiar tooling | Decide whether to use only Postgres or additional Supabase services; connection/policy model must remain clear |
| Managed traditional Postgres with pooler | Mature operational controls and portability | Requires a compatible pooler/proxy and careful serverless connection sizing |

Recommendation: select a provider with pooled connections, separate development/preview/staging/production databases, automated backups, point-in-time recovery, TLS, metrics, and migration-friendly direct PostgreSQL access. Reuse a server-only client/pool module; never open an uncontrolled new pool for every invocation. Keep preview data isolated from production and run migrations as a controlled deployment step, not during a user request.

For data access, a typed ORM such as Drizzle or Prisma can improve schema/type ergonomics; a query builder or parameterized SQL can reduce abstraction and bundle overhead. Choose based on Node.js/Vercel compatibility, migration review, transaction support, query observability, connection behavior, and team expertise. Whichever approach is selected, repositories own database access and services own transaction boundaries.

## Common lookup strategy

`roles`, `permissions`, `categories`, `countries`, and `locations` are lookup tables with stable slugs/codes, display names, active flags, and sort order. Their values are admin-managed or seed-managed, so a new category/country does not require a database enum migration. Workflow states (`request_status`, `verification_status`, `listing_status`, `inquiry_status`) use application-level constrained strings plus transition-service validation and `CHECK` constraints.

## Core identity and authorization tables

| Table | Columns and requiredness | PK/FK and unique constraints | Indexes | Soft delete / audit |
| --- | --- | --- | --- | --- |
| `users` | `id uuid`; `email citext not null`; `password_hash text null`; `full_name varchar(160) not null`; `phone varchar(40) null`; `email_verified_at timestamptz null`; `status varchar(32) not null default 'active'`; `last_login_at timestamptz null`; timestamps | PK `id`; unique active `email` | email; status; email_verified_at | `deleted_at`; audit registration, profile, status, login/security events |
| `roles` | `id uuid`; `slug varchar(64) not null`; `name varchar(120) not null`; `description text null`; `is_system boolean not null` | PK; unique slug | active/system if added | No routine soft delete for system roles; audit admin changes |
| `permissions` | `id uuid`; `slug varchar(100) not null`; `description text null` | PK; unique slug | slug | No routine soft delete; audit changes |
| `role_permissions` | `role_id uuid not null`; `permission_id uuid not null`; timestamps | Composite PK; FKs to roles/permissions | permission_id | No soft delete; audit grant/revoke |
| `user_roles` | `user_id uuid not null`; `role_id uuid not null`; `company_id uuid null`; `assigned_by uuid null`; `assigned_at timestamptz not null` | Composite/association PK; FKs users, roles, companies, users(assigner) | user_id; role_id; company_id | `revoked_at` rather than delete; audit assignment/revocation |
| `sessions` | `id uuid`; `user_id uuid not null`; `refresh_token_hash text not null`; `expires_at timestamptz not null`; `revoked_at timestamptz null`; `ip inet null`; `user_agent text null` | PK; FK user; unique token hash | user_id/expires_at; token hash | No soft delete; audit create/revoke/reuse |
| `email_verification_tokens` | `id uuid`; `user_id uuid not null`; `token_hash text not null`; `expires_at timestamptz not null`; `used_at timestamptz null` | PK; FK user; unique token hash | user_id; expires_at; token hash | No soft delete; audit issuance/use |
| `password_reset_tokens` | Same shape as verification tokens plus `requested_ip inet null` | PK; FK user; unique token hash | user_id; expires_at | No soft delete; audit issuance/use |

## Company and reference tables

| Table | Columns and requiredness | PK/FK and unique constraints | Indexes | Soft delete / audit |
| --- | --- | --- | --- | --- |
| `companies` | `id uuid`; `slug varchar(180) not null`; `legal_name varchar(240) not null`; `display_name varchar(240) not null`; `business_type varchar(64) not null`; `description text null`; `website text null`; `verification_status varchar(32) not null default 'not_started'`; `account_status varchar(32) not null default 'active'`; `is_featured boolean not null default false`; `founded_year smallint null`; `employee_range varchar(64) null`; `primary_location_id uuid null`; timestamps | PK; unique active slug; FK location | slug; verification_status; account_status; business_type; primary_location_id | `deleted_at`; audit profile, suspension, feature, verification |
| `company_members` | `id uuid`; `company_id uuid not null`; `user_id uuid not null`; `membership_role varchar(48) not null`; `status varchar(32) not null`; `is_primary boolean not null default false`; `invited_by uuid null`; timestamps | PK; FKs company/user/inviter; unique active `(company_id,user_id)` | company_id/status; user_id/status | `deleted_at`; audit invite, accept, role/status changes |
| `company_invitations` | `id uuid`; `company_id uuid not null`; `email citext not null`; `role varchar(48) not null`; `token_hash text not null`; `expires_at timestamptz not null`; `accepted_at timestamptz null`; `invited_by uuid not null` | PK; FKs; unique active token hash | email; company_id/status; expires_at | `deleted_at`; audit invite/accept/expire |
| `categories` | `id uuid`; `slug varchar(120) not null`; `name varchar(160) not null`; `parent_id uuid null`; `scope varchar(48) not null`; `is_active boolean not null`; `sort_order int not null` | PK; unique `(scope,slug)`; self FK parent | scope/active/sort; parent_id | `deleted_at`; audit taxonomy changes |
| `countries` | `id uuid`; `iso2 char(2) not null`; `iso3 char(3) not null`; `name varchar(120) not null`; `is_active boolean not null` | PK; unique iso2, iso3 | name; active | Usually no delete; audit status |
| `locations` | `id uuid`; `country_id uuid not null`; `parent_id uuid null`; `name varchar(160) not null`; `type varchar(48) not null`; `postal_code varchar(32) null`; `is_active boolean not null` | PK; FKs country/self; unique normalized country/parent/name/type | country_id/name; parent_id | `deleted_at`; audit reference changes |
| `company_categories` | `company_id uuid not null`; `category_id uuid not null`; `is_primary boolean not null default false` | Composite PK; FKs | category_id/company_id | No soft delete needed; audit association changes |
| `company_countries` | `company_id uuid not null`; `country_id uuid not null`; `relationship varchar(48) not null` | Composite PK; FKs | country_id; company_id | No soft delete; audit changes |

## Requests and operations tables

| Table | Columns and requiredness | PK/FK and unique constraints | Indexes | Soft delete / audit |
| --- | --- | --- | --- | --- |
| `business_requests` | `id uuid`; `reference_number varchar(40) not null`; `slug varchar(180) not null`; `title varchar(240) not null`; `description text not null`; `request_type varchar(32) not null`; `status varchar(32) not null`; `priority varchar(16) not null`; `company_id uuid not null`; `user_id uuid not null`; `category_id uuid null`; `source_country_id uuid null`; `destination_country_id uuid null`; `location_id uuid null`; structured `quantity jsonb null`; structured `budget_range jsonb null`; `timeline varchar(120) null`; `is_public boolean not null default false`; `marketplace_status varchar(32) not null default 'not_requested'`; `version int not null default 1`; timestamps | PK; unique reference/slug; FKs company/user/category/countries/location | company/status; type/status; priority; created_at; marketplace_status; reference | `deleted_at`; every mutation audited |
| `request_status_history` | `id uuid`; `request_id uuid not null`; `from_status varchar(32) null`; `to_status varchar(32) not null`; `reason text null`; `changed_by uuid not null`; `created_at timestamptz not null` | PK; FKs request/user | request_id/created_at; to_status | No soft delete; append-only audit source |
| `request_assignments` | `id uuid`; `request_id uuid not null`; `team_member_id uuid null`; `assigned_by uuid not null`; `assigned_at timestamptz not null`; `unassigned_at timestamptz null`; `reason text null` | PK; FKs request/user; one active assignment partial unique on request_id | request_id/active; team_member_id/active | No hard delete; append-only assignment history |
| `request_admin_notes` | `id uuid`; `request_id uuid not null`; `author_id uuid not null`; `body text not null`; timestamps | PK; FKs request/user | request_id/created_at; author_id | `deleted_at` only for redaction; deletion audited |
| `request_documents` | `request_id uuid not null`; `document_id uuid not null` | Composite PK; FKs | document_id | Association removal audited |

## Documents and verification tables

| Table | Columns and requiredness | PK/FK and unique constraints | Indexes | Soft delete / audit |
| --- | --- | --- | --- | --- |
| `documents` | `id uuid`; `owner_user_id uuid not null`; `company_id uuid null`; `resource_type varchar(48) not null`; `resource_id uuid not null`; `document_type varchar(64) not null`; `original_file_name varchar(255) not null`; `safe_file_name varchar(255) not null`; `content_type varchar(120) not null`; `size_bytes bigint not null`; `checksum_sha256 char(64) null`; `storage_key text not null`; `storage_provider varchar(48) not null`; `scan_status varchar(32) not null`; `review_status varchar(32) not null`; `uploaded_at timestamptz not null`; `retention_until timestamptz null` | PK; FKs user/company; unique storage key; optional unique checksum per owner/resource | resource_type/resource_id; company_id; scan_status; review_status; created_at | `deleted_at`; upload/download/review/deletion audit |
| `company_verifications` | `id uuid`; `company_id uuid not null`; `status varchar(32) not null`; `submitted_by uuid null`; `assigned_reviewer_id uuid null`; `submitted_at timestamptz null`; `decided_at timestamptz null`; `decision_reason text null`; `version int not null default 1`; timestamps | PK; FK company/users; one active case per company partial unique | status; reviewer/status; submitted_at; company_id | `deleted_at` only for duplicate cases; decisions audited |
| `verification_checklist_items` | `id uuid`; `verification_id uuid not null`; `item_key varchar(64) not null`; `status varchar(32) not null`; `reviewer_id uuid null`; `note text null`; timestamps | PK; FK verification/user; unique `(verification_id,item_key)` | verification_id/status | No routine soft delete; each decision audited |
| `verification_document_reviews` | `id uuid`; `verification_id uuid not null`; `document_id uuid not null`; `decision varchar(32) not null`; `reviewer_id uuid not null`; `note text null`; `reviewed_at timestamptz not null` | PK; FKs; unique current review `(verification_id,document_id)` | verification_id; document_id/status | Keep history in `audit_logs`; no destructive update without event |

## Marketplace, inquiry, and product tables

| Table | Columns and requiredness | PK/FK and unique constraints | Indexes | Soft delete / audit |
| --- | --- | --- | --- | --- |
| `marketplace_listings` | `id uuid`; `request_id uuid not null`; `company_id uuid not null`; `slug varchar(180) not null`; `public_title varchar(240) not null`; `public_summary text not null`; `publication_status varchar(32) not null`; `public_fields jsonb not null`; `views_count bigint not null default 0`; `interests_count int not null default 0`; `published_at timestamptz null`; `expires_at timestamptz null`; `moderated_by uuid null`; `moderation_reason text null`; `version int not null default 1`; timestamps | PK; unique active slug; unique one active listing per request; FKs request/company/user | status/category through projection or request; published_at; expires_at; company_id | `deleted_at`; publish/edit/action audited |
| `marketplace_interests` | `id uuid`; `listing_id uuid not null`; `inquiry_id uuid not null`; `submitted_by_user_id uuid null`; `message text null`; timestamps | PK; FKs listing/inquiry/user; optional duplicate protection per inquiry/listing | listing_id/created_at; inquiry_id | `deleted_at` only for spam/redaction; audit |
| `inquiries` | `id uuid`; `inquiry_number varchar(40) not null`; `source varchar(48) not null`; `inquiry_type varchar(48) not null`; `status varchar(32) not null`; `sender_user_id uuid null`; `sender_name varchar(160) not null`; `sender_email citext not null`; `sender_phone varchar(40) null`; `company_id uuid null`; `related_listing_id uuid null`; `related_company_id uuid null`; `related_product_id uuid null`; `message text not null`; `assigned_to uuid null`; `version int not null default 1`; timestamps | PK; unique inquiry number; FKs user/company/listing/product/assignee | status/source; assigned_to/status; company_id; created_at | `deleted_at`; creation/status/assignment/activity audited |
| `inquiry_activities` | `id uuid`; `inquiry_id uuid not null`; `activity_type varchar(48) not null`; `body text null`; `from_status varchar(32) null`; `to_status varchar(32) null`; `actor_id uuid null`; `created_at timestamptz not null` | PK; FKs inquiry/user | inquiry_id/created_at; activity_type | Append-only; audit event may reference it |
| `technology_products` | `id uuid`; `slug varchar(180) not null`; `provider_company_id uuid not null`; `name varchar(200) not null`; `category_id uuid not null`; `short_description text not null`; `description text not null`; `problem text not null`; `features jsonb not null`; `target_users jsonb not null`; `use_cases jsonb not null`; `implementation_steps jsonb not null`; `faq jsonb not null`; `pricing_note text not null`; `status varchar(32) not null`; timestamps | PK; unique active slug; FKs provider/category | slug; provider/status; category_id | `deleted_at`; product publish/edit audited |
| `demo_requests` | `id uuid`; `inquiry_id uuid not null`; `product_id uuid not null`; `business_type varchar(80) not null`; `preferred_demo_time timestamptz null`; `existing_system text null` | PK; unique inquiry_id; FKs inquiry/product | product_id/created_at | `deleted_at`; creation/status through inquiry audited |

## Notifications and audit tables

| Table | Columns and requiredness | PK/FK and unique constraints | Indexes | Soft delete / audit |
| --- | --- | --- | --- | --- |
| `notifications` | `id uuid`; `user_id uuid not null`; `type varchar(64) not null`; `title varchar(240) not null`; `body text not null`; `resource_type varchar(48) null`; `resource_id uuid null`; `read_at timestamptz null`; `delivery_status varchar(32) not null`; `dedupe_key varchar(180) null`; timestamps | PK; FK user; unique active dedupe key where required | user_id/read_at; delivery_status; created_at | `deleted_at`; delivery attempts audited or logged |
| `notification_preferences` | `id uuid`; `user_id uuid not null`; `event_type varchar(64) not null`; `email_enabled boolean not null`; `in_app_enabled boolean not null`; timestamps | PK; FK user; unique user/event | user_id | No soft delete; preference changes audited |
| `audit_logs` | `id uuid`; `actor_user_id uuid null`; `actor_role varchar(64) null`; `action varchar(100) not null`; `resource_type varchar(64) not null`; `resource_id uuid null`; `company_id uuid null`; `before_json jsonb null`; `after_json jsonb null`; `reason text null`; `request_id varchar(80) null`; `ip inet null`; `user_agent text null`; `created_at timestamptz not null` | PK; FKs user/company; no business unique constraint | resource_type/resource_id/created_at; actor/created_at; company/created_at; action; request_id | Append-only, no update/delete in application |
| `idempotency_keys` | `id uuid`; `key varchar(180) not null`; `scope varchar(120) not null`; `actor_user_id uuid null`; `request_fingerprint char(64) not null`; `status varchar(32) not null`; `response_status smallint null`; `response_json jsonb null`; `expires_at timestamptz not null`; timestamps | PK; FK user; unique `(scope,key)` | scope/key; actor; expires_at; status | No soft delete; expiry cleanup audited/observable |

## Normalization and indexing notes

1. Keep request status history, inquiry activities, assignments, document reviews, notifications, and audit logs append-oriented so timelines remain explainable.
2. Use GIN indexes only where JSONB is genuinely queried; normalize categories, countries, locations, and relation tables instead of hiding searchable data inside JSON.
3. Add full-text or trigram indexes for company/listing/request/product search after measuring requirements. Do not introduce search infrastructure in the first migration unless query volume requires it.
4. Use partial indexes for active records (`WHERE deleted_at IS NULL`) and active assignments/listings.
5. Use transactions for request transitions, verification decisions, marketplace actions, suspension, and assignment. Publish events through an outbox or transactionally reliable queue.

## Ownership and public/private classification

The table rows above define columns, keys, indexes, soft-delete, and audit behavior. This matrix makes the ownership and exposure rule explicit for every table:

| Table(s) | Owner/scope rule | Classification |
| --- | --- | --- |
| `users`, `sessions`, `email_verification_tokens`, `password_reset_tokens`, `notifications`, `notification_preferences` | User ID; only the user or authorized security/admin service may access | Private; never public |
| `roles`, `permissions`, `role_permissions`, `user_roles` | Platform/company administration; scoped by assigned company where applicable | Private authorization data |
| `companies`, `company_categories`, `company_countries` | Company membership for writes; platform admin for moderation | Public projection for approved profile fields; full row private |
| `company_members`, `company_invitations` | Company owner/admin and invited user | Private |
| `categories`, `countries`, `locations` | Platform reference-data administration | Public active reference values; admin metadata private |
| `business_requests`, `request_status_history`, `request_assignments`, `request_admin_notes`, `request_documents` | Owning company/user; team/admin scope for operations | Request summary may become public only through a separate listing; history/assignments/notes private |
| `documents`, `verification_document_reviews` | Uploader/resource owner/reviewer by related entity | Private; public only via explicitly approved derivative/projection |
| `company_verifications`, `verification_checklist_items` | Company case and assigned reviewer | Private; only safe verification status may be public |
| `marketplace_listings` | Owning request/company; moderation team controls publication | Public projection fields only when published; moderation/request relation private |
| `marketplace_interests`, `inquiries`, `inquiry_activities`, `demo_requests` | Sender/owner company plus assigned team/admin | Public submission confirmation only; message/contact/activity private |
| `technology_products` | Provider company/admin | Approved catalogue fields public; draft/provider management fields private |
| `audit_logs`, `idempotency_keys` | Platform service and actor/resource scope | Private operational/security records; append-only |

All ownership checks happen in server services/queries before serialization. A database foreign key alone is not an authorization rule.

## Migration sequence and seed data

Create migrations in dependency order: identity → roles/permissions → reference data → companies/memberships → documents → requests/operations → verification → products/listings → inquiries/interests → notifications → audit/reporting indexes. Seed system roles/permissions, Bangladesh-connected categories/countries/locations, and no real user/contact data. Mock frontend records may be imported only through an explicit development seed script, never as production defaults.

## Open schema decisions

- UUID versus ULID implementation and database extension policy.
- Whether `users.email` uses PostgreSQL `citext` or normalized lowercase text.
- Exact membership roles versus global roles plus company-scoped assignments.
- S3-compatible provider, scan provider, retention period, and legal holds.
- Whether analytics use live queries, materialized views, or an external warehouse.
- Whether budget/quantity require a shared measurement table or typed JSONB during the first release.
- Whether idempotency responses are stored in PostgreSQL only or paired with a short-lived Redis accelerator; PostgreSQL remains the source of truth.
