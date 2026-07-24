# TradeConnect Next.js Full-Stack Server Architecture

Planning only. The existing Next.js App Router repository remains the single application. Public pages, authenticated dashboards, Route Handlers, services, repositories, and database access are deployed from the same Vercel project, while PostgreSQL, private object storage, email, and optional job infrastructure remain managed external services.

## Proposed source structure

```text
src/
├── app/
│   └── api/
│       └── v1/
│           ├── auth/
│           ├── users/
│           ├── me/
│           ├── companies/
│           ├── requests/
│           ├── verifications/
│           ├── documents/
│           ├── marketplace/
│           ├── inquiries/
│           ├── products/
│           ├── demo-requests/
│           ├── notifications/
│           ├── admin/
│           └── health/
├── server/
│   ├── auth/
│   ├── db/
│   ├── repositories/
│   ├── services/
│   ├── validators/
│   ├── permissions/
│   ├── errors/
│   ├── storage/
│   ├── notifications/
│   └── audit/
├── lib/
├── types/
└── components/
```

## Directory responsibilities

| Directory | Responsibility | Must not contain |
| --- | --- | --- |
| `src/app/api/v1` | Thin Next.js Route Handlers: parse request, invoke validation/auth/service, map response/error | Business rules, direct SQL, storage secrets, duplicated mutations |
| `src/server/auth` | Server-only session parsing, token rotation/revocation, current-user resolution, email verification/password reset adapters | Client components or browser storage logic |
| `src/server/db` | Server-only PostgreSQL client/pool, ORM/query setup, transaction helpers, migration integration | API response shaping or React imports |
| `src/server/repositories` | Persistence queries and entity mapping | Permission decisions that belong to services/policy layer |
| `src/server/services` | Business workflows, state transitions, transactions, idempotency, event/outbox coordination | HTTP-specific request/response objects |
| `src/server/validators` | Runtime request/response schemas and domain field validation | Database access or authorization assumptions |
| `src/server/permissions` | Role, permission, company membership, ownership, and resource-scope policies | UI-only visibility decisions |
| `src/server/errors` | Canonical error classes, public error mapping, request IDs | Stack traces in responses |
| `src/server/storage` | Presigned upload/download, metadata validation, scan/quarantine adapters | Public storage URLs or client credentials |
| `src/server/notifications` | Notification creation, email adapter, outbox/job publishing, retry/idempotency | Blocking long-running work inside ordinary handlers |
| `src/server/audit` | Append-only audit event creation and query policy | Editable audit history |
| `src/lib` | Safe shared utilities and client API helpers; server-only utilities must be explicitly isolated | Database clients, secrets, server-only imports in client bundles |
| `src/types` | Public DTO/view types and safe shared unions | Raw ORM models or private database columns in public types |
| `src/components` | Presentation and interaction; calls typed API/query hooks | Repositories, database clients, server secrets |

## Dependency rules

```text
Route Handler
  → validator
  → authentication / permission check
  → service
  → repository / storage / notification / audit abstractions
  → database or external provider
```

- Route Handlers may call validators, server auth, permissions, and services.
- Services may call repositories, storage, notification, audit, and job abstractions.
- Repositories may access the database and return domain records, but not React or HTTP objects.
- React components must not import repositories, database clients, or server services.
- Client Components must never import `src/server/*` modules.
- Shared types must be intentionally public-safe; use separate `Public*`, `Owner*`, `Team*`, and `Admin*` DTOs where fields differ.
- Server Actions and Route Handlers must call the same service functions; they must never contain competing business logic.

## Enforcing server-only boundaries

Use `import "server-only"` at the top of database, auth, storage, repository, service, and secret-bearing modules. Keep server modules outside component import paths and expose only typed API responses to the browser. Use TypeScript path aliases that distinguish `@/src/server/*`, lint rules against server imports in Client Components, and CI checks that build client bundles without server-only modules.

Secrets must be available only to server runtime code through non-public environment variables. Never prefix database, storage, signing, or email credentials with `NEXT_PUBLIC_`. Do not return storage keys, token hashes, database errors, or authorization policy details in API responses.

## Route Handler principles

Each route handler should:

1. create/read a request ID;
2. parse and validate the request body/query with a runtime schema;
3. resolve the session and resource scope;
4. call one service operation inside the required transaction boundary;
5. map a typed public response DTO;
6. map known errors to the canonical JSON contract;
7. publish only non-blocking work to an outbox/queue when needed.

Use the Node.js runtime for database, storage SDKs, cryptography, and email integrations unless a dependency is confirmed Edge-compatible. The default Route Handler runtime should be Node.js for consistency. Public cacheable reads may use revalidation only when their response contains no authenticated or private data.

## Server Actions policy

Server Actions may be used selectively for same-origin mutations initiated only by this Next.js UI, such as a simple preference update or marking a notification read. They must still resolve the session, enforce permissions, call the shared service, and use the same error mapping.

Prefer Route Handlers for resource CRUD, search/filter lists, uploads, webhooks, admin APIs, mobile-ready consumers, integrations, and every endpoint documented in `API_CONTRACT_DRAFT.md`. Do not duplicate business logic between a Server Action and Route Handler; either both call the same service or only the Route Handler exists.

## Database and external service boundary

PostgreSQL is the source of truth. Use a serverless-compatible pooled connection strategy, a singleton/lazy module-level client only for connection reuse (never application data), and bounded pool settings. Use transactions for status transitions, verification decisions, moderation, membership changes, and idempotent webhook/cron processing. See [`SERVERLESS_CONSTRAINTS.md`](./SERVERLESS_CONSTRAINTS.md) for runtime limits.

Private documents live in private object storage such as Vercel Blob or an S3-compatible provider. Email is an external transactional provider. Retryable work is published to a queue/workflow/cron system and represented by durable job/outbox records in PostgreSQL.

## Caching and data classification

- Public marketplace/company/product reads may use short revalidation only after verifying that the serializer contains no private fields.
- User dashboard and admin responses must default to `no-store` or user-scoped cache keys.
- Mutations invalidate the affected public tag/query and the authenticated owner/admin query; never use a global cache key for private data.
- Public and private DTOs are separate at the query/serialization boundary, not separated only by React rendering.

## Observability

Every request has a correlation ID. Log route, status, duration, actor ID where safe, resource ID, and error code without passwords, tokens, document contents, or private message bodies. Add error monitoring for Route Handlers and background jobs, database slow-query metrics, storage scan failures, queue retry/dead-letter metrics, and health/readiness checks.

## Architecture acceptance criteria

- [ ] No Route Handler contains direct business workflow logic or SQL.
- [ ] No Client Component imports a server-only module.
- [ ] All private operations resolve session, permission, and resource scope server-side.
- [ ] Public serializers cannot return private contact, budget, document, or internal-note fields.
- [ ] Database transactions cover every multi-record state transition.
- [ ] Retryable work has durable idempotency and failure visibility.
- [ ] API routes and services have unit, authorization, privacy, and integration tests.
