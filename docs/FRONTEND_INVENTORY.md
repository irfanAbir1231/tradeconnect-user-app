# TradeConnect Frontend Inventory

This inventory describes the frontend surface as it exists before backend integration. All records are mock data unless stated otherwise.

## Application architecture

| Area | Location | Responsibility |
| --- | --- | --- |
| App Router | `src/app` | Route segments, layouts, static params, page composition |
| Public chrome | `src/components/layout` | Header, footer, mobile navigation, public/admin separation |
| Public sections | `src/components/home`, `src/components/sections` | Reusable hero, cards, stats, steps, CTA, and content sections |
| User dashboard | `src/app/dashboard`, `src/components/dashboard` | User-facing request, company, document, verification, and inquiry shell |
| Admin dashboard | `src/app/admin`, `src/components/admin` | Request operations, verification, moderation, inquiry, company, and analytics UI |
| Forms | `src/components/forms`, `src/components/submit` | Local-state inquiry, demo, and request submission experiences |
| Shared types | `src/types/index.ts`, `src/types/auth.ts` | Domain and future authorization contracts |
| Shared utilities | `src/lib` | `cn()`, permission evaluation, presentation helpers |
| Mock data | `src/data` | Static examples consumed by public, user, and admin pages |

## Route inventory

| Route | Page/module | Data source | Interaction |
| --- | --- | --- | --- |
| `/` | Homepage | `opportunities.ts`, `products.ts`, static stats | CTA navigation, responsive cards |
| `/platform` | Platform overview | `sections` components, static content | CTA navigation |
| `/solutions` | Solution index | `solutions.ts` | Solution card links |
| `/solutions/import` | Import solution | `solutions.ts`, `RequestForm` preview | FAQ/details, submit CTA |
| `/solutions/export` | Export solution | `solutions.ts`, `RequestForm` preview | FAQ/details, submit CTA |
| `/solutions/supply` | Supply solution | `solutions.ts`, `RequestForm` preview | FAQ/details, submit CTA |
| `/solutions/technology` | Technology solution | `solutions.ts`, `DemoRequestForm` | Local success state |
| `/submit` | Request selection | `request-forms.ts` | Four request-type links |
| `/submit/import` | Import request form | `request-forms.ts` | Local form submit state |
| `/submit/export` | Export request form | `request-forms.ts` | Local form submit state |
| `/submit/supply` | Supply request form | `request-forms.ts` | Local form submit state |
| `/submit/technology` | Technology request form | `request-forms.ts` | Local form submit state |
| `/marketplace` | Opportunity listing | `opportunities.ts` | Search/filter state, detail links |
| `/marketplace/[slug]` | Opportunity detail | `opportunities.ts`, `companies.ts` | notFound, inquiry form anchor |
| `/directory` | Company directory | `companies.ts` | Search/filter state, profile links |
| `/directory/[slug]` | Public company profile | `companies.ts`, `opportunities.ts` | notFound, inquiry form |
| `/products` | Technology product listing | `products.ts` | Product detail/demo links |
| `/products/[slug]` | Product detail | `products.ts`, `DemoRequestForm` | notFound, local demo success |
| `/unauthorized` | Access fallback | Static copy | Return-to-dashboard link |
| `/dashboard` | User overview | `dashboard.ts`, `requests.ts` | Mock stats/activity/next steps |
| `/dashboard/requests` | User requests | `requests.ts` | Search/filter/list links |
| `/dashboard/requests/[id]` | User request detail | `requests.ts` | notFound, mock status/update controls |
| `/dashboard/inquiries` | User inquiries | `inquiries.ts` | Static list |
| `/dashboard/company` | User company | `dashboard.ts` | Static company profile shell |
| `/dashboard/documents` | User documents | `adminVerification.ts`/static | Mock upload cards/table |
| `/dashboard/verification` | User verification | `adminVerification.ts`/static | Progress and CTA links |
| `/dashboard/settings` | User settings | Static copy | Disabled future settings |
| `/admin` | Admin overview | `admin.ts`, `requests.ts`, verification/inquiry data | Quick action links and tables |
| `/admin/requests` | All admin requests | `requests.ts` | Search, filters, sort, local row actions |
| `/admin/requests/import` | Import request queue | `requests.ts` | Reuses filtered `RequestTable` |
| `/admin/requests/export` | Export request queue | `requests.ts` | Reuses filtered `RequestTable` |
| `/admin/requests/supply` | Supply request queue | `requests.ts` | Reuses filtered `RequestTable` |
| `/admin/requests/technology` | Technology request queue | `requests.ts` | Reuses filtered `RequestTable` |
| `/admin/requests/[id]` | Admin request detail | `requests.ts` | Local status, priority, notes, assignment |
| `/admin/verifications` | Verification queue | `adminVerification.ts` | Search/filter queue |
| `/admin/verifications/[companyId]` | Verification detail | `adminVerification.ts` | Local document decisions and final decision dialog |
| `/admin/marketplace` | Moderation queue | `adminMarketplace.ts` | Search/filter publication queue |
| `/admin/marketplace/[id]` | Moderation detail | `adminMarketplace.ts` | Local public preview editing/actions |
| `/admin/inquiries` | Inquiry queue | `inquiries.ts` | Search/filter table |
| `/admin/inquiries/[id]` | Inquiry detail | `inquiries.ts` | Local status, assignment, notes |
| `/admin/companies` | Company queue | `adminCompanies.ts` | Search/filter table |
| `/admin/companies/[slug]` | Company admin detail | `adminCompanies.ts` | Local verification/suspension/category actions |
| `/admin/analytics` | Analytics | requests, companies, inquiries, moderation data | Date-range UI and CSS/SVG chart placeholders |
| `/admin/documents` | Placeholder catch-all | `admin/[...slug]/page.tsx` | Placeholder only |
| `/admin/users` | Placeholder catch-all | `admin/[...slug]/page.tsx` | Placeholder only |
| `/admin/team` | Placeholder catch-all | `admin/[...slug]/page.tsx` | Placeholder only |
| `/admin/categories` | Placeholder catch-all | `admin/[...slug]/page.tsx` | Placeholder only |
| `/admin/settings` | Placeholder catch-all | `admin/[...slug]/page.tsx` | Placeholder only |

