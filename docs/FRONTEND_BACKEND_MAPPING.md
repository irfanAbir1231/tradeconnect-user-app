# TradeConnect Frontend ↔ Backend Mapping

This document maps the current App Router surface to the proposed Next.js Route Handlers under `/api/v1`. `src/data/*` is the current mock source; each row identifies the replacement query/mutation, expected states, role, and integration phase.

## Phase 4A.2 onboarding boundary

`/dashboard/company/onboarding` now creates a real authenticated company through `POST /api/v1/companies`. It consumes canonical category/country/location reference endpoints and redirects to the server-rendered private company page after success. Request, inquiry, document, verification, and marketplace fixtures remain explicitly demo/deferred.

## Shared adapter conventions

## Phase 3A update

`/login` and `/register` now use Better Auth's same-origin `/api/auth/*` endpoints, while `GET /api/v1/me` returns the safe server-resolved actor. Dashboard and admin layouts perform server-side session/permission checks. All business resource pages continue to use mock data until their planned integration phases.

| Frontend concern | Proposed implementation |
| --- | --- |
| Transport | Typed native `fetch` client in `src/lib/api/client.ts`; optional TanStack Query hooks for authenticated/admin screens |
| Runtime validation | Server-side runtime schemas plus client boundary schemas before mapping into `src/types` |
| Query key | Resource + normalized URL filter object, e.g. `['admin-requests', filters]` |
| Loading | Route-level `loading.tsx` or component skeleton that preserves layout |
| Empty | Existing empty-state component with filter reset and next action |
| Error | Error boundary/inline error with request ID and safe retry |
| Mutation | Disable duplicate submission, show pending state, invalidate/refetch; use optimistic updates only for low-risk preferences |
| Auth | Session provider hydrates `GET /me`; protected layouts handle `401`, `403`, and redirect decisions |
| Privacy | Use separate public/owner/admin DTOs; never fetch private data into public pages |

## Public pages

| Route / component | Current mock source | User action | API method / endpoint | Request / response schema | States | Role / phase |
| --- | --- | --- | --- | --- | --- | --- |
| `/` homepage | `opportunities.ts`, `products.ts`, static stats | Browse featured opportunities/products; CTA navigation | `GET /marketplace/listings?featured=true`; `GET /products?featured=true` | `PublicListingCard[]`, `PublicProductCard[]` | loading skeleton; empty section; safe public error | Guest / 6 |
| `/platform` | Static sections | Read-only | None initially | Static content | Static | Guest / 0 |
| `/solutions` | `solutions.ts` | Open solution | None initially | Static solution config | Static | Guest / 0 |
| `/solutions/import` | `solutions.ts` | Submit request | `POST /requests` after form; optional `POST /documents/presign` | `ImportRequestCreate`, `BusinessRequest` | field/server errors; success reference; rate-limit error | Guest/business user / 4 |
| `/solutions/export` | `solutions.ts` | Submit request | `POST /requests` | `ExportRequestCreate`, `BusinessRequest` | same as import | Guest/business user / 4 |
| `/solutions/supply` | `solutions.ts` | Submit request | `POST /requests` | `SupplyRequestCreate`, `BusinessRequest` | same as import | Guest/business user / 4 |
| `/solutions/technology` | `solutions.ts`, local demo form | Request technology support/demo | `POST /requests` or `POST /demo-requests` | `TechnologyRequestCreate` or `DemoRequestCreate` | pending/success/error/duplicate | Guest/business user / 7 |
| `/submit` | `request-forms.ts` | Choose request type | None | Static route selection | Static | Guest / 0 |
| `/submit/import` | `RequestForm`, `request-forms.ts` | Fill and submit import request | `POST /requests`; upload endpoints for attachment | `ImportRequestCreate`, `DocumentUploadIntent` | initial/loading/field errors/success/429/500 | Guest/business user / 4 |
| `/submit/export` | `RequestForm` | Fill and submit export request | `POST /requests`; product/company document uploads | `ExportRequestCreate` | same | Guest/business user / 4 |
| `/submit/supply` | `RequestForm` | Fill and submit supply request | `POST /requests` | `SupplyRequestCreate` | same | Guest/business user / 4 |
| `/submit/technology` | `RequestForm` | Fill and submit technology request | `POST /requests`; requirement document upload | `TechnologyRequestCreate` | same | Guest/business user / 4 |
| `/marketplace` | `opportunities.ts` | Search/filter/sort opportunities; open detail | `GET /marketplace/listings` | Query: `search,type,category,country,location,status,page,page_size,sort,direction`; `Paginated<PublicListingCard>` | loading; empty/reset; 400/429/500 | Guest / 6 |
| `/marketplace/[slug]` | `opportunities.ts`, `companies.ts` | View safe detail; submit interest/information | `GET /marketplace/listings/:slug`; `POST /marketplace/listings/:id/interests` | `PublicListingDetail`; `InterestCreate` | notFound; form pending/success/validation/rate-limit | Guest/business user / 6 |
| `/directory` | `companies.ts` | Search/filter companies | `GET /companies` | `search,businessType,category,location,verification,page`; `Paginated<PublicCompanyCard>` | loading; empty/reset; 500 | Guest / 3 |
| `/directory/[slug]` | `companies.ts`, `opportunities.ts` | View safe profile; send inquiry | `GET /companies/:slug`; `POST /inquiries` | `PublicCompanyProfile`; `InquiryCreate` | notFound; inquiry success/error | Guest/business user / 3 then 7 |

