# Company profile field contract

Phase 4A.1 provides the private backend contract for an authenticated company draft. It does not publish profiles, upload documents, or start verification.

| Group | Fields | Create requirement | Visibility |
| --- | --- | --- | --- |
| Identity | `legalName`, `displayName`, `slug`, `businessType` | Legal/display name and business type | Owner/admin only; a future public DTO may expose approved display fields. |
| Contact | `businessEmail`, `businessPhone` | Email defaults to authenticated user email | Owner/admin only. |
| Registration | `registrationCountryId`, registration/license/tax identifiers | Country | Owner/admin only; excluded from audit snapshots and public DTOs. |
| Profile | Description, website, products/services, founded year, employee range | Optional | Owner/admin; public use needs a separate policy. |
| Address/taxonomy | Address lines, active primary location, categories, served countries | One category and primary category | Owner/admin; location must belong to registration country. |
| Operations | Version, verification/account status, timestamps | Server managed | Owner/admin as applicable. |

Create requires legal name, display name, business type, registration country, selected categories, and one primary category. Completion is derived rather than stored. Verification readiness requires legal name, business email, registration country, category, primary location, and address; a later verification phase must also require its own documents and decision workflow.

The schema supports country/location hierarchies, but canonical seed data currently has Bangladesh and limited city-level locations only. Division/district/upazila coverage is an explicit future idempotent reference-data task. No fabricated geography is returned.

Annual revenue, capacity, certifications, public contact preferences, social profiles, uploads, and verification review fields remain deferred because they require their own privacy and workflow contracts.

The onboarding UI creates only supported draft fields and retains registration identifiers inside authenticated private responses; it does not place them in URLs, metadata, or navigation props.

The Phase 4A.3 editor exposes only the existing editable contract fields: identity, business type/category, contact, profile description/products, founded year/employee range, address/location, and optional registration identifiers. It never sends IDs as editable values, membership/application roles, slug, verification state, completion, timestamps, audit data, documents, or admin notes. Read-only member dashboard projections omit private contact and registration identifiers.
