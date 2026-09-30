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

## Privacy request execution: exact records, all relevant copies

This is an operator procedure for the current private Blob + PostgreSQL implementation, not a new public deletion API. `server/admin-store.ts` exposes list/detail/status/sync, **not deletion**. The following external actions are prepared instructions; no cloud record was deleted while writing or testing this runbook. Production/customers are outside the synthetic drill.

### Intake and prepare the exact deletion manifest

1. Receive the request privately through hello@levarum.com. Verify that the requester controls the relevant contact address and determine what they want removed before exposing or deleting records. Keep identity verification in the private correspondence; never publish it in a GitHub issue or this document. Owner decides any actual retention obligation or unresolved identity case; do not invent a legal deadline or keep-everything policy.
2. Identify the precise request references/source paths through authorized owner access. A person can have multiple separate follow-up/call/partner records; deleting one ID is not automatically a complete response to a request covering all their data. Current SQL index has no email-search field. If the person cannot identify their requests, establish a separately authorized private discovery scope rather than scan/export every submission casually.
3. Prepare a restricted manifest containing case reference, environment/resource identities, each exact `leads/{plan|call|partner}/{uuid}-{hash}.json` path, `id=SHA256(path)`, expected index/event counts, and known copy locations. Include no token, email body or extra personal content in the deletion ledger. Paths/IDs remain pseudonymous private records, not public evidence.
4. Inventory each exact copy: active Blob object; index/history; recovery-store object; archived raw JSON/manifest; SQL dumps and extracted baseline/fixture files; operational correspondence and sent replies; any intentionally created export. Do not assume a database deletion removes Blob, recovery copies or email. Current synthetic recovery manifests are under `work/blob-recovery/` and `work/combined-recovery/`; their test records are not customer records.
5. Confirm the selected credential belongs to the intended store and the database to the intended environment. Use explicit credentials loaded privately, not SDK defaults. For a synthetic cloud exercise, derive paths only from `work/post-scope-hosted/submissions.json` and verify the synthetic email/consent against `work/blob-recovery/.../manifest.json`; reject any production token or nonmatching store. No such cloud deletion has been executed here.

### Remove and verify, with failure recovery

Pause owner reconciliation/status work for the selected records during removal; an index-only delete followed by reconciliation can recreate the row from Blob. The application has no persistent deletion suppression table, and an in-flight public retry can recreate content: before real deletion, arrange a bounded maintenance/quiescence method or implement/test a narrow suppression mechanism. A human note alone does not stop active requests. Do not promise complete erasure until this concurrency boundary is controlled.

Retain a minimal restricted deletion ledger entry before removing content: case reference, exact path/hash ID, selected resource IDs, state `in-progress`, date, accountable operator and per-copy completion booleans. Do not copy the submitted body into that ledger. This ledger is also the restore exclusion list.

For each authorized path, the installed Blob SDK supports an exact-path operation:

```js
// Run only after validating the private manifest, explicit store identity,
// authorized scope and quiescence. Never pass a prefix or unbounded list.
await del(entry.path, { token: explicitSelectedStoreToken });
const remaining = await get(entry.path, {
  token: explicitSelectedStoreToken, access: 'private', useCache: false
});
if (remaining !== null) throw new Error('Exact object absence not confirmed');
```

Use the same bounded operation for the known recovery-store copy with its **separate** explicit credential. Treat network/auth errors as unknown outcome, not confirmed absence. Keep the case in progress, retry the exact path and verify again; do not broaden the deletion or delete the store. Provider cache/history behavior is not proved by this snippet or the local test.

After active content is confirmed absent, use a database transaction with parameterized values. The tested local helper performs this exact sequence:

```sql
BEGIN;
SELECT id, source_key FROM levarum_lead_index
  WHERE id = $1 AND source_key = $2 FOR UPDATE;
-- Assert the manifest ID equals SHA256(path), and that at most one row matches.
DELETE FROM levarum_status_events WHERE lead_id = $1;
DELETE FROM levarum_lead_index WHERE id = $1 AND source_key = $2;
COMMIT;
```

The helper deletes events/index only after confirming the ID/path match. Zero matching rows is a safe repeated-operation state, not proof that Blob or copies are gone. Verify zero index/history counts for that exact ID after commit. Do not modify other leads, clear sync state, or drop tables. If SQL fails after Blob removal, roll back the SQL transaction and leave the case open for an exact retry; the remaining index may report unavailable content. Do not restore deleted content merely to make the inbox look consistent. A transaction cannot atomically roll back a separate Blob deletion.

Delete or exclude the same exact local raw-copy files, using paths inside the manifest's approved private archive directory. Preserve unrelated records and never use recursive wildcard cleanup of `leads/`, `work/` or a store. A custom SQL archive can contain several people: do not edit bytes in place. Either retire the entire archive when permitted by the selected policy, or keep it restricted until expiration and enforce the deletion ledger during isolated restore before any restored service is accessible. Record that distinction; do not call a retained archive physically erased.

