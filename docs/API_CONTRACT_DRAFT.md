# TradeConnect API Contract Draft

## Phase 4A.4 company-domain note

Company PATCH uses an expected `version` and returns the canonical `COMPANY_VERSION_CONFLICT` (409) for stale writes. Reference endpoints remain public, minimal, active-only, deterministic, and cached separately from private `no-store` company responses.

This is a frontend-oriented draft for the full-stack Next.js application. It uses Next.js Route Handlers under `src/app/api/v1` and a consistent JSON response envelope. Exact naming, authentication mechanism, pagination defaults, and validation rules must be approved before implementation.

Phase 2 adds the database readiness contract only. No business resource API is enabled yet. `GET /api/v1/health` remains liveness-only; `GET /api/v1/health/ready` performs a minimal `SELECT 1` using the server-only Prisma boundary and returns `503 SERVICE_UNAVAILABLE` without provider details when the database is unavailable.

## Conventions

Base URL: `/api/v1`

Successful response:

```json
{
  "data": {},
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

Error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fields": {
      "email": "Enter a valid email address."
    },
    "requestId": "req_01J..."
  }
}
```

The error code `SERVICE_UNAVAILABLE` maps to HTTP `503`. Error responses include safe `error.requestId` and `meta.timestamp` values and never include database connection details, raw provider errors, or stack traces.

Use ISO-8601 UTC timestamps. IDs are opaque strings. List endpoints support `page`, `pageSize`, `sort`, and documented filters. Mutations should return the updated resource and an audit/event ID where relevant.

## Authentication and current user

Phase 3A uses Better Auth's same-origin endpoints at `/api/auth/*` for registration, sign-in, sign-out, and session lifecycle. These endpoints use Better Auth's contract rather than the future `/api/v1` domain envelope. The implemented actor endpoint is `GET /api/v1/me`.

| Method/path | Roles | Request | Response | Frontend consumer |
| --- | --- | --- | --- | --- |
| `POST /api/auth/sign-up/email` | guest | Better Auth name/email/password payload | Better Auth session/user payload | `/register` |
| `POST /api/auth/sign-in/email` | guest | Better Auth email/password payload | Better Auth session/user payload | `/login` |
| `POST /api/auth/sign-out` | authenticated | none | Better Auth success payload | Logout control |
| `GET /api/v1/me` | authenticated | none | safe actor profile, roles, permissions, memberships | Future session context |

The backend must return `401` for unauthenticated requests and `403` for authenticated users lacking permission. Do not trust a role sent by the browser.

## Companies

| Method/path | Roles | Request/query | Response |
| --- | --- | --- | --- |
| `GET /companies` | guest | `search`, `businessType`, `category`, `location`, `verification`, pagination | public company cards only |
| `GET /companies/:slug` | guest | none | public company profile, public products/services, approved certifications, public opportunities |
| `PATCH /companies/:id` | business_user/company admin | editable company profile fields | updated own company |
| `GET /companies/:id/admin-view` | team_member/admin | none | private admin company record, contact users, documents, notes, activity |
| `PATCH /companies/:id/categories` | admin/manage_companies | category IDs | updated categories + audit event |
| `POST /companies/:id/feature` | admin/manage_companies | `{ isFeatured: boolean }` | updated company |
| `POST /companies/:id/suspension` | admin/manage_companies | `{ action: "suspend" | "restore", reason?: string }` | account status + audit event |

Public responses must never include private user contacts, private documents, internal notes, exact budget details, or admin-only flags.

## Business requests

