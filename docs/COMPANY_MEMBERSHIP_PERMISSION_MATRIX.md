# Company membership permission matrix

| Action | Owner | Company Admin | Member | Unrelated user | Application admin | Super admin | Enforcement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| View member-safe company profile | Yes | Yes | Yes | No (404) | Yes | Yes | Active membership or `manage_companies` |
| View private contact/registration data | Yes | Yes | No | No | Yes | Yes | Safe projection mapper |
| Edit company profile | Yes | Yes | No | No | Yes | Yes | Service-level administrator check |
| Select own primary company | Yes | Yes | Yes | No | Own membership | Own membership | Active membership + `manage_own_company` |
| View completion/status | Yes | Yes | Yes | No | Yes | Yes | Member-safe projection |
| Access onboarding | Redirect to profile | Redirect to profile | Redirect to profile | Available only if no memberships | N/A | N/A | Server route guard |
| Future manage members / submit verification | Deferred | Deferred | Deferred | Deferred | Deferred | Deferred | Future phase |

Application roles and company membership roles are separate. Platform access is based on the canonical `manage_companies` permission, never a browser claim or email address.
