# TradeConnect Backend Integration Execution Checklist

Planning checklist only. Do not mark a phase complete until its backend, frontend, test, privacy, and deployment acceptance criteria are met. Keep `main` deployable and retain the current mock-data mode behind an explicit feature flag until the corresponding API slice is proven in staging.

## Temporary MVP deployment decision

`main` is the sole active deployment branch. Vercel Production and Preview temporarily share the persistent Neon main branch; automatic Neon Preview Branching must be disabled. The deployment command is `prisma migrate deploy && prisma db seed && next build`. Preview data can affect the shared database, so destructive tests and customer-like data are prohibited until isolated staging is restored.

## Phase 2 database foundation status

## Phase 3A authentication core status

- [x] Better Auth schema mapping and additive migration reviewed/applied.
- [x] Email/password registration, login, logout, database sessions, and database-backed rate limiting implemented.
- [x] Default `business_user` role assignment and audited development role-grant CLI implemented.
- [x] Server-side actor resolution, dashboard/admin guards, and `GET /api/v1/me` implemented.
- [ ] Production email verification, password reset, OAuth, and browser end-to-end authorization tests remain deferred.

- [x] Prisma 7 schema, generated client boundary, config, scripts, seed structure, and readiness route added.
- [x] Runtime/migration environment split documented as pooled `DATABASE_URL` versus direct `DIRECT_URL`.
- [x] Frontend remains mock-data based; no business API or authentication was added.
- [x] Initial migration `20260721190410_init_domain` generated, reviewed, and applied through the direct migration connection.
- [x] Reference seed, rollback-only smoke test, and ready-state verification completed against the aligned persistent database connection.

## Global release gates

- [ ] API contract version and OpenAPI document reviewed by frontend/backend owners.
- [ ] Database migrations are reversible or have a documented forward-fix plan.
- [ ] Every private endpoint has a permission and resource-scope test.
- [ ] Public DTOs have a privacy test proving no contact, budget, document, or internal-note leakage.
- [ ] Every integrated route has loading, empty, error, unauthorized, forbidden, not-found, and conflict behavior as applicable.
- [ ] No secrets are committed; staging/production configuration is injected by the hosting platform.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass for every frontend integration PR.
- [ ] Next.js Route Handler/service unit, integration, and authorization tests pass for every full-stack integration PR.
- [ ] Manual QA checklist and Playwright smoke tests pass against staging before release.

## Phase 0 — Contracts, repository, and environment strategy

### Server deliverables

- [ ] Establish the `src/app/api/v1` Route Handler tree and `src/server` dependency boundaries in the existing Next.js repository.
- [ ] Establish server runtime-schema, service, repository, dependency, and test conventions.
- [ ] Approve PostgreSQL, migration, object storage, email, queue, and monitoring choices.
- [ ] Define staging/production config keys without real values in Git.
- [ ] Publish initial OpenAPI and error/pagination/privacy contract.

### Frontend changes

- [ ] No behavior change required.
- [ ] Add a documentation-only API boundary decision if needed.
- [ ] Confirm mock mode remains the default until Phase 2 authentication is available.

### Tests and acceptance

- [ ] Contract review completed.
- [ ] OpenAPI lint/validation passes.
- [ ] No frontend regression in lint/type/build.

### Dependencies / rollback

Depends on product decisions in the audit docs. Roll back by reverting documentation/contract branch; do not touch runtime behavior.

## Phase 1 — Next.js server foundation

### Backend deliverables

- [ ] Next.js health/readiness Route Handlers, structured logging, and request IDs.
- [ ] PostgreSQL connection/session management and Alembic baseline.
- [ ] Shared response envelope, error handlers, validation error mapping, CORS configuration.
- [ ] Transaction boundaries and database test fixture.

### Frontend changes

- [ ] Add typed `src/lib/api/client.ts` with base URL, timeout/abort, JSON parsing, request ID, and typed errors.
- [ ] Add feature flag for mock/API transport; do not expose secrets.

### Tests and acceptance

- [ ] `/health` and `/ready` pass in staging.
- [ ] Migration up/down or rollback procedure tested.
- [ ] CORS allows only approved Vercel staging/production origins.
- [ ] Client handles canonical success/error envelopes.

### Dependencies / rollback

Depends on Phase 0. Roll back by disabling API feature flag and keeping `src/data` transport.

## Phase 2 — Users, authentication, roles, permissions

### Backend deliverables

- [ ] Users, sessions, refresh-token rotation/revocation, email verification, password reset.
- [ ] Roles, permissions, user-role assignments, company membership hooks.
- [ ] `GET /me`, login, logout, refresh, registration, verification endpoints.
- [ ] Server-only `current_user`, `require_permission`, and resource-scope dependencies.

### Frontend changes

- [ ] Implement `/login` and `/register` mock-to-API forms.
- [ ] Add session provider/hydration around App Router layouts.
- [ ] Replace `current-user.ts` only after `/me` is stable.
- [ ] Protect dashboard/admin layouts; handle 401 redirect and 403 unauthorized page.
- [ ] Keep `RoleGate` as UI gating only and retain its security warning comments.

