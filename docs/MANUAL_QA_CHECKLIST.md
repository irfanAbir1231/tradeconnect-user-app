# TradeConnect Manual QA Checklist

Use this checklist against a production-like preview build. It is intentionally browser-oriented because the repository currently has no Playwright, Cypress, Vitest, or Jest setup. Record the browser, viewport, date, and build commit before testing.

**Test environment:** ____________________  
**Browser/version:** ____________________  
**Desktop viewport:** ____________________  
**Mobile viewport:** ____________________  
**Build/commit:** ____________________  

For each item, mark `[P]` passed, `[F]` failed, or `[B]` blocked.

## 1. Global navigation and public chrome

| ID | Starting route | Action | Expected result | Result/notes |
| --- | --- | --- | --- | --- |
| NAV-01 | `/` | Open desktop header links one by one | Platform, Solutions, Marketplace, Directory, Products, Resources anchor, and About anchor resolve without a console error | [ ] |
| NAV-02 | `/` | Click TradeConnect logo | Returns to `/` | [ ] |
| NAV-03 | `/` | Click Submit Request in header | Opens `/submit` | [ ] |
| NAV-04 | `/` | Click Login | Opens the current mock dashboard entry at `/dashboard`; confirm this is acceptable until auth is implemented | [ ] |
| NAV-05 | `/` | Resize to mobile and open/close menu | Menu opens, exposes the same links, closes after selection, and does not scroll the page unexpectedly | [ ] |
| NAV-06 | Any public route | Inspect footer links | Footer links either resolve to an implemented route or clearly land on the intended homepage section | [ ] |
| NAV-07 | Any admin route | Inspect chrome | Public Header/Footer are absent; admin shell is visible instead | [ ] |

## 2. Responsive and keyboard behavior

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| RWD-01 | Test desktop at 1440px, tablet at 768px, and mobile at 390px | No horizontal page overflow; typography remains readable | [ ] |
| RWD-02 | Tab through header and mobile menu | Focus order is logical, visible, and every control is reachable | [ ] |
| RWD-03 | Open admin mobile navigation and press Escape | Menu closes and focus remains usable | [ ] |
| RWD-04 | Open verification decision dialog and press Escape | Dialog closes without changing the decision | [ ] |
| RWD-05 | Test every admin list | Desktop tables stay readable; mobile switches to cards or an intentionally scrollable table | [ ] |
| RWD-06 | Zoom browser to 200% | Content remains usable without clipped primary actions | [ ] |

## 3. Request submission flows

Run the same checks for `/submit/import`, `/submit/export`, `/submit/supply`, and `/submit/technology`.

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| FORM-01 | Open `/submit` and choose each request type | Correct detail page opens and title/context match the selected type | [ ] |
| FORM-02 | Submit an empty form | Browser required validation prevents success state and identifies the missing field | [ ] |
| FORM-03 | Fill all required fields with valid representative data and submit | Page prevents reload and displays a clean local success state | [ ] |
| FORM-04 | Enter invalid email where an email field exists | Browser validation rejects the value | [ ] |
| FORM-05 | Enter invalid phone text and non-numeric quantity/range text | Confirm current behavior; record whether stronger field validation is needed for the approved API contract | [ ] |
| FORM-06 | Use file upload controls | Visual upload affordance is clear, no file is sent to a server, and no console error appears | [ ] |
| FORM-07 | Test each helper text and label | Every control has an understandable label and nearby guidance | [ ] |
| FORM-08 | Submit the technology solution demo form | Success state is shown and no navigation/API call is attempted | [ ] |

## 4. Marketplace

| ID | Starting route | Action | Expected result | Result/notes |
| --- | --- | --- | --- | --- |
| MKT-01 | `/marketplace` | Search by a known keyword | Cards narrow to matching opportunities; result count/empty state is clear | [ ] |
| MKT-02 | `/marketplace` | Change type, category, location, and status filters | Each filter updates results locally and combinations remain usable | [ ] |
| MKT-03 | `/marketplace` | Open every visible View Details card | Slug resolves to the correct opportunity | [ ] |
| MKT-04 | `/marketplace/[invalid-slug]` | Navigate manually | Next.js not-found page is used safely | [ ] |
| MKT-05 | Opportunity detail | Inspect company snapshot and public content | No email, phone, private documents, exact budget, or internal notes are exposed | [ ] |
| MKT-06 | Opportunity detail | Submit interest/request information | Inquiry form success state appears without a network request | [ ] |

## 5. Company directory

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| DIR-01 | Search and combine directory filters | Company cards update locally and empty state is helpful | [ ] |
| DIR-02 | Open each company profile | Correct slug/profile opens with verified state and profile sections | [ ] |
| DIR-03 | Open an invalid company slug | notFound page is used | [ ] |
| DIR-04 | Inspect public profile | Documents/certifications are previews only; private contact information is not shown | [ ] |
| DIR-05 | Submit a company inquiry | Success state appears and page remains stable | [ ] |

## 6. Technology products

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| PROD-01 | Open `/products` | POS Software, Inventory Management, E-commerce System, and Custom ERP/CRM appear | [ ] |
| PROD-02 | Open each product detail | Correct slug and provider information appear | [ ] |
| PROD-03 | Open an invalid product slug | notFound page is used | [ ] |
| PROD-04 | Click Request Demo | Demo form is visible/anchored and submits to local success state | [ ] |
| PROD-05 | Inspect public product content | No payment flow or backend claim is presented | [ ] |

