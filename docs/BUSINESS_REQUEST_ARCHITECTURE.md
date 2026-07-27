# Business Request Architecture (Phase 4B.1)

`BusinessRequest` and its status history, assignment, documents, and marketplace relations were part of the existing normalized Prisma domain. Phase 4B.1 adds no migration and does not change applied migrations.

Route Handlers call the request service, which owns authorization, tenancy, reference validation, optimistic locking, lifecycle validation, transactions, and audit writes. The repository supplies explicit Prisma projections; views serialize those records into client-safe DTOs. Validators reject unknown fields and perform strict server-side validation before services touch the database.

The current lifecycle boundary is intentionally narrow: requests begin as `draft` and may transition to `submitted`. Admin review transitions, assignments, documents, notifications, and marketplace publication are deferred. Soft deletion is permitted only for creator-owned drafts.

The dashboard “My Requests” page now reads the authenticated API and shows its own company only. Legacy admin and public mock fixtures remain isolated from this domain API until their later milestones are migrated.
