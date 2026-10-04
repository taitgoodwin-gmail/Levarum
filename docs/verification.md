# Preview verification — migration and redesign evidence

This file retains dated migration/redesign evidence, not production-release acceptance. The older d3c0a824 evidence below belongs to that deployment. Current branch checkpoints are recorded in the [documentation index](README.md), [execution record](../PLANS.md) and dated sections; later changes do not inherit historical live-provider acceptance.

## LVR-MVP-HOSTED-20261004 — isolated enquiry-to-owner verification

Owner Go; sole writer Codex lead in chat `01a104ce-044a-7b90-b397-a6087b363c5d`, branch `codex/mvp-completion-20261003`, source `82967bddfc053d099eefd397a1e3f879fcd6e41d`. Local and remote were clean/matched before work and rechecked before evidence edits; previous Levarum and monitoring chats were idle/read-only. Project startup/requirements/workflows/UX/evidence at this source were read or reused where unchanged from the preceding increment. Root AGENTS blob `10cf97ac7b0ab2d4c6d89d36579d5c3380fcc063`; Go method `e53dfad6ee867f915e608e0659da2287f9160ef1`; shared AugMind baseline `e4677946488b543dab641830f25a62f5c702ff6d` was previously read in full and its current main revision rechecked unchanged. Node24.19.0 and locked dependencies were available; no new dependency installation or application change.

**Exact target and isolation:** Vercel metadata reports Git-created deployment `dpl_CGhnWnHPBRYo2YBiMfCCjzMkm6aH`, READY, nonproduction target, branch/source above. Unauthenticated shell access returned302; the existing authenticated Codex browser opened the Contact page. Neither access-sharing tool was called. The dashboard inventory independently identifies `levarum-preview-private` as Private and connected to Levarum, matching the preview credential's provider store metadata. Fresh environment metadata scopes the preview credential to preview/development. Database URLs were compared only in memory: preview and production hosts differ; no production connection was opened and its comparison value was discarded. Project and linked-shared variable searches found no RESEND key. The connector's store getter returned INVALID_ARGUMENT, so dashboard metadata supplied that provider check. Current configuration is not a complete deployment-secret snapshot audit.

**Fresh hosted journey:** in the existing browser, submitted deliberately synthetic follow-up, call and partner requests with example.com addresses, actual descriptions and checked consent. All three showed the appropriate saved acknowledgements; the call remained explicitly unbooked and partner interest was not an offer. A parameterized SQL predicate returned only an index key whose complete SHA256 matches our unique known synthetic payload and its browser-generated UUID, restricted to this test's time window. A negative altered-payload predicate returned no match. No Blob listing or unrelated record content was requested. Exact private SDK reads matched every canonical submitted field, receipt time and privacyVersion (lead-v2 2026-09-30, partner 2026-09-29); leads omitted business/hours. All three anonymous object reads returned403. [Sanitized hosted receipt](evidence/hosted-20261004/ui-results.json), [readback log](evidence/hosted-20261004/ui-readback.log) and [readback helper source](evidence/hosted-20261004/ui-readback.mjs). Helpers were executed from ignored `work/hosted-20261004`; archived source preserves that relative context and is not a default test command.

**Fresh legitimate owner:** normal Google sign-in stated “signing back in” for the already-established verified owner; no new account, access grant, persistent credential, allowlist or authentication setting was created. Login briefly redirected to `/admin`; it was immediately navigated to the exact known synthetic detail, and no general inbox content was inspected or exported. Each hosted fixture displayed its actual supplied message/work, correct intent, consent and exact mailto reply address. Booked was available only for the call. Keyboard Contacted updates persisted with history after reload for all three; these are simulated follow-up statuses, not messages sent to anyone. Two legitimate call views shared a starting version: the first succeeded, the stale second displayed the conflict/refetch message, and keyboard Refresh request data recovered the saved Contacted status. A text locator initially missed doubled whitespace in the history; fresh AX inspection confirmed the correct saved state. No application defect followed from that test-selector failure.

The call detail at320px/light and partner detail at320px/dark and1440px/dark had no horizontal overflow; desktop partner screenshot was inspected and contains only synthetic details. A first viewport setting applied to another active tab; measured innerWidth exposed that mismatch, and a newly selected1440px tab was measured before claiming desktop coverage. These are selected owner states, not a complete hosted width/theme matrix or visual acceptance. Normal logout showed sign-in; Back to the earlier partner URL, the second open call tab, and a reload of the other detail all had no synthetic private content. No pre-logout JWT was retained or replayed. [Sanitized owner observations](evidence/hosted-20261004/owner-results.json).

**Separate real-provider check:** three further fresh synthetic fixtures were submitted through the actual lead/partner handlers executing locally, using only the isolated preview providers. Exact private reads, anonymous403, identical save retries preserving receivedAt, one index row, one successful concurrent status update and one409 conflict, mutation replay without duplicate history, and persisted reads from a second database connection passed for each kind. Non-call Booked was rejected. This used real Neon PostgreSQL18.6, not mocks, but does not establish hosted HTTP or Clerk behavior by itself. [Provider receipt](evidence/hosted-20261004/provider-results.json), [log](evidence/hosted-20261004/provider.log), [helper source](evidence/hosted-20261004/provider-check.mjs). No audit-failure constraint or other remote failure injection was added. Only these new synthetic records were changed. The six fixtures remain clearly marked in preview; cloud cleanup/deletion was not performed. Temporary provider-config files were removed before network execution; no credential, private object URL, fixture key/ID or owner identifier is included in public receipts.