| Method/path | Roles | Request/query | Response |
| --- | --- | --- | --- |
| `GET /requests` | authenticated | own-scope filters: `type`, `status`, `dateFrom`, `dateTo`, `page`, `pageSize`, `sort` | paginated own requests |
| `POST /requests` | business_user | request form payload, optional document upload references | created `BusinessRequest` with `referenceNumber` |
| `GET /requests/:id` | owner/team_member/admin | none | request detail; private fields according to permission |
| `PATCH /requests/:id` | owner/team_member/admin | allowed editable fields and optimistic `version` | updated request |
| `GET /requests/:id/status-history` | owner/team_member/admin | none | ordered `RequestStatusHistory[]` |
| `POST /requests/:id/notes` | team_member/admin | `{ body: string }` | created internal `AdminNote` |
| `PATCH /requests/:id/assignment` | team_member/admin | `{ teamMemberId: string | null }` | updated assignment |
| `POST /requests/:id/status` | team_member/admin | `{ status, reason?, version }` | updated request + transition event |
| `PATCH /requests/:id/priority` | team_member/admin | `{ priority, version }` | updated request |
| `POST /requests/:id/marketplace` | admin/moderate_marketplace | public projection fields and publication action | moderation listing |

Create payloads should use the form field mapping in [`FRONTEND_INVENTORY.md`](./FRONTEND_INVENTORY.md), with structured arrays for countries, certifications, and documents rather than comma-separated strings.

## Documents

| Method/path | Roles | Request | Response |
| --- | --- | --- | --- |
| `POST /documents/presign` | business_user/team_member/admin | filename, MIME type, size, document type, related entity | short-lived upload URL + document ID |
| `POST /documents/:id/complete` | uploader/team_member/admin | storage checksum/metadata | document record |
| `GET /documents/:id/download-url` | owner/team_member/admin | none | short-lived signed URL |
| `POST /documents/:id/review` | review_verifications/admin | `{ decision, note? }` | document review status + audit event |

Validate extension, MIME, size, checksum, malware scan, and ownership server-side. The browser must not receive a permanent storage URL.

## Verification

| Method/path | Roles | Request/query | Response |
| --- | --- | --- | --- |
| `GET /admin/verifications` | review_verifications | `search`, `status`, `companyType`, `reviewerId`, dates, pagination | verification queue |
| `GET /admin/verifications/:companyId` | review_verifications | none | verification case with checklist and private documents |
| `POST /admin/verifications/:companyId/decision` | review_verifications | `{ decision: "approve" | "needs_information" | "reject", reason, version }` | updated case + audit event |
| `POST /admin/verifications/:companyId/checklist` | review_verifications | checklist item decision/note | updated checklist |

Final decisions require a server-side confirmation rule, reviewer identity, reason where applicable, and an immutable audit record.

## Marketplace

| Method/path | Roles | Request/query | Response |
| --- | --- | --- | --- |
| `GET /marketplace/listings` | guest | keyword, type, category, location, status, pagination | public listing cards |
| `GET /marketplace/listings/:slug` | guest | none | public listing detail + safe company snapshot |
| `GET /admin/marketplace/listings` | moderate_marketplace | type, category, publicationStatus, verification, search, pagination | moderation records with private request relation |
| `GET /admin/marketplace/listings/:id` | moderate_marketplace | none | moderation detail/private fields |
| `PATCH /admin/marketplace/listings/:id` | moderate_marketplace | public title, summary, visibility fields, version | updated listing |
| `POST /admin/marketplace/listings/:id/action` | moderate_marketplace | publish/draft/request_changes/pause/reject/remove_sensitive_data + reason | updated listing + audit event |

The public endpoint must use a separate serializer/projection. Removing a field in the React preview is not sufficient privacy protection.

## Inquiries and leads

| Method/path | Roles | Request/query | Response |
| --- | --- | --- | --- |
| `POST /inquiries` | guest/business_user | sender details, company, inquiry type, message, related entity | created inquiry with safe confirmation |
| `GET /inquiries` | authenticated | own-scope status/source/date filters, pagination | own inquiries |
| `GET /inquiries/:id` | owner/team_member/admin | none | detail with contacts based on permission |
| `GET /admin/inquiries` | manage_requests/admin | source, status, reviewer/assignee, date, search, pagination | admin inquiry queue |
| `PATCH /admin/inquiries/:id` | manage_requests/admin | status, assignment, note, version | updated inquiry + timeline event |
| `POST /demo-requests` | guest/business_user | demo form fields, product ID | inquiry/lead record |

