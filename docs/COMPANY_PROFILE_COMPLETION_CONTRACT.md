# Company profile completion contract

Completion is calculated centrally from saved server state and is never persisted or recomputed by client UI. It is whitespace-aware and returns field identifiers only: percentage, completed/incomplete groups, next action, `profileComplete`, `verificationReady`, and `verificationBlockers`. It never returns company field values.

The supported weighted groups are identity, business type, business email, registration country, category, primary location, business address, description, products/services, and business phone. Optional website and optional registration identifiers do not change the completion percentage in this phase.

Verification readiness is distinct from completion. It currently requires legal identity, business email, registration country, category, location, and address. It does not claim document submission, review, pending status, or approval; those future workflow blockers remain outside this calculation.