| `/dashboard/company`, `/dashboard/company/edit` | Authenticated company service + reference APIs | View/update the actor's selected private company draft | `GET/PATCH /companies/:companyId`; reference GET routes | `CompanyOwnerView`; compact member/navigation projections | Onboarding redirect, forbidden redirect, field errors, version conflict | Active member; PATCH owner/admin / 4A.3 |
| `/products` | `products.ts` | Browse/filter products | `GET /products` | `search,category,targetUser,page`; `Paginated<PublicProductCard>` | loading; empty; error | Guest / 7 |
| `/products/[slug]` | `products.ts`, `DemoRequestForm` | View product; request demo | `GET /products/:slug`; `POST /demo-requests` | `PublicProductDetail`; `DemoRequestCreate` | notFound; form pending/success/error | Guest/business user / 7 |
| `/resources`, `/about`, `/contact` | Not implemented | Product decision required | Future CMS/content endpoints or remove links | TBD | Not currently routable | Guest / decision before launch |
| `/login`, `/register` | Not implemented; header enters mock dashboard | Authenticate/register | `POST /auth/login`, `POST /auth/register` | Auth payload/session | field errors; unverified; rate-limit; generic auth error | Guest / 2 |
| `/unauthorized` | Static | Return to safe route | None | Static | Static | All / 2 |

## User dashboard pages

