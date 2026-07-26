# TradeConnect Next.js Full-Stack Integration Plan

This plan turns the current mock-only frontend into a production-ready full-stack Next.js B2B trade and business support platform without changing the existing information architecture unnecessarily.

## Phase 4A.3 private company profile consumer

The authenticated company profile consumer now uses the existing company service and PATCH contract. Owner/admin edits are server-authorized and version-checked; member-safe views omit contact and registration identifiers. Public company profiles, documents, verification review, and invitations remain later domains.

## Current boundary

Today, pages import static records from `src/data`, and interactive flows update local React state. `RoleGate` hides UI based on a mock user, but it is explicitly not a security boundary. The backend must become the source of truth for identity, ownership, verification, workflow state, documents, marketplace publication, inquiries, analytics, and audit history.

All route paths in this document are relative to the canonical `/api/v1` Route Handler tree unless a full path is shown.

## Temporary MVP deployment decision

`main` is the only active deployment branch. Vercel Production and optional Preview deployments temporarily share one persistent Neon main branch, with automatic Neon Preview Branching disabled. Deployments always run migrations, the production-safe canonical seed, and the Next.js build. Preview test data can affect the shared database; restore isolated staging resources before real customer production or destructive testing.

## Recommended system shape

| Concern | Backend responsibility | Frontend change |
| --- | --- | --- |
| Authentication | Session/token issuance, password or external identity provider, logout, recovery | Replace mock current user with `GET /api/v1/me` and auth client; keep loading/error states |
| Authorization | Server-enforced role, permission, company membership, ownership checks | Keep `RoleGate` for UX only; handle `401/403` from API |
| API | Thin Next.js Route Handlers under `src/app/api/v1` delegating to server services | Replace direct data imports with a typed API client/hooks |
| Database | Relational records, relationships, status history, notes, assignments, audit records | Map API DTOs into existing shared view models |
| Documents | Object storage, signed upload/download URLs, malware scanning, metadata | Replace upload placeholders with presigned upload flow and progress/error states |
| Notifications | Email/in-app notifications and event delivery | Add notification center, unread state, and action links |
| Analytics | Aggregated, permission-aware reporting queries | Replace static chart values with date-filtered API responses |
| Operations | Background jobs for review reminders, expiry, matching, indexing | Surface pending, retry, and stale-data states |

## Data domains

### Identity and access

Entities: `User`, `Role`, `Permission`, `Session`, `CompanyMembership`, `TeamMember`. A user may belong to one or more companies in the future; every request, inquiry, document, and note must have an owning company and actor metadata where applicable. Server-only auth, database, repository, service, validator, permission, storage, notification, and audit modules follow [`NEXTJS_SERVER_ARCHITECTURE.md`](./NEXTJS_SERVER_ARCHITECTURE.md).

### Companies and verification

Entities: `Company`, `CompanyContact`, `CompanyCategory`, `CompanyCountry`, `VerificationCase`, `VerificationChecklistItem`, `VerificationDocument`, `VerificationDecision`. Verification is an auditable workflow, not a boolean-only update.

### Business requests

Persist the existing `BusinessRequest` shape, but normalize fields into typed columns/relations:

- request identity/reference/slug and owning user/company;
- type, category, title, description, quantity, budget range, timeline;
- conditional source/destination/location fields;
- priority, status, public marketplace state;
- assigned team member;
- document references;
- status history and internal notes;
- created/updated timestamps and actor IDs.

### Marketplace

Keep private request data separate from a public `MarketplaceListing` projection. A listing should contain only explicitly approved public fields. Publication, pause, rejection, expiry, and removal should create audit events.

### Inquiries and matching

An inquiry may originate from a marketplace listing, company profile, technology product demo, or partnership request. Store the immutable original message and a separate operational status/timeline. Matching/introduction events should preserve which admin/team member performed the action.

### Products and demos

Products are public catalogue records owned by a technology provider. Demo requests should be stored as inquiries or a dedicated lead record with a relation to the product and provider company.

