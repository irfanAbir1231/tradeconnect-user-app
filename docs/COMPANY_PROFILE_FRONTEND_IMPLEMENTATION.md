# Phase 4A.3 company profile frontend implementation

`/dashboard/company` is a dynamic, authenticated server route. It resolves the trusted actor, then the actor's selected primary membership through the existing company service; it never accepts a company ID from the browser. A user without a membership sees only the onboarding state and a link to `/dashboard/company/onboarding`.

The profile page renders real company identity, membership role, account/profile status, canonical completion output, real verification status, business summary, address/location hierarchy, and timestamps. Completion is never calculated in a component. `not_started` is shown as a truthful status; document submission, review, and approval are explicitly deferred.

`/dashboard/company/edit` is also dynamic and server-authorized. It redirects no-company users to onboarding and redirects members without owner/admin membership (unless platform admin) back to the profile. The PATCH service repeats the authorization check, so hiding the Edit link is not a security boundary.

The profile editor is a settings form, not a second onboarding wizard. It preloads the private owner DTO, uses the Phase 4A.2 category/country/location routes and dependent-reset helpers, validates helpful client errors, sends only changed approved fields plus the current `version`, prevents double submits, maps safe API errors, and replaces/refreshes the profile route after success. Empty updates are stopped before the request and rejected by the canonical backend validator.

Only owner/admin dashboard projections include private contact and registration identifiers. Member projections omit them before any client component receives data. Navigation receives only a compact safe projection: display name, membership role, completion percentage, verification status, and edit capability. Raw Prisma records, documents, audit data, credentials, and session data are not passed as UI props.

The dashboard overview, settings page, desktop sidebar, and mobile navigation now show the selected primary company's real identity and membership role. Multiple memberships follow the Phase 4A.1 primary-company policy; selection is already persisted by the existing primary endpoint, while a company-switcher UI remains deferred.

Deferred: document uploads, verification submission/review, member invitations, public profiles, and company management. Browser QA is intentionally scheduled after this implementation phase.
