# Preview verification — 2026-09-29

This is evidence for the design-migration branch, not production-release acceptance. Production remains the earlier pilot. The current preview is protected by Vercel account access.

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

## Remaining release gates

1. Complete live non-owner/expired-token probes and replay of a pre-logout JWT. Injected tests cover these rejection paths; provider logout and browser clearing have passed.
2. Configure production Clerk/domain and separate production database; verify account recovery and provider backup/restore.
3. Owner visual review before replacing the production homepage. Figma and the historical gallery have not been refreshed; R14 follows approved visual review.
4. Confirm lead review cadence and privacy retention operations. Apple/iCloud correspondence remains manual; email delivery has not been tested.

## Repeating browser checks

`tests/browser/public-flow.mjs` uses Playwright and an explicitly selected browser. It intentionally saves three synthetic records, so requires RUN_LIVE_SUBMISSIONS=1. Set TEST_BASE_URL to the preview, TEST_OUT to an ignored evidence directory, CHROME_PATH if using system Chrome, and PLAYWRIGHT_MODULE if using a bundled runtime. For protected previews, an optional TEST_COOKIE_FILE accepts a locally obtained curl cookie jar; never commit that file. Keep any preview access tokens out of logs and reports.

Screenshots and synthetic request manifests live in ignored `work/` directories. They contain no customer data. Test rows are retained as identified verification records; there is no bulk-delete cleanup.

## Published review artifacts

- Draft PR: https://github.com/taitgoodwin-gmail/Levarum/pull/4
- Committed application: cf088592685b8bd39443d82b984d535ca837eec2
- Initial preview: https://levarum-l8p152zh0-mind-lever-gmail.vercel.app
- Deployment: dpl_86fx5d4AmN8YueQw8qAvZPhvKdwj — READY, preview target.
- Final preview smoke covers public/admin routes, both themes, reduced-motion visibility, admin 503 setup gate, draft API 404 and no page exceptions. Production has not been promoted.

Final smoke on the CSS follow-up passed routes, both themes, reduced-motion visibility, admin anonymous 401, disabled draft 404 and no page exceptions.