## Authorization model

Use the frontend roles as the initial vocabulary:

- `guest`: public pages only.
- `business_user`: own requests, own inquiries, own company/profile operations.
- `verified_business`: business-user permissions plus verified-company capabilities.
- `team_member`: assigned operational work and appropriate queues.
- `admin`: request, verification, marketplace, company, analytics, team, and settings operations according to organization policy.
- `super_admin`: platform-wide administration and sensitive settings.

Server rules should check all of the following before returning private data or accepting mutations:

1. authenticated session;
2. permission for the action;
3. company membership/ownership for business-user actions;
4. assignment or team scope for team-member actions;
5. organization scope and role for admin actions;
6. explicit field-level policy for contact details, documents, budgets, and internal notes.

## Request lifecycle

`draft → submitted → under_review → needs_information → matching → quotation_received → approved → completed`

Rejection/cancellation can occur only under documented rules. Every transition must validate the current state, persist the actor/time/reason in `RequestStatusHistory`, and emit a notification/audit event. The frontend should not infer allowed transitions solely from the status badge.

## Integration sequence

### Phase 1 — Next.js server foundation

1. Approve the API envelope and error format in `API_CONTRACT_DRAFT.md`.
2. Add a typed client for same-origin `/api/v1` Route Handlers.
3. Implement session bootstrap (`/api/v1/auth/*`, `/api/v1/me`) and loading/unauthorized states.
4. Add request correlation IDs and server logging.

### Phase 2 — Companies and requests

1. Implement company/profile reads and ownership checks.
2. Implement request create/read/update, draft autosave, and server validation.
3. Add request status history, assignment, notes, and document metadata.
4. Replace `src/data/requests.ts` imports on dashboard/admin pages with query hooks.

#### Phase 4A.1 implemented foundation

Authenticated company create/read/update/primary-company Route Handlers now exist with active reference-data validation, owner/admin membership scope, profile completion, audit writes, and an additive schema migration. The dashboard profile remains intentionally unwired until the next frontend phase. See `COMPANY_PROFILE_BACKEND_IMPLEMENTATION.md` and `COMPANY_PROFILE_API_CONTRACT.md`.

### Phase 3 — Verification and documents

1. Add presigned object-storage upload and secure download Route Handlers.
2. Add verification queue/detail endpoints and immutable review events.
3. Add server-side document type/size/content validation and malware scanning.
4. Replace document placeholders and local decisions with mutation states.

### Phase 4 — Marketplace and inquiries

1. Add public listing projection and moderation endpoints.
2. Add inquiry creation with spam/rate-limit controls.
3. Add assignment, status transitions, introduction, and conversion tracking.
4. Replace public/admin mock datasets and add pagination/filter query parameters.

### Phase 5 — Products, notifications, analytics

1. Add product catalogue and demo lead endpoints.
2. Add in-app/email notification preferences and read state.
3. Add date-filtered analytics aggregations with permission checks.
4. Replace static chart values with API responses and loading/empty/error states.

### Phase 6 — Hardening and launch

1. Add Playwright smoke/regression coverage based on the manual checklist.
2. Run accessibility audit, privacy review, dependency/security scan, and load tests.
3. Add migration/rollback runbooks and production monitoring.
4. Decide and implement `/login`, `/register`, `/contact`, `/about`, and `/resources`, or remove those links.

## Frontend migration points

- Introduce `src/lib/api/client.ts`, `src/lib/api/requests.ts`, `companies.ts`, `inquiries.ts`, `verification.ts`, and `marketplace.ts`; keep server implementations under `src/server`.
- Keep `src/types` as the shared compile-time contract, but validate server responses at runtime.
- Replace list-page data imports with query hooks that support `loading`, `error`, `empty`, `refresh`, `pagination`, and URL-synchronized filters.
- Replace local action state with mutation hooks and invalidate affected queries after success.
- Keep public listing DTOs separate from admin/private DTOs; do not fetch private fields and hide them in CSS.
- Preserve existing reusable components: `RequestTable`, status/priority badges, `InquiryForm`, `DemoRequestForm`, verification cards, moderation preview, and `RoleGate`.