Public submission endpoints need rate limiting, spam detection, consent capture, and safe error messages that do not disclose whether a private account exists.

## Products and technology solutions

| Method/path | Roles | Request/query | Response |
| --- | --- | --- | --- |
| `GET /products` | guest | category, targetUser, search, pagination | public product cards |
| `GET /products/:slug` | guest | none | product detail, safe provider profile, FAQs |
| `POST /admin/products` | manage_settings/admin | product payload | created product |
| `PATCH /admin/products/:id` | manage_settings/admin | editable product fields, version | updated product |

## Analytics and notifications

| Method/path | Roles | Request/query | Response |
| --- | --- | --- | --- |
| `GET /admin/analytics` | view_analytics | `from`, `to`, timezone, optional dimensions | metric cards, series, breakdowns, operations metrics |
| `GET /notifications` | authenticated | unread, page, pageSize | notification list/count |
| `PATCH /notifications/:id/read` | authenticated | none | updated notification |

Analytics responses should define timezone and whether counts are event-based or entity-based. Do not expose cross-company analytics to business users.

## Response privacy matrix

| Field | Public marketplace/profile | Owning user | Team/admin |
| --- | --- | --- | --- |
| Company name/category/location | approved public subset | yes | yes |
| User email/phone | no | own context | authorized admin only |
| Exact budget | no | own request | authorized operations only |
| Private documents | no | own documents | authorized reviewers only |
| Internal notes/admin notes | no | no | authorized operations only |
| Assignment details | no | limited status only | team/admin |

## Error and concurrency rules

- `400 INVALID_REQUEST`: malformed request envelope, unsupported query shape, or invalid request ID.
- `400 VALIDATION_ERROR`: malformed or invalid fields.
- `401 UNAUTHENTICATED`: no valid session.
- `403 FORBIDDEN`: session lacks permission or ownership.
- `404 NOT_FOUND`: resource is absent or intentionally hidden.
- `409 VERSION_CONFLICT`: record changed since the UI loaded it; return current version and ask the client to refresh.
- `413 FILE_TOO_LARGE`: upload exceeds policy.
- `422 INVALID_TRANSITION`: requested status/action is not allowed from the current state.
- `429 RATE_LIMITED`: public submission or login throttled.
- `500 INTERNAL_ERROR`: generic message plus request ID.

Use an integer or opaque `version`/ETag on mutation endpoints so two admins cannot silently overwrite one another’s local changes.

## Open contract decisions

1. REST versus GraphQL and session-cookie versus token transport.
2. Company membership model for users who work with multiple companies.
3. Exact request status transition matrix and required reasons.
4. File size, MIME, retention, and malware scanning policy.
5. Search implementation and supported sort fields.
6. Notification channels and consent requirements.
7. Analytics definitions for “completed,” “converted,” “views,” and “interests.”
8. Whether resources/about/contact get standalone CMS-backed pages or remain anchors.

---

## Next.js Route Handler/PostgreSQL contract refinement

### Transport and naming conventions

- Base URL: same-origin `/api/v1` Route Handlers in the Vercel deployment; future external consumers may use an approved API origin without changing the resource contract.
- JSON uses `camelCase` at the frontend boundary. Server runtime schemas and database naming may use `snake_case` internally, but Route Handler serializers must be consistent and documented.
- All timestamps are ISO-8601 UTC strings. All IDs are opaque strings; clients must not infer database sequences.
- `GET` collections use `page`, `page_size`, `search`, `sort`, `direction`, `status`, `type`, `priority`, `category`, `country`, `location`, `assigned_to`, `verification_status`, `date_from`, and `date_to` where relevant.
- Mutations accept an optional `version` or `If-Match` ETag. A stale version returns `409 VERSION_CONFLICT` rather than silently overwriting another operator’s change.
- Every mutating response includes the updated resource, `updatedAt`, and an `auditEventId` when the action is auditable.

### Canonical response envelopes

