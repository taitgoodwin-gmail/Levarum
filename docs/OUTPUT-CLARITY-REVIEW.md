# Connected output and mobile approval — 2026-10-01

Connected now exposes a concise captured-request and draft-reply preview without opening the existing full-details disclosure. The content comes from the existing synthetic booking-enquiry sample; missing date, time and service remain explicitly missing. Both the visible preview and full details state that no booking, quote or message is sent.

At mobile/tablet widths the human-approval endpoint has its own coral-bordered panel, a 20px review heading and 16px no-auto-send explanation. Its height follows content, including enlarged text. Palette, fonts, original workflow artwork, desktop review endpoint, routes and backend are preserved.

## Coded before/after evidence

Same local Chromium 151, dark theme, reduced motion, DPR1; captures include the complete opening. These are useful change comparisons; pinned CI Chromium 143 remains the authoritative font-metric reference (see [metric reconciliation](FONT-METRICS-RECONCILIATION.md)). Natural line wrapping is preserved.

| State | Before | After |
| --- | --- | --- |
| Mobile Connected | [390px before](evidence/output-clarity-20261001/before-390-connected.png) | [390px after](evidence/output-clarity-20261001/after-390-connected.png) |
| Desktop Connected | [1440px before](evidence/output-clarity-20261001/before-1440-connected.png) | [1440px after](evidence/output-clarity-20261001/after-1440-connected.png) |
| Mobile Scattered | [390px before](evidence/output-clarity-20261001/before-390-scattered.png) | [390px after](evidence/output-clarity-20261001/after-390-scattered.png) |
| Desktop Scattered | [1440px before](evidence/output-clarity-20261001/before-1440-scattered.png) | [1440px after](evidence/output-clarity-20261001/after-1440-scattered.png) |

## Verification

Passed locally: 33 unit tests; build including TypeScript and public/private boundary checks; 12 signature cases across both themes and widths320/390/768/1024/1200/1440; 24 Axe scans with zero violations. Keyboard Enter/Space/Home/End and focus retention, reduced motion, rapid reversal, orientation changes, 200% text, nonoverlapping approval/preview, collapsed disclosure with preview visible, original vector geometry, and absence of submissions all pass. Receipts: [cases](evidence/output-clarity-20261001/results.json), [motion](evidence/output-clarity-20261001/motion.json).

Failed local checks: none. The complete CI suite runs on this pushed commit; the exact SHA and terminal result are reported in the handoff with its Actions link. CI retains authoritative browser screenshots and all suite receipts in its synthetic-browser-evidence artifact.

Unrun: authenticated Vercel preview review (sign-in blocked), real assistive technology, live identity/storage/recovery and production checks. No duplicate deployment, access change, PR, merge or production replacement. Existing [launch decisions](SIGNATURE-OPENING-REVIEW.md) remain open. Parent Figma worker can sync the verified result; this change does not write Figma.
