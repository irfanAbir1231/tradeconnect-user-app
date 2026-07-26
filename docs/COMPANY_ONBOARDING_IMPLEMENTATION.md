# Phase 4A.2 company onboarding implementation

`/dashboard/company/onboarding` is an authenticated, dynamic server route. A user with an active company membership is redirected to `/dashboard/company`; a user with no membership receives the multi-step creation form. The form uses only the Phase 4A.1 `POST /api/v1/companies` contract and never submits a user ID, membership role, completion value, or UI-only step state.

The form has four stages: identity, business category/products, contact/location, and review. It creates no server records until final submission. Field validation is useful in the client while server validation remains authoritative; API field errors are preserved for correction. Successful creation replaces the route with `/dashboard/company` and refreshes server-rendered navigation.

Reference data is shared through server-only repository/service modules and safe public API routes for active categories, countries, divisions, districts, and upazilas. The Bangladesh cascade stores canonical IDs; country/division/district changes reset incompatible children. Seed data is idempotent and includes one real administrative path for each division, ready for later expansion without schema changes.

The initial company page is now real and displays server-projected identity, category, contact, location, completion, membership, and truthful `not_started` verification state. Editing, documents, verification submission, public directory projection, and membership management remain deferred to later phases.

Phase 4A.3 now provides the authorized settings-style editor at `/dashboard/company/edit`; onboarding remains the only creation path and is not duplicated.