```json
{
  "data": {},
  "meta": {
    "requestId": "req_01J..."
  }
}
```

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 42,
    "totalPages": 3,
    "hasNext": true,
    "hasPrevious": false,
    "requestId": "req_01J..."
  }
}
```

The error envelope is:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fields": {
      "email": "Enter a valid email address."
    },
    "requestId": "req_01J...",
    "retryAfterSeconds": null
  }
}
```

### Authentication and session endpoints

| Method/path | Request | Response | Roles / notes |
| --- | --- | --- | --- |
| `POST /auth/register` | `{ name, email, password, companyName?, businessType?, acceptTermsVersion, acceptPrivacyVersion }` | `{ user, session: { expiresAt } }` or verification-required state | Guest; generic duplicate-email response |
| `POST /auth/verify-email` | `{ token }` | user/session summary | Guest with valid single-use token |
| `POST /auth/login` | `{ email, password }` | user/session summary | Guest; do not reveal whether account exists |
| `POST /auth/refresh` | refresh cookie or rotating token | new access/session expiry | Auth transport only; revoke reuse |
| `POST /auth/logout` | none | `{ success: true }` | Authenticated; revoke current token family |
| `POST /auth/forgot-password` | `{ email }` | generic accepted response | Guest; rate limited |
| `POST /auth/reset-password` | `{ token, password }` | `{ success: true }` | Valid single-use token |
| `GET /me` | none | user, roles, permissions, memberships, active company | Authenticated |
| `PATCH /me` | profile fields | updated user | Authenticated, own record |

### Reference data and company endpoints

| Method/path | Query/body | Response | Roles |
| --- | --- | --- | --- |
| `GET /categories` | `scope=companies\|requests\|products` | active category tree/list | Guest read |
| `GET /countries` | `search?` | country list | Guest read |
| `GET /locations` | `country`, `search`, `page` | location list | Guest read |
| `GET /companies` | public filters + pagination | public company cards | Guest |
| `GET /companies/:slug` | none | public profile projection | Guest |
| `PATCH /companies/:id` | approved editable profile fields | company summary | Company member/admin |
| `GET /companies/:id/members` | none | member summaries | Company owner/admin; authorized admin |
| `POST /companies/:id/invitations` | `{ email, role }` | invitation summary | Company owner/admin |
| `PATCH /companies/:id/categories` | `{ categoryIds }` | updated categories | Company admin/admin |
| `POST /companies/:id/feature` | `{ isFeatured }` | updated company | `manage_companies` |
| `POST /companies/:id/suspension` | `{ action, reason }` | account status | `manage_companies`; confirmation is UI only, server validates |
| `GET /admin/companies` | admin filters + pagination | private company rows | `manage_companies` |
| `GET /admin/companies/:slug` | none | private admin company view | `manage_companies` |

### Business request endpoints

| Method/path | Request/query | Response | Roles |
| --- | --- | --- | --- |
| `GET /requests` | owner filters, pagination, sort | paginated own requests | Authenticated business user |
| `POST /requests` | normalized import/export/supply/technology payload | created request | `submit_request` |
| `GET /requests/:id` | none | owner-safe request detail | Owner, assigned team, admin |
| `PATCH /requests/:id` | editable fields + `version` | updated request | Owner while editable; team/admin by policy |
| `POST /requests/:id/submit` | `{ version }` | submitted request | Owner/company member |
| `GET /requests/:id/status-history` | none | history list | Owner-safe; operations/admin full |
| `POST /requests/:id/status` | `{ status, reason?, version }` | updated request + transition | Team/admin; owner only supported resubmission/cancel |
| `PATCH /requests/:id/priority` | `{ priority, version }` | updated request | `manage_requests` |
| `PUT /requests/:id/assignment` | `{ teamMemberId }` | assignment | `manage_requests` |
| `GET /requests/:id/notes` | none | internal notes | Team/admin only |
| `POST /requests/:id/notes` | `{ body }` | created note | Team/admin only |
| `POST /requests/:id/marketplace` | public title/summary/field policy | moderation listing | `moderate_marketplace` |
| `GET /admin/requests` | all admin filters + pagination | private request rows | `manage_requests` |
| `GET /admin/requests/:id` | none | full admin request view | `manage_requests` |

