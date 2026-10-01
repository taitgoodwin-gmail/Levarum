# Performance baseline — 2026-09-30

## Scope and reproducibility

This is a **local laboratory navigation baseline**, not a measurement of the Vercel preview, production CDN, API latency, real user journeys, or field Core Web Vitals. Source commit `ba49a1c78c0e5fa57c2bdd404f39745765f12257` contains the application from `700a85075152c2c8411609b5de30738376619560` plus documentation. An immutable copy of its production build was used so concurrent redesign work could not alter these measurements.

The homepage screenshot was inspected: it renders the actual “Less admin. More room to run your business.” Levarum site. All reports remain on the expected localhost application origin; no Vercel protection or sign-in page was audited. No authentication cookies, customer records or secrets were supplied. Admin and form interaction states are outside these navigation audits.

- Node: 24.19.0. Lighthouse: **13.5.0**. Installed in an isolated task-work directory; no repository dependency or lockfile changes.
- Chrome: **154.0.8037.58**, headless, clean profiles per CLI invocation. Categories: performance, accessibility, best practices and SEO. Storage reset enabled; no additional request headers, blocked URLs or audit exclusions.
- Mobile: Lighthouse default simulated throttling, 150 ms RTT, 1,638.4 Kbps throughput, CPU slowdown 4×; 412 × 823 viewport, DPR 1.75.
- Desktop: Lighthouse desktop preset, simulated 40 ms RTT, 10,240 Kbps throughput, CPU slowdown 1×; 1,350 × 940 viewport, DPR 1.
- Local static server: `http://127.0.0.1:5189`, frozen `dist` snapshot, gzip text responses, immutable cache headers for hashed assets and `no-cache` for HTML. Public SPA fallback enabled; API calls explicitly disabled. This controlled server does **not** reproduce Vercel edge, TLS or geographic latency.
- Remote Google Fonts CSS/font requests remain live and contribute variability. Three sequential homepage runs per device; one mobile run for each additional public route. No parallel Lighthouse runs.

Private, ignored artifacts are under `work/performance-baseline/`: `baseline-dist/`, `serve.mjs`, `run.mjs`, `reports/*.report.json`, matching HTML reports/logs, and `reports/summary.json`. The scripts preserve all raw settings, timestamps, warnings and metric values. These files are local evidence and are not present in a fresh clone.

To repeat: install the exact Lighthouse version in a separate tools directory, build the desired revision, create a separate immutable build snapshot, then run the same static server and CLI settings. The mobile command is `node "$LIGHTHOUSE_CLI" http://127.0.0.1:5189/ --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path=REPORT_PREFIX --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"`; add `--preset=desktop` for desktop. Set `CHROME_PATH` to the recorded Chrome executable, and keep the version fixed. Repeat each homepage profile three times; report median and range rather than selecting the fastest run.

## Build and security baseline

Fresh execution at the recorded revision: **21/21 API/security tests pass**. Production build and TypeScript pass. Both boundary checks pass: 109 scanned files, 14 modules reachable from the public entry, no admin/auth/private-store/server SDK dependency in that public graph.

Build sizes: public entry 30.17 kB (gzip 9.12 kB); shared React/UI chunk 194.34 kB (gzip 61.54 kB); shared CSS 20.89 kB (gzip 5.19 kB). Admin entry 121.18 kB (gzip 31.35 kB) remains separate. The shared chunk’s generated `ThemeToggle` filename does not imply that the toggle itself accounts for its size.

## Results

Audit timestamps: **2026-09-30 05:37:47–05:39:39 UTC**. All 12 runs completed without runtime errors or run warnings. Accessibility, best practices and SEO scored **100 in all runs**; these are automated navigation results only.

### Homepage — three runs per profile

| Metric | Mobile median (range) | Desktop median (range) |
|---|---:|---:|
| Performance score | 92 (92–99) | 100 (99–100) |
| FCP | 2.676 s (1.628 s–2.680 s) | 0.529 s (0.522 s–0.779 s) |
| LCP | 2.676 s (1.656 s–2.680 s) | 0.529 s (0.522 s–0.779 s) |
| Speed Index | 2.680 s (1.628 s–2.957 s) | 0.529 s (0.522 s–0.779 s) |
| TBT | 0 ms (0 ms–0 ms) | 0 ms (0 ms–0 ms) |
| CLS | 0 (0–0) | 0 (0–0) |

Individual performance scores: mobile **92, 99, 92**; desktop **99, 100, 100**. The mobile median meets the project’s >=90 score target. Two mobile LCP observations exceeded 2.5 seconds in this lab; this warrants investigation but does not establish field p75 compliance or failure.

### Other public routes — one mobile run each

