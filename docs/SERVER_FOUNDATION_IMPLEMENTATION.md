# TradeConnect Server Foundation Implementation

Status: Phase 1 foundation implemented; authentication, database, business APIs, uploads, and mock-data replacement deferred.  
Date: 21 July 2026

## Files created

### Server-only runtime foundation

- `src/server/server-only.d.ts` — TypeScript declaration for Next’s server-only boundary import without installing a package.
- `src/server/config/env.ts` — validated, server-only runtime metadata.
- `src/server/errors/error-codes.ts` — canonical API error codes and statuses.
- `src/server/errors/app-error.ts` — typed application error factory/class.
- `src/server/errors/error-response.ts` — safe public error serialization and diagnostics helper.
- `src/server/http/request-context.ts` — safe request ID extraction/generation, response headers, timing.
- `src/server/http/api-response.ts` — success, created, no-content, and paginated response helpers.
- `src/server/http/route-handler.ts` — centralized Route Handler wrapper and error/log handling.
- `src/server/logging/logger.ts` — dependency-free structured JSON logger with redaction.
- `src/server/permissions/permissions.ts` — canonical server permission vocabulary and actor shape.
- `src/server/permissions/authorize.ts` — unauthenticated/role/permission/company-scope interfaces.
- `src/server/validators/common.ts` — primitive ID, slug, email, phone, pagination, search, sort, date, and request-ID validators.
- `src/app/api/v1/health/route.ts` — Node.js liveness Route Handler.

### Deferred-boundary documentation files

Concise boundary READMEs were added under `src/server/auth`, `db`, `repositories`, `services`, `audit`, `storage`, and `notifications`. They describe ownership without creating fake database/auth/storage implementations.

## Directory responsibilities

The implemented and deferred boundaries follow [`NEXTJS_SERVER_ARCHITECTURE.md`](./NEXTJS_SERVER_ARCHITECTURE.md): Route Handlers parse/validate/delegate; services will own workflows; repositories will own database access; validators own runtime input checks; permissions own server authorization; storage, notifications, and audit remain abstractions until their phases.

## API response envelope

Successful responses use:

```json
{
  "data": {},
  "meta": {
    "requestId": "generated-request-id",
    "timestamp": "2026-07-21T00:00:00.000Z"
  }
}
```

Paginated helpers add `page`, `pageSize`, `total`, `totalPages`, `hasNext`, and `hasPrevious`. Responses default to `Cache-Control: no-store` and include `X-Request-ID` and `X-Response-Timestamp` headers.

## Error envelope and mapping

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fields": {
      "email": "Enter a valid email address."
    },
    "requestId": "request-id"
  }
}
```

Implemented mappings:

| Code | HTTP status | Intended use |
| --- | --- | --- |
| `INVALID_REQUEST` | 400 | Malformed request shape |
| `VALIDATION_ERROR` | 400 | Stable field-oriented validation errors |
| `UNAUTHENTICATED` | 401 | Future session requirement |
| `FORBIDDEN` | 403 | Future permission/resource-scope denial |
| `NOT_FOUND` | 404 | Missing/hidden resource |
| `CONFLICT` | 409 | Version/duplicate conflict |
| `INVALID_STATE_TRANSITION` | 422 | Future workflow transition rejection |
| `PAYLOAD_TOO_LARGE` | 413 | Future upload/payload limit |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Future file/content-type rejection |
| `RATE_LIMITED` | 429 | Future throttling |
| `INTERNAL_ERROR` | 500 | Unknown errors, without provider/stack leakage |

Unknown thrown values are converted to `INTERNAL_ERROR`. App errors may expose only their safe code/message/fields. Stack traces and raw provider/database errors are never serialized.

## Request ID behavior

`src/server/http/request-context.ts` accepts `x-request-id` only when it matches the bounded `[A-Za-z0-9._:-]` format and is at most 128 characters. Missing or malformed values receive a new `crypto.randomUUID()` ID. The ID appears in success metadata, error payloads, `X-Request-ID`, structured logs, and `X-Response-Timestamp` headers.

## Logging and redaction

The logger emits JSON-compatible records with timestamp, level, event, service, and safe metadata. It supports `debug`, `info`, `warn`, and `error`. Keys containing passwords, cookies, authorization, access/refresh/reset tokens, secrets, signatures, storage keys, document URLs, or bodies are replaced with `[REDACTED]`. Route Handlers log timing/status/request ID but do not log full request bodies. Development-only stack diagnostics stay server logs and never reach clients.

## Environment handling

`src/server/config/env.ts` is server-only and currently reads only safe runtime metadata: `NODE_ENV`, optional `VERCEL_ENV`, optional `VERCEL_URL`, and optional `VERCEL_GIT_COMMIT_SHA`. Values are length/newline/environment validated. Future database/auth/storage/email/queue settings must be added centrally and only when their phase begins. No `.env` file or secret is required for the build.

## Server-only protections

- Server modules import `server-only`.
- `server-only.d.ts` supplies TypeScript resolution without adding a package.
- Client Components do not import `src/server`.
- No database client, repository, service, storage adapter, auth provider, or secret exists yet.
- The server permission layer imports the public-safe role/permission vocabulary but does not authenticate or grant a default actor.
- `RoleGate` remains frontend-only and is not a security boundary.

## Health endpoint contract

`GET /api/v1/health` uses the shared wrapper, Node.js runtime, no database check, and no-store headers. It returns HTTP 200:

```json
{
  "data": {
    "service": "tradeconnect",
    "status": "ok",
    "environment": "development",
    "timestamp": "2026-07-21T00:00:00.000Z",
    "version": "development",
    "liveness": true
  },
  "meta": {
    "requestId": "generated-request-id",
    "timestamp": "2026-07-21T00:00:00.000Z"
  }
}
```

`timestamp` values are generated at request time. The endpoint is liveness only; a future readiness endpoint may check database/storage/queue dependencies separately.

## Validation utilities

`src/server/validators/common.ts` provides bounded parsing for:

- safe IDs and lowercase slugs;
- email and phone;
- page/page_size with defaults `1/20` and maximum page size `100`;
- search text maximum 120 characters;
- sort direction and allowlisted sort fields;
- ISO date/date-time;
- safe incoming request IDs;
- trimmed non-empty text with per-field maximum lengths.

Complete request/company/document schemas are intentionally deferred.

## Permission foundation

`src/server/permissions/permissions.ts` imports `UserRole` and `Permission` from `src/types/auth.ts`, preventing a second public vocabulary. `authorize.ts` exposes `requireAuthenticated`, `requirePermission`, `requireRole`, and `requireCompanyScope`. These are unused until authentication exists; no fake actor or default admin is created.

## Deferred items

- Authentication/session provider and current-user hydration.
- PostgreSQL client, ORM/query layer, repositories, migrations, and seed data.
- Business request CRUD/state transitions.
- File upload/storage/scanning.
- Notifications/queues/cron.
- Route-level auth/permission integration.
- Frontend mock-data replacement and API query hooks.

## Local verification commands

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run dev
Invoke-RestMethod http://localhost:3000/api/v1/health
Invoke-WebRequest http://localhost:3000/api/v1/health
```

The app should continue to build and render existing mock pages because this milestone adds only server foundation and a liveness endpoint.