The request payload must use structured fields, for example `quantity: { value, unit, frequency }`, `budgetRange: { min, max, currency, unit }`, and `targetCountries: [{ countryCode }]`. Keep the current frontend’s human-readable text as a temporary adapter concern, not the long-term database contract.

### Documents and verification endpoints

| Method/path | Request | Response | Roles |
| --- | --- | --- | --- |
| `POST /documents/presign` | `{ fileName, contentType, sizeBytes, documentType, resourceType, resourceId }` | document ID, upload URL, required headers, expiry | Owner/team/admin by resource |
| `POST /documents/:id/complete` | `{ checksum, storageVersion }` | document metadata + scan status | Uploader/authorized operator |
| `GET /documents/:id/download-url` | none | short-lived signed URL | Owner/reviewer/admin by resource |
| `DELETE /documents/:id` | `{ reason? }` | soft-deleted document | Owner before review or authorized admin |
| `GET /verification` | none | current company verification case | Company member |
| `POST /verification` | profile/document references | submitted case | Company member |
| `GET /admin/verifications` | search/status/companyType/reviewer/date/pagination | queue rows | `review_verifications` |
| `GET /admin/verifications/:companyId` | none | private case/checklist/documents | `review_verifications` |
| `POST /admin/verifications/:companyId/checklist` | `{ item, status, note?, version }` | checklist item | `review_verifications` |
| `POST /admin/verifications/:companyId/documents/:documentId/review` | `{ decision, note?, version }` | review record | `review_verifications` |
| `POST /admin/verifications/:companyId/decision` | `{ decision, reason?, version }` | updated verification case | `review_verifications` |

Document responses contain metadata and authorized URLs only. They never return storage credentials. A document in `quarantined` or `rejected` status cannot be downloaded by a public endpoint.

### Marketplace and interest endpoints

| Method/path | Request/query | Response | Roles |
| --- | --- | --- | --- |
| `GET /marketplace/listings` | keyword/type/category/country/location/status/pagination | public listing cards | Guest |
| `GET /marketplace/listings/:slug` | none | public listing detail projection | Guest |
| `POST /marketplace/listings/:id/interests` | inquiry/interest payload | safe confirmation + inquiry ID | Guest/business user; rate limited |
| `GET /admin/marketplace/listings` | moderation filters + pagination | private moderation rows | `moderate_marketplace` |
| `GET /admin/marketplace/listings/:id` | none | private listing/request + public projection | `moderate_marketplace` |
| `PATCH /admin/marketplace/listings/:id` | public title/summary/field flags + `version` | updated listing | `moderate_marketplace` |
| `POST /admin/marketplace/listings/:id/action` | `{ action, reason?, version }` | updated listing + audit event | `moderate_marketplace` |

Actions are `publish`, `save_draft`, `request_changes`, `pause`, `reject`, `remove_sensitive_information`, and `archive`. The server recomputes the safe projection and ignores forbidden public fields supplied by the client.

### Inquiry, product, and demo endpoints

| Method/path | Request/query | Response | Roles |
| --- | --- | --- | --- |
| `POST /inquiries` | sender/company/message/type/source/relation | safe inquiry confirmation | Guest/business user |
| `GET /inquiries` | own status/source/date/pagination | own inquiry list | Authenticated |
| `GET /inquiries/:id` | none | authorized inquiry detail | Owner/team/admin |
| `GET /admin/inquiries` | search/source/status/assignee/date/pagination | private queue | `manage_requests` |
| `GET /admin/inquiries/:id` | none | private detail | `manage_requests` |
| `PATCH /admin/inquiries/:id` | status/assignment + `version` | updated inquiry | `manage_requests` |
| `POST /admin/inquiries/:id/activity` | `{ action, body? }` | activity event | `manage_requests` |
| `GET /products` | search/category/targetUser/pagination | public product cards | Guest |
| `GET /products/:slug` | none | public product detail | Guest |
| `POST /demo-requests` | demo form + `productId` | safe lead confirmation | Guest/business user |
| `GET /admin/products` | filters/pagination | admin product records | `manage_settings` |
| `POST /admin/products` | product payload | product | `manage_settings` |
| `PATCH /admin/products/:id` | product fields + `version` | product | `manage_settings` |

