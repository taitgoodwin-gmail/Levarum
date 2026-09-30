# Owner inbox setup and operation

## Current environment

Production remains the previous pilot. The review preview now has Clerk development authentication, Neon Free PostgreSQL, and a separate private preview Blob store. Current source requires PREVIEW_READ_WRITE_TOKEN for every non-production write/read and fails closed when it is missing; it never falls back to the production token. Production explicitly uses BLOB_READ_WRITE_TOKEN (or its supported store-ID authentication). Provider scope verification is recorded separately in BLOB-ISOLATION.md; source selection alone does not prove deployment configuration. No production lead reconciliation was performed. The public bundle cannot import the admin entry or server SDKs.

## Provisioned preview services

After the owner accepted marketplace terms, Clerk Hobby and Neon Free (iad1, Neon auth disabled) were provisioned for preview/development. No paid plan was selected. Clerk enrollment is restricted by an exact email allowlist to taitgoodwin@gmail.com, with subaddresses blocked. This is restricted self-enrollment, not an emailed invitation. The owner completed verification; the verified primary-email account's immutable ID is configured server-side as ADMIN_OWNER_USER_ID. Both that ID and the verified exact primary email are checked on every admin request.

Server configuration: CLERK_SECRET_KEY, ADMIN_OWNER_USER_ID, ADMIN_ALLOWED_ORIGINS (comma-separated exact trusted origins), DATABASE_URL, and the environment-specific private Blob token. The only client configuration is VITE_CLERK_PUBLISHABLE_KEY. The marketplace public key is mapped to this Vite name. Secret values stay in Vercel and ignored env files.

Preview authorization also trusts Vercel's platform-supplied immutable VERCEL_URL. It never derives trusted origins from request headers. A deployment hostname change requires a fresh browser sign-in. Configure explicit stable production origins before release.

The isolated production database is connected and schema-tested. Clerk DNS and certificates are verified, while its production project connection and owner binding remain incomplete. Synthetic combined recovery is verified in [RECOVERY-PLAN.md](RECOVERY-PLAN.md); owner account recovery, ongoing backup custody/routine and production acceptance remain release gates. Do not promote a development Clerk instance as the production authentication setup.

## Admin API

Vercel's single `/api/admin` function supports GET with action=list (default), kind/status/page filters, and action=detail&id=<opaque ID>. POST action=status takes id, status, expected version and mutationId; POST action=sync reconciles one page of 50 private Blob keys. Every action authenticates independently. POST also requires same-origin JSON and a 4 KB maximum body.

Only call requests can move to Booked. A status change is not an email, invitation or appointment. Reply from hello@levarum.com using Apple/iCloud Mail, agree a time and timezone, then record Booked. Other records use New, Contacted and Done, with corrections allowed.

Blob is the durable submission record. PostgreSQL stores the index and status history, not full submission content. An index failure cannot turn a saved public request into a reported failure. Use Reconcile saved requests until the UI reports a complete pass; counts explicitly cover indexed records only. SQL updates lock the record and atomically write status/history; the expected version detects stale edits. Mutation IDs make successful retries idempotent.

## Release and recovery

Local PostgreSQL transactional behavior passed the opt-in test in tests/postgres.integration.mjs. Neon persistence, concurrent updates and private Blob reconciliation now also pass with isolated synthetic records. Do not promote until browser admin verification, production authentication/resources, recovery, manual review cadence and visual review pass. Before promotion record the previous production deployment ID. A rollback changes application code, not customer records. Do not delete Blob data or drop tables during rollback.

Confirm provider backup/restore availability and retention on the selected plan before production. There is no verified automated retention/deletion job. For a deletion request, verify identity privately and remove matching content, index and associated records consistently using an audited procedure; do not publish personal data in tickets or logs.


## Recovery procedure scope

The tested procedure exports exact private object bytes and matching SQL index/history together, restores SQL before reconciliation, and verifies target-only detail reads and status continuity. Original SQL receipt dates and Blob JSON receipt dates are independently preserved. A Blob-only rebuild is not equivalent: it loses status history and may use new upload dates. [Recovery evidence](RECOVERY-PLAN.md) records the three-record synthetic drill and its limits. No automated customer backup schedule, retention period or account-loss recovery guarantee is configured by that test.