| Route / component | Current mock source | User action | API method / endpoint | Request / response schema | States | Role / phase |
| --- | --- | --- | --- | --- | --- | --- |
| `/dashboard` | `dashboard.ts`, `requests.ts`, `inquiries.ts` | View stats, activity, recommendations, next steps | Parallel `GET /me`, `GET /requests?limit=...`, `GET /inquiries?limit=...`, optional `GET /recommendations` | Dashboard summary DTO | shell skeleton; partial cards; retry; empty recent data | business_user / 2,4,7 |
| `/dashboard/requests` | `requests.ts` | Filter/sort own requests; open detail | `GET /requests` | `status,type,date_from,date_to,page,page_size,sort,direction`; `Paginated<BusinessRequestSummary>` | loading; empty/reset; 401/500 | business_user / 4 |
| `/dashboard/requests/[id]` | `requests.ts` | View timeline/docs; update/cancel where allowed | `GET /requests/:id`; `GET /requests/:id/status-history`; `PATCH /requests/:id`; `POST /requests/:id/submit` | `BusinessRequestDetail`, `StatusHistory[]`, `RequestPatch` | notFound/403; pending update; 409 refresh; 422 transition | business_user / 4 |
| `/dashboard/inquiries` | `inquiries.ts` | View own inquiries/status | `GET /inquiries` | `status,source,date_from,date_to,page`; `Paginated<InquirySummary>` | loading; empty; 401/500 | business_user / 7 |
| `/dashboard/company` | `dashboard.ts`, `companies.ts` | Edit own company profile/categories | `GET /companies/:id`; `PATCH /companies/:id`; `PATCH /companies/:id/categories` | `CompanyDetail`, `CompanyPatch`, category IDs | skeleton; validation; 409; success/error | business_user/verified_business / 3 |
| `/dashboard/documents` | `adminVerification.ts`/static | Upload/replace/delete own documents; view status | `GET /documents?owner=me`; presign/complete/delete/download | `DocumentSummary`, `UploadIntent` | upload progress; quarantine; rejected; retry; empty | business_user / 5 |
| `/dashboard/verification` | `adminVerification.ts`/static | Start/edit/submit verification; respond to information request | `GET /verification`; `POST /verification`; `POST /verification/resubmit` | `VerificationCase`, `VerificationSubmit` | loading; not started; missing docs; success; 409 | business_user / 5 |
| `/dashboard/settings` | Static placeholder | Edit preferences/password later | `PATCH /me`; notification/password endpoints | `ProfilePatch`, preferences | placeholder until API scope approved | business_user / 2,7 |

## Admin pages and actions

