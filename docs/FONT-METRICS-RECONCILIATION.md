# Intended-font rendering: CI and local metrics

2026-10-01. Application source remains `33176adb1589a7e89c5ec64ebf2a94d038df3493`. Diagnostic-only commit `571b84874732e65a83f5915ef7ca64e3ddd9d902` adds `tests/browser/font-metrics.mjs` and its CI invocation. No application CSS, font package, content, route or backend change was needed.

## Finding

**The different mobile wrapping comes from different measured text advances in the two rendering environments, not fallback fonts, stale assets or unsettled font loading.** The exact low-level contribution of Chromium version/build versus the Linux rendering stack has not been isolated. Do not claim a specific Chromium defect from this comparison.

The original exact-33176ad CI artifact (11141705439) shows the intro across four lines and the primary CTA across two at 390px. Its font receipts already confirmed intended custom fonts. The committed local screenshots showed three intro lines and one CTA line. Both layouts remain readable and have no horizontal overflow.

The new diagnostic compares identical viewport/DPR settings, resources, computed styles, actual per-element glyph fonts and stable text rectangles. [CI run 36816958670](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/36816958670) passed build/unit checks and all nine browser suites, including the new diagnostic. Artifact 11141632214 contains the receipts and controlled captures.

| Measurement at 390px | Local | CI |
|---|---|---|
| Chromium | 151.0.7922.173, system binary | 143.0.7499.4, Playwright 1.57.0 bundled browser |
| Node | 24.19.0 | 24.21.0 |
| Viewport / DPR | 390 × 1400 / 1 | 390 × 1400 / 1 |
| Intro style | Instrument Sans, 400, 18px / 25.2px; 330px box | Identical |
| Intro full-string canvas advance | 898.788px | 925px |
| Intro line rectangles / height | 3 / 75.563px | 4 / 100.75px |
| CTA style | Instrument Sans, 600, 16px / 19.2px; 242px box | Identical |
| CTA text advance | 147.472px | 150px |
| CTA line rectangles / height | 1 / 54px | 2 / 70.375px |

The CTA has approximately 149px available for text after padding, gap, arrow and margins. The measured advances fall on opposite sides of that threshold. At 1440px its wider box fits one line in both environments. The intro's 1440px line count is also the same in both. Differences in content-driven dimensions, such as the wordmark's width, follow the measured text advances.

## What was ruled out

- **Wrong font or weight:** CDP confirms custom Bricolage Grotesque, Instrument Serif, Space Mono and Instrument Sans glyphs, including the CTA. Relevant computed family, weight, size, stretch, variation axes, optical sizing, kerning, features, spacing, line-height and box styles match. Both use the existing pinned Fontsource 5.3.0 files.
- **Different CSS/font builds:** every requested CSS and WOFF2 asset has the same path, byte size and SHA-256 hash in the controlled local and CI runs. Different Node patch versions did not produce different tested CSS/font bytes.
- **Stale installation/build:** a fresh local `npm ci` and production build reproduce the earlier local computed metrics, actual fonts and asset hashes exactly.
- **Capture race:** the diagnostic waits for the relevant rendered elements, `document.fonts.ready` and two animation frames, then records again after 2.1 seconds. Metrics are identical before/after that interval in each environment. Both screenshots use reduced motion and settled selected states.
- **Viewport or device scaling:** both controlled runs use explicit width, 1400px height, DPR 1, locale en-US and visual viewport scale 1. The earlier local evidence's taller crop does not explain text-width differences; the controlled equal-height captures reproduce them.

The CI environment yields different glyph advances even for identical canvas font descriptions. Attempts to download Chromium 143 locally returned HTTP 403 from the browser download endpoints, so a same-machine browser-version comparison was not possible. A local `--disable-font-subpixel-positioning` probe did not reproduce CI's advances and is not an established explanation or proposed fix.

## Authoritative reference and design handoff

For metric-level Figma reconciliation, use the four **`ci-dark-*` PNGs** in [the new evidence directory](evidence/font-metrics-20261001/), together with `ci-results.json` and `comparison.json`. These are the controlled, pinned-browser CI reference: 390/1440 × 1400, DPR 1, en-US, reduced motion, font-ready and settled. The mobile reference has **four intro lines and a two-line primary CTA**. Preserve natural wrapping and auto height; do not force a one-line CTA or shrink type to match one environment.

`local-dark-*` captures are valid comparison evidence for system Chromium 151, not the canonical CI metric reference. The older screenshots in `evidence/signature-20261001/` remain historical local evidence; no attempt was made to silently replace them. The original exact-33176ad CI mobile images are also retained in the new directory for traceability.

The diagnostic remains in CI, checking intended custom glyphs and post-load stability while retaining resource hashes, engine version, viewport, computed style and geometry receipts. It deliberately does not require identical line counts across rendering environments. Hosted authenticated QA remains blocked on normal user sign-in and is not claimed complete. Main, production, identity, credentials and customer data were untouched.