### Tests and acceptance

- [ ] Registration, duplicate-safe response, email verification, login/logout, refresh rotation, reset flow.
- [ ] Role/permission matrix tests for every defined permission.
- [ ] Browser test proves session hydration and refresh expiry behavior.
- [ ] Private route cannot be accessed by changing the URL as a guest.

### Dependencies / rollback

Depends on Phase 1. Roll back by feature-flagging auth and preserving mock current user for preview builds; never weaken backend authorization to support rollback.

## Phase 3 — Companies, memberships, categories, countries, locations

### Backend deliverables

- [ ] Company/member CRUD and invitation acceptance.
- [ ] Public company directory/profile serializers.
- [ ] Categories, countries, and locations seed/read endpoints.
- [ ] Company ownership and membership authorization.

### Frontend changes

- [ ] Replace `companies.ts` and `dashboard.ts` imports on directory/profile/company screens with API hooks.
- [ ] Add loading/empty/error states and URL-synchronized directory filters.
- [ ] Replace static category/country options in forms with reference-data queries.
- [ ] Add 409 handling for concurrent company edits.

### Tests and acceptance

- [ ] Public profile privacy tests.
- [ ] Membership/ownership tests across two companies.
- [ ] Directory search/filter/pagination and invalid slug tests.
- [ ] Admin company action audit tests.

### Dependencies / rollback

Depends on identity. Roll back by switching public directory/company views to mock data; do not mix partial private API data with mock ownership.

## Phase 4 — Business requests and dashboard integration

### Backend deliverables

- [ ] `business_requests`, status history, assignment, notes, transition service, version/ETag support.
- [ ] Import/export/supply/technology create schemas and normalized quantity/budget structures.
- [ ] Owner/team/admin request scopes and notification/outbox events.

### Frontend changes

- [ ] Replace request form local success with `POST /requests` and field/server validation.
- [ ] Replace user request list/detail data imports with paginated hooks.
- [ ] Replace admin RequestTable data/actions with API queries/mutations.
- [ ] Sync filters/sort with URL parameters.
- [ ] Add loading/empty/error/conflict/invalid-transition states.

### Tests and acceptance

- [ ] Every valid lifecycle transition and invalid transition is covered.
- [ ] Owner cannot read/update another company’s request.
- [ ] Admin assignment/status/note actions create history/audit events.
- [ ] Duplicate submit and stale update behavior is safe.
- [ ] Import/export/supply/technology form payloads round-trip correctly.

### Dependencies / rollback

Depends on identity, companies, categories, countries, and locations. Roll back one route family at a time through API feature flags; keep mock request IDs usable for demo environments.

## Phase 5 — Documents and verification

### Backend deliverables

- [ ] Presigned uploads, completion callback, metadata, scan/quarantine state, signed download URLs.
- [ ] Verification case/checklist/document review/decision services.
- [ ] Reviewer assignment, decision reason, notification, and audit events.

### Frontend changes

- [ ] Replace upload placeholders with file selection, presign, progress, complete, retry, and cancellation states.
- [ ] Replace dashboard verification/documents mock data with API queries.
- [ ] Replace admin verification local actions with mutations and conflict refresh.
- [ ] Hide private document URLs from public components.

### Tests and acceptance

- [ ] MIME, size, signature, checksum, malware, and filename tests.
- [ ] Owner/reviewer/admin document access matrix.
- [ ] Signed URL expiry and unauthorized download tests.
- [ ] Verification state machine, replacement, final decision, and audit tests.

### Dependencies / rollback

Depends on requests/companies and approved storage/scanning providers. Roll back by disabling uploads and showing a clear maintenance state; never fall back to public storage URLs.

## Phase 6 — Marketplace and interests

### Backend deliverables

- [ ] Public listing projection separate from private request.
- [ ] Moderation queue/detail/actions, expiry job, listing views, interests.
- [ ] Rate-limited public interest submission and inquiry relation.

### Frontend changes

- [ ] Replace marketplace/opportunity mocks with public listing queries.
- [ ] Replace admin moderation local state with API mutations and safe preview DTO.
- [ ] Replace Submit Interest with `POST /marketplace/listings/:id/interests`.
- [ ] Add pagination, URL filters, listing loading/empty/error states.

### Tests and acceptance

- [ ] Public serializer privacy test against all sensitive request fields.
- [ ] Publication/pause/reject/expire/archive transition tests.
- [ ] Interest rate limit, duplicate, and safe confirmation tests.
- [ ] Listing view/interests metrics are defined and non-duplicating.

### Dependencies / rollback

Depends on requests, companies, categories, and identity. Roll back by leaving public listings on mock mode and disabling interest submit rather than exposing private records.

## Phase 7 — Inquiries, demos, notifications

### Backend deliverables

- [ ] Inquiry creation, source/relation, immutable message, activities, assignments, statuses.
- [ ] Demo-request mapping to product/inquiry.
- [ ] Notification outbox, delivery retry, read state, preference endpoints.

