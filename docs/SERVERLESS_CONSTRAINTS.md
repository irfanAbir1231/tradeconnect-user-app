# TradeConnect Serverless Constraints

Planning only. This document describes how the full-stack Next.js application should behave on Vercel with managed PostgreSQL, private object storage, transactional email, and optional queue/workflow/cron services.

## Implemented database and Phase 3A auth boundary

The current foundation uses Neon PostgreSQL with Prisma 7 and `@prisma/adapter-neon`. Node.js Route Handlers use pooled `DATABASE_URL`; Prisma migration/schema operations use `DIRECT_URL` first and Vercel Neon `DATABASE_URL_UNPOOLED` otherwise. Better Auth runs only in Node.js Route Handlers against this server-only boundary. No migration runs during application startup; Vercel uses `prisma migrate deploy && prisma db seed && next build`. For the MVP, Production and Preview intentionally share one persistent Neon main branch; automatic Preview database branching is disabled and Preview data can affect the shared database.

## Constraint matrix

| Constraint | Risk | Required design response |
| --- | --- | --- |
| No trusted persistent process memory | Multiple function instances do not share state and may be recycled | Store state in PostgreSQL/Redis/queue; module-level values may only cache safe clients/config |
| No persistent local filesystem | Files written in a function are temporary and instance-local | Upload directly to private object storage; keep metadata in PostgreSQL |
| Function duration limits | Long scans, exports, matching, and email workflows can time out | Return quickly, publish a durable job, expose job status, retry asynchronously |
| Database connection limits | One uncontrolled pool per invocation can exhaust PostgreSQL | Reuse a server-only pooled client, bound pool size, use a serverless-compatible provider/proxy, monitor connections |
| Cold starts and regional latency | First request and cross-region DB/storage calls are slower | Choose a primary region near users/DB, keep handlers thin, use safe public revalidation, avoid unnecessary sequential calls |
| Payload limits | Large multipart requests may fail or consume function memory | Use presigned direct uploads; send only metadata through Route Handlers |
| At-least-once retries | A webhook/cron/job may execute more than once | Require idempotency keys, unique constraints, durable job status, and safe upserts |
| Concurrent invocations | Two admins may mutate the same record | Use transaction isolation, row/version checks, ETags, and `409 VERSION_CONFLICT` |
| Transaction boundaries | Multi-record workflows can partially persist | Keep transitions, history, audit, and outbox writes in one DB transaction |
| Scheduled-job limits | Cron runs may be delayed, duplicated, or have short execution windows | Make jobs idempotent, use leases/locks, process bounded batches, persist cursors |
| Background work | Serverless response should not depend on long post-response work | Queue/outbox provider for retries; cron only for bounded discovery/cleanup |
| Logging | Function logs are distributed and may contain sensitive data | Structured correlation IDs, redaction, centralized retention, no secrets/private payloads |
| Environment boundaries | Preview activity can affect the shared MVP database | Explicit pooled/direct variable mapping, no `NEXT_PUBLIC_` secrets, no destructive Preview testing, and restore isolation before customer production |

## Operation classification

