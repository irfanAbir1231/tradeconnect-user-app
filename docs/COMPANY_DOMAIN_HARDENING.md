# Phase 4A.4 company-domain hardening

Phase 4A.5 consolidates these controls for release and adds the aggregate `test:company-profile` gate. Manual browser, Preview, and production QA remain intentionally pending.

Company creation remains one short transaction: company, owner membership, first primary selection, verification placeholder, and privacy-safe audit event. The membership unique constraint prevents duplicate user/company rows; the primary partial unique constraint preserves one active primary membership per user. Ownership transfer, removal, invitations, documents, and verification actions are deferred.

Company PATCH uses the canonical `version` column as optimistic concurrency control. The expected version is validated but never editable business data. An atomic update predicate requires the expected value, increments exactly once on success, and returns `COMPANY_VERSION_CONFLICT` (409) on stale writes. The frontend preserves entered fields and asks the user to reload/review saved details.

Company names are not globally unique. Slugs are generated server-side from normalized lowercase display/legal names, fall back safely for unsupported/empty Unicode output, use bounded collision suffixes, and rely on the database unique constraint. Registration-conflict handling is safe if a real unique constraint applies; it never exposes another company.

Audit events contain only actor/request identifiers, action, resource/company IDs, resulting version, and changed field names. They do not retain contact values, addresses, legal identifiers, sessions, tokens, cookies, or raw errors. No migration was created in this phase: the reviewed existing constraints and indexes cover the observed correctness paths. The local Prisma schema-engine ErrorEvent remains a tooling blocker for migration status, seed, and smoke verification.
