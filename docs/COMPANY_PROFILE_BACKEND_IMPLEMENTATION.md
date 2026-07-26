# Phase 4A.1 company profile backend implementation

This phase adds a database-backed company onboarding foundation without changing frontend pages. Route Handlers parse/validate/authenticate; services own scope, transactions, slug allocation, completion, and audit; repositories own Prisma queries and explicit projections.

Creation atomically creates a company, active owner membership, caller primary-company selection, `not_started` verification record, and audit event. Update checks the supplied version, updates profile relations, increments the version, and appends an audit event in one transaction. Bounded slug retries rely on the database unique constraint. There are no uploads, email, external calls, or long-running work in request handling.

Any active member can select their own primary company. Only owner/admin members or platform administrators can patch. Unrelated callers receive `404` to reduce enumeration. Owner responses are private and omit documents, sessions, credentials, marketplace controls, and audit history; audit snapshots omit contact and registration identifiers.

Deferred: frontend forms/API hooks, public directory serialization, invitations, document storage, verification review, complete Bangladesh geography reference data, notifications, and browser QA. Verify with `npm run test:company-foundation`, Prisma validation/generation/status/smoke, lint, TypeScript, and production build. Vercel deployment is outside this backend-only phase.

Phase 4A.2 adds the authenticated onboarding consumer for this contract plus safe reference-data routes. The existing service remains the sole company-creation authority.

Phase 4A.3 consumes the existing GET/PATCH service contract through authenticated dashboard routes. The edit page is server-gated for owner/admin membership and the service remains authoritative for every mutation. Its optimistic `version` check is the stale-update policy; it rejects stale writes rather than merging them.