| Operation | Classification | Notes |
| --- | --- | --- |
| Public marketplace/company/product read | Safe synchronous Route Handler | Short query, safe DTO, optional conservative revalidation |
| Auth login/logout/session refresh | Safe synchronous Route Handler | Rate limited, secure cookie/token handling, no verbose errors |
| Create/update request | Safe synchronous Route Handler | Validate and commit request + initial history/audit transaction; enqueue notifications after commit |
| Request status transition | Safe synchronous Route Handler | Transactional transition/history/audit/outbox; reject stale version |
| Admin assignment/note/priority | Safe synchronous Route Handler | Permission/resource check and transaction |
| Direct document upload | Should use direct storage upload | Presign/complete handlers validate metadata; browser sends bytes to storage |
| Document malware scan/thumbnailing | Should use queue/workflow | Mark quarantine, process asynchronously, expose status |
| Email notifications | Should use post-response work/queue | Durable outbox, retry, dedupe key, failure visibility |
| Marketplace expiry discovery | Should use cron | Select bounded expired records, acquire lease, idempotently archive/notify |
| Reminder notifications | Should use cron + queue | Cursor/batch processing and dedupe keys |
| Analytics aggregation | Should use post-response work/queue if expensive | Live small aggregates may be synchronous; large reports use materialized/read models |
| Audit cleanup/retention | Should use cron | Respect legal holds and retention policy; never delete active audit evidence |
| Stale upload cleanup | Should use cron | Delete incomplete storage objects only after grace period and verify no completion record |
| Business matching | Should use queue/workflow | Durable job, retry/dead letter, admin-visible job status |
| CSV/PDF exports | Should use queue/workflow | Store export status and private result object; signed download URL |
| Future AI features | Separate service if compute-heavy | Keep request/response job boundary; never block core request handler |

## Database connection management

- Use one server-only database client module with lazy initialization and a bounded pool suitable for serverless concurrency.
- Prefer a managed serverless Postgres provider with pooling/proxy support; confirm driver compatibility with the Node.js runtime.
- Do not create a new uncontrolled connection/pool inside each request handler.
- Set statement and transaction timeouts, use indexes for every list filter, and monitor active/idle connections.
- For the MVP, Preview and Production deliberately share the persistent Neon main branch; Preview seeds must remain production-safe and idempotent. Restore separate staging resources before customer production.

## Upload constraints

The browser requests authorization, receives a short-lived upload permission, uploads directly to private storage, and calls a completion Route Handler. The completion handler validates size, declared/actual MIME, extension, checksum, owner/resource scope, and scan state before creating/activating the document record. Public pages never receive private storage keys.

Suggested limits: 10 MB for trade licenses, tax/VAT documents, company profiles, and certifications; 25 MB for catalogs/specifications; 10 MB per product image with a 50 MB request total. Final limits require provider and business approval. Use generated storage keys, sanitized display names, checksum-based duplicate handling, quarantine prefixes, signed download URLs, retention timestamps, soft deletion, and orphan cleanup cron.

## Idempotency and retries

Require `Idempotency-Key` for public submissions, payment-like future actions, webhooks, cron-triggered mutations, document completion, listing publication actions, and notification enqueue operations. Store key, actor/scope, request fingerprint, status, response, and expiry in `idempotency_keys`. A repeated key with the same fingerprint returns the original result; a different fingerprint returns `409`.

Use exponential backoff with bounded retries. Permanent validation/permission errors are not retried. Failed jobs move to a dead-letter/manual recovery state with a visible job ID and audit event.

## Security and environment boundaries

- Server secrets include database URLs, session signing keys, storage tokens, email keys, queue credentials, and monitoring secrets.
- Only public configuration such as a browser-safe API origin may use `NEXT_PUBLIC_`.
- Use `import "server-only"` in secret-bearing modules and review client bundle output in CI.
- Configure CORS only when external consumers need it; same-origin Next.js calls should use same-site cookies and CSRF protections appropriate to the session design.
- Rate-limit login, password reset, public request/inquiry/demo submission, presign, and admin-sensitive actions.

## Deployment and operations checklist

- [ ] Vercel Production and Preview database variables map to the same persistent Neon main branch for the temporary MVP, with automatic Neon Preview Branching disabled.
- [ ] Route Handlers run in Node.js where database/storage/crypto SDKs require it.
- [ ] Migrations run as a controlled deployment step, never opportunistically on every request.
- [ ] Health checks cover application, database reachability, storage configuration, and queue/outbox health without leaking secrets.
- [ ] Structured logs include request/job IDs and redact tokens, credentials, file contents, and private messages.
- [ ] Monitoring alerts on 5xx rate, latency, DB connections, pool waits, queue retries, scan failures, and cron misses.
- [ ] Backup restore, migration rollback/forward-fix, and orphan cleanup procedures are tested.
