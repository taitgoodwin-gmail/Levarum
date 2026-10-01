# Exact-key erasure and retry coordination — proposal, 2026-10-01

**Decision required; not implemented in the application.** The smallest candidate preserves a private, content-free marker at each erased Blob pathname, while existing PostgreSQL transactions serialize index/reconciliation changes with erasure. It avoids a new service, a second authoritative suppression table, and making successful public saves depend on SQL availability. Eight executable proposal tests pass, in addition to the two existing open-gap characterization tests. This is a tested model, not proof of cloud-provider behavior or completed erasure.

## Verified preview provenance

Vercel deployment `dpl_3TrqqBBiRD8NNkTuaFDGZXVBinxc` is **READY**, source **git**, target **null** (preview), with repository `taitgoodwin-gmail/Levarum`, branch `codex/design-assessment-fixes-20261001`, and exact commit `78bb9a9d5cfa41ef1b7cdbf1e35bd0f91519920f`. [Sanitized connector receipt](evidence/admin-correctness-20261001/deployment-78bb9a9.json). [Preview](https://levarum-hrndh3v4g-mind-lever-gmail.vercel.app).

The approved working-branch push triggered the existing Git-linked Vercel deployment automatically. No separate deploy call, credentials, temporary share link, sign-in bypass or protection change was used. Metadata was verified through the connected read-only deployment tool. This confirms provenance/build readiness; it does not claim a fresh authenticated owner walkthrough. [Exact application-commit CI](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/36925641195) completed successfully.

## Why this is smaller than a new mandatory SQL ledger

Current `server/private-save.ts` writes immutable exact keys with `allowOverwrite:false`; an existing matching body means a duplicate retry, while missing/different content does not produce success. Both lead and partner APIs use it. SQL indexing remains best effort after durable Blob saving. `indexLead` and `syncPage` currently insert index rows without inspecting a deletion marker; reconciliation trusts listed key metadata. There is no deletion endpoint, enforced request-expiry window or deletion ledger in the running application.

A physically removed key can be recreated. A separate preflight tombstone check races with a delayed write, including when a database lock is lost but a remote Blob request can still finish. A retained marker keeps the *same destination key occupied*: ordinary writers remain unable to replace it, even if their request started earlier. All participant operations must preserve that storage invariant.

Vercel documents same-path overwrite rejection by default, explicit overwrite support, and origin reads using `useCache:false`. These support the candidate primitives; isolated provider concurrency/failure validation remains required before relying on them for erasure. [Blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk), [private consistent reads](https://vercel.com/docs/vercel-blob/private-storage). PostgreSQL transaction advisory locks release with the transaction and require every relevant caller to participate. [PostgreSQL locking documentation](https://www.postgresql.org/docs/current/explicit-locking.html).

## Proposed protocol

1. **Validate exact scope.** A private operator operation accepts an already-authorized manifest of exact source keys/IDs in one explicitly selected environment. Verify key grammar and `id=SHA256(exact pathname)`; never normalize key case, scan by email casually, accept arbitrary Blob URLs or use a deletion prefix. No new public deletion API is needed.
2. **Acquire the per-key SQL transaction lock.** Use one deterministic advisory-lock identity derived from the exact key; hash collisions may serialize unrelated work but never determine deletion scope. Apply it in `indexLead`, each reconciled key and erasure. Use a consistent lock order and bounded transactions; a failed connection cannot continue SQL work outside its transaction.
3. **Seal the Blob key.** Overwrite that exact private key with a versioned constant marker such as `{"_levarumDeletion":1}`; retain no original body, email, timestamp, actor or status in it. If the key is absent, create the marker anyway to block delayed writes. Verify the exact marker using an uncached private read. An unknown write/read outcome is pending, not completed. Never delete the marker or roll it back to personal content.
4. **Remove active SQL data under the same lock.** Delete the exact status events and index row, then commit. If SQL fails after the marker is durable, do not undo the marker; retry the bounded cleanup. Until SQL cleanup succeeds the case is incomplete and a stale index row may remain, but private detail reads must not expose or interpret the marker as a lead.
5. **Make indexing marker-aware.** After acquiring the same key lock, both direct indexing and reconciliation read the source from origin. A marker or missing source is not indexable; an unreadable/unknown source fails that operation rather than being treated as missing. Reconciliation must not rely on an earlier listing or cached source body. Advance its cursor only after the page's operations have safely completed. Public Blob saves retain best-effort indexing semantics.
6. **Make reads/retries truthful.** `readDetail` recognizes the marker and returns the normal unavailable/not-found response, never marker data. The saver recognizes a marker separately from an ordinary duplicate. The APIs return a terminal, generic non-success for an erased request, and the UI does not silently rotate its request ID to bypass suppression. A genuinely new consented request remains separate; this is exact-key suppression, not an identity ban or all-record discovery mechanism.
7. **Restore with current exclusions.** Preserve an independently current marker manifest through backup/restore. Seal excluded keys before importing old content, exclude their SQL index/history, use non-overwriting imports, and do not expose the restored service until scope/freshness is verified. An old archive's own marker list is insufficient. The model deliberately demonstrates that an empty/stale manifest can restore deleted content.
8. **Roll out compatibly before erasure.** Every deployment/tool that can reconcile or overwrite the same store must understand markers. Old sync code can recreate ghost index rows; old restore tooling can overwrite markers. Establish a compatible rollback floor and prevent those old operations from being used before enabling erasure. This proposal changes no deployment access settings.

The marker prevents ordinary late writes from resurrecting content; the SQL lock prevents a reconciler that read earlier content from recreating an index *after a completed erasure*. If a connection dies while a remote marker write is still pending, completion remains unknown and a fresh locked verification/cleanup is required. No cross-provider transaction is claimed. A private response or optional notification already in flight cannot be recalled by this protocol; the case must also account for pending correspondence and known copies before claiming complete handling. New reads recognize markers, but this is not a promise to erase content already delivered to a browser or mailbox.

## Synthetic model and acceptance coverage

`tests/fixtures/deletion-protocol.mjs` is test-only. It uses the real immutable record saver with atomic in-memory Blob operations; an in-memory queue stands in for per-key PostgreSQL transaction locks. No server/application import, real credential, cloud write or real deletion occurs.

`tests/deletion-protocol.test.mjs` covers:

- repeated erasure, unchanged retries, stale list reconciliation and an unrelated control;
- an already-started Blob write arriving after the marker;
- an in-flight index transaction completing before erasure cleanup;
- reconciliation waiting behind erasure, then re-reading the marker;
- failure after marker persistence, rejection of retries, and resumable SQL cleanup;
- old-archive exclusion using a current manifest, plus failure without one;
- the explicit limitation that removing a marker reopens the key, while a new request ID is separate;
- both call and partner payloads through the real immutable saver.

All 43 unit/model tests pass locally. [Targeted model/characterization receipt](evidence/deletion-proposal-20261001/model-results.txt). The original two characterization tests still demonstrate the *running application's* open limitation; green model tests do not close it. Current source/application is unchanged from 78bb9a9; only tests and documentation are added. CI also runs the complete existing browser/build checks on the saved proposal commit.

Not validated here: actual PostgreSQL advisory locking, Blob conditional-write races/unknown outcomes, provider history/erasure, full coordinated restore, old-deployment isolation, actual retention obligations or live owner acceptance. These require the chosen protocol and designated isolated resources; no real-data erasure is authorized by this proposal.

## Precise owner decision

**Recommended:** permit a minimal private marker at each erased key, with the current marker manifest treated as mandatory restore exclusion data. Markers contain no submitted body, but their pathname still encodes a request ID/content hash and is pseudonymous information. Current APIs accept old request IDs indefinitely, so a finite marker expiry cannot safely be chosen under existing semantics.

**Decision to return:** May Levarum retain these private anti-replay markers for as long as old requests can be replayed (currently unbounded), and require a verified current marker manifest before any restore is exposed?

If yes, the implementation scope is steps 1–8 above plus provider/SQL fault-injection tests and truthful API/UI rejection. Full backup/correspondence/provider-copy disposition still needs its own approved handling; marker retention is not a claim of complete erasure.

If no, do not add a race-prone preflight or delete markers on an invented schedule. A finite-retention alternative needs a server-enforced admission/expiry protocol with an explicit legacy-client cutoff and matching restore horizon. That changes retry/backward-compatibility behavior and costs more engineering. Existing product semantics do not select between those policies, so the application remains unchanged pending this decision.