### Notifications and analytics endpoints

| Method/path | Request/query | Response | Roles |
| --- | --- | --- | --- |
| `GET /notifications` | `unread`, pagination | notification list/count | Authenticated owner |
| `PATCH /notifications/:id/read` | none | updated notification | Notification owner |
| `PATCH /notification-preferences` | channel/event preferences | updated preferences | Authenticated owner |
| `GET /admin/analytics` | `from`, `to`, timezone, dimensions | metrics, series, breakdowns, operations | `view_analytics` |
| `GET /admin/audit-logs` | actor/resource/action/date/pagination | audit rows | `manage_settings` or security role |

### Error contract and frontend behavior

| HTTP/code | Meaning | Frontend behavior |
| --- | --- | --- |
| `400 VALIDATION_ERROR` | Shape/field validation failed | Keep form values; show field errors and summary |
| `401 UNAUTHENTICATED` | Session missing/expired | Refresh once; otherwise clear session and redirect to login |
| `403 FORBIDDEN` | Authenticated but not allowed | Render unauthorized state; do not retry |
| `404 NOT_FOUND` | Resource absent or intentionally hidden | Use route `notFound()`/empty state; avoid leaking existence |
| `409 VERSION_CONFLICT` | Record changed by another actor | Refetch; show conflict banner; ask user to review before retry |
| `413 FILE_TOO_LARGE` | Upload exceeds limit | Show file-specific error and allowed limit |
| `422 INVALID_STATUS_TRANSITION` | Workflow action invalid | Refresh detail; explain current allowed action |
| `422 EMAIL_NOT_VERIFIED` | User must verify email | Show verification prompt/resend action |
| `422 DOCUMENT_QUARANTINED` | File scan pending/failed | Show scan status; do not retry blindly |
| `429 RATE_LIMITED` | Too many requests/submissions | Show retry-after and disable submit temporarily |
| `500 INTERNAL_ERROR` | Unexpected backend failure | Generic error + request ID; retry safe GETs only |
| `503 SERVICE_UNAVAILABLE` | Dependency/maintenance outage | Show service banner and retry/backoff |

### Public/private serializer rule

Next.js Route Handlers should expose separate response schemas for public, owner, team, and admin contexts. Public listing and company serializers must exclude user email/phone, exact budget, private documents, internal notes, assignment details, and moderation-only fields at query/serialization time. The frontend preview is a usability layer, not a privacy control.

## Canonical Next.js API tree and operation policy

```text
src/app/api/v1/
├── auth/
├── users/
├── me/
├── companies/
├── requests/
├── verifications/
├── documents/
├── marketplace/
├── inquiries/
├── products/
├── demo-requests/
├── notifications/
├── admin/
└── health/
```

The following matrix records the default runtime and idempotency policy. All handlers use Node.js runtime unless a later compatibility review proves a route can safely use Edge.

