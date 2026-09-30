# Recovery plan and isolated drill specification

Prepared 2026-09-30. **Research and proposed procedure only: no export/restore drill was executed by this work.** No production writes, customer reads, service configuration changes or paid commitments occurred. This supports existing release gate G06; it does not add an approval stage. Read alongside [operations](OPERATIONS.md), [production provisioning](PRODUCTION-PROVISIONING.md), [Blob isolation](BLOB-ISOLATION.md) and [release gates](PRODUCTION-RELEASE-GATES.md).

## What is known, and what is not

Provider inspection records both Levarum Neon resources as Free `free_v3`: production-only `levarum-production` and preview/development `levarum-admin-preview`. Their distinct endpoints/projects and production schema were verified. The rolled-back synthetic SQL transaction proves constraints and schema behavior, **not recovery**. Earlier synthetic private persistence and status-conflict checks also do not constitute backup restoration.

Blob identity inspection distinguishes production `levarum-leads` from `levarum-preview-private`; the scope findings and correction status belong to BLOB-ISOLATION.md. Do not infer safe credentials from store names or assume every local/deployment environment has the latest correction. No actual Neon history setting, available restore timestamp, snapshot entitlement, customer-accessible Blob recovery, or completed recovery time was verified here.

| Capability | Official documentation checked | Consequence for Levarum |
|---|---|---|
| Neon Free history | The dedicated history-window page specifies a six-hour default/maximum, capped at 1 GB of history without charge. History supports point-in-time operations; zero disables them. [Neon history window](https://neon.com/docs/postgres/backup-restore/history-window). | This is a short, size-limited history window, not a promised six hours under every workload. Inspect the actual project's setting and earliest restorable point before relying on it. It protects database state, not Blob content. |
| Conflicting Free entitlement wording | The current pricing table also lists six hours/1 GB, but marks Free “Instant restore” unavailable. It lists one manual snapshot while clarifying snapshot counts are limits, not free allowances; scheduled snapshots are unavailable on Free. [Neon pricing](https://neon.com/pricing). | Record this documentation conflict rather than promise Free instant restore. Confirm actual `free_v3` account capability through its console/provider. Do not enable snapshots or a paid plan on the assumption they are free. The independent export path below does not rely on this ambiguity. |
| PostgreSQL export/import | Neon documents custom-format `pg_dump` and `pg_restore`, using direct, unpooled connections and compatible PostgreSQL client versions. An external export can outlast provider history. [Neon backup with pg_dump](https://neon.com/docs/manage/backup-pg-dump). | An archive is only a backup after a successful restore and integrity check. Database-only archives cannot recover submission JSON. No export schedule exists merely because these tools are available. |
| Private Blob data access | The SDK supports authenticated private reads and private writes with fixed paths and overwrite disabled. Reviewed SDK documentation supplies no customer undelete or point-in-time restore procedure. [Vercel Blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk). | Use an independently retained copy of raw objects. Absence of a documented restore workflow is not a universal claim about provider support; do not depend on an undocumented recovery promise. |
| Vercel internal backups | Vercel expressly describes its infrastructure backups as unavailable to customers. [Vercel security and compliance](https://vercel.com/docs/security/compliance#data-backup). | Do not translate that infrastructure statement into Levarum's Blob backup retention, recovery time or self-service restore entitlement. Deployment rollback also does not restore Blob/SQL records. |
| Blob Hobby usage | Documentation includes 1 GB storage/month, 10,000 simple and 2,000 advanced operations, and 10 GB Blob transfer. Private/public storage pricing is the same; Hobby access stops when limits are exceeded until the stated reset period. Additional stores still consume usage. [Vercel Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing). | Check actual team plan, remaining allowance and operation estimate before a cloud drill. “Small” does not prove free, nor does a separate store provide an independent account backup. This research did not verify the team's remaining allowance. |

## Recovery unit and fidelity requirements

The application splits one operational record across two systems:

- **Private Blob:** exact original JSON bytes, original pathname, content type, and manifest metadata. Preserve `receivedAt`, `privacyVersion`, consent, schema version and omitted optional fields. Restore bytes rather than resubmitting through `/api/leads` or `/api/partners`, which would create a new submission context.
- **PostgreSQL:** schema plus `levarum_lead_index` and `levarum_status_events`, including source keys, IDs, original receipt dates, current statuses, versions, event timestamps, actors and mutation UUIDs. `levarum_sync` is operational cursor state, not submission evidence.
- **Manifest:** source code commit, schema/client versions, export start/end, fixture IDs, original paths, object byte lengths and SHA-256 hashes, archive hash, and expected row/event counts. Keep credential-free resource identifiers privately with the drill evidence.

Source references: `server/private-save.ts` and `server/admin-store.ts`. Index IDs are SHA-256 hashes of original source paths. Restoring to the same paths in a different private store therefore preserves application IDs. Provider upload timestamps/URLs/ETags may change; these are not the JSON's original receipt date. Preserve database receipt dates. Reconciliation currently derives a missing index date from provider upload time, so rebuilding from reuploaded objects alone can change displayed receipt chronology as well as lose status/history. A Blob-only reindex is explicitly incomplete recovery.

## Practical synthetic drill — proposed, not run

### 1. Establish isolated targets and fixtures

Use a bounded set of newly generated synthetic follow-up, call and partner records, including legacy/v2 shapes, a message-only v2 request and omitted optional context. Use reserved example contact details; disable notifications. Include at least one record with two status events so a reset to New cannot pass unnoticed.

The source and restore database must contain only these fixtures. Prefer two dedicated local PostgreSQL databases for the first round. A cloud round uses designated empty, unconnected test databases and a separate empty private Blob restore store, after confirming allowance/access. Do not branch production: a branch can copy customer data. Do not run `pg_dump` over an existing mixed preview database merely to obtain a few test rows.

If reusing previously created preview fixtures, read only their exact manifest paths/IDs, verify their synthetic provenance, and import their allowlisted database rows into the dedicated synthetic source database before dumping. Label this a **selected-record recovery** rather than a complete database export. Missing or uncertain provenance stops that fixture's inclusion. Never list or export the production inbox.

Fail closed before writes unless source/target database identity and Blob store identity are known, distinct, and nonproduction. Target emptiness must be checked. Use a standalone process with explicit test credentials, no automatic fallback to `.env.local` or production variables. Keep secrets out of arguments, logs and reports; use restricted credential files/process configuration and remove temporary copies afterward. No application project connection, alias or deployment is changed by the drill.

### 2. Capture a consistent export

Finish all fixture writes and stop fixture mutations for the capture. Record this bounded quiescent interval; do not claim an atomic cross-provider snapshot. Fetch each known private object as raw bytes, verify its known path/content, and write it to a restricted ignored directory. Do not serialize parsed JSON back into a new byte representation.

Export the isolated synthetic database using `pg_dump` custom format, preserving schema/data/constraints. Verify compatible client/server versions and use direct connections for Neon. Store the archive and manifest together; hash each artifact and check that every indexed fixture has a matching object and every event points to its original lead. Capture sync state for diagnosis, with the restart rule below.

A production procedure would need an explicit coordinated write pause or independently proven snapshot/high-water-mark method to align database status/history with Blob content. The synthetic pause does not prove such a live-capture mechanism exists.

### 3. Restore into empty destinations

Restore the database archive into the dedicated empty target using `pg_restore`; fail on errors and validate all constraints. Do not use destructive clean/drop options against an existing database. A different database role can own restored objects, but event `actor` values must remain unchanged.

Write each archived object to the **restore store**, retaining its original pathname and bytes, with private access, the captured content type, no random suffix, and overwrite disabled. Re-read only those target paths and compare bytes/hashes. An existing identical object may be verified and skipped on a repeat run; any differing object is an error, never an implicit overwrite.

Compare the restored database to the captured baseline before further mutations. Then reset only the target `levarum_sync` cursor and completion timestamp to null before starting a fresh bounded reconciliation: source listing cursors/completion are not valid proof of target-store coverage. Record this intentional operational reset separately from preserved business data. On the complete synthetic target, reconcile and ensure existing statuses/history/receipt dates remain unchanged.

### 4. Prove useful recovery, not just successful commands

| Assertion | Required result |
|---|---|
| All fixture content | Exact path and SHA-256/length match; original consent/notice/date/context omissions preserved. |
| Database fidelity | IDs/source keys/receipt times/statuses/versions and every event/mutation UUID/actor/timestamp match the baseline; constraints present. |
| Application read | Fresh process using only target resources reads fixture details and history through existing storage code. No source fallback. |
| Private access | Known restored synthetic object is unreadable without authorization; an authenticated exact read succeeds. Never expose an access token in a URL/report. |
| Mutation continuity | An already-used mutation ID is idempotent for its original actor/payload; a new valid update advances one version/event; a stale version conflicts. Compare baseline before this deliberate mutation. |
| Reconciliation | Complete bounded pass on the synthetic target retains current status/history and original indexed receipt dates. |
| Failure detection | A deliberately corrupted **copy of the local export** is rejected by hash validation before restore; missing object/event fails completeness. Original source/export remain intact. |
| Repeatability | A second run refuses a nonempty SQL target unless explicitly designated a separate verification path; Blob identical-content retry is safe and different-content collision fails. |

A local Blob fixture adapter can exercise archive mechanics but cannot close private-cloud storage recovery. Likewise, direct storage-code reads do not prove a logged-in owner browser journey. Record these as separate scopes rather than inflate drill coverage.

### 5. Record evidence and stop

Record exact source commit, database/client versions, nonsecret source/target identities, UTC timings, counts, manifest/archive hashes, assertions and unresolved limitations in ignored evidence, plus a sanitized pass/fail summary in documentation. Keep synthetic values out of public screenshots when unnecessary. Do not delete stores or original records as part of proving recovery. Cleanup only the exact designated synthetic resources under the relevant authorization; never broad prefix deletion in a shared store.

The elapsed time of one small drill is an observation, not a recovery-time guarantee. The oldest recoverable point is bounded by a verified retained export/provider timestamp, not a promised daily schedule. No RPO, RTO, automated backup schedule or retention period is established by this specification.

## Optional provider-history drill

After read-only confirmation of actual Free `free_v3` history availability/settings, a separate disposable synthetic-only Neon resource can test a historical restore/branch using a known pre-change timestamp. Preserve the original test branch and restore into a separate supported target where possible. Do not change project history settings, start a billable snapshot or rewind production. Record the actual supported operation and retained interval. This tests Neon database history only; Blob content and cross-system consistency still need the export drill.

## Ongoing operation and genuine owner decisions

The agent can prepare the harness, inspect nonsecret capabilities/allowances and run authorized isolated synthetic checks without a new committee or paid service. Provider access may require owner login; no passwords/codes should be shared in chat.

Before relying on backups for customer data, the owner must choose only the actual operating commitments:

1. **Acceptable data-loss exposure:** how much request/status history loss can the business tolerate? The short/capped provider window and independently chosen export frequency constrain the answer. If a required window cannot be met within existing free resources, present the exact gap and alternatives before any paid commitment.
2. **Who keeps and checks the copies:** designate an accessible private destination, credential recovery/custody and someone responsible for confirming export/restore health. A copy under the same compromised account or only on a lost laptop has limited independence. No new vendor is inherently required.
3. **Retention and deletion practice:** choose how long necessary backup copies remain, aligned with the live-data policy. Track verified exact-record deletion requests so an old backup cannot silently resurrect deleted personal data; apply pending deletions in isolation before returning a restore to service. Do not claim instantaneous deletion from provider history or invent a statutory period.

Production replacement still follows visual review and existing release gates. Data recovery does not replace the recorded application rollback candidate, owner account recovery, manual inbox review or Apple/iCloud correspondence access. None of those capabilities is newly verified by this document.

## Local drill preflight — actual evidence, 2026-09-30

At `2026-09-30T06:56:46.786Z`, source HEAD `6b9a0f7f90079ca8dedbe9d5a39b6f5cfe737d21`, inspected the existing embedded PostgreSQL runtime referenced by `work/run-postgres.mjs`. The installed `@embedded-postgres/darwin-arm64` package version is `18.4.0-beta.17`; its native binary directory contains only `initdb`, `pg_ctl` and `postgres`. **Both `pg_dump` and `pg_restore` are absent.** Executable checks also found neither tool on the current PATH or in the bundled runtime fallback/override directories. A runtime file search found no copy; conventional `/opt/homebrew/opt` and `/usr/local/bin` directories are absent.

The ignored repeatable preflight is `work/local-recovery/check-tools.mjs`; machine-readable results are `work/local-recovery/preflight-results.json`. The bundled Node executable ran that preflight successfully. It stopped before creating databases because genuine archive tooling is a prerequisite: zero databases/records were created, no cloud/customer data was accessed, no package was installed, and no archive export/import occurred. There was no substitute JSON roundtrip.

**Scope still unverified:** receipt-date fidelity after restore, statuses/versions, events/mutation IDs, restored constraints and continued idempotence, as well as all Blob restore behavior. The precise next dependency is compatible PostgreSQL `pg_dump` and `pg_restore` executables; the database engine itself is already available. Once those tools are available within authorized scope, run the two fresh localhost databases and assertions above. This is an executable-availability result, not a failed data restore or proof of recovery.
