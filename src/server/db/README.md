# Database boundary

This directory is the only application boundary for Prisma. It is server-only and must never be imported by Client Components or passed directly to a browser response.

## Conventions

- Application runtime code reads the pooled `DATABASE_URL` through `client.ts` and `PrismaNeon`.
- Prisma migrations and schema operations use the direct `DIRECT_URL` from `prisma.config.ts`.
- Route Handlers should call a domain repository/service, not compose Prisma queries in the route itself.
- Every repository query must use an explicit `select`/safe projection. Full rows can contain email, phone, budgets, internal notes, documents, storage keys, and audit metadata.
- Repository methods must filter soft-deleted records unless an admin-only recovery operation explicitly opts in.
- Ownership and company scope are service-layer authorization rules; foreign keys alone are not authorization.
- Use `withTransaction` for status changes, verification decisions, marketplace moderation, assignments, and audit writes that must commit together.
- Use cursor pagination for large operational lists and return stable sort keys with the cursor.
- Use optimistic concurrency (`version`) on mutable workflow records.
- Every sensitive mutation should write an append-only audit event in the same transaction.

`disconnectPrismaClient` is for standalone scripts only. Request-time code must not disconnect after every invocation because the serverless runtime may reuse the pooled client.
