# Server authentication boundary

Authentication is deferred to a later phase. Future session, registration, email verification, password reset, and revocation adapters belong here. This directory must remain server-only and must not expose credentials or session internals to Client Components.