| Resource | Representative route/method | Validation | Service method | Database entities | Response/public-private rule | Errors | Cache | Idempotent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Health | `/api/v1/health` `GET` | None | `healthService.check` | None/readiness dependencies | Health summary; no secrets | 503 | `no-store` | Yes/read-only |
| Auth | `/api/v1/auth/login` `POST` | Login schema | `authService.login` | users, sessions, audit_logs | Session summary only; no token hashes | 400/401/429 | `no-store` | No; use rate-limit key |
| Me | `/api/v1/me` `GET` | Session | `userService.getCurrentContext` | users, roles, company_members | Owner-scoped user/permissions | 401 | `no-store` | Yes/read-only |
| Companies | `/api/v1/companies` `GET`, `/companies/:id` `PATCH` | Public filter/company patch schemas | `companyService.list/get/update` | companies, members, categories, locations | Public DTO on GET; owner/admin DTO on PATCH | 400/401/403/404/409 | Public GET may revalidate; private no-store | PATCH with version; GET yes |
| Requests | `/api/v1/requests` `GET/POST`, `/requests/:id/status` `POST` | Type-specific request and transition schemas | `requestService.create/list/transition` | requests, history, assignments, notes | Owner/admin DTO; never public by default | 400/401/403/404/409/422/429 | Auth no-store | POST create requires Idempotency-Key; transition requires version |
| Verification | `/api/v1/verifications`, `/api/v1/admin/verifications/:id/decision` | Verification/checklist/review schemas | `verificationService.submit/review/decide` | verifications, documents, reviews, audit | Private to company/reviewer/admin | 401/403/404/409/422 | `no-store` | Decision requires version/key |
| Documents | `/api/v1/documents/presign`, `/complete` | File metadata/checksum schema | `documentService.authorize/complete` | documents, resource links, audit | Metadata only; signed URL private | 400/401/403/404/413/415/422 | `no-store` | Presign key and complete key |
| Marketplace | `/api/v1/marketplace/listings` `GET`; admin action `POST` | Public filter/moderation/action schemas | `marketplaceService.list/moderate` | listings, requests, interests, audit | Public projection versus admin DTO | 400/403/404/409/422/429 | Published GET short revalidate; admin no-store | Actions require Idempotency-Key/version |
| Inquiries | `/api/v1/inquiries` `POST`; admin `PATCH` | Inquiry/demo schemas | `inquiryService.create/update` | inquiries, activities, users, relations | Public confirmation; private owner/admin detail | 400/401/403/404/409/429 | Public POST no-store; lists private no-store | Public create requires key |
| Products | `/api/v1/products` `GET`, admin `PATCH` | Product/filter schemas | `productService.list/get/update` | products, companies, categories | Public product DTO; provider/admin write DTO | 400/403/404/409 | Public GET may revalidate | PATCH versioned |
| Demo requests | `/api/v1/demo-requests` `POST` | Demo request schema | `leadService.createDemoRequest` | demo_requests, inquiries, products | Safe confirmation only | 400/404/409/429 | `no-store` | Idempotency-Key required |
| Notifications | `/api/v1/notifications` `GET`, `/:id/read` `PATCH` | Read-state schema | `notificationService.list/markRead` | notifications, preferences | Owner-scoped | 401/403/404/409 | `no-store` | Mark-read is idempotent |
| Admin | `/api/v1/admin/*` | Resource-specific admin schemas | Domain services, never a generic mutation service | All scoped domain tables, audit_logs | Admin DTO only; private data | 401/403/404/409/422 | `no-store` | Destructive actions require key/version |

## Server Actions policy

Server Actions may be used only for simple same-origin mutations initiated exclusively by this Next.js UI, such as marking a notification read or updating a low-risk preference. The Action must call the same server service, perform the same session/permission checks, use the same validation/error mapping, and remain idempotent where relevant.

Prefer Route Handlers for resource CRUD, list/search/filter endpoints, uploads, webhooks, mobile-ready APIs, admin operations, integrations, and all resources in the contract above. Do not create duplicate logic: a Server Action and Route Handler must call the same service function or only the Route Handler should exist.

## Caching policy

- Public marketplace, directory/company, and product GET responses may use a short `revalidate` window only with public DTOs and a stable public cache tag.
- Authenticated dashboard, user inquiry, verification, document, and admin responses use `Cache-Control: private, no-store` by default.
- Mutations invalidate only affected public tags and user/admin query keys; never invalidate or reuse a global private cache key.
- Route Handlers must not cache a response containing cookies, user IDs, company membership, contact details, budgets, documents, or internal notes.
- A public listing is cacheable only when its database status is `published` and its public projection has been regenerated after moderation.