### Frontend changes

- [ ] Replace InquiryForm/DemoRequestForm local success with API mutations.
- [ ] Integrate public profile, marketplace, product, and technology-solution contexts.
- [ ] Replace user/admin inquiry lists/details with paginated query hooks.
- [ ] Add notification button/list and unread state to dashboard/admin header.

### Tests and acceptance

- [ ] Spam/rate-limit/consent tests.
- [ ] Inquiry lifecycle and activity audit tests.
- [ ] Demo request creates exactly one lead/inquiry relationship.
- [ ] Notification idempotency, retry, preferences, and read tests.

### Dependencies / rollback

Depends on identity, companies, products, and marketplace. Roll back by disabling public submit mutations while keeping safe read-only mock pages.

## Phase 8 — Admin operations and company management

### Backend deliverables

- [ ] Admin overview aggregation, request operations, company actions, assignment, notes, document review, audit log query.
- [ ] Team member/user/category/settings modules as separately approved scopes.
- [ ] Destructive-action reasons and conflict handling.

### Frontend changes

- [ ] Replace all local admin mutations in request, verification, marketplace, inquiry, and company components.
- [ ] Add permission-aware action visibility plus backend error handling.
- [ ] Replace catch-all placeholders only when their contracts are approved.
- [ ] Add admin query pagination and URL filters.

### Tests and acceptance

- [ ] Admin/super-admin/team-member permission matrix.
- [ ] Suspension, rejection, document decisions, and marketplace actions require reason/confirmation.
- [ ] Audit trail shows actor, before/after, reason, and request ID.
- [ ] Cross-company/private data leakage tests pass.

### Dependencies / rollback

Depends on every operational domain and audit logs. Roll back individual action mutations to read-only mode; never remove authorization checks.

## Phase 9 — Admin and analytics

### Backend deliverables

- [ ] Admin overview aggregation, audit log query, analytics aggregates, and documented metric definitions.
- [ ] Admin/super-admin/team-member authorization and audit boundaries are explicit.

### Frontend changes

- [ ] Replace analytics mock calculations with date-filtered API response.
- [ ] Add chart loading/empty/error states and timezone display.
- [ ] Replace local admin mutations with authorized Route Handler mutations.

### Tests and acceptance

- [ ] Admin queues, destructive confirmations, conflict states, and privacy tests pass.
- [ ] Analytics metric definitions match approved product semantics.

### Dependencies / rollback

Depends on Phases 2–8 and audit-log foundations. Roll back admin mutations to read-only mode while preserving public/user flows.

## Phase 10 — Production hardening

### Server deliverables

- [ ] Rate limiting, security headers, CSRF/session review, structured logs, tracing, error monitoring, and alerts.
- [ ] Backup/restore, migration rollback/forward-fix, health checks, and disaster recovery runbooks.
- [ ] Queue/cron observability, dead-letter/manual recovery, orphan upload cleanup, and listing expiry operations.
- [ ] Staging and production deployment checks with isolated resources.

### Frontend changes

- [ ] Add browser error monitoring and final accessible responsive states.
- [ ] Implement or remove missing public routes by product decision.
- [ ] Complete public/private serializer review and 401/403/404/409/422/429/500 behavior.

### Tests and acceptance

- [ ] Unit/service/API/authorization/privacy/document/state-machine tests green.
- [ ] Playwright critical-path suite green against staging.
- [ ] Manual QA checklist complete on desktop/mobile.
- [ ] Load/performance test supports expected queue/list traffic.
- [ ] Backup restore and rollback rehearsal complete.

### Dependencies / rollback

Depends on all previous phases. Release can be rolled back to the last frontend/server version pair; migrations require the approved migration rollback/forward-fix plan.

## Minimum test gate matrix

| Gate | Minimum evidence before merge |
| --- | --- |
| Contract | OpenAPI and DTO examples reviewed; pagination/error/privacy rules approved |
| Auth | Unit + API + browser tests for login, refresh, logout, 401, 403 |
| CRUD domain | Service/API tests for validation, ownership, duplicate, not-found, conflict |
| Workflow | Every listed valid/invalid transition and audit/notification side effect |
| Documents | Access, signed URL, MIME/size, malware/quarantine, retention tests |
| Public privacy | Automated response snapshot/assertions for no private fields |
| Frontend | Lint, TypeScript, build, component/API-mock tests, manual responsive/accessibility checks |
| E2E | Playwright smoke paths: register/login, submit request, dashboard detail, admin review, publish listing, inquiry, logout |
| Staging | Health, migration, CORS, monitoring, email/storage, rollback and smoke verification |

## Recommended delivery controls

- [ ] Every integration phase has a feature flag or route-level API mode switch until staging sign-off.
- [ ] Backend and frontend version compatibility is recorded in release notes.
- [ ] Contract changes are additive or versioned; breaking changes require a migration window.
- [ ] No production data is copied into local mock fixtures.
- [ ] All branch and commit messages identify the integration phase and domain.
- [ ] A release is promoted only when frontend and backend artifacts pass their paired acceptance gates.