| Route | Performance | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| `/how-it-works` | 99 | 1.652 s | 1.652 s | 0 ms | 0.00000 |
| `/what-we-automate` | 99 | 1.613 s | 1.652 s | 0 ms | 0.00064 |
| `/questions` | 99 | 1.652 s | 1.652 s | 0 ms | 0.00000 |
| `/partners` | 99 | 1.656 s | 1.656 s | 0 ms | 0.00000 |
| `/start` | 90 | 2.854 s | 2.854 s | 0 ms | 0.00000 |
| `/privacy` | 99 | 1.616 s | 1.658 s | 0 ms | 0.00000 |

These single-route results are spot checks, not stable distributions. `/start` has the slowest measured route paint at 2.854 seconds; form states after interaction were not audited by Lighthouse here.

## Prioritized findings

| ID / priority | Evidence and affected task | Correction to evaluate | Acceptance check |
|---|---|---|---|
| PERF01 / P2 | Public first paint depends on two similar Google Fonts CSS requests: an HTML `<link>` plus `src/styles/levarum/tokens/fonts.css` `@import`. Lighthouse identifies both in the render-blocking dependency chain. Slow homepage run estimated 1,470 ms potential render-blocking savings; `/start` estimated 1,650 ms. These are model estimates, not promised gains. | Consolidate font loading to one intentional path; evaluate self-hosting or reducing requested variants only if typography remains correct. Avoid font requests nested through another stylesheet. | Network trace has no duplicate Google Fonts stylesheet request; preserve both families, required weights, both themes and layout stability; repeat identical mobile/desktop runs. |
| PERF02 / P3 | Homepage reports about 34 KiB estimated unused transferred JavaScript in the shared React/UI chunk (about 31 KiB on `/start`). Navigation coverage does not exercise all interactive code. | Investigate public route splitting and runtime cost after the design is stable; do not remove functionality or treat the chunk’s `ThemeToggle` name as attribution. No security boundary defect was detected. | Public graph stays free of admin/server SDKs; compare transferred bytes, navigation metrics and complete interaction tests. Do not claim saved bytes from an estimate alone. |
| PERF03 / measurement limitation | Mobile homepage score varies 92–99 and LCP 1.656–2.680 s; the font network chain remains external. Local static gzip serving does not reproduce production transport. | Keep raw runs, compare medians/ranges, then measure the actual application on the final deployment with an authorized access method. | Same Lighthouse/Chrome/settings for comparisons, actual app screenshot and final URL verified; separately document hosted and field results. |

No actionable automated accessibility failures were reported in these navigation runs. That does not replace keyboard, screen-reader, zoom/reflow, error-state or representative-user testing.


## Predeployment candidate comparison — uncommitted snapshot

This comparison measures the revised task explorer, direct-contact flow and interactive invoice example **before the final deployment**, using the same Chrome/Lighthouse versions, simulated settings and static server policy. It is not a result for a later hosted build or an owner-approved release. The baseline server/snapshot is unchanged; candidate uses localhost **5190**.

Base commit: `ba49a1c78c0e5fa57c2bdd404f39745765f12257` plus the uncommitted application changes captured at **2026-09-30T05:47:47.031647+00:00**. Source-file hashes (including new files), built-file hashes and tracked source diff are retained in ignored `candidate-fingerprints.json` and `candidate-source.diff`. Fingerprint manifest SHA-256: `5fdd1751d587c70ed5378b6645cac4de1771962d042a68b605229f1603cce756`. Built `.vite/manifest.json` SHA-256: `eb06e207239f094a9c5263351ce5290c970b28a69bbc76fae04a565a3d50d0eb`.

The exact measured public entry is `public-PqUKoI2R.js`, shared entry `ThemeToggle-CM86YZ6d.js`, public CSS `public-CtTU_Wlo.css` and shared CSS `ThemeToggle-CZGc4JkJ.css`. Subsequent copy/validation or application changes require rechecking before these results can be attached to a final commit. The source fingerprints identify the working-copy capture; the immutable emitted assets identify what Chrome actually measured.

Eight sequential runs completed at **2026-09-30T05:47:53.749Z–2026-09-30T05:49:03.466Z**, with no runtime errors or warnings. Actual redesigned homepage screenshot inspected; all final URLs stayed on the local application origin. Accessibility, best practices and SEO scored **100 for all eight navigation audits**.

| Profile / metric | Baseline median (range) | Candidate median (range) |
|---|---:|---:|
| Mobile / Performance | 92 (92–99) | 99 (92–99) |
| Mobile / LCP | 2.676 s (1.656 s–2.680 s) | 1.654 s (1.654 s–2.682 s) |
| Mobile / CLS | 0.00000 (0.00000–0.00000) | 0.00000 (0.00000–0.00000) |
| Desktop / Performance | 100 (99–100) | 100 (99–100) |
| Desktop / LCP | 0.529 s (0.522 s–0.779 s) | 0.453 s (0.449 s–0.777 s) |
| Desktop / CLS | 0.00000 (0.00000–0.00000) | 0.01021 (0.01021–0.01021) |

