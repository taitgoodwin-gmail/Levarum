## Owner interruption and recovery — 2026-10-02

Continues exact f9a5fa6efcd8d8884b5a9c9bedf23ce22119bf7a on the existing working branch.

- HTTP 401/403 now clears private content before parsing the response body. HTML provider/proxy denials previously left request details visible. Stale-generation checks still precede denial side effects.
- The existing 20-second owner request budget now includes token retrieval and response decoding. A dependency that ignores cancellation cannot leave the interface working indefinitely. Timeout and malformed-response messages explain uncertainty, direct the owner to refresh, and preserve the same mutation ID for an unchanged retry.
- The inbox summary's existing four-second shared budget now settles even when a reader ignores its abort signal. Indexed rows remain available with unavailable summaries; late results cannot populate the returned page. This bounds waiting, not the lifetime of an uncooperative underlying provider operation; at most five reads start concurrently.

**Failed before / passed after:** [summary deadline regression](evidence/owner-recovery-20261002/summary-deadline-before.log) and [HTML denial regression](evidence/owner-recovery-20261002/admin-recovery-before.log) reproduced on the starting implementation. Both pass after the fixes. An initial refresh assertion was corrected to await refresh completion instead of inspecting the still-visible prior detail.

**Passed locally:** [48 unit/model tests](evidence/owner-recovery-20261002/owner-recovery-tests.log); [TypeScript, build and public/private import checks](evidence/owner-recovery-20261002/owner-recovery-build.log); [owner browser receipt](evidence/owner-recovery-20261002/results.json), including six width/theme cases and six Axe scans, keyboard/focus, stale responses, repeated clicks, stable retries, sign-out failure, lifecycle/session clearing, HTML 401/403, malformed mutation responses, and an actual 20-second token stall followed by refresh recovery. Visually inspected the [mobile timeout](evidence/owner-recovery-20261002/token-timeout.png) and [cleared denial](evidence/owner-recovery-20261002/non-json-denial-403.png). All records, tokens and API responses are local synthetic fixtures. Exact-SHA CI and Git-linked Ready preview results are reported in the handoff after pushing.

**Unrun / release gates:** real hosted Clerk owner login/session recovery, live private storage and provider latency, actual assistive technology, production rollback and backup/restore remain unverified. No deletion protocol or marker-retention policy is enabled. Owner decisions on retention, backup custody/cadence and operational inbox review remain open. No credentials/access changes or live data actions occurred; production and PR approval remain separate.

## Four practical audit fixes — 2026-10-01

Continues exact094e5fd52f2ef4746935bbbf3564a5f86e86f0f3. The focused coded audit's four findings are now addressed:

- Authorized inbox rows show the supplied sender (partner name where present) and a short task/message cue. The API reads only the current SQL page's exact validated source keys: at most 25 records, five concurrent reads and a shared four-second abort deadline. No Blob listing, email search, new persistent PII column, new public endpoint or cache is added. Source paths and full records are omitted from responses. Authorization still happens before the inbox handler and responses remain private/no-store. Missing, malformed or failed sources show a per-row unavailable fallback without discarding the indexed page. Additional Blob reads/latency on owner page loads are the tradeoff; live provider latency remains unverified.
- Contact and partner validation errors are specific and adjacent to their fields/groups. Native validation/focus and ARIA associations remain; correcting a radio selection clears the group's stale error associations. Server-error focus, keyboard retry, retained input and stable retry identity are preserved.
- “Illustrative example · not live” appears above the demo controls in both states and at mobile/desktop widths, before the output claims.
- Inbox cards explicitly describe all indexed requests regardless of filters. SQL count semantics are unchanged.

| Coded comparison | Before | After |
| --- | --- | --- |
| Authorized inbox cues and global scope,1440px | [Before](evidence/practical-fixes-20261001/before-inbox-1440.png) | [After](evidence/practical-fixes-20261001/after-inbox-1440.png) |
| Adjacent validation,390px | [Before](evidence/practical-fixes-20261001/before-validation-390.png) | [After](evidence/practical-fixes-20261001/after-validation-390.png) |
| Demo qualification,390px | [Before](evidence/practical-fixes-20261001/before-demo-390.png) | [After](evidence/practical-fixes-20261001/after-demo-390.png) |

[Mobile inbox after](evidence/practical-fixes-20261001/after-inbox-390.png). Captures use local Chromium151 at900px viewport height; inbox/validation captures are full-page. Both inbox datasets and all API responses are synthetic. The after inbox uses the new API projection shape; it is not a live owner/storage walkthrough. Native validation's temporary bubble was dismissed for the persistent-error comparison.

Passed locally: 47 unit/model tests; TypeScript/build/public-private boundary; 12 signature width/theme cases with 24 Axe scans; six owner width/theme cases with six scans plus distinct-sender/unavailable/global-count regressions; four contact/partner width/theme cases with four scans. [Signature receipt](evidence/practical-fixes-20261001/signature.json), [owner receipt](evidence/practical-fixes-20261001/admin-states.json), [form receipt](evidence/practical-fixes-20261001/forms.json). Unit coverage verifies per-page read/concurrency bounds, source-path/ID validation, minimal response projection, legacy/partner fallbacks, aborted reads and authorization-before-read. Eight contact/partner recovery cases and ten failure/retry cases (including timeout) also pass locally. Final exact-commit CI runs all eleven browser suites; its terminal result and Ready preview are reported in the handoff.

Remaining limits: real owner/provider readback and latency, authenticated hosted review and actual assistive technology are unrun. The separate deletion/retention decision is unchanged; no live data actions, retention/auth/access changes, logos, PR, main or production changes occurred. A capture attempt against an expired local dev-server process was rerun successfully against the built preview; this was not an application failure.

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