For correspondence, the owner reviews the exact request/reply thread in Apple/iCloud Mail and handles applicable mailbox/trash copies under the chosen policy. The application does not control those copies. Provider history/internal backups may retain older data according to actual provider settings; no immediate deletion from every provider backup is asserted.

Only mark the case completed when active exact-path absence, SQL absence, addressed recovery/raw copies, restore exclusions and correspondence disposition are recorded. Keep necessary exceptions explicit. Any response to the requester requires the user's authorized correspondence workflow; this runbook does not send email.

## Local privacy procedure test — verified scope

On 2026-09-30, source `9ad165b87ded68dfe2bb2e2422bb95545799d8c2`, executed ignored `work/privacy-runbook/local-delete.mjs` from `08:19:28.439Z` to `08:19:29.232Z`; exit0, cluster stopped. The test creates a fresh localhost-only embedded PostgreSQL database using the exact application DDL, two generated synthetic records/history rows and two local filesystem copy sets. One record is the deletion target; the other is an unrelated synthetic control. It accesses no prior/cloud/customer records.

Verified: dry-run rollback preserved both records; mismatched ID/path failed closed; exact event/index deletion and repeat succeeded; both target local-copy files disappeared while control files remained; restore-manifest filtering excluded the deletion target; sync row stayed intact. Evidence: `work/privacy-runbook/latest-results.json` and the named run directory therein. **Local filesystem copies are adapters, not proof of Vercel Blob deletion or secure physical erasure.** The exclusion test is filtering logic, not a new database restore; genuine restoration evidence remains in RECOVERY-PLAN.md.

Repeat safely from the repository with the available Node24 runtime:

```sh
/Users/tag-mba-2066/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node work/privacy-runbook/local-delete.mjs
```

It generates fresh localhost fixtures every run. Local socket binding may require the execution environment's permission. It never accepts a remote database URL or cloud token. The script and evidence are ignored work artifacts; preserve them in the controlled operator handoff if this procedure will be maintained beyond this workspace.

## Backup custody and copy-retention checklist

An export is not a backup routine until somebody keeps, checks and can restore it. Existing scripts are verified **synthetic test harnesses**, not an installed production backup service. The source/target credentials and prior run state differ between scripts; do not replay a cloud launcher against a nonempty target or point a synthetic harness at production.

| Operator action | Concrete completion evidence | Current capability / limitation |
|---|---|---|
| Select coverage | Manifest of intended source records, raw Blob bytes and matching SQL index/events, code/schema version and capture boundaries. | Selected-record mechanics verified; no scheduled full-customer export or atomic live cross-provider snapshot. A real capture requires controlled writes or a tested consistency method. |
| Create and validate copy | Private object hashes/lengths + SQL archive hash, row/event counts and original receipt dates; original files unchanged after verification. | Use the exact recovery procedure. Existing locally built18.4 pg_dump/restore clients have no TLS: localhost only. Remote Neon export requires compatible TLS-capable clients/direct connection or the bounded read-only extraction already demonstrated. |
| Store privately | Named approved destination, accountable custodian, access permissions and encryption/access-key recovery recorded privately; secret keys kept separately. | Current ignored directories are mode-restricted evidence, not proof of device encryption, off-device protection or owner custody. Never move customer backups into Git/public outputs. A second store in the same account does not protect against account loss. |
| Confirm backup health | Date/source, manifest hash, count check, successful restore record and a failure flag visible to the accountable operator. | No automatic job/alert exists. Until implemented, the chosen person must inspect the outcome; a failed or incomplete export does not replace the last verified copy. |
| Restore without resurrection | Empty isolated targets; hash check; apply deletion ledger to content/index/history before exposure; verify application details, status continuity and authorized access. | Combined synthetic read/sync/status restoration passed. Owner-authenticated restore and deletion-ledger integration into an actual archive restore remain unverified. |
| Retire an eligible copy | Exact archive/copy ID, policy decision, disposition and date; verify absence where independently controllable. | No automatic expiration configured. Account for copies of manifests/baselines and provider history; never infer actual deletion from removal of a local shortcut. |

The owner must still choose the actual retention practice, acceptable loss exposure/export cadence, custodian and accessible private destination; none is filled with an invented numeric promise. Choices can use existing private resources if suitable—no paid vendor, new committee or automatic email is required. If a real resource limit conflicts with the selected practice, present that concrete limitation before any paid commitment.

For the operator handoff, record these five fields privately: **reviewer; inbox review cadence; backup custodian/destination; export/check cadence; retention/deletion practice**. Record missing fields as unresolved rather than silently defaulting them. A successful synthetic drill is progress toward operational readiness, not agreement to an ongoing routine or completion of production launch.
