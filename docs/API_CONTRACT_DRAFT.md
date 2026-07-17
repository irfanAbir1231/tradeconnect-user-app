# TradeConnect API Contract Draft

This is a frontend-oriented draft for backend discussion. It uses REST-style resource paths and a consistent response envelope. Exact naming, authentication mechanism, pagination defaults, and validation rules must be approved before implementation.

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

Use ISO-8601 UTC timestamps. IDs are opaque strings. List endpoints support `page`, `pageSize`, `sort`, and documented filters. Mutations should return the updated resource and an audit/event ID where relevant.

## Authentication and current user

| Method/path | Roles | Request | Response | Frontend consumer |
| --- | --- | --- | --- | --- |
| `POST /auth/register` | guest | name, email, password, companyName, businessType, acceptance | session/user summary | Future `/register` |
| `POST /auth/login` | guest | email, password | session/user summary | Future `/login` |
| `POST /auth/logout` | authenticated | none | `{ data: { success: true } }` | Header/session client |
| `GET /me` | authenticated | none | user summary, roles, permissions, company summary | `current-user.ts` replacement, `RoleGate` context |

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
