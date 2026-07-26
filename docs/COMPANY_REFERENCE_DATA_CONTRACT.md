# Company reference-data contract

TradeConnect uses canonical database records, never labels, for company category and location submissions. `Category` is hierarchical by optional `parentId` and is unique by `(scope, slug)`. Company categories are relational and the existing partial unique constraint permits one primary category per company.

Reference APIs expose active, non-deleted values only, with deterministic category ordering by scope, sort order, and name. Country and location options expose only IDs and display names; category options additionally expose safe `scope` and `slug`. They use the normal API envelope, request IDs, and public reference-only caching (`max-age=300`, `s-maxage=3600`). Private company data always remains `no-store` and dynamic.

Bangladesh is a canonical `Country` record with generic `Location` hierarchy: country → division → district → upazila. Parent query parameters are UUID-validated; requested parents must be active; list responses are active/non-deleted and may be empty. Company validation verifies country ownership and the division/district/upazila parent chain. Frontend selector values are IDs, while labels are display-only.

The seed currently contains all eight Bangladesh divisions, plus one real district and two real upazila paths per division. It is deliberately not nationwide coverage; enrichment remains an idempotent reference-data task, not a schema change.