**Checks and guidance:** documentation/JSON receipt, source-blob, relative-link, redaction and diff checks passed for this evidence-only increment. No fresh unit/build/local browser suite is claimed: the previous60 tests/build/seven local suites and [source82967bdd CI](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/37173196997) retain their original scopes. Current provider guidance read: [Vercel deployment listing](https://vercel.com/docs/rest-api/deployments/list-deployments), [project metadata](https://vercel.com/docs/rest-api/projects/find-a-project-by-id-or-name), [environment metadata](https://vercel.com/docs/rest-api/projects/retrieve-the-environment-variables-of-a-project-by-id-or-name), [environment retrieval](https://vercel.com/docs/rest-api/projects/retrieve-the-decrypted-value-of-an-environment-variable-of-a-project-by-id), [store metadata](https://vercel.com/docs/rest-api/storage/get-a-store), [deployment authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication), [private Blob](https://vercel.com/docs/vercel-blob/private-storage), [Blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk), [Clerk SignIn](https://clerk.com/docs/react/reference/components/authentication/sign-in), [Google sign-in](https://support.google.com/accounts/answer/12849458?hl=en), [node-postgres Client](https://node-postgres.com/apis/client), [parameterized queries](https://node-postgres.com/features/queries), [PostgreSQL SHA256](https://www.postgresql.org/docs/current/functions-binarystring.html). Node24 TypeScript guidance and the existing Playwright library guidance informed the helper/browser execution; documentation does not replace the receipts. Vercel API/environment/storage skills were read; read-only provider operations and existing-session browser access were used.

**NOT RUN / OPEN:** whole hosted inbox/filter/reconciliation flow; valid non-owner, expired-token and pre-logout revoked-JWT replay; the dedicated-local `tests/postgres.integration.mjs` audit-failure/rollback run (no local PostgreSQL runtime is available); actual email delivery/customer response; manual screen-reader/full accessibility and owner visual acceptance; operating/backup custody/cadence/retention, production identity/recovery and release. The owner must still agree the practical routine already specified in OPERATIONS; no cadence was invented. No PR, main merge, manual deployment, production operation, access/security change, purchase, customer outreach or sharing link. This materially verifies the preview capture→private record→legitimate owner-detail path; it is not complete MVP acceptance. No independent review is claimed.

## LVR-MVP-REVENUE-20261003 — direct enquiry and synthetic owner follow-up

Owner Go; sole writer Codex lead in local chat `01a104ce-044a-7b90-b397-a6087b363c5d`, branch `codex/mvp-completion-20261003`, starting `d25bb0ee9d4d41be770b404bbf6d8560c4802421`. No newer branch tip or active Levarum writer was found in the available inventory. Read project startup, requirements, workflows, UX and verification at that revision; Go method at `e53dfad6ee867f915e608e0659da2287f9160ef1`; shared AugMind baseline at `e4677946488b543dab641830f25a62f5c702ff6d`. Selected Home→Contact→private acknowledgement→manual owner follow-up remains unchanged. Optional /start compatibility is secondary.

**Demonstrated defect:** real localhost responses sent HTTP200 headers and partial JSON, then stalled. At the existing20-second deadline, both public forms displayed the raw browser exception “The user aborted a request.” Four contact/partner×light320/dark1440 cases reproduced this on the built starting app. [Before receipt](evidence/revenue-first-20261003/body-before.json). No successful-save receipt appeared; this was an error-copy/recovery defect, not proven data loss.

**Fix:** shared submission waiting uses the existing abortable helper for both fetch and response-body consumption under one unchanged20-second signal. TimeoutError and AbortError use the existing honest unconfirmed-save/retry copy. Input/consent and the exact unchanged request body/ID survive retry; neither200 headers nor saved:false confirms saving. [After receipt](evidence/revenue-first-20261003/body-after.json). The built-app streaming regression is retained in `tests/browser/submission-body.mjs` and the existing CI loop; the workflow now defines12 suites. It serves synthetic local responses with `configFile:false`/`envDir:false`, blocks external browser requests and never loads application API handlers or writes a private record. No production test injection is added.

**Fresh checks performed:** Node24.19.0, workspace-local npm11.6.2 verified against official registry SHA512, `npm ci` with unchanged lockfile; Playwright1.57.0 / Chromium143.0.7499.4 (build1200) and Axe4.13.0 match CI pins. All [60 aggregate tests](evidence/revenue-first-20261003/unit.log) pass; [build/TypeScript/boundaries](evidence/revenue-first-20261003/build.log) pass (118 scanned files,18 public reachable modules, no admin/auth/private store/server SDK). An initial npm launcher error was environment-only; a workspace-local npm-cli symlink resolved it. Sandbox localhost listening required execution escalation; no access/security setting was changed.

Seven local browser suites passed: public-flow (80 route/width/theme render cases plus keyboard/consent/save/retry); round2-contact-matrix (16 Home→Contact maximum-content/pending/payload/receipt cases); recovery (8 repeated-failure keyboard cases); release-acceptance (10 offline/timeout/429/malformed/saved:false retry cases plus metadata/Back/print); practical-forms (4 validation/Axe cases); admin-states; submission-body (4 real partial-body timeouts followed by saved:false and stable successful retries). [Receipts and public-suite exit codes](evidence/revenue-first-20261003/browser-exits.json) and [owner receipt](evidence/revenue-first-20261003/admin.json) retain actual scopes. Existing Axe checks reported zero violations within their tested states; real screen-reader behavior is NOT RUN. The320px light Contact timeout screenshot was visually inspected for readable error/retry and retained form state; this is not owner visual acceptance.

Added three synthetic owner cases for follow-up/call/partner: genuine message or contribution details, exact reply address, consent, absent invented business/hours, call-only Booked, keyboard Contacted update, status/history rendering after reload and retained inbox filters. The existing stale denial, conflict/retry, account/session clearing and logout tests also pass. API/provider responses are fixtures: reload proves frontend retrieval/rendering, not real database persistence, Clerk authorization or email delivery. A new exact-label selector in the test initially timed out; correcting the locator to the actual native select label resolved that harness failure without an application change.

**Guidance consulted and actually applied:** [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/) for locked installation; [Vite](https://vite.dev/guide/) and [Playwright library](https://playwright.dev/docs/library) for isolated built-app/browser setup; [React useRef](https://react.dev/reference/react/useRef) for stable submission identity; [MDN fetch cancellation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) and [AbortSignal timeout](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) for response-body cancellation and error classification; [Git push](https://git-scm.com/docs/git-push) for a normal working-branch push; [GitHub run history](https://docs.github.com/en/actions/how-tos/monitor-workflows/view-workflow-run-history) for exact-commit CI inspection. Documentation informed the work; the receipts establish the bounded checks.

**NOT RUN / BLOCKED:** fresh hosted private-save/exact-record readback and legitimate owner/non-owner/expired/revoked sessions need authorized isolated access; current real PostgreSQL integration needs its dedicated local runtime/database. Operating/backup custody and review cadence, final visual acceptance, manual accessibility and production release remain open. No real submission, private customer data, customer outreach, PR, main merge, security/access change, sharing link or production operation occurred. No independent review is claimed. Local result is VERIFIED for this bounded defect and synthetic journey coverage, not MVP acceptance. Next: exact-commit CI, then isolated hosted customer-to-owner acceptance with legitimate access, keeping production checks separately gated. Optional five-task coverage remains an existing secondary gap.

## LEV-REQUIREMENT-COVERAGE-20261003 — documentation audit

The [37-row crosswalk](REQUIREMENTS.md#requirement-coverage-counts--2026-10-03) assesses sourcebe5fe61, preserving current22 and proposed8+7 denominators. Sole writer: Codex lead on the existing working branch. Independent reviewer `/root/review_retry` recomputed totals and checked mappings; R05/R06 coverage was corrected to Partial because linked tests do not cover every task. Local validation passed: exact unique ID sets, allowed mutually exclusive labels, table totals, all relative README/requirements file links and zero inferred owner acceptance. Documentation-only diff; no runtime/test/config edits or new test execution claimed. The60-test/11-suite source evidence remains tied to [be5fe61 CI](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/37152749054). Five-task browser coverage is the next READY gap; actual local PostgreSQL and hosted private verification remain blocked. No acceptance, scope, access or production decision changed.

## LVR-CI-RETRY-20261003 — workflow pins and recovery classification

### Isolated PostgreSQL harness continuation (starting cc37bff)

Same work key, writer and branch. Test-only changes; no production module/fixture injection. The target validator rejects query parameters before driver parsing (including SSL file-read options), checks driver-effective loopback host, explicit unprivileged port and dedicated database name, and fails closed on inherited PG/application-cloud settings with a generic error that never includes credentials. No hostname resolution or connection occurs in offline tests. The integration script adds read-only server identity and empty-database preflight before application DDL and removes inbox/Blob access entirely.

Either concurrent winner is now replayed unchanged. An authored test-only CHECK constraint forces the audit INSERT to fail after the status UPDATE; assertions require both row and history rollback, then success and idempotent replay using the same mutation ID after fixture removal. Eight offline tests cover malicious configuration, both winners and assertion detection of index/history leakage; they simulate the assertion inputs, not PostgreSQL transactions.

Passed: [60 aggregate tests](evidence/ci-retry-20261003/harness-tests.log), [typecheck/build/boundaries](evidence/ci-retry-20261003/harness-build.log), syntax checks and final independent review by `/root/review_retry` (8/8 offline harness tests; no findings or edits). Review scope: `tests/postgres.integration.mjs`, `tests/fixtures/postgres-harness.mjs`, `tests/postgres-harness.test.mjs` relative to cc37bff. Reviewer explicitly approved target isolation, winner replay and assertion-oracle coverage while leaving SQL behavior unverified.

**BLOCKED / NOT RUN:** actual PostgreSQL integration, server-side identity/empty-target preflight and SQL failure injection/rollback. No database was connected, installed or written; no credentials or settings changed. Prerequisite: an approved supported local PostgreSQL runtime with a fresh dedicated `levarum_test_*` database on an explicit loopback port, and a launch environment free of inherited driver/cloud settings. Only then run `POSTGRES_INTEGRATION_URL=<local test URL> node --test tests/postgres.integration.mjs`. Do not point it at a shared, remote or production database. CI runs offline harness tests only; a green run cannot close this integration gate.

### Prior checkpoint: cc37bff

Sole writer: Codex lead, `codex/design-assessment-fixes-20261001`, starting8a29675; main04a7927 read only. Applied current AGENTS review rules and AugMind delivery baseline. State: BUILDING → VERIFIED → REVIEWED locally; exact-SHA CI and preview metadata are reported in the final handoff. Ready deployment metadata is not authenticated hosted or production acceptance.

Workflow reconciliation preserves both jobs, `contents: read`, working-branch push triggers, all eleven browser suites,14-day synthetic artifact retention and the existing browser timeout; adds the same15-minute bound to the unit/build job. Checkout3d3c42e5aac5ba805825da76410c181273ba90b1 (v7.0.1) and setup-node820762786026740c76f36085b0efc47a31fe5020 (v7.0.0) match main and were independently resolved against official `actions` tag refs. The branch-only upload-artifact step is pinned to official v4.6.2 ea165f8d65b6e75b540449e92b4886f43607fa02. No mutable action refs remain. No branch protections, permissions or authentication policy changed.

Independent read-only reviewer `review_retry` reproduced a medium implementation defect: valid contact/partner input received400 when uncertain-save readback contained malformed JSON. Both handlers' broad catch treated a provider SyntaxError as invalid visitor input. [Before regression](evidence/ci-retry-20261003/repro.log). The bounded fix tracks completion of input validation: only input-stage errors map400; subsequent persistence/readback failure maps503. Success and notification remain withheld until exact stored content is verified. Both-handler regressions verify same-key/unchanged-byte recovery and retain400 for genuinely invalid JSON. No submitted fields or retry identity rules changed.

Passed: [52 unit/model tests](evidence/ci-retry-20261003/tests.log), [TypeScript/build and public/private boundaries](evidence/ci-retry-20261003/build.log), and independent reviewer rerun/approval of the corrected boundary and retries. The review found no further concrete defect in deadline settlement, immutable reconciliation, UI generation guards or unchanged mutation IDs; it is bounded AI-assisted review, not penetration testing. Final CI runs the complete browser suite; no local browser rerun is claimed for this backend/workflow-only change.

Unrun/blocked: actual PostgreSQL transaction execution in this review, hosted legitimate-owner/isolated-record acceptance and live provider stalls/recovery. The next safe test is `tests/postgres.integration.mjs` against a fresh localhost database named `levarum_test_*` via `POSTGRES_INTEGRATION_URL`, with cloud Blob credentials absent; it must not use production or customer records. Mandatory intake/Game Plan, alternative queue/linkage, retention/deletion and production pilot remain owner decisions. No Linear, sharing/access, secrets, customer data, main merge, PR or production actions.

## Public save deadlines and contract reconciliation — 2026-10-02

Continues f358bc7 on `codex/design-assessment-fixes-20261001`. Read current main at222d433 and its referenced AugMind delivery baseline; no merge/rebase. The root README and requirements now distinguish implemented browse-first/direct-contact and owner queue behavior from proposed mandatory intake/Game Plan, alternative status/linkage semantics and real production pilot. No proposal was promoted to implementation authority.

**Failed before:** two [synthetic regressions](evidence/public-save-20261002/public-save-before.log) reproduced indefinite waiting after an uncertain write: a provider stream stayed open after partial JSON, and a write promise ignored cancellation. The latter never reached exact-key readback.

**Fixed:** the saver enforces its existing12-second write budget independently of provider cancellation cooperation. Its existing five-second reconciliation budget covers fetching and consuming the response body; abort cancels a stalled stream. Only an exact private-key readback matching the supplied fields confirms an uncertain write. Incomplete/missing/different content cannot confirm success. An unchanged retry preserves record bytes, original receipt time and notice version. The budgets bound saver waiting, not total request time or a provider operation that refuses cancellation. No key, payload, retention, collection, notification or commercial semantics changed.

**Passed:** [50 unit/model tests](evidence/public-save-20261002/public-save-after.log), including the actual five/12-second regressions and prior save-before-success/immutable retry tests; [TypeScript/build and public-private boundary checks](evidence/public-save-20261002/public-save-build.log). Eight contact/partner keyboard recovery cases pass at320/1440px in both themes ([receipt](evidence/public-save-20261002/recovery.json)); ten failure/retry cases plus route metadata, print and contextual Back/refresh pass against the built public app ([receipt](evidence/public-save-20261002/release.json)). All browser submissions are mocked. Exact-commit CI/Ready metadata accompany this checkpoint's handoff.

**Unrun:** real hosted provider stalls, live owner authentication/storage/recovery, real assistive technology and production pilot. Tests use isolated synthetic streams/records. No credentials, customer records, sharing tools, auth/access, retention or production changes were used. No new report or alternative requirements source was created.


## Observed results

- Node 24.19.0: initial build and 8 baseline tests passed. Expanded API/security suite: 17 tests passed; final build and explicit typecheck passed. One additional opt-in integration test passed against real local PostgreSQL 18.4.
- Public import graph: 41 modules reachable from `src/main.tsx`; no admin/operator module, private store, Clerk, Blob or PostgreSQL SDK reachable. Separate `index.html` and `admin.html` assets are generated.
- Local and hosted Chrome: Home, How, What, Questions, Partners, Start, Privacy, admin setup screen and unknown route each loaded at 320, 390, 768 and 1440px (36 checks per environment), with no horizontal overflow or page exceptions.
- Home selection transfers into intake. Native radio arrows, Enter on Back, Space on FAQ and the skip link work. Theme reload persists and its next-action label agrees with the rendered theme.
- Invalid email exposes persistent associated validation text. Missing challenge selection prevents advancement. A deliberately failed save keeps answers and shows an error; the subsequent successful retry reuses the request ID. Fields lock while a save is pending.
- Real synthetic plan, call and partner submissions succeeded locally and on the hosted preview. Each was retrieved by its exact content-addressed key using private Blob access; no customer listing or unrelated record was read. Each anonymous Blob read returned 403. Re-saving identical content preserved receivedAt. Test addresses use example.com and clearly identify verification records.
- Call success explicitly says the request is not a confirmed appointment. Partner success follows saved:true. No email delivery was tested or claimed.
- Axe 4.12.1: zero violations after entrance animations settled on eight routes in light and dark (16 scans). The admin scan covers only its setup screen. This is not screen-reader testing or a certification. Early scans during opacity animation produced transient contrast findings; settled-state reruns passed.
- Real isolated localhost PostgreSQL 18.4: duplicate indexing remained one row; two concurrent version-0 updates produced one success and one 409; audit and status committed together; identical mutation retries created no duplicate event; a new connection read persisted status/history; partners could not be marked Booked. The temporary cluster was stopped after testing. The subsequent isolated Neon run also passed persistence, concurrent conflict, retry idempotence and Blob reconciliation; cloud backup recovery remains unverified.
- The 320px Home badge initially overflowed; wrapping fixed it, and the complete responsive check then passed.
- Earlier unconfigured hosted `/api/admin` returned 503 without records; the configured preview now returns 401 for missing and fabricated tokens. `/api/draft` returns 404. Live non-owner and expired-token probes remain outstanding. Dependency-injected tests exercise those authorization paths, exact owner ID, verified owner email, session token policy and live-session rejection.

## Provider continuation — 2026-09-30

- Clerk Hobby and Neon Free provisioning succeeded after owner terms acceptance. The exact verified owner account was bound by immutable server-side ID. The provider is currently a development instance; production setup is separate.
- A separate private Blob store is connected to preview/development. A regression test verifies that production ignores the preview token.
- Real synthetic plan/call/partner records saved into isolated Blob and Neon. Exact detail reads succeeded. Removing only a newly created synthetic index row and running reconciliation restored its index from Blob; a full pass completed.
- Two concurrent Neon version-0 updates produced one success and one 409. Mutation replay did not duplicate history. Persisted version 2 and two history events were read back.
- Node 24 build/typecheck, public dependency boundary, and all 17 API/security tests pass.
- Real owner browser session loaded the inbox and private synthetic partner details. Keyboard status update persisted after reload with one history event. Type/status filters returned the expected single row. Owner-triggered reconciliation completed.
- Logout returned to sign-in; browser Back did not restore private details. Clerk API confirmed the active session changed to removed. No pre-logout JWT was retained for replay testing.
- Anonymous reads of all three exact isolated Blob fixtures returned 403.
- Refreshed public suite: all 36 route/viewport checks, keyboard/theme/validation/failure/retry flows and real synthetic plan/call/partner saves passed on the configured preview.
- Populated detail was inspected at 390 and 320px and inbox at desktop. Long actor ID caused 320px overflow; added history wrapping. Built-CSS regression fixture passes at 320/390/768/1440. The final CSS-only follow-up has not had a second owner login.
- Final preview: https://levarum-moq3w4uv1-mind-lever-gmail.vercel.app (dpl_6bNR8R7f5Z2Aeub47RVNvn5xmXwU). Production remains unchanged.

## Migration release gates recorded before redesign

1. Complete live non-owner/expired-token probes and replay of a pre-logout JWT. Injected tests cover these rejection paths; provider logout and browser clearing have passed.
2. Configure production Clerk/domain and separate production database; verify account recovery and provider backup/restore.
3. Owner visual review before replacing the production homepage. At this historical checkpoint Figma had not been refreshed; the redesign checkpoint below now records editable frames and comparison limitations. The gallery remains archival; production approval is still pending.
4. Confirm lead review cadence and privacy retention operations. Apple/iCloud correspondence remains manual; email delivery has not been tested.

## Repeating browser checks

`tests/browser/public-flow.mjs` uses Playwright and an explicitly selected browser. Its default mode mocks submission responses and does not save real records. Set RUN_LIVE_SUBMISSIONS=1 only for the opt-in integration mode that intentionally saves three synthetic records. Set TEST_BASE_URL to the preview, TEST_OUT to an ignored evidence directory, CHROME_PATH if using system Chrome, and PLAYWRIGHT_MODULE if using a bundled runtime. For protected previews, an optional TEST_COOKIE_FILE accepts a locally obtained curl cookie jar; never commit that file. Keep any preview access tokens out of logs and reports.

Screenshots and synthetic request manifests live in ignored `work/` directories. They contain no customer data. Test rows are retained as identified verification records; there is no bulk-delete cleanup.

## Published review artifacts

- Draft PR: https://github.com/taitgoodwin-gmail/Levarum/pull/4
- Committed application: cf088592685b8bd39443d82b984d535ca837eec2
- Initial preview: https://levarum-l8p152zh0-mind-lever-gmail.vercel.app
- Deployment: dpl_86fx5d4AmN8YueQw8qAvZPhvKdwj — READY, preview target.
- Final preview smoke covers public/admin routes, both themes, reduced-motion visibility, admin 503 setup gate, draft API 404 and no page exceptions. Production has not been promoted.

Final smoke on the CSS follow-up passed routes, both themes, reduced-motion visibility, admin anonymous 401, disabled draft 404 and no page exceptions.


## UX redesign verification — 2026-09-30

### Version and artifacts

- Application source commit: `700a85075152c2c8411609b5de30738376619560`; source tree `5743424959207b8db3741825528c7841c715e4ca`.
- Current Vercel review preview: [Levarum redesign](https://levarum-6n8z4iohc-mind-lever-gmail.vercel.app); deployment `dpl_Vkpo5Y2hLJFrHf9zNz5QZp3zDshW`.
- Review source: [PR #4](https://github.com/taitgoodwin-gmail/Levarum/pull/4). Production has not been promoted.
- Browser evidence: ignored `work/redesign-hosted/results.json` and `work/redesign-hosted/submissions.json`; private synthetic verification: ignored `work/redesign-private-results.json`. Test record identifiers stay in these local artifacts, not public documentation. They contain synthetic examples, not customer data.

### Verified public and storage behavior

- All 21 API/security tests pass. Build, TypeScript and public import-boundary checks pass. The public entry reaches 14 modules and no authentication/operator/private-data dependency; admin remains a separate entry.
- Local and hosted `tests/browser/public-flow.mjs` runs each pass 72 route/viewport/theme checks: nine routes at 320/390/768/1440px in light and dark, without unintended horizontal overflow or page exceptions. The /admin checks cover unauthenticated entry, not a newly authenticated dashboard session.
- Guidance is reached with zero submission POSTs before optional contact. Two selected tasks produce distinct guidance, and editing retains questionnaire answers. These checks do not prove exhaustive content quality across every task/band combination or real-user usefulness.
- Changing follow-up purpose resets consent. An injected 503 retains input; pending submission disables changes; unchanged retry retains request ID. Email follow-up and call receipts reflect the submitted purpose; call receipt explicitly remains a request rather than a booking. Partner acknowledgement passes.
- Hosted security smoke rejects missing/fabricated admin credentials with 401 and no-store; disabled /api/draft returns 404. Reduced-motion content remains visible. Evidence: ignored `work/redesign-security-results.json`. These probes do not replace live non-owner/expired/revoked-session checks.
- Review screenshots were exported to the chat output directory as `levarum-redesign-mobile.png` and `levarum-redesign-desktop.png`; they show the preview, not customer records.
- Theme reload persists; mobile menu works with Enter/Escape; native FAQ responds to Space; the skip link works. The suite also exercises native radio keyboard behavior. These are specific keyboard checks, not a complete assistive-technology certification.
- Three real hosted synthetic submissions—follow-up, call and partner—were privately retrieved by their exact known references from isolated preview storage. No unrelated customer records were needed. Concurrent stale update returns 409, persisted status reads back, and successful mutation retry is idempotent. This is persistence/transaction evidence, not proof of the new authenticated dashboard rendering.

### Accessibility checks and limits

A separate Axe 4.12.1 run found zero violations on seven public routes in both themes and on guidance/contact states in light theme. The public-flow harness itself reports its optional Axe installation unavailable; the findings above come from the separate audit and must not be attributed to that harness.

Admin sign-in initially produced two landmark findings; adding a main landmark corrected them. Its dark-theme retest reports zero violations, with three Clerk-provider items still requiring manual contrast review. Zero reported violations does not clear those incomplete checks or establish WCAG conformance. No actual screen-reader or representative-user session is claimed. Authenticated redesigned admin accessibility and interaction checks remain pending owner sign-in.

### Figma comparison

The [editable Figma reference](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L) records the reviewed hierarchy, chosen Lift mark, choice-B intake, components and responsive intent. [UX-REDESIGN.md](UX-REDESIGN.md) links core and supporting frames, including dark Home `8:43`, How `10:48`, FAQ `10:66`, Partners `10:82`, owner detail `10:102`, and automation examples `10:125`.

The implementation is not a pixel-perfect reproduction of every draft frame: the desktop hero uses two columns; the application includes five task cards where an earlier draft showed three; native form control styling differs. These are recorded implementation differences, not claimed fidelity passes. Final owner visual review must assess the whole preview. The frame set is not evidence that every state/theme has a matching design frame.

### Remaining gates after this checkpoint

1. Owner sign-in and fresh browser verification of the redesigned authenticated inbox/details/status/sync/logout flow. Earlier owner tests remain valid historical evidence, not proof of the changed UI.
2. Live non-owner/expired-token and pre-logout JWT replay probes; injected tests cover their rejection logic but do not replace live-session evidence.
3. Production Clerk/domain, isolated production database, account recovery, provider backup/restore and recorded rollback target.
4. Owner visual approval before production homepage replacement; no approval is inferred from the implemented preview or design selection.
5. Manual lead-review cadence and privacy retention/deletion operations; automatic email delivery and booking remain outside the implemented workflow.
6. Manual review of the three incomplete Clerk contrast items, actual screen-reader checks and representative-user task testing. No certification or experimentally measured UX improvement is claimed.


## Task-first and v2 verification — 2026-09-30

### Exact tested source and deployment

- Source commit `8989c1c0d6853c608baf3c424edd34e9a99fe334`, tree `0252f14aab8690f0f2b56dc982f3ebb0703fca61`.
- [Current task-first review preview](https://levarum-k09ohnt2g-mind-lever-gmail.vercel.app), deployment `dpl_DF4zfACeg4HahJwDZ6CWAa3gG5Tr`.
- Draft [PR #4](https://github.com/taitgoodwin-gmail/Levarum/pull/4) updated; no production promotion.
- Local/hosted browser evidence includes ignored repository `work/reimagination-hosted/results.json` and synthetic submission manifest. Exact private checks are in `work/reimagination-private-results.json`; no record identifiers or customer content are copied into this document.

### Passed at this checkpoint

1. **API and build:** 32 tests pass, with build/TypeScript/boundary checks. Boundary scan covers 112 files; public graph has 15 reachable modules and no auth/private dependency.
2. **Rendering:** local and hosted runs each pass 80 route/width/theme cases: ten routes, four widths (320/390/768/1440px), light and dark. No page exceptions reported. This includes unauthenticated admin entry, not an authenticated owner walkthrough.
3. **Task-first exploration:** scenario keyboard operation and no POST; guidance before contact; task-specific content; valid task deep link; invalid-task recovery. Changing task context resets consent; returning to exploration/contact retains the existing draft; refreshing clears it as disclosed.
4. **Contact:** direct contact requires a genuine message when no task is selected; payload check confirms no fabricated context. Purpose change resets consent; injected failure retains input; pending disables changes; retry preserves ID. Follow-up/call receipts match purpose; no booking/automatic email is asserted.
5. **Shared interactions:** mobile menu keyboard, theme persistence, native FAQ keyboard and skip link pass; partner acknowledgement passes.
6. **Real private storage:** three hosted synthetic requests—follow-up, call and partner—were retrieved by exact known references from isolated preview storage. V2 lead records use schemaVersion 2, privacyVersion 2026-09-30 and contain no invented business/hours. Concurrent stale status update produces 409; status persists; successful mutation retry is idempotent. This proves the checked storage/transaction behavior, not new owner UI operation.
7. **Separate automated accessibility:** Axe 4.12.1 reports zero violations on eight public routes in both themes. Evidence is in the chat working directory’s ignored `work/levarum-reimagination/a11y.json`. The browser-flow harness reports its optional Axe installation unavailable; do not attribute the separate scan to that harness. No screen-reader, authenticated-owner or complete conformance claim follows.

### Design reference and limits

Current editable [Figma](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L) includes concept alternatives 16:3/16:4 and 16:5/16:6, journey page 18:2, contact 18:4, receipt 18:5, error 18:6 and operator 18:7. Task references are questions 23:33, invoices 18:3, copying 23:54, booking 23:75 and leads 23:96. These are conceptual visual/interaction references, not pixel-perfect browser parity. Full-state alignment and further logo refinement remain open; frame availability does not prove every theme/viewport/state is designed or matched.

The recorded [performance baseline](PERFORMANCE-BASELINE.md) remains a frozen previous local build. Final hosted performance comparison is still open; no current Lighthouse score or field Core Web Vitals result is inferred from the 80 browser cases.

### Remaining work and release gates

- Fresh authenticated owner inbox/detail/filter/status/sync/logout walkthrough, plus live non-owner/expired/revoked-session probes not yet evidenced. Earlier provider/owner checks remain historical.
- Logo refinement, complete design-state alignment and final hosted performance comparison.
- Manual accessibility/contrast follow-up, actual screen-reader checks and representative-user testing; automated zero violations does not close these.
- Owner visual approval, production Clerk/domain/storage isolation, recovery/backup/rollback, manual lead-review cadence and privacy retention/deletion operation. These remain production gates; no deadline, paid package, automatic delivery or appointment is promised.


## Keyboard recovery follow-up — 2026-09-30

Scope: local source changes following deployed8989, not yet evidence for a new deployment. Manual review reproduced loss of keyboard focus after a failed asynchronous save. Shared SubmissionError focuses the failure alert after controls re-enable; Tab reaches the retry button. Contact and partner use the same component. Native validation now appends/removes only its own aria-describedby token, preserving message-help.

Validation after the fix:32/32 API/security tests pass; production build/typecheck and boundary checks pass (112files;15public modules). The local public-flow suite passes80 responsive route/theme cases plus the new failed-save focus and retry assertion. Dedicated tests/browser/recovery.mjs passes8 combinations (contact/partners × light/dark ×320/1440), each with two mocked503 failures, alert focus, Tab-to-retry, retained email/consent and identical retry request IDs. Direct-contact validation retains message-help before/after correction. Evidence: ignored work/recovery-browser/results.json and work/recovery-focus/results.json. No real submissions in these runs; no fresh private-record or authenticated-owner claim. Actual screen-reader behavior remains unverified.

The React review of this change found a module-level shared component, primitive effect dependency, semantic alert/ref focus, no new dependency or network operation, and unchanged public/admin import boundary. No broad React refactor was added.


## Wordmark and recovery preview — 2026-09-30

Exact application source8e80f5de339cdd62bdb01cfcdb257f183cb50e87, treee2aa24f9d82729e541f23121ebc086c78a925d42. Vercel Git integration automatically deployed dpl_5oxtDaZnuyTp9iBceQjos1i1R7mP, Ready, at https://levarum-9tvocbmhj-mind-lever-gmail.vercel.app . No manual production promotion occurred. Branch pushes also created previews for bcc1bb2 and3d5bac4; earlier statements that those changes were not deployed meant no verified deployment had yet been recorded, and are superseded by this inspected Git-deployment evidence.

Changes: reviewed Wordmark-first default shared across public and owner interfaces, matching theme-aware L favicon, corrected legacy logo type documentation, contact included in sitemap, consistent partner voice without unverified location claim, plus the prior failed-save focus/help-text fix. Legacy explicit logo variants and supplied design history remain preserved.

Current validation:32/32 API/security tests, build/typecheck/boundary pass (112files,15public modules). Local and exact-hosted public suites each pass80 route/width/theme cases and interaction checks. Hosted recovery suite passes8 contact/partner×light/dark×320/1440 cases with repeated mocked503 responses, error focus, Tab-to-retry, retained input/consent and stable request ID. No live submissions in those suites.

Hosted security probes exercise list/detail/status/sync with absent and fabricated authorization:8/8 return401, private/no-store and error-only JSON. Disabled /api/draft returns404. These are actual preview API probes but NOT valid non-owner, expired or revoked-session tests. No private records or owner session accessed. Fresh authenticated-owner testing remains pending.

Evidence: ignored work/wordmark-tests.log, work/wordmark-build.log, work/wordmark-browser/, work/wordmark-hosted/, work/wordmark-hosted-recovery/results.json and work/wordmark-admin-negative/results.json. Narrow light-mobile and dark-desktop screenshots inspected after the wordmark change. Temporary preview access came from the Vercel connector into an ignored file; no bearer URL/cookie appears in public evidence. Earlier8989 private-record and Lighthouse results retain their exact scope; they are not silently relabeled as8e80 results. API/storage implementation is unchanged by this source follow-up.

## Non-production Blob isolation regression — 2026-09-30

Source inspection found that missing PREVIEW_READ_WRITE_TOKEN allowed non-production code to fall back to BLOB_READ_WRITE_TOKEN. The selector now throws before any SDK call in that configuration; public readiness checks return false even if a production token or BLOB_STORE_ID is available. Production selection and store-ID authentication remain supported. No public request schema or successful-save contract changed.

Local verification: 33 tests pass, including missing/empty/whitespace preview tokens in preview, development and unset local environments with production credentials present; build, TypeScript and public/admin boundary pass. Raw logs: ignored work/blob-isolation-tests.log and work/blob-isolation-build.log. This section is a local checkpoint until a deployment is named; previous hosted evidence is not relabeled. Provider isolation and credential scopes are audited separately in BLOB-ISOLATION.md.

### Hosted isolation-fix checkpoint

Source 6b9a0f7 at https://levarum-cjhcj1631-mind-lever-gmail.vercel.app (dpl_352C2wYRW8uVsbcU5irXd3DJTeBm) passed 80 responsive route/theme checks and targeted public flows with **real synthetic saves**. Four attempts resolved to three unique saved content keys. Exact private readback using fresh preview credentials verified consent, v2 notice, absent fabricated context and all request kinds; direct server-function concurrency produced one success/one409, and repeated mutation retained version/event count. This is not a fresh logged-in owner API/browser test. Evidence: work/isolation-hosted, work/isolation-private-results.json. Narrow mobile Start and dark desktop Home screenshots were visually inspected without overflow.

Eight current-source Lighthouse audits completed with matched baseline configSettings; Home mobile median98, desktop100. See PERFORMANCE-BASELINE.md for all metrics and scope limits. Provider scope correction may have completed after this deployment began, so historical credential snapshots are not claimed revoked. A fresh post-correction deployment remains necessary; BLOB-ISOLATION.md records verified live scopes and local-file correction.


### Post-scope deployment checkpoint — 2026-09-30

Commit `84663f563e849a7050801ece2fb859565f968ab9`, deployment `dpl_ENBZ1wqd2anRwmnBZNyCqKmNCubH`, [fresh preview](https://levarum-msfizuxea-mind-lever-gmail.vercel.app), was built after the provider credential-scope correction. Its application source is unchanged from6b9a0f7; this documentation-only commit does not claim another complete browser/Lighthouse run.

A bounded live API smoke saved three new synthetic request types; an unchanged fourth retry reused its reference. Exact private reads verified all three fixtures using freshly pulled preview-only credentials with production Blob credentials explicitly absent. Direct server-function concurrent updates and mutation retries passed. No customer listing or owner session was used. Evidence: ignored `work/post-scope-hosted/results.json`, `work/post-scope-private-results.json`, `work/post-scope-smoke.mjs` and `work/verify-post-scope.ts`. This closes the fresh-build environment checkpoint above, not authenticated owner or production end-to-end acceptance.