The expected `/resources`, `/about`, `/contact`, `/login`, and `/register` routes are not currently implemented. The header Login link intentionally enters the mock dashboard at `/dashboard`; this should change when authentication is introduced.

## Shared domain types

`src/types/index.ts` is the canonical domain model. Important unions and interfaces include:

| Type | Values/role |
| --- | --- |
| `RequestType` | `import`, `export`, `supply`, `technology` |
| `RequestStatus` | `draft`, `submitted`, `under_review`, `needs_information`, `matching`, `quotation_received`, `approved`, `completed`, `rejected`, `cancelled` |
| `RequestPriority` | `low`, `medium`, `high`, `urgent` |
| `MarketplaceStatus` | `draft`, `pending_review`, `published`, `paused`, `matched`, `closed` |
| `VerificationStatus` | `pending_review`, `approved`, `rejected`, `needs_information` |
| `InquiryStatus` | `new`, `contacted`, `qualified`, `introduced`, `negotiating`, `converted`, `closed`, `spam` |
| `CompanyType` | `supplier`, `exporter`, `buyer`, `technology_provider` |
| `BusinessRequest` | Shared user/admin request record with status history, notes, documents, assignment, company/user summaries, and marketplace visibility |
| `Company` | Public company profile and verification summary |
| `CompanyAdminRecord` | Admin-only company record with users, documents, activity, and internal notes |
| `Inquiry` | Shared public/admin inquiry record with source, relation, assignment, timeline, and internal notes |
| `Product` | Technology product catalogue record |
| `VerificationCase` | Admin verification queue record with checklist and document review state |
| `MarketplaceModerationListing` | Admin moderation record with private request and public listing projection |

`src/data/request-forms.ts` reuses the shared request type for form configuration instead of introducing a separate request-type union.

## Mock data inventory

| File | Records | Consumers |
| --- | --- | --- |
| `src/data/requests.ts` | 12 Bangladesh-connected `BusinessRequest` records | User dashboard, admin request queues/details, analytics |
| `src/data/opportunities.ts` | 4 public `Opportunity` records | Homepage, marketplace, company profiles |
| `src/data/companies.ts` | 4 supplier/exporter/buyer/technology provider records | Directory, public profiles, marketplace snapshots |
| `src/data/products.ts` | POS, inventory, e-commerce, custom ERP/CRM | Product listing/detail, homepage |
| `src/data/inquiries.ts` | 8 marketplace/profile/demo/partnership inquiries | User dashboard, admin inquiry queue/detail, analytics |
| `src/data/adminVerification.ts` | 4 verification cases | User verification/documents, admin verification queue/detail |
| `src/data/adminMarketplace.ts` | 6 moderation listings | Admin moderation pages, analytics |
| `src/data/adminCompanies.ts` | Admin projections of companies | Admin company pages |
| `src/data/current-user.ts` | One mock admin user | RoleGate and admin shell |
| `src/data/dashboard.ts` | Mock user/company summary | User dashboard shell |
| `src/data/nav.ts` | Public and footer navigation | Header, Footer, MobileNav |
| `src/data/solutions.ts` | Four solution configurations | Solution index/detail pages |

## Form field inventory

All forms use local state and `preventDefault()`. No form writes data outside the current browser session. File controls are visual upload placeholders and do not upload files.

### Request forms

