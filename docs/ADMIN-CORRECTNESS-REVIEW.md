# Owner dashboard correctness — 2026-10-01

Continues cbef8fcd29194a9dad5b7c20ba1327553745a41b without branding, routes, server authorization, storage configuration or production changes.

## Fixed and reproduced

The new isolated browser suite failed on the original code: a delayed401 for an older load cleared private content that a newer successful load had already rendered. The API helper now checks its request generation after obtaining a token and after reading a response, before applying any session-denial side effects. Stale responses cannot change the current view.

Denied sessions no longer trigger additional reads through focus/pageshow or a failed sign-out. A keyed session boundary remounts private UI state on account/session changes, including a signed-in to signed-in switch. This also prevents earlier requests/mutation state leaking into a replacement session. Server-side authorization still independently protects every API action; frontend state handling is not an authorization boundary.

## Synthetic dashboard coverage

`tests/browser/admin-states.mjs` starts its own loopback-only Vite server with no real API middleware or environment loading. Only that server aliases Clerk to `tests/fixtures/admin-auth.tsx`; production Vite configuration and both production entries have no fixture alias. All API responses are intercepted; external requests are blocked; the fake token cannot authenticate with the real server. Tests exercise the actual dashboard component, not a separately implemented mock dashboard.

Coverage: stale401 after newer success; loading;503 retry; stable mutation IDs;409 conflict then refreshed version; pending controls; keyboard status change; successful no-email notice; partial reconciliation notice; empty inbox; retained filter query; focus; missing-token/current403 denial; denied pageshow; sign-out failure/success; account change; pagehide clearing/pageshow reload. Detail UI passes at320/390/1440 in both themes and six Axe scans. [Results](evidence/admin-correctness-20261001/results.json), [mobile synthetic detail](evidence/admin-correctness-20261001/detail-390-dark.png), [desktop synthetic detail](evidence/admin-correctness-20261001/detail-1440-light.png).

Local35 unit/characterization tests, TypeScript/build and public/private boundaries pass. All eight real local API unconfigured503 guards and the disabled draft404 pass; production assets contain none of the synthetic provider fixture identifiers. The additional two tests below document open behavior, not a deletion-safety pass. The CI browser loop now includes this isolated admin suite alongside the existing nine suites. Final exact SHA/CI status accompanies the handoff.

## Verified deletion limitation — OPEN, no unsafe partial fix

`tests/deletion-race.test.mjs` uses the real private-record saver with an in-memory Blob substitute. It demonstrates: save a synthetic record → remove its key → replay unchanged request → content is recreated. A second deterministic test shows why a preflight suppression read fails: the deletion/suppression can occur between that read and an already-started write.

The repository exposes no deletion API. Current saves deliberately succeed after durable Blob storage even when best-effort SQL indexing fails. A safe fix is therefore not a one-line retry change:

- An SQL tombstone check alone cannot serialize the Blob write and deletion. A shared per-key transaction/lock protocol would also need every saver, indexer/reconciler and deletion operation to participate, including crash recovery. Making SQL mandatory for intake changes the existing Blob-first availability contract.
- Replacing content with permanent Blob tombstones preserves pseudonymous object keys and requires an explicit marker-retention/erasure policy. It also needs provider overwrite/history and restore verification; it is not proof of complete erasure.
- A process-local flag or mutex does not coordinate separate serverless instances. An owner note does not drain in-flight writes. Restoring an old archive can recreate content unless deletion exclusions are applied before exposure.

No backend patch is represented as closing this gap. No real or cloud records were deleted, no migration/configuration was applied, and no retention policy was selected. The existing operations prohibition on uncoordinated real deletion remains necessary. Next prerequisite is a reviewed deletion/restore coordination contract consistent with the required availability and marker-retention behavior; implement and test that protocol with isolated storage before any real erasure. This is a concrete remaining engineering/operational gate, not evidence that all privacy work is done.

## Remaining verification

The system Chromium151 dev smoke loaded real public content without a Vite overlay or reported browser errors. Firefox installation was attempted, but the browser distribution download returned403 Domain forbidden; Firefox coverage remains unrun. No new performance score is claimed. Hosted owner sign-in, valid/non-owner/expired/revoked live sessions, live Blob/SQL acceptance, actual assistive technology, production recovery and visual approval remain separate gates. Synthetic UI passes cannot replace those checks. No main/production/PR/access changes or duplicate deployment.
