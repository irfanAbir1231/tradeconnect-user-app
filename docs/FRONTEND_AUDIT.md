# TradeConnect Frontend Audit

Audit date: 17 July 2026  
Scope: pre-backend verification of the Next.js App Router frontend  
Current frontend version: `0.1.0`

## Executive verdict

**Conditionally ready for backend integration.** The implemented public, user-dashboard, and admin-dashboard routes compile and statically generate successfully. Shared request, company, inquiry, product, verification, marketplace, and auth types are already in place. The UI is intentionally mock-data based and does not yet persist mutations.

The main release caveats are:

- `/resources`, `/about`, `/contact`, `/login`, and `/register` are not standalone routes. Footer resources/about links currently use home-page anchors, and the header’s mock Login action goes to `/dashboard` rather than a real auth page.
- There is no browser automation or end-to-end test runner in the repository. Manual browser QA is required before a production deployment; see [`MANUAL_QA_CHECKLIST.md`](./MANUAL_QA_CHECKLIST.md).
- Forms use local React state and native browser validation only. File uploads, field persistence, server validation, email/phone normalization, and numeric range validation are backend work.
- Admin catch-all pages under `/admin/[...slug]` are navigation placeholders for Documents, Users, Team Members, Categories, and Settings. They are reachable, but are not complete modules.

## Verification commands

The following checks passed sequentially after the audit changes:

| Check | Result |
| --- | --- |
| `npm.cmd run lint` | PASS — no warnings or errors |
| `npx.cmd tsc --noEmit` | PASS |
| `npm.cmd run build` | PASS — Next.js generated 100 static pages |
| `git diff --check` | PASS |

The repository has no test script and no Playwright, Cypress, Vitest, or Jest dependency. No test framework was installed during this audit.

## Scope and architecture reviewed

- Next.js 16 App Router with `src/app` and strict TypeScript.
- Public chrome in `src/components/layout/SiteChrome.tsx`, with public Header/Footer excluded from `/admin` routes.
- User dashboard shell in `src/app/dashboard/layout.tsx` and `src/components/dashboard/DashboardNav.tsx`.
- Admin shell in `src/app/admin/layout.tsx`, `AdminSidebar`, `AdminHeader`, and `AdminMobileNav`.
- Shared domain types in `src/types/index.ts` and auth types in `src/types/auth.ts`.
- Mock data in `src/data/requests.ts`, `companies.ts`, `opportunities.ts`, `products.ts`, `inquiries.ts`, and admin-specific datasets.
- Local-state forms and moderation/admin controls; no API calls, environment variables, auth provider, database, or object storage.

## Route audit

### Public routes

| Route | Status | Notes |
| --- | --- | --- |
| `/` | PASS | Homepage and primary CTAs |
| `/platform` | PASS | Platform overview |
| `/solutions` | PASS | Solution index |
| `/solutions/import` | PASS | Import detail |
| `/solutions/export` | PASS | Export detail |
| `/solutions/supply` | PASS | Supply detail |
| `/solutions/technology` | PASS | Technology detail with demo form |
| `/submit` | PASS | Request type selection |
| `/submit/import` | PASS | Import form |
| `/submit/export` | PASS | Export form |
| `/submit/supply` | PASS | Supply form |
| `/submit/technology` | PASS | Technology form |
| `/marketplace` | PASS | Search/filter listing |
| `/marketplace/[slug]` | PASS | Static params and `notFound()` |
| `/directory` | PASS | Search/filter directory |
| `/directory/[slug]` | PASS | Static params and `notFound()` |
| `/products` | PASS | Product listing |
| `/products/[slug]` | PASS | Static params and `notFound()` |
| `/resources` | MISSING | No standalone resources page; current nav uses `/#resources` |
| `/about` | MISSING | No standalone about page; current nav uses `/#about` |
| `/contact` | MISSING | No standalone contact page |
| `/login` | MISSING | Header uses the mock dashboard entry point at `/dashboard` |
| `/register` | MISSING | No registration UI |
| `/unauthorized` | PASS | Role-gate fallback page |

### User routes

All requested user routes are present and generated with valid mock data where applicable:

`/dashboard`, `/dashboard/requests`, `/dashboard/requests/[id]`, `/dashboard/inquiries`, `/dashboard/company`, `/dashboard/documents`, `/dashboard/verification`, and `/dashboard/settings`.

### Admin routes

All requested concrete admin modules are present and generated:

`/admin`, `/admin/requests`, `/admin/requests/import`, `/admin/requests/export`, `/admin/requests/supply`, `/admin/requests/technology`, `/admin/requests/[id]`, `/admin/verifications`, `/admin/verifications/[companyId]`, `/admin/marketplace`, `/admin/marketplace/[id]`, `/admin/inquiries`, `/admin/inquiries/[id]`, `/admin/companies`, `/admin/companies/[slug]`, and `/admin/analytics`.

The sidebar links `/admin/documents`, `/admin/users`, `/admin/team`, `/admin/categories`, and `/admin/settings` resolve through the admin catch-all placeholder. These should be replaced with real modules or removed from the sidebar before backend launch.

### Dynamic route safety

The following dynamic pages use `generateStaticParams()` and call `notFound()` after lookup failure: marketplace opportunities, directory companies, products, user request details, admin request details, verification cases, moderation listings, inquiries, and admin company details. The route IDs/slugs used by list cards are present in their source datasets and were included in the production build.

## Findings and fixes completed

- Reused `RequestStatusBadge` on the admin overview instead of duplicating status-label and color logic.
- Updated the mock admin role permissions so the existing admin user can see all intended sidebar areas, including team and settings placeholders.
- Improved the admin mobile navigation with dialog semantics, `aria-controls`, `aria-expanded`, `aria-modal`, an accessible label, and Escape-key close behavior.
- Added an accessible label to the admin company category editor.
- Added labelled, dismissible confirmation-dialog semantics to the verification decision flow.
- Confirmed public marketplace previews omit private email, phone, documents, internal notes, and exact budget values. Those fields remain available only in dashboard/admin mock views.
- Confirmed no `process.env`, `NEXT_PUBLIC_*`, `fetch`, Axios, auth SDK, database client, or external API usage exists in `src`.
- Confirmed no unsafe `any` usage was found in application source during the static review.

## Remaining frontend findings

### High priority before backend integration

1. Decide whether the missing public auth/contact/content routes should be implemented as mock pages or removed from the product navigation. The current `/dashboard` Login link is explicitly a mock entry point and must become a real auth flow later.
2. Replace the five admin catch-all placeholders with real modules or hide them until their API contracts exist.
3. Add browser smoke tests and run the manual checklist at a deployed preview URL. Build success cannot detect click, focus, hydration, or browser console regressions.

### Medium priority

1. Replace local form success states with API-backed submit states, field-level server errors, retry behavior, and durable draft handling.
2. Add stronger phone, numeric quantity, budget, and date validation. Current forms use required fields and browser email validation; several quantity/range inputs deliberately accept human-readable text such as `20,000 units/month`.
3. Add focus trapping and focus restoration for the dashboard mobile menu, then verify with keyboard and screen reader testing.
4. Normalize mock-data verification fields. Public `Company` data currently contains both `isVerified` and a legacy `verified` property because admin records were built from an earlier model.
5. Replace hardcoded analytics and overview chart values with a single derived reporting adapter once the request and inquiry APIs are available.

## Privacy review

The moderation detail view explicitly separates public and private fields. Public listing previews show title, summary, type, category, location at the intended business level, quantity/requirement where safe, company name, and verification state. They do not show user email, phone, private documents, exact budget, or internal admin notes.

The admin UI intentionally shows private contact details and internal notes. This is acceptable for the mock-only phase but must be enforced by backend authorization and response shaping; hiding a field in React is not a security boundary.

## Backend blockers and handoff

The frontend is ready for an API adapter, but not for production data or production authorization. The required integration sequence, data ownership, state transitions, and endpoint draft are documented in [`BACKEND_INTEGRATION_PLAN.md`](./BACKEND_INTEGRATION_PLAN.md) and [`API_CONTRACT_DRAFT.md`](./API_CONTRACT_DRAFT.md).

**Final readiness verdict:** frontend foundation and admin request-management milestone are build-ready for backend wiring, with the missing route decision, browser QA, real authorization, persistence, uploads, notifications, and error handling still required before production launch.