## 7. User dashboard

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| USER-01 | Open `/dashboard` | Welcome, stats, recent activity, recommended matches, and next actions render | [ ] |
| USER-02 | Open `/dashboard/requests` | Shared request records render with filters and valid detail links | [ ] |
| USER-03 | Open each request detail and an invalid ID | Valid records render; invalid ID uses notFound | [ ] |
| USER-04 | Open company, inquiries, documents, verification, settings | Each dashboard link works and keeps the dashboard shell | [ ] |
| USER-05 | Open documents/verification pages | Upload is clearly mock-only and no private data appears in public chrome | [ ] |
| USER-06 | Test mobile dashboard menu | Menu is reachable by keyboard and all links remain tappable | [ ] |

## 8. Admin request management

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| ADM-01 | Open every admin sidebar link | Concrete modules open; catch-all links clearly show placeholders | [ ] |
| ADM-02 | Open `/admin/requests` | Summary cards, result count, search, filters, sort, and responsive table render | [ ] |
| ADM-03 | Search and combine type/status/priority/assignee/verification/visibility filters | Results update locally and Reset restores all records | [ ] |
| ADM-04 | Sort by available selector options | Sort order visibly changes and keys remain stable | [ ] |
| ADM-05 | Use each row action | View link works; local feedback appears for assignment, status, note, and marketplace actions | [ ] |
| ADM-06 | Open all type-specific request queues | Same table is reused and records are filtered to the route type | [ ] |
| ADM-07 | Open a valid/invalid admin request ID | Detail content/notFound behavior is correct | [ ] |
| ADM-08 | Change status, priority, assignment, and add a note | Detail page updates within the session and does not mutate imported arrays globally | [ ] |
| ADM-09 | Inspect request documents and private fields | They are visible only in admin detail, with placeholder view/download actions | [ ] |

## 9. Admin verification

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| VER-01 | Open `/admin/verifications` | Summary cards and queue render | [ ] |
| VER-02 | Search/filter by status, company type, date, reviewer | Queue updates locally | [ ] |
| VER-03 | Open each verification case and invalid company ID | Valid detail/notFound behavior works | [ ] |
| VER-04 | Approve, reject, and request replacement for a document | Local document status and success feedback update | [ ] |
| VER-05 | Attempt each final decision | Confirmation dialog appears before decision and can be cancelled | [ ] |
| VER-06 | Keyboard-test the dialog | Labeling, Escape, visible focus, and action buttons work | [ ] |

## 10. Marketplace moderation

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| MOD-01 | Open moderation queue and combine filters | Listing statistics and responsive results update | [ ] |
| MOD-02 | Open each listing and invalid ID | Correct detail/notFound behavior works | [ ] |
| MOD-03 | Edit public title/summary and save draft | Preview updates locally and save feedback appears | [ ] |
| MOD-04 | Publish, pause, request changes, reject, remove sensitive data | Local state/feedback updates and destructive paths confirm intent where provided | [ ] |
| MOD-05 | Compare private request and public preview | Public preview excludes contact data, private documents, exact budget, and internal notes | [ ] |

## 11. Admin inquiries, companies, and analytics

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| OPS-01 | Search/filter admin inquiries | Result list updates and related request/product/company links are valid | [ ] |
| OPS-02 | Open inquiry detail and change status/assignment | Timeline, notes, and local feedback update | [ ] |
| OPS-03 | Search/filter admin companies | Counts and table filters remain consistent | [ ] |
| OPS-04 | Open company admin details | Users, verification, products, requests, listings, inquiries, documents, notes, and activity render | [ ] |
| OPS-05 | Try suspend/restore/approve/feature/category actions | Local feedback appears; suspension has a clear warning/confirmation | [ ] |
| OPS-06 | Open analytics and change date range | Metrics/charts remain readable and accessible; values are clearly mock/derived | [ ] |

## 12. Accessibility and privacy sign-off

| ID | Action | Expected result | Result/notes |
| --- | --- | --- | --- |
| A11Y-01 | Inspect every form control with keyboard and screen reader | Visible label or accessible name exists; required state is understandable | [ ] |
| A11Y-02 | Inspect badges and status cells | Meaning is conveyed by text, not color alone | [ ] |
| A11Y-03 | Keyboard-test mobile menus and dialogs | Focus is visible, controls have names, Escape/cancel behavior is clear | [ ] |
| A11Y-04 | Check headings and landmark order | One meaningful page heading and navigable sections exist | [ ] |
| PRIV-01 | Inspect public marketplace/directory/product routes | No private contact data, internal notes, private documents, or sensitive budget details are rendered | [ ] |
| PRIV-02 | Inspect admin-only routes | Private mock data is visible only in the admin UI; verify no public component imports it accidentally | [ ] |
| PRIV-03 | Check browser console/network | No hydration error, failed asset, unexpected request, or unhandled exception | [ ] |

## Exit criteria

The frontend can be signed off for backend wiring when all critical tests pass, no hydration/console errors remain, every intentionally missing route has a product decision, public privacy checks pass, and the backend team has accepted the API draft.