| Form | Field / frontend label | Control | Required | Current validation / backend field |
| --- | --- | --- | --- | --- |
| Import | Product name | text | yes | required; `productName` |
| Import | Product category | select | yes | required; `category` |
| Import | Source country | text | yes | required; `sourceCountry` |
| Import | Destination country | text | yes | required; `destinationCountry` |
| Import | Quantity | text | yes | required, accepts units/ranges; `quantity` |
| Import | Budget range | text | no | human-readable range; `budgetRange` |
| Import | Timeline | select | yes | required; `timeline` |
| Import | Product specification | textarea | yes | required; `description`/`specification` |
| Import | Attachment | file | no | visual only; `documents[]` |
| Import | Contact person | text | yes | required; `contactName` |
| Import | Phone or email | text | yes | required; normalize to separate `phone`/`email` server-side |
| Export | Company name | text | yes | required; `companyName` |
| Export | Product name | text | yes | required; `productName` |
| Export | Product category | select | yes | required; `category` |
| Export | Target countries | text | yes | required; `destinationCountries[]` |
| Export | MOQ | text | yes | human-readable MOQ; `minimumOrderQuantity` |
| Export | Monthly capacity | text | yes | human-readable capacity; `monthlyCapacity` |
| Export | Price range | text | no | `priceRange` |
| Export | Certifications | text | no | `certifications[]` |
| Export | Product images | file | no | visual only; `productImages[]` |
| Export | Company profile | file | no | visual only; `companyProfileDocument` |
| Export | Contact person | text | yes | required; `contactName` |
| Supply | I want to supply / I need a supplier | radio/toggle | yes | `supplyMode` |
| Supply | Product category | select | yes | required; `category` |
| Supply | Product name | text | yes | required; `productName` |
| Supply | Location | text | yes | required; `location` |
| Supply | Delivery capacity or required quantity | text | yes | human-readable; `quantity` |
| Supply | Budget/price range | text | no | `budgetRange` |
| Supply | One-time or recurring requirement | select | yes | `requirementFrequency` |
| Supply | Attachment | file | no | visual only; `documents[]` |
| Supply | Contact person | text | yes | required; `contactName` |
| Technology | Business type | select | yes | required; `businessType` |
| Technology | Required solution type | select | yes | required; `solutionType` |
| Technology | Problem description | textarea | yes | required; `description` |
| Technology | Budget range | text | no | `budgetRange` |
| Technology | Timeline | select | yes | required; `timeline` |
| Technology | Existing system | text | no | `existingSystem` |
| Technology | Attachment | file | no | visual only; `documents[]` |
| Technology | Contact person | text | yes | required; `contactName` |

### Inquiry and demo forms

| Form | Fields | Required/current validation | Future backend target |
| --- | --- | --- | --- |
| `InquiryForm` | Name, Company name, Email, Phone, Message, Inquiry type | All required; browser email type; phone is `tel`; inquiry type is a fixed enum | `POST /inquiries` with relation and source context |
| `DemoRequestForm` | Name, Company name, Email, Phone, Business type, Product interested in, Preferred demo time, Message | All required; browser email type; select enums | `POST /demo-requests`, creating an inquiry/lead |

## Filters and local behavior

| Module | Filters/sort currently represented |
| --- | --- |
| Marketplace | Keyword, request type, category, country/location, status |
| Directory | Keyword, business type, category, location, verification |
| Admin requests | Search, type, status, priority, assignee, verification, visibility, date UI, sort |
| Admin verifications | Search, verification status, company type, submitted date, reviewer |
| Admin marketplace | Search, type, category, publication status, company verification |
| Admin inquiries | Search, source, status, assignee, date |
| Admin companies | Search, business type, verification, location, category, account status |
| Analytics | Date-range selector UI; summary values derive from available mock data where possible |

All filters and row actions are local React state. There is no pagination, URL query synchronization, persistence, optimistic API state, or server-side filtering yet.

## Auth and authorization preparation

`src/types/auth.ts` defines guest, business user, verified business, team member, admin, and super admin roles. `src/lib/permissions.ts` maps roles to named permissions and `RoleGate` provides client-side visibility gating. `src/data/current-user.ts` supplies one mock admin.

The comments in the auth files explicitly state that RoleGate is frontend UI gating only and is not a security boundary. Backend/API authorization must enforce ownership, role, company membership, and admin permissions independently.

## Environment and persistence

No environment variables or API base URL are used by the current `src` tree. No persistence exists beyond local component state. Backend integration should introduce a typed API client and runtime configuration rather than coupling pages directly to `src/data` imports.

## Privacy inventory

| Data | Public pages | User dashboard | Admin pages |
| --- | --- | --- | --- |
| Company name, business type, category, business location | Yes when profile/listing is public | Yes | Yes |
| User email and phone | No | Own mock profile/context only | Yes, mock admin context |
| Exact budget | No in public moderation preview | Own request detail may show it | Yes |
| Private documents | No | Own document placeholders | Yes, review placeholders |
| Internal admin notes | No | No | Yes |
| Assignment/team notes | No | No | Yes |

## Recommended next frontend additions

1. Add a browser test runner (Playwright recommended) outside this audit, with seeded mock/API fixtures.
2. Add shared loading, error, empty, and pagination primitives for API-backed list screens.
3. Add a typed form schema layer once the API contract is approved; Zod can then be shared by client and server if the backend stack supports it.
4. Add URL-synchronized filters for shareable admin queues.
