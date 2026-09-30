# Preview verification — 2026-09-29

This is evidence for the design-migration branch, not production-release acceptance. Production remains the earlier pilot. The current preview is protected by Vercel account access.

## Observed results

- Node 24.19.0: initial build and 8 baseline tests passed. Expanded API/security suite: 16 tests; final build/typecheck recorded in the release handoff.
- Public import graph: 41 modules reachable from `src/main.tsx`; no admin/operator module, private store, Clerk, Blob or PostgreSQL SDK reachable. Separate `index.html` and `admin.html` assets are generated.
- Local and hosted Chrome: Home, How, What, Questions, Partners, Start, Privacy, admin setup screen and unknown route each loaded at 320, 390, 768 and 1440px (36 checks per environment), with no horizontal overflow or page exceptions.
- Home selection transfers into intake. Native radio arrows, Enter on Back, Space on FAQ and the skip link work. Theme reload persists and its next-action label agrees with the rendered theme.
- Invalid email exposes persistent associated validation text. Missing challenge selection prevents advancement. A deliberately failed save keeps answers and shows an error; the subsequent successful retry reuses the request ID. Fields lock while a save is pending.
- Real synthetic plan, call and partner submissions succeeded locally and on the hosted preview. Each was retrieved by its exact content-addressed key using private Blob access; no customer listing or unrelated record was read. Each anonymous Blob read returned 403. Re-saving identical content preserved receivedAt. Test addresses use example.com and clearly identify verification records.
- Call success explicitly says the request is not a confirmed appointment. Partner success follows saved:true. No email delivery was tested or claimed.
- Axe 4.12.1: zero violations after entrance animations settled on eight routes in light and dark (16 scans). The admin scan covers only its setup screen. This is not screen-reader testing or a certification. Early scans during opacity animation produced transient contrast findings; settled-state reruns passed.
- The 320px Home badge initially overflowed; wrapping fixed it, and the complete responsive check then passed.
- Hosted `/api/admin` returns 503 with setup-incomplete text and no records; `/api/draft` returns 404. Provider-backed 401/403/session-revocation checks remain outstanding. Dependency-injected tests exercise those authorization paths, exact owner ID, verified owner email, session token policy and live-session rejection.

## Remaining release gates

1. Vercel requires the owner to accept Clerk and Neon marketplace terms. Free plans were selected, but neither installation completed. No Clerk keys, PostgreSQL connection or immutable owner ID has been configured. No claim is made that real owner login/recovery/logout works yet.
2. Complete invite-only owner enrollment, verify taitgoodwin@gmail.com, set server-only ADMIN_OWNER_USER_ID and exact ADMIN_ALLOWED_ORIGINS. Run owner, non-owner, expired and revoked-session tests against the actual provider.
3. Provision isolated preview PostgreSQL and production resources. Verify reconciliation, transactional status/history persistence, concurrent stale-write 409, duplicate mutation IDs and recovery using the real database. Unit tests do not establish database concurrency correctness.
4. Verify the populated admin screen at mobile/desktop, logout/Back clearing and provider recovery. Presently only the fail-closed screen is browser-verified.
5. Owner reviews this preview before the production homepage changes. Figma and the historical gallery have not been refreshed; R14 follows approved visual review.
6. Confirm lead review cadence and privacy retention operations before accepting traffic into the combined release. Apple/iCloud correspondence is manual; no mail-delivery test or automated notification is claimed.

## Repeating browser checks

`tests/browser/public-flow.mjs` uses Playwright and an explicitly selected browser. It intentionally saves three synthetic records, so requires RUN_LIVE_SUBMISSIONS=1. Set TEST_BASE_URL to the preview, TEST_OUT to an ignored evidence directory, CHROME_PATH if using system Chrome, and PLAYWRIGHT_MODULE if using a bundled runtime. For protected previews, an optional TEST_COOKIE_FILE accepts a locally obtained curl cookie jar; never commit that file. Keep any preview access tokens out of logs and reports.

Screenshots and synthetic request manifests live in ignored `work/` directories. They contain no customer data. Test rows are retained as identified verification records; there is no bulk-delete cleanup.