Candidate performance scores: mobile **92, 99, 99**; desktop **99, 100, 100**. TBT remained **0 ms** in every candidate run. Candidate mobile FCP and Speed Index share the LCP median/range above; desktop FCP and Speed Index likewise match LCP. Both baseline and candidate meet the project’s median mobile >=90 target.

| Candidate mobile route | Performance | FCP / LCP | TBT | CLS |
|---|---:|---:|---:|---:|
| `/start` | 98 | 1.656 s / 1.656 s | 0 ms | 0.06640 |
| `/contact` | 99 | 1.656 s / 1.656 s | 0 ms | 0.00000 |

### What changed and what remains

- **Confirmed network correction:** candidate reports contain one Google Fonts stylesheet request, versus two in the baseline. The redundant CSS `@import` was removed while keeping the HTML font stylesheet. This is observed request elimination, not proof that it alone caused the higher mobile median.
- **No causal speed claim:** font timing and lab variability remain; the slow candidate homepage run still scored 92 with LCP 2.682 seconds and an estimated 1,470 ms render-blocking opportunity. Samples overlap substantially. The redesign and stylesheet composition also changed, so the score difference cannot be attributed solely to font deduplication.
- **Measured layout-stability regression:** desktop homepage CLS is 0.01021 across three runs, versus baseline 0. The `/start` single-run CLS is 0.06640, versus baseline 0. Lighthouse identifies webfont swaps moving the homepage heading/example section and explorer grid. These observed values remain below 0.1, but improving fallback font metrics or reserving stable heading/layout space is an actionable follow-up. No field conclusion follows from these samples.
- **Direct contact is now measured:** `/contact` navigation scored 99 with LCP 1.656 seconds and CLS 0. Form validation, consent and storage still require separate interaction/API checks; Lighthouse navigation does not test them.

Candidate artifacts remain under ignored `work/performance-baseline/candidate-dist/`, `candidate-reports/`, `serve-candidate.mjs`, and `run-candidate.mjs`. Baseline artifacts were not overwritten. No secrets, cookies or lead data were used. The later server `hasOwnProperty.call` compiler-compatibility fix does not change the measured public assets; later public edits do, and are outside this snapshot.

## Final hosted preview — measured with authorized access

