# TradeConnect Contract Freeze Report

Status: **PASS with documented adapters**  
Scope: Phase 0 contract freeze verification against the implemented frontend and planning documents  
Date: 21 July 2026

## Decision summary

The frontend contract is stable enough to begin the server foundation and later database foundation. Existing UI types remain unchanged where a richer server lifecycle would otherwise alter working pages. The server/API contract is the superset; adapters will map server lifecycle states to current UI display states until the frontend is expanded.

## Contract categories reviewed

- Request types, statuses, and priorities.
- Inquiry statuses and source/type vocabulary.
- Verification and marketplace lifecycle states.
- Roles and permissions used by `RoleGate`, shared auth types, and server permission foundations.
- Public/private field boundaries.
- Pagination, sorting, request IDs, error codes, and response envelopes.
- Current `src/data` imports and their eventual API replacements.
- Existing route inventory, including placeholder and missing routes.

## Canonical final values

### Request types — PASS

`import`, `export`, `supply`, `technology`

Canonical frontend location: `src/types/index.ts` → `RequestType`. Form configuration now reuses this type through `src/data/request-forms.ts`.

### Request statuses — PASS

`draft`, `submitted`, `under_review`, `needs_information`, `matching`, `quotation_received`, `approved`, `completed`, `rejected`, `cancelled`

Canonical frontend location: `src/types/index.ts` → `RequestStatus`. The server transition matrix in the planning documents is a superset of the current mock behavior and does not alter the UI yet.

### Request priorities — PASS

`low`, `medium`, `high`, `urgent`

Canonical frontend location: `src/types/index.ts` → `RequestPriority`.

### Inquiry statuses — PASS

`new`, `contacted`, `qualified`, `introduced`, `negotiating`, `converted`, `closed`, `spam`

Canonical frontend location: `src/types/index.ts` → `InquiryStatus`.

### Roles and permissions — PASS

Roles:

`guest`, `business_user`, `verified_business`, `team_member`, `admin`, `super_admin`

Permissions:

`submit_request`, `view_own_requests`, `manage_own_company`, `submit_inquiry`, `view_admin_dashboard`, `manage_requests`, `review_verifications`, `moderate_marketplace`, `manage_companies`, `view_analytics`, `manage_team`, `manage_settings`

Canonical shared location: `src/types/auth.ts`. The frontend UI mapping is `src/lib/permissions.ts`; the server foundation imports the same public-safe role/permission vocabulary in `src/server/permissions/permissions.ts` and never trusts `RoleGate`.

## Mismatches discovered and resolution

| Area | Mismatch | Resolution | Status |
| --- | --- | --- | --- |
| Form request type | `request-forms.ts` had a second literal union duplicating `RequestType` | Replaced it with `type RequestFormType = RequestType` | FIXED |
| Verification lifecycle | Frontend `VerificationStatus` is `pending_review`, `approved`, `rejected`, `needs_information`; the backend workflow also requires `not_started`, `draft`, `submitted`, `under_review`, and `suspended` | Preserve current UI type to avoid behavior changes. Use a server verification lifecycle/DTO adapter and expose the current UI subset until the verification UI is expanded | FIXED BY DOCUMENTED ADAPTER |
| Verification initial state | Dashboard copy includes “Not Started” while mock `VerificationCase` data begins at `pending_review` | Treat `not_started` as a server/company-level state; keep current mock records unchanged for this milestone | DOCUMENTED |
| Marketplace listing states | Frontend `MarketplaceModerationStatus` uses `pending_publication` and lacks `not_requested`/`archived`; request-level `MarketplaceStatus` separately uses `pending_review`, `matched`, and `closed` | Keep request and listing concepts separate. Server canonical listing lifecycle is `not_requested`, `pending_review`, `draft`, `published`, `paused`, `rejected`, `expired`, `archived`; map it to current UI listing states | FIXED BY DOCUMENTED ADAPTER |
| Company verification fields | Public mock `Company` contains both `isVerified` and legacy `verified` | Preserve working UI/data in Phase 0; normalize to one server `verificationStatus`/public `isVerified` projection during company integration | DEFERRED |
| User permission name | Earlier planning text used `view_own_profile`, which is not in the canonical frontend permission union | Removed it from the module plan. Own profile access is authenticated resource scope; admin user management uses `manage_team` | FIXED |
| API path prefix | Earlier planning tables used paths relative to `/api/v1` without always restating the prefix | Documents now state that paths are relative unless a full `/api/v1` path is shown; the canonical Route Handler tree is explicit | FIXED |
| Validation library | No Zod or other validation package is installed | Foundation uses small typed primitive validators; a schema library can be evaluated later without adding it now | FIXED FOR PHASE 1 |

## Canonical status mapping policy

Do not force richer server workflow statuses into public shared UI unions by adding values that current components cannot render. Use explicit mapping functions at the API/view-model boundary and include an unmapped-state telemetry/log event in later phases. Database values remain strings with server transition validation and database checks; categories and reference data remain lookup tables.

## Files updated for the freeze

- `src/data/request-forms.ts` — reuses `RequestType`.
- `src/server/permissions/permissions.ts` — imports canonical role/permission types.
- `docs/BACKEND_INTEGRATION_PLAN.md` — Next.js Route Handler architecture and permission correction.
- `docs/API_CONTRACT_DRAFT.md` — canonical `/api/v1` Route Handler/resource policy.
- `docs/DATABASE_SCHEMA_DRAFT.md` — serverless PostgreSQL and ownership/classification additions.
- `docs/FRONTEND_BACKEND_MAPPING.md` — Next.js mapping and complete `src/data` inventory.
- `docs/INTEGRATION_EXECUTION_CHECKLIST.md` — single-repository Phase 0–10 gates.

## Unresolved decisions

- Final authentication provider/session transport.
- PostgreSQL provider, serverless driver/pooler, and ORM/query approach.
- Object-storage and malware-scanning providers.
- Queue/workflow/cron provider and regional placement.
- Exact verification/listing state DTOs exposed to the frontend.
- Product decision for currently missing `/login`, `/register`, `/resources`, `/about`, and `/contact` routes.

## Readiness decision

**PASS — API/server foundation work may safely begin.** Do not begin database, authentication, business-request CRUD, document upload, or frontend mock-data replacement until their phase-specific contracts and authorization rules are approved.
