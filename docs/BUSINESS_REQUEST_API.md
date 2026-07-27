# Business Request API (Phase 4B.1)

All endpoints require the authenticated Better Auth session and use the standard TradeConnect envelope. Successful payloads are returned as `{ data, meta }`; failures are returned as `{ error, meta }` with a stable error code. Responses are `Cache-Control: no-store`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/business-requests` | Create a draft in the actor's primary company. |
| `GET` | `/api/v1/business-requests?page=1&page_size=20&type=import&status=draft` | List only the actor's primary-company requests. |
| `GET` | `/api/v1/business-requests/:requestId` | Read one request after tenant authorization. |
| `PATCH` | `/api/v1/business-requests/:requestId` | Update a creator-owned draft with its current `version`. |
| `DELETE` | `/api/v1/business-requests/:requestId` | Soft-delete a creator-owned draft with `{ "version": number }`. |
| `POST` | `/api/v1/business-requests/:requestId/submit` | Submit a complete creator-owned draft with `{ "version": number }`. |

`PATCH`, `DELETE`, and `submit` are optimistic-concurrency operations. A stale version returns `CONFLICT`; a submitted request returns `INVALID_STATE_TRANSITION` for edit/delete attempts.

## Ownership and privacy

- Creation and mutation require `submit_request`; listing and retrieval require `view_own_requests`.
- The server derives the company from the actor's active primary membership—clients never select another company ID.
- An unrelated company receives `NOT_FOUND`, avoiding tenant-resource enumeration.
- A related non-creator can read a company request but cannot change the creator's draft.
- Request audit records retain lifecycle metadata and changed field names only. They never store descriptions, budgets, contact values, or other request values.
- Authenticated request DTOs deliberately omit internal notes, contact data, document metadata, and marketplace controls.

## Initial submission rules

Submission requires a title, description, category, and timeline. Import requests also require source and destination countries; export requests require a destination country; supply requests require a location; and all non-technology requests require a quantity and unit. Phase 4B.2 will introduce the type-specific form UI and richer request detail fields.
