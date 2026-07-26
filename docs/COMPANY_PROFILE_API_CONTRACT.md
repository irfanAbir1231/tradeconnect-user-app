# Company profile API contract

All routes are Node.js `/api/v1` Route Handlers using the existing `{ data, meta }` envelope and `no-store`. They use canonical `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, and `CONFLICT` errors.

| Method | Route | Scope | Result |
| --- | --- | --- | --- |
| POST | `/companies` | `manage_own_company` | Creates draft, owner membership, primary selection, readiness record, and audit event. |
| GET | `/companies` | `manage_own_company` | Lists active companies in the caller's memberships only. |
| GET/PATCH | `/companies/:companyId` | Active membership; PATCH requires owner/admin or platform administrator | Reads owner DTO / atomically updates it using required `version`. |
| POST | `/companies/:companyId/primary` | Active membership + `manage_own_company` | Selects the caller's sole primary company. |
| GET | `/me/company` | Authenticated caller | Returns selected primary owner DTO or `null`. |

Writes accept JSON only, reject unknown fields, validate UUIDs and active reference data, and reject cross-country locations. The API has no public company profile route. Public serializers must never expose private contact, registration identifiers, documents, audit events, or verification internals.

Onboarding also reads safe cached reference data from `/reference/business-categories`, `/reference/countries`, `/reference/divisions`, `/reference/districts`, and `/reference/upazilas`. These routes contain no authenticated company data.

Phase 4A.3 uses `PATCH /companies/:companyId` from the owner/admin edit form. The payload includes the current server `version` plus only changed allowlisted fields. Empty payloads, immutable fields, stale versions, inactive category/location references, cross-country locations, and unauthorized mutations are rejected by the existing validator/service layers.