| Route / component | Current mock source | User action | API method / endpoint | Request / response schema | States | Role / phase |
| --- | --- | --- | --- | --- | --- | --- |
| `/admin` | `admin.ts`, `requests.ts`, inquiries/verification data | View operational overview and quick actions | `GET /admin/overview` or parallel admin collections | `AdminOverview` | dashboard skeleton; partial widget errors; empty queues | `view_admin_dashboard` / 8 |
| `/admin/requests` | `requests.ts`, `RequestTable`, filters | Search/filter/sort all requests | `GET /admin/requests` | Admin filter DTO + pagination | loading; empty/reset; 403; 500 | `manage_requests` / 4,8 |
| `/admin/requests/import` | `requests.ts` | Type-filtered request queue | `GET /admin/requests?type=import` | `Paginated<AdminRequestRow>` | same | `manage_requests` / 4 |
| `/admin/requests/export` | `requests.ts` | Type-filtered request queue | `GET /admin/requests?type=export` | same | same | `manage_requests` / 4 |
| `/admin/requests/supply` | `requests.ts` | Type-filtered request queue | `GET /admin/requests?type=supply` | same | same | `manage_requests` / 4 |
| `/admin/requests/technology` | `requests.ts` | Type-filtered request queue | `GET /admin/requests?type=technology` | same | same | `manage_requests` / 4 |
| `/admin/requests/[id]` | `requests.ts` | Assign, change status/priority, add note, publish | `GET /admin/requests/:id`; `PUT /requests/:id/assignment`; `POST /requests/:id/status`; `PATCH /requests/:id/priority`; `POST /requests/:id/notes`; marketplace action | Admin detail + mutation DTOs | skeleton; 403; 409; invalid transition; success/error toast | `manage_requests` / 4,8 |
| `/admin/verifications` | `adminVerification.ts`, `VerificationQueue` | Search/filter verification cases | `GET /admin/verifications` | status/companyType/date/reviewer/pagination | loading; empty; 403/500 | `review_verifications` / 5 |
| `/admin/verifications/[companyId]` | `adminVerification.ts`, checklist/document cards | Review checklist/docs; approve/reject/request info | `GET /admin/verifications/:companyId`; checklist/document/decision POST routes | `VerificationDetail`, review/decision DTO | 403; 409; confirmation; success/error | `review_verifications` / 5 |
| `/admin/marketplace` | `adminMarketplace.ts`, moderation table | Filter moderation queue | `GET /admin/marketplace/listings` | moderation filters + pagination | loading; empty; 403/500 | `moderate_marketplace` / 6 |
| `/admin/marketplace/[id]` | `adminMarketplace.ts` | Edit public title/summary; publish/draft/request changes/pause/reject/remove sensitive info | `GET/PATCH /admin/marketplace/listings/:id`; `POST .../action` | `ModerationDetail`, `ModerationPatch`, action DTO | 403; 409; confirmation for destructive actions; success/error | `moderate_marketplace` / 6 |
| `/admin/inquiries` | `inquiries.ts`, `InquiryTable` | Search/filter/assign/status | `GET /admin/inquiries` | source/status/assignee/date/pagination | loading; empty; 403/500 | `manage_requests` / 7,8 |
| `/admin/inquiries/[id]` | `inquiries.ts` | Mark contacted/qualify/introduce/convert/spam/close; add activity | `GET /admin/inquiries/:id`; `PATCH`; `POST /admin/inquiries/:id/activity` | inquiry detail, status/action DTO | 403; 409; confirmation spam/close; success/error | `manage_requests` / 7,8 |
| `/admin/companies` | `adminCompanies.ts`, `CompanyAdminTable` | Search/filter companies | `GET /admin/companies` | businessType/verification/location/category/accountStatus/pagination | loading; empty/reset; 403 | `manage_companies` / 8 |
| `/admin/companies/[slug]` | `adminCompanies.ts`, `CompanyAdminDetail` | Approve/suspend/restore/feature/edit categories/message/public profile | `GET /admin/companies/:slug`; verification/suspension/category/feature routes | admin company DTO + action DTOs | 403; 409; suspension confirmation; success/error | `manage_companies` / 3,8 |
| `/admin/analytics` | requests/companies/inquiries/moderation mocks | Change date range and inspect metrics | `GET /admin/analytics` | `from,to,timezone`; `AnalyticsReport` | skeleton; empty range; 403; 500 | `view_analytics` / 9 |
| `/admin/documents` | Catch-all placeholder | Document operations decision required | Future `GET /admin/documents` | TBD | Placeholder | `manage_requests`/review role / 5,8 |
| `/admin/users` | Catch-all placeholder | User management decision required | Future `GET/PATCH /admin/users` | TBD | Placeholder | `manage_team` / 2,8 |
| `/admin/team` | Catch-all placeholder | Team member management decision required | Future `/admin/team-members` | TBD | Placeholder | `manage_team` / 2,8 |
| `/admin/categories` | Catch-all placeholder | Manage taxonomy | `GET/POST/PATCH /admin/categories` | category DTO | loading/validation/conflict | `manage_settings` / 3 |
| `/admin/settings` | Catch-all placeholder | Platform settings decision required | Future `/admin/settings` | TBD | Placeholder | `manage_settings` / 9 |

## Form schema mapping

| Current frontend form | API payload | File handling | Success contract |
| --- | --- | --- | --- |
| Import `RequestForm` | `{ requestType: "import", productName, categoryId, sourceCountryId, destinationCountryId, quantity, budgetRange?, timeline, description, contact }` | Presign/complete request documents before submit, or submit draft then attach | `201 BusinessRequest` with reference number |
| Export `RequestForm` | `{ requestType: "export", companyName, productName, categoryId, targetCountries, moq, monthlyCapacity, priceRange?, certifications?, contact }` | Product images/company profile through document service | `201 BusinessRequest` |
| Supply `RequestForm` | `{ requestType: "supply", supplyMode, categoryId, productName, locationId, quantity, budgetRange?, frequency, contact }` | Supporting documents | `201 BusinessRequest` |
| Technology `RequestForm` | `{ requestType: "technology", businessType, solutionType, description, budgetRange?, timeline, existingSystem?, contact }` | Requirement document | `201 BusinessRequest` |
| `InquiryForm` | `{ name, companyName, email, phone, message, inquiryType, source, relatedId }` | No file currently | `202` safe confirmation + inquiry ID |
| `DemoRequestForm` | `{ name, companyName, email, phone, businessType, productId, preferredDemoTime, message }` | No file currently | `202` safe confirmation + inquiry ID |