Target: [the exact review preview](https://levarum-k09ohnt2g-mind-lever-gmail.vercel.app/), source commit `8989c1c0d6853c608baf3c424edd34e9a99fe334`. These are **hosted-preview laboratory results**, not production or real-user field results.

The user explicitly authorized reusing the existing preview session cookie solely for this audit. After the initial access-review rejection, the coordinating agent obtained approval in the root conversation and ran the same scoped audit. Authentication was seeded as domain-scoped browser cookies in a fresh Chrome profile per measurement, never as global request headers; `extraHeaders` remains null. Saved JSON/HTML reports are sanitized and stay in ignored local work. Cookie values were neither printed nor committed. The earlier access gate is now resolved for this audit only.

All eight retained reports have the expected final application URL and HTTP 200 document response. Expected application headings were verified after measurement; homepage and task-explorer audit screenshots were also inspected. No protection or sign-in screen was accepted as Levarum performance evidence. The runner reopened the route after Lighthouse closed its measurement tab to verify content; that check occurs after the recorded audit and does not warm the next fresh browser profile.

Audit timestamps: **2026-09-30T06:06:32.606Z–2026-09-30T06:08:39.383Z**. Lighthouse **13.5.0**, Chrome **154.0.8037.58**. Every retained report matches the baseline's profile, viewport, DPR, simulated throttling/CPU, storage-reset and category settings. Reports contain no runtime errors or run warnings.

| Homepage metric | Hosted mobile median (range) | Hosted desktop median (range) |
|---|---:|---:|
| Performance | 90 (90–98) | 100 (100–100) |
| FCP | 2.924 s (1.726 s–2.930 s) | 0.569 s (0.567 s–0.571 s) |
| LCP | 2.924 s (2.198 s–2.930 s) | 0.644 s (0.567 s–0.653 s) |
| Speed Index | 3.016 s (1.726 s–3.033 s) | 0.569 s (0.567 s–0.571 s) |
| TBT | 0 ms (0 ms–0 ms) | 0 ms (0 ms–0 ms) |
| CLS | 0.00000 (0.00000–0.00000) | 0.01021 (0.01021–0.01021) |

Individual homepage scores: mobile **90, 98, 90**; desktop **100, 100, 100**. The mobile median meets the project’s >=90 target at its threshold, while measured mobile LCP still has room for improvement.

| Hosted mobile route | Performance | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| `/start` | 89 | 2.899 s | 2.899 s | 0 ms | 0.06640 |
| `/contact` | 98 | 1.659 s | 2.157 s | 0 ms | 0.00000 |

### Category interpretation and comparison

- **Accessibility and best practices: 100 in all eight runs.** This clears only the automated navigation checks exercised here, not manual accessibility, form-state, owner-session or representative-user testing.
- **SEO: 63 in all eight runs.** The only failing weighted SEO audit is `is-crawlable`: the preview response has `x-robots-tag: noindex`. This is appropriate for the private review deployment; do not remove preview indexing protection to improve a score. Title, description, HTTP status, link text, crawlable anchors, robots.txt and hreflang audits pass. The canonical audit is **not applicable**, so no canonical configuration is certified. Verify intended public production headers and canonical metadata separately before promotion.
- **Same settings do not make local and hosted transport identical.** Mobile homepage medians are local baseline 92, local candidate 99 and hosted final 90; desktop medians are 100 across all three sets. External fonts and actual hosted transport vary, and the source also changed. These results do not establish a causal speed improvement or a clean code-only regression comparison.
- **The duplicate font request correction survives deployment:** all eight hosted traces contain exactly one Google Fonts stylesheet request. Render-blocking font CSS remains a performance opportunity; the slow hosted homepage run estimates 1,550 ms potential savings. This is a model estimate, not a promised gain.
- **Remaining observed weakness:** `/start` scored 89 in its single mobile run, with LCP 2.899 seconds and CLS 0.06640. Desktop homepage font-swap CLS remains approximately 0.01021. Improve font delivery/fallback metrics and retest rather than discarding the slower result. These navigation samples are not real-user p75 field measurements and cannot certify INP or field CWV.

Sanitized evidence: ignored `work/performance-baseline/hosted-reports/summary.json`, eight JSON/HTML reports and inspected screenshot exports. Measured deployed assets include `public-C6zzipIF.js`, `public-D4xVNfJK.js`, `public-CZGc4JkJ.css` and `public-Cm0Nu5M_.css`. The local baseline/candidate reports remain preserved separately. No form submissions or private admin records were accessed during Lighthouse.

## Interpretation and next checks

Lighthouse scores are automated indicators, not proof of usable journeys or full accessibility conformance. The navigation runs do not measure INP, validate consent/submission states or establish real-user p75 Core Web Vitals. Those remain separate browser/manual/field checks. A mobile median performance score of at least 90 is a **project target**, not a claim of complete UX quality or a guarantee of field results.

Use the same local conditions for the redesigned build, and separately verify the final hosted application rather than benchmarking a deployment-protection page. Do not infer production SEO/indexing correctness from this local score; canonical URLs, metadata, robots policy and hosted responses need their own review.

Sources: [Chrome: Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview) describes audit scope and workflows; [Chrome: performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) explains score variability and why distributions are more useful than one run. The settings, thresholds and interpretation above distinguish source guidance from this project’s test choices.

## Current application source 6b9a0f7 — hosted measurement, 2026-09-30

Measured the actual app at https://levarum-cjhcj1631-mind-lever-gmail.vercel.app (deployment dpl_352C2wYRW8uVsbcU5irXd3DJTeBm). Eight audits completed with Lighthouse 13.5.0 / Chrome 154: three Home runs per device plus mobile Start and Contact. Every run verified the expected final route and actual application heading; HTTP status audit passed. The temporary preview access link established access before measurement without extracting an existing browser credential. Reports remain ignored/private under work/performance-baseline/isolation-hosted-reports.

| Page/profile | Performance scores | Median LCP | CLS |
|---|---|---|---|
| Home mobile, 3 runs | 98 / 98 / 98 | 1.843 s | 0 each |
| Home desktop, 3 runs | 100 / 100 / 100 | 0.485 s | 0.0102–0.0129 |
| Start mobile, 1 run | 98 | 1.846 s | 0.0664 |
| Contact mobile, 1 run | 98 | 1.868 s | 0 |

All eight audits returned accessibility 100 and best practices 100, with no run warnings or runtime errors. SEO 63 is attributable to the preview x-robots-tag:noindex directive; keeping previews out of indexing is intentional. These scores do not prove real assistive-technology usability or production indexing.

Mobile/desktop configSettings exactly match the earlier hosted measurement profiles. Current Home mobile median98 meets the project >=90 target (earlier hosted source8989 median90; frozen earlier local baseline median92). Different deployment/time/cache/network conditions prevent attributing the observed change to one code edit. This is lab evidence, not field p75 Core Web Vitals, INP or a conversion outcome.
