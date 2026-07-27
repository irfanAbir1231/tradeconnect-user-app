# Company profile release readiness

Phase 4A delivers private, authenticated company onboarding, profile view/edit, membership-aware dashboard integration, reference selectors, canonical completion/readiness, and atomic versioned updates. The supported routes are `/dashboard/company/onboarding`, `/dashboard/company`, and `/dashboard/company/edit`; APIs are `/api/v1/companies`, `/api/v1/companies/:companyId`, `/api/v1/companies/:companyId/primary`, `/api/v1/me/company`, and the five reference-data routes.

Authentication is server-side. Owner/company-admin edits are enforced again by the service; members receive a narrowed view without private contact/registration data; platform access requires `manage_companies`. Company creation is transactional, updates use expected `version`, and private company responses are dynamic/no-store. Only active, minimal public reference data is conservatively cached.

Completion is server-derived and separate from verification readiness. No documents, verification submission/review, invitations, public company directory, requests, marketplace, billing, or analytics are included. The Bangladesh seed covers all divisions with intentionally partial district/upazila paths.

The single existing migration is additive and documented. Local `db:format`, `db:validate`, and `db:generate` pass. Local migration status, seed, smoke, and `vercel-build` may remain blocked by the known Prisma schema-engine environment failure; this does not change the deployment architecture. Vercel Preview should run its normal migration/seed/build sequence after the feature branch is pushed. Before merging to production, complete `COMPANY_PROFILE_FINAL_QA.md`, resolve/verify database tooling against the deployment environment, and review Preview logs.

Rollback is a standard feature-branch revert. No destructive migration, data rewrite, or externally irreversible action was performed.

## Phase 4A.6 status

Preview QA began on the protected feature deployment and produced one scoped UX fix in `5882a70`: a stale versioned update now presents a visible, keyboard-reachable reload action after the controlled 409 response. The updated Vercel Preview was Ready and the focused owner flow passed. Merge readiness remains pending the documented database, API-privacy, isolation/member, responsive/accessibility, and full runtime-log checks in `COMPANY_PROFILE_FINAL_QA.md`. Do not merge based on the partial Preview record alone.

The partial mobile check passed at 390px without horizontal overflow. Because direct API navigation was blocked by the browser client and no read-only Neon session was available, these are evidence gaps rather than failed product behavior; they remain merge gates.