## Route protection and failure behavior

| Area | Protection | `401` | `403` | `404` | `409/422` | `429/500` |
| --- | --- | --- | --- | --- | --- | --- |
| Public pages | None | N/A | N/A | notFound for detail | Inline form error | Safe retry/banner |
| User dashboard | Authenticated session + company scope | Redirect login | Unauthorized page | notFound/empty | Refetch and explain | Retry state |
| Admin pages | Permission + resource scope | Redirect login | Unauthorized page | notFound without leakage | Conflict banner and refresh | Admin retry/request ID |
| Uploads | Resource ownership/reviewer role | Rehydrate session | Hide/deny download | Safe notFound | File-specific correction | Retry only if upload token valid |

## DTO ownership and privacy

Use `PublicCompany`, `OwnerCompany`, `AdminCompany`, `PublicListing`, `OwnerRequest`, and `AdminRequest` DTO families rather than one all-purpose response. Public components should never import admin DTOs. The API should filter private fields in SQL/service queries and server response schemas before the response reaches a client component.

## `src/data/` migration inventory

These are the current application imports found under `src/`. They may remain as development/demo seed data, but production pages should receive records through the listed API/query boundary:

| Current mock file | Current consumers | Production replacement | Keep as seed/demo? |
| --- | --- | --- | --- |
| `request-forms.ts` | Submit pages/components | Keep static form labels/config; submit payloads go to `/api/v1/requests` | Yes, presentation config |
| `dashboard.ts` | User dashboard/nav/company/settings | `GET /api/v1/me`, `/api/v1/companies/:id`, dashboard summary queries | Yes, local fixture only |
| `requests.ts` / `dashboardRequests.ts` | User request pages, admin request pages/components, analytics, admin derived data | `/api/v1/requests`, `/api/v1/admin/requests`, `/api/v1/requests/:id` | Yes, seeded test/demo fixture |
| `companies.ts` | Directory, marketplace detail, admin derived data/verification | `/api/v1/companies`, public/admin company endpoints | Yes, seeded test/demo fixture |
| `opportunities.ts` | Marketplace and company public pages | `/api/v1/marketplace/listings` | Yes, public demo fixture |
| `products.ts` | Product listing/detail, inquiry relations | `/api/v1/products` | Yes, seeded catalogue fixture |
| `inquiries.ts` | Admin inquiry pages, analytics, admin company projections | `/api/v1/inquiries`, `/api/v1/admin/inquiries` | Yes, seeded test/demo fixture |
| `adminMarketplace.ts` | Admin moderation pages, analytics/company projections | `/api/v1/admin/marketplace/listings` | Yes, admin fixture only |
| `adminVerification.ts` | Dashboard docs/verification, admin verification pages/company projections | `/api/v1/verification`, `/api/v1/admin/verifications`, document endpoints | Yes, seeded workflow fixture |
| `adminCompanies.ts` | Admin company pages | `/api/v1/admin/companies` | Yes, derived fixture only |
| `admin.ts` | Admin navigation, overview stats, catch-all placeholders | Admin overview/analytics/reference endpoints; static nav can remain | Navigation yes; metrics no |
| `solutions.ts` | Public solution pages | Static marketing content may remain; request/demo mutations use API | Yes, content config |
| `nav.ts` | Header/footer/mobile navigation | Static navigation can remain until CMS requirement | Yes |
| `current-user.ts` | `RoleGate` mock UI | `GET /api/v1/me` and session context | No in production; local fixture only |

Do not make `src/data` a runtime database adapter. A later seed script may import compatible fixtures into a development database, but production repositories must query PostgreSQL and return validated DTOs.
