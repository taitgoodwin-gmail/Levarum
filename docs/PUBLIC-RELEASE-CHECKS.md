# Public release acceptance follow-up — 2026-09-30

Local checkpoint after HEAD `599d2f2`: `src/App.tsx`, `src/prospect/useSubmission.ts`, `src/prospect/explorer.css` and `tests/browser/release-acceptance.mjs`. This page records a bounded follow-up; earlier hosted evidence is not relabeled as testing these changes. The next hosted checkpoint must identify its actual deployment.

## Defects and corrections

- Browser offline requests exposed `Failed to fetch`; a malformed HTTP200 response exposed a JSON parser error. The shared submission hook now gives an actionable connection message or explains that saving could not be confirmed. It preserves input/consent and the same unchanged-request identity. Timeout and429 handling remain distinct. No API schema, storage or owner authorization changed.
- Dark-theme printed guidance rendered the human-review heading as `rgb(237,230,214)` on white. Print styles now use dark text and omit the exploration prompt, navigation and controls, leaving the chosen idea and human-review boundaries.
- Eight public routes had page titles but no canonical links and a generic shared description. Route metadata now sets one production-domain canonical without query/fragment, a route-specific description and title. Unknown routes have no canonical and receive a client-rendered noindex directive; recovery to Home restores ordinary public metadata.

## Guidance and limitations

[Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) supports setting titles/descriptions and injecting a single canonical where the initial HTML has none. This application remains client-rendered: initial HTML still contains its generic fallback description, and social crawlers that do not execute JavaScript may not see route-specific metadata. This is not server rendering, a crawl/indexing guarantee or a replacement for production-domain verification. Preview platform noindex and separate admin noindex/private headers remain in place.

## Local evidence

The initial browser run reproduced four failures: offline and malformed-response messaging on both Contact and Partners. Timeout and429 recovery already passed. Preserved result: `work/release-acceptance-before/results.json`.

After correction,33 API/security tests and build/TypeScript/public-admin boundary checks pass (`work/release-tests.log`, `work/release-build.log`;15 public modules). The bounded real-Chromium suite uses eight known routes plus unknown-route recovery, contextual Back/refresh, print/PDF and eight failure scenarios (Contact/Partners × offline, real20-second timeout,429, malformed HTTP200). It verifies alert focus, Tab-to-retry, retained email/consent, no premature receipt, and a successful unchanged-ID retry. All submissions are intercepted or browser-offline; no new stored request is claimed. The print assertions require at least4.5:1 contrast against white for guidance headings/body in both themes and hide the page prompt/navigation/actions. Raw results/screenshots/PDF are under ignored `work/release-acceptance/`.

These checks do not prove screen-reader announcements, authenticated owner operation, actual rate-limit timing, real email delivery or production saving. They do exercise the browser's native offline state and timeout rather than accelerating timers or replacing the submission hook.