## Operational requirements

- Rate-limit public request, inquiry, and demo submissions.
- Add CSRF protection if cookie sessions are used.
- Store secrets server-side only; never expose storage credentials or admin policy to the client.
- Encrypt sensitive data at rest and restrict document access with short-lived URLs.
- Add retention/deletion policy for documents and contact data.
- Audit every admin status, verification, moderation, assignment, suspension, and note action.
- Make email/notification events idempotent and retryable.
- Expire stale marketplace listings through a scheduled job, not only a page render.

## Definition of backend-ready

Full-stack integration is complete for a module when Next.js Route Handlers call authenticated server services, server-side authorization is enforced, runtime response validation exists, loading/error/empty states work, optimistic or refetch behavior is appropriate, audit logging is present where required, DTOs are privacy-reviewed, and automated happy-path plus permission regression tests pass.

---

## Next.js Route Handler + PostgreSQL refinement

This plan uses the existing Next.js App Router repository as the full-stack application. Next.js Route Handlers under `src/app/api/v1` provide the canonical API surface on Vercel, while managed PostgreSQL owns durable relational state. Private object storage, transactional email, and optional queue/workflow/cron infrastructure remain external services. The server must not depend on the browser or frontend mock-data modules for persistence.

### Domain module plan

| Module | Responsibility / primary entities | Service operations and API routes | Permissions | Frontend consumers | Dependencies |
| --- | --- | --- | --- | --- | --- |
| Authentication | Registration, sessions, email verification, password reset; `User`, `Session`, `RefreshToken`, `EmailVerificationToken` | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password` | Guest for registration/login; authenticated for logout | Header, future `/login` and `/register`, session provider | Users, email provider, security configuration |
| Users | Identity, contact profile, lifecycle; `User` | `GET /api/v1/me`, `PATCH /api/v1/me`, `GET /api/v1/users/:id` (admin scope) | Authenticated own-record scope; `manage_team` for admin user management | Dashboard shell, RoleGate context | Auth, company members |
| Companies | Public profile and private organization record; `Company`, `CompanyCategory`, `CompanyCountry` | `GET /companies`, `GET /companies/:slug`, `PATCH /companies/:id`, admin view/actions | Public read; company member owns edits; `manage_companies` for admin actions | Directory, marketplace snapshots, dashboard company, admin companies | Users, categories, countries, locations, verification |
| Company members | Membership, company role, invitation; `CompanyMember`, `CompanyInvitation` | `GET/POST/PATCH /companies/:id/members`, `POST /companies/:id/invitations`, accept invitation | Company owner/admin; platform admin | Company management, future team flows | Users, companies, auth |
| Roles and permissions | Role catalog and permission assignments; `Role`, `Permission`, `RolePermission`, `UserRole` | `GET /me/permissions`, admin CRUD under `/admin/roles` and `/admin/permissions` | `manage_team`, `manage_settings`, `super_admin` | RoleGate only for UX; admin settings later | Users, company members, audit logs |
| Business requests | Trade and technology demand records; `BusinessRequest` | `GET/POST /requests`, `GET/PATCH /requests/:id`, `POST /requests/:id/submit` | Own company/user; operations and admin by scope | Submit forms, dashboard requests, admin queues/details | Companies, users, categories, documents, status history |
| Request status history | Immutable transitions; `RequestStatusHistory` | `GET /requests/:id/status-history`, internal transition service via `POST /requests/:id/status` | Request owner read; operations/admin transition | User timeline, admin timeline | Requests, users, notifications, audit logs |
| Request assignments | Team ownership and routing; `RequestAssignment` | `GET /admin/assignments`, `PUT /requests/:id/assignment` | `manage_requests`, assigned team member scope | Admin request table/detail | Requests, users/roles |
| Request admin notes | Internal operational notes; `RequestAdminNote` | `GET/POST /requests/:id/notes` | Team/admin only; never public | Admin request detail | Requests, users, audit logs |
| Documents | Metadata, storage lifecycle, access policy; `Document`, `DocumentAccessEvent` | `POST /documents/presign`, `POST /documents/:id/complete`, `GET /documents/:id/download-url`, `DELETE /documents/:id` | Owner, assigned reviewer, admin by document scope | Submit forms, dashboard documents, verification/admin detail | Object storage, malware scanner, requests/companies |
| Company verification | Verification cases, checklist, decisions; `CompanyVerification`, `VerificationChecklistItem` | `GET /verification`, `POST /verification/submit`; admin `/admin/verifications` and `/admin/verifications/:id/decision` | Company member submits; `review_verifications` reviews | Dashboard verification, admin verification queue/detail | Companies, documents, users, notifications, audit logs |
| Verification document reviews | Per-document reviewer decisions; `VerificationDocumentReview` | `POST /admin/verifications/:id/documents/:documentId/review` | `review_verifications` | `DocumentReviewCard`, checklist | Verification, documents, users, audit logs |
| Marketplace listings | Safe public projection and moderation; `MarketplaceListing`, `MarketplaceInterest` | `GET /marketplace/listings`, `GET /marketplace/listings/:slug`; admin moderation routes | Public read; `moderate_marketplace` writes | Marketplace, moderation queue/detail | Requests, companies, categories, interests |
| Marketplace interests | Interest/quotation lead from a listing; `MarketplaceInterest` | `POST /marketplace/listings/:id/interests`, admin list under `/admin/marketplace/interests` | Guest/business user creates; team/admin manages | Inquiry form, admin inquiries | Listings, inquiries, users, companies |
| Inquiries | Relationship requests and leads; `Inquiry` | `POST /inquiries`, `GET /inquiries`, `GET /inquiries/:id`, admin list/detail | Public create; owner/team/admin reads by scope | InquiryForm, dashboard inquiries, admin inquiries | Listings, companies, products, users |
| Inquiry activity | Immutable operational timeline; `InquiryActivity` | `GET /inquiries/:id/activity`, `POST /admin/inquiries/:id/activity` | Team/admin; owner sees safe milestones | Admin inquiry detail, user status view | Inquiries, users, notifications, audit logs |
| Technology products | Public product catalogue; `TechnologyProduct` | `GET /products`, `GET /products/:slug`, admin product CRUD | Public read; provider/admin writes | Products pages, demo form | Companies, categories |
| Demo requests | Product demo lead; `DemoRequest` | `POST /demo-requests`, admin read/convert route | Guest/business user create; team/admin manage | Product detail, technology solution, admin inquiries | Products, companies, inquiries, users |
| Notifications | In-app and email delivery state; `Notification`, `NotificationPreference` | `GET /notifications`, `PATCH /notifications/:id/read`, preferences routes | Authenticated owner; admin can inspect delivery health | Admin header, dashboard future notification center | Users, event publisher, email provider |
| Analytics | Permission-aware aggregates and reporting; read models/materialized views | `GET /admin/analytics`, optional export endpoint | `view_analytics` | Admin analytics | All operational domains, audit events |
| Categories | Controlled taxonomy; `Category`, `CategoryAlias` | `GET /categories`, admin CRUD under `/admin/categories` | Public read; `manage_settings` writes | Marketplace/directory/forms/admin filters | Audit logs, products, companies, requests |
| Countries and locations | Country and normalized location reference data; `Country`, `Location` | `GET /countries`, `GET /locations?country=...`, admin maintenance | Public read; `manage_settings` writes | Forms, filters, company/request profiles | Categories optional, companies/requests |
| Audit logs | Immutable actor/action/resource history; `AuditLog` | Admin-scoped `GET /admin/audit-logs`; writes from service layer only | `manage_settings` or security audit role | Admin activity/history, analytics | Every mutating domain |

Each service should expose domain operations rather than allowing Route Handlers to mutate ORM models directly. Server auth/permission dependencies should resolve the current user, company scope, permission, and transaction context before calling a service.

## Authentication and authorization design

### Registration and email verification

1. `POST /auth/register` creates an inactive user and optional company/member record in one transaction.
2. The service sends a single-use, expiring email-verification token. Do not reveal whether an email already exists in public responses.
3. `POST /auth/verify-email` activates the email; the user then completes company profile and verification documents.
4. Registration must record acceptance of terms/privacy versions and the acceptance timestamp.

### Session model

Use short-lived access tokens and rotating refresh tokens. For a browser frontend, prefer an `HttpOnly`, `Secure`, `SameSite=Lax` refresh cookie scoped to the API domain plus an in-memory access token, or a secure same-site session-cookie design if deployment domains permit it. Never store refresh tokens in `localStorage`. Hash refresh tokens at rest and revoke the token family on reuse detection.

The frontend should hydrate a session context by calling `GET /api/v1/me` once on app startup. While pending, protected layouts render a loading state; a `401` clears session and redirects to login; a `403` renders `/unauthorized`; a `404` uses the route’s not-found UI.

### Backend authorization rules

`RoleGate` remains useful for hiding or disabling UI, but **frontend RoleGate is not a security boundary**. All permissions must be enforced by Next.js server dependencies and service-level checks. Every private response must be scoped by authenticated user/company/team membership, and every admin mutation must record actor and reason in `audit_logs`.

The permission dependency should support `require_permission("manage_requests")`, `require_any_permission(...)`, and resource-level checks such as `can_access_request(request, current_user)`. A role from the browser, a hidden button, or a guessed URL must never grant access.

### Authentication solution selection criteria

Do not select a final auth library until it is evaluated against the existing Next.js App Router and Vercel runtime. Candidates may include a managed identity provider, a Next.js-compatible auth library, or a small server-owned session implementation, but the decision must document:

- App Router/server-side session validation and Route Handler compatibility;
- secure `HttpOnly`, `Secure`, `SameSite` cookie support and CSRF strategy;
- access/session expiry, refresh rotation, revocation, reuse detection, and logout-all-sessions;
- email verification, password reset, MFA readiness, and external identity support if needed;
- company membership and role/permission claims without trusting client-provided claims;
- serverless/Vercel compatibility, cold-start behavior, operational cost, and vendor lock-in;
- audit hooks for login, logout, verification, password reset, role changes, and suspicious activity;
- testability with local development, preview deployments, staging, and Playwright.

The selected solution must support registration, email verification, login, logout, password reset or a supported external identity flow, current-user hydration, session revocation, secure cookies, and server-side permission checks. Frontend `RoleGate` remains a UI helper only.

## Workflow state machines

### Business request lifecycle

| Current state | Allowed next states | Actor | Side effects |
| --- | --- | --- | --- |
| `draft` | `submitted`, `cancelled` | Owner/company member | Validate required fields; notify operations after submit; audit |
| `submitted` | `under_review`, `cancelled` | Team/admin | Assign or queue; notify owner; audit |
| `under_review` | `needs_information`, `matching`, `rejected`, `cancelled` | Team/admin | Request missing data, reject reason, or start matching; notify; audit |
| `needs_information` | `submitted`, `under_review`, `cancelled` | Owner then team/admin | Notify owner of missing fields; preserve response; audit |
| `matching` | `quotation_received`, `approved`, `rejected`, `cancelled` | Team/admin | Create matching activity; notify owner on partner/quotation; audit |
| `quotation_received` | `approved`, `matching`, `rejected`, `cancelled` | Owner/team/admin | Store quotation reference; notify; audit |
| `approved` | `completed`, `cancelled` | Team/admin/owner confirmation | Record approval/completion evidence; notify; audit |
| `completed` | none | System/admin correction only | Emit completion notification; audit corrections |
| `rejected` | `submitted` only after explicit resubmission | Owner/team/admin | Preserve rejection reason; notify; audit |
| `cancelled` | none | Owner before matching or team/admin | Stop notifications/matching; audit |

Transition validation belongs in a single service transaction. Idempotent repeat requests should return the current state; stale `version`/ETag values return `409 VERSION_CONFLICT`. Status history, notification enqueue, and audit log must be committed atomically with an outbox event where possible.

### Verification lifecycle

`not_started → draft → submitted → under_review → needs_information → under_review → approved`

`under_review → rejected` and `approved → suspended` are also allowed. Company members create/edit `draft`, submit when required documents exist, and answer `needs_information`. Reviewers move `submitted/under_review` cases, approve/reject/request information, and suspend an approved company only with a reason. Every checklist/document decision is separately audited. Approval creates a verified-company notification; rejection or more-information requests include safe reviewer feedback.

### Marketplace lifecycle

`not_requested → pending_review → draft → published → paused → published → expired → archived`

`pending_review → rejected`, `published → rejected`, and `paused → archived` are allowed with an admin reason. Publication creates a public projection that excludes private contacts, exact budget, private documents, and internal notes. A scheduled job expires listings; an admin may archive rather than delete them. The public endpoint must not expose a listing until status is `published`.

### Inquiry lifecycle

`new → contacted → qualified → introduced → negotiating → converted`

At any operational point, `new/contacted/qualified/introduced/negotiating → closed` or `spam` is allowed. `converted → closed` is allowed for administrative closure. Public users create `new`; team/admin staff record contact, qualification, introduction, negotiation, conversion, spam, and close events. The original message is immutable; activity entries capture actor, timestamp, note, and status transition.

## Secure file upload plan

Use direct-to-private-object-storage uploads through presigned URLs. Recommended default: Vercel Blob or an S3-compatible provider with a separate malware-scanning/quarantine prefix. Upload-through-Route-Handler is acceptable only for small files when a provider cannot support presigned uploads; it increases function memory, timeout, and bandwidth risk.

| Document class | MIME allowlist | Suggested max size | Visibility |
| --- | --- | --- | --- |
| Trade license, tax/VAT, company profile, certification | `application/pdf`, `image/jpeg`, `image/png` | 10 MB each | Private; reviewers only |
| Product catalog, request specification, technology requirements | PDF, DOCX, XLSX, JPEG, PNG | 25 MB each | Private unless an explicit public projection approves it |
| Product images | JPEG, PNG, WebP | 10 MB each; 50 MB request total | Public only after moderation; originals private |

Flow: create document metadata with owner/resource/type; request a short-lived presigned URL; upload directly; call `/documents/:id/complete`; verify checksum, declared MIME, actual file signature, size, and malware scan; mark `quarantined`, `available`, or `rejected`; issue signed download URLs only after authorization. Sanitize display names, generate storage keys server-side, prevent path traversal, and never use a client filename as a storage path.

Store original filename, safe display filename, MIME, byte size, checksum, storage key, scan status, uploader, related entity, and retention/deletion timestamps. Public documents require a separate approved/public flag and an access policy. Deletion is soft-delete plus storage lifecycle removal after the retention window; legal/audit holds override deletion. Every download, review, replacement, and deletion is audited.

## Frontend integration recommendation

Use a small typed API client built on native `fetch` for request/response transport. Add a runtime schema validator at the client boundary (Zod is a reasonable option once backend/frontend agree on DTOs). Use TanStack Query only when the team accepts the dependency: it is recommended for dashboard/admin query caching, pagination, invalidation, mutations, and retry behavior, but it is not required for public static pages.

- Keep public read-heavy pages as Server Components where data can be fetched server-side through a backend-safe server client.
- Use Client Components for filters, forms, dialogs, optimistic interactions, and query hooks that need browser state.
- Keep sensitive admin requests server-authorized and do not fetch private fields into public components.
- Replace direct `src/data` imports incrementally behind repository/query functions so pages do not change data shape and API transport in one step.
- Add `loading.tsx`, `error.tsx`, empty states, retry actions, and mutation feedback to every API-backed route.
- Synchronize list filters with URL query parameters, while debouncing free-text search.
- Use optimistic updates only for low-risk UI preferences/read status and local draft edits; refetch or invalidate for status, verification, moderation, assignment, suspension, and financial/sensitive actions.

## Error, pagination, and filter standards

Use the error envelope and behavior in `API_CONTRACT_DRAFT.md`. Add these operational codes: `EMAIL_NOT_VERIFIED`, `DOCUMENT_QUARANTINED`, `UPLOAD_EXPIRED`, `RATE_LIMITED`, `INVALID_STATUS_TRANSITION`, `VERSION_CONFLICT`, and `PUBLIC_FIELD_NOT_ALLOWED`.

All collection endpoints use `page` (1-based), `page_size` (default 20, maximum 100), `search`, `sort`, and `direction=asc|desc`. Filter names are stable across modules where they have the same meaning: `status`, `type`, `priority`, `category`, `country`, `location`, `assigned_to`, `verification_status`, `date_from`, and `date_to`. Response metadata uses `page`, `page_size`, `total`, `total_pages`, and optional `has_next`/`has_previous`. Return a deterministic tie-breaker, normally `id`, after the requested sort.

## Next.js/PostgreSQL implementation phases

The detailed acceptance gates are repeated in `INTEGRATION_EXECUTION_CHECKLIST.md`; this summary shows dependencies and rollback boundaries.

| Phase | Backend deliverables | Frontend changes | Tests / acceptance | Dependencies | Rollback boundary |
| --- | --- | --- | --- | --- | --- |
| 0. Contracts/setup | Next.js API versioning, OpenAPI conventions, config strategy, PostgreSQL/storage/queue decisions | No behavior change; document API boundary | Contract review; no secrets committed | Team decisions | Revert docs/branch only |
| 1. Foundation | `src/server` scaffold, health/readiness Route Handlers, DB session, migrations, shared errors, CORS, logging | Add API client skeleton and health-only environment wiring | Health, migration, error-envelope tests | Phase 0 | Keep frontend mock mode |
| 2. Identity | Users, auth/session, email verification, roles/permissions, `/me` | Session provider, protected layouts, 401/403 handling | Auth, password, refresh rotation, permission tests | Foundation | Feature flag mock/auth mode |
| 3. Companies/reference data | Companies, memberships, categories, countries, locations | Directory/company/dashboard reads; URL filters | Ownership/privacy tests | Identity | Keep mock directory |
| 4. Requests | Business requests, transitions/history, assignment, notes | Submit/dashboard/admin request queries and mutations | State-machine, ownership, conflict tests | Companies | Per-route API feature flags |
| 5. Documents/verification | Presigned storage, scan state, verification/checklist/reviews | Upload flow, document states, verification actions | Access, malware, reviewer authorization tests | Requests, companies, storage | Disable uploads while retaining mock docs |
| 6. Marketplace | Listing projection, moderation, interests | Public marketplace and admin moderation integration | Privacy/public projection, publication transition tests | Requests, companies | Keep mock public listings |
| 7. Inquiries/notifications | Inquiries, demo requests, activities, notification outbox | Inquiry/demo submit, admin/user inquiry, notification UI | Rate limit, spam, notification idempotency tests | Marketplace/products, identity |
| 8. Admin operations | Admin assignment, notes, company actions, audit logs | Replace local admin mutations, add conflict/retry states | RBAC, audit, destructive-action tests | All operational domains | Read-only admin fallback |
| 9. Admin and analytics | Admin operations, audit-log queries, aggregates, metric definitions | Authorized admin mutations and analytics API/UI | RBAC, audit, privacy, analytics-definition tests | All operational domains | Read-only admin/analytics fallback |
| 10. Production hardening | Rate limiting, security, observability, backups, restore, performance, deployment checks | Final error/accessibility states and public-route decisions | E2E, load, privacy, accessibility, staging smoke, disaster recovery | All previous phases | Paired frontend/server rollback and migration runbook |

## Final handoff decisions

1. **Frontend readiness blockers:** no real session, API client, persistence, uploads, server-side authorization, browser E2E suite, or standalone auth/content routes.
2. **Backend prerequisites:** Next.js server module setup, PostgreSQL, migration runner, session design, object storage, malware scanning, email provider, staging domains, CORS policy, monitoring, and approved DTO/state contracts.
3. **First backend milestone:** Phase 0 plus Phase 1, ending with a deployed `/health` endpoint, migration baseline, typed error envelope, OpenAPI review, and frontend mock-mode compatibility.
4. **First frontend integration milestone:** session hydration plus read-only `/me`, company directory, and user request list behind a feature flag; no destructive admin mutations yet.
5. **Highest-risk areas:** document privacy and signed URLs, admin authorization, status transition concurrency, public/private listing projection, refresh-token security, and cross-company data leakage.
6. **Team approval required:** session transport, role/membership model, storage provider, file limits/retention, state transition rules, analytics definitions, public route decisions, and API versioning policy.
7. **Branch strategy:** for this MVP, `main` is the only active deployment branch after the authentication milestone is merged. Do not depend on feature branches or deployment-specific database branches for deployment testing; restore a reviewed multi-environment branch strategy before broader team delivery.
8. **Commit sequence:** `docs: approve api and schema contracts` → `fullstack: add server foundation` → `fullstack: add database foundation` → `fullstack: add auth and permissions` → `frontend: add typed api client` → one domain pair per phase (`fullstack: ...`, `frontend: integrate ...`) → `test: add integration and e2e coverage` → `ops: add staging and monitoring`.

## Final planning report

1. **Documents created:** `NEXTJS_SERVER_ARCHITECTURE.md` and `SERVERLESS_CONSTRAINTS.md`; the schema, mapping, and execution checklist are part of the same planning set.
2. **Documents updated:** `BACKEND_INTEGRATION_PLAN.md`, `API_CONTRACT_DRAFT.md`, `DATABASE_SCHEMA_DRAFT.md`, `FRONTEND_BACKEND_MAPPING.md`, and `INTEGRATION_EXECUTION_CHECKLIST.md`.
3. **FastAPI assumptions removed:** the canonical API is now explicitly Next.js Route Handlers under `src/app/api/v1`; no separate FastAPI backend is planned for the MVP.
4. **Current frontend blockers:** no real session, server services/repositories, database, uploads, API client, durable mutation handling, browser E2E suite, or standalone auth/content routes.
5. **Required architecture decisions:** auth provider/session transport, PostgreSQL provider/driver/ORM, object storage/scanning, queue/workflow/cron provider, environment isolation, status transitions, privacy DTOs, and API versioning.
6. **Recommended first implementation phase:** Phase 0 contract freeze followed by Phase 1 server foundation with health/readiness, configuration validation, error mapping, logging, and database client architecture.
7. **Highest serverless risks:** database connection exhaustion, cache leakage of private data, duplicate retries, function duration/payload limits, incomplete upload cleanup, cron overlap, and long-running matching/exports in request handlers.
8. **Features that may eventually need a separate service:** compute-heavy matching, AI processing, large exports, malware scanning, or analytics workloads if queue/serverless execution becomes insufficient. These are future boundaries, not MVP backend architecture.
9. **Suggested branch name:** `docs/nextjs-fullstack-backend-plan` for this documentation revision; future implementation branches should follow `fullstack/phase-<n>-<slug>`.
10. **Suggested commit sequence:** `docs: revise backend plan for nextjs serverless` → `fullstack: add server foundation` → `fullstack: add database foundation` → `fullstack: add auth` → one domain commit per phase → paired frontend integration commits → `test: add integration coverage` → `ops: harden production deployment`.
