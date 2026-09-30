# Owner inbox setup and operation

## Current environment

Production is the previous pilot. This branch is a review preview. Public submissions save privately to the existing Vercel Blob store. The separate admin app is implemented but fails closed until Clerk and PostgreSQL provisioning is completed. The public build must never include the admin entry or server dependencies.

## Provider setup still required

The requested marketplace provisioning commands selected Clerk `hobby_2025_08` ($0/month) and Neon `free_v3`, region iad1, built-in Neon auth disabled. Both returned `integration_terms_acceptance_required`; the owner must accept those provider terms in Vercel. Retry provisioning after acceptance, first for preview/development only. Do not silently select a paid plan.

Configure Clerk restricted enrollment and invite the owner through the normal provider UI. The owner completes verification. Record the verified account's immutable Clerk user ID as ADMIN_OWNER_USER_ID. The API also checks that the primary email is verified and exactly taitgoodwin@gmail.com. Neither client-side roles nor email alone grant access. Configure recovery and test it with the owner.

Server configuration: CLERK_SECRET_KEY, ADMIN_OWNER_USER_ID, ADMIN_ALLOWED_ORIGINS (comma-separated exact trusted origins), DATABASE_URL, BLOB_READ_WRITE_TOKEN. The only client configuration is VITE_CLERK_PUBLISHABLE_KEY. If the marketplace creates a differently named publishable variable, map its public value to this Vite name. Never prefix a secret with VITE_. Keep all secret values in Vercel/ignored env files, not source or chat.

Use isolated resources for provider development/preview and production. The existing Blob integration currently connects the same private store to all environments; verification therefore reads only exact synthetic keys. Do not reconcile production customer records into a preview database. Establish isolation before admin reconciliation tests.

## Admin API

Vercel's single `/api/admin` function supports GET with action=list (default), kind/status/page filters, and action=detail&id=<opaque ID>. POST action=status takes id, status, expected version and mutationId; POST action=sync reconciles one page of 50 private Blob keys. Every action authenticates independently. POST also requires same-origin JSON and a 4 KB maximum body.

Only call requests can move to Booked. A status change is not an email, invitation or appointment. Reply from hello@levarum.com using Apple/iCloud Mail, agree a time and timezone, then record Booked. Other records use New, Contacted and Done, with corrections allowed.

Blob is the durable submission record. PostgreSQL stores the index and status history, not full submission content. An index failure cannot turn a saved public request into a reported failure. Use Reconcile saved requests until the UI reports a complete pass; counts explicitly cover indexed records only. SQL updates lock the record and atomically write status/history; the expected version detects stale edits. Mutation IDs make successful retries idempotent.

## Release and recovery

Do not promote this preview until owner login, real PostgreSQL behavior, mobile admin, manual review cadence and visual review pass. Before promotion record the previous production deployment ID. A rollback changes application code, not customer records. Do not delete Blob data or drop tables during rollback.

Confirm provider backup/restore availability and retention on the selected plan before production. There is no verified automated retention/deletion job. For a deletion request, verify identity privately and remove matching content, index and associated records consistently using an audited procedure; do not publish personal data in tickets or logs.
