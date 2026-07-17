# TradeConnect Backend Integration Plan

This plan turns the current mock-only frontend into a production-ready B2B trade and business support platform without changing the existing information architecture unnecessarily.

## Current boundary

Today, pages import static records from `src/data`, and interactive flows update local React state. `RoleGate` hides UI based on a mock user, but it is explicitly not a security boundary. The backend must become the source of truth for identity, ownership, verification, workflow state, documents, marketplace publication, inquiries, analytics, and audit history.

## Recommended system shape

| Concern | Backend responsibility | Frontend change |
| --- | --- | --- |
| Authentication | Session/token issuance, password or external identity provider, logout, recovery | Replace mock current user with `GET /me` and auth client; keep loading/error states |
| Authorization | Server-enforced role, permission, company membership, ownership checks | Keep `RoleGate` for UX only; handle `401/403` from API |
| API | Typed REST or equivalent resource endpoints | Replace direct data imports with a typed API client/hooks |
| Database | Relational records, relationships, status history, notes, assignments, audit records | Map API DTOs into existing shared view models |
| Documents | Object storage, signed upload/download URLs, malware scanning, metadata | Replace upload placeholders with presigned upload flow and progress/error states |
| Notifications | Email/in-app notifications and event delivery | Add notification center, unread state, and action links |
| Analytics | Aggregated, permission-aware reporting queries | Replace static chart values with date-filtered API responses |
| Operations | Background jobs for review reminders, expiry, matching, indexing | Surface pending, retry, and stale-data states |

## Data domains

### Identity and access

Entities: `User`, `Role`, `Permission`, `Session`, `CompanyMembership`, `TeamMember`. A user may belong to one or more companies in the future; every request, inquiry, document, and note must have an owning company and actor metadata where applicable.

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

### Phase 1 — API foundation

1. Approve the API envelope and error format in `API_CONTRACT_DRAFT.md`.
2. Add runtime API URL configuration and a typed client.
3. Implement session bootstrap (`/auth/*`, `/me`) and loading/unauthorized states.
4. Add request correlation IDs and server logging.

### Phase 2 — Companies and requests

1. Implement company/profile reads and ownership checks.
2. Implement request create/read/update, draft autosave, and server validation.
3. Add request status history, assignment, notes, and document metadata.
4. Replace `src/data/requests.ts` imports on dashboard/admin pages with query hooks.

### Phase 3 — Verification and documents

1. Add presigned object-storage upload and secure download URLs.
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

- Introduce `src/lib/api/client.ts`, `src/lib/api/requests.ts`, `companies.ts`, `inquiries.ts`, `verification.ts`, and `marketplace.ts`.
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

Backend integration is complete for a module when the UI has authenticated API reads/mutations, server-side authorization, runtime response validation, loading/error/empty states, optimistic or refetch behavior, audit logging where required, privacy-reviewed DTOs, and automated happy-path plus permission regression tests.
