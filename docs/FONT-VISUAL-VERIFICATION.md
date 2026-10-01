# Levarum — intended-font visual review and release gates

2026-10-01. Local continuation of design checkpoint `e15cc43102b2706d71e28faf11af127fcd29df8b`, on `codex/design-assessment-fixes-20261001`. Exact original baseline `be7df2b` remains in history. The earlier design report and fallback-font screenshots are preserved; this record supersedes their font-verification limitation. No push, PR, merge, deployment, access or credential change.

## Creative direction handoff

The latest owner feedback rates the earlier drafts and Amplitude/Customer.io references around 3/10, except Adobe MAX. These screenshots document a functional checkpoint, not an accepted page composition. A new Figma concept is being developed around one polished opening and one signature interaction. Preserve the tested accessibility, enquiry behavior, readable labels, licensed fonts and backend boundaries when integrating that concept; do not expand this composition before the handoff. The five Adobe Design headings below remain the review criteria.

## Font gap closed

The supplied Figma Home/Contact direction uses Schibsted Grotesk for structural typography and Instrument Sans for body text. Both active HTML entries previously requested Google Fonts CSS, which this environment blocked. The completed change self-hosts the same families through pinned `@fontsource-variable/schibsted-grotesk@5.3.0` and `@fontsource-variable/instrument-sans@5.3.0` npm packages, with lockfile integrity records. These are Fontsource distributions of Google Fonts sources, not publisher-operated npm packages or a new hosted service.

Inspected package metadata names the original Schibsted-Grotesk and Instrument Sans project authors and identifies SIL Open Font License 1.1. Unmodified package licenses are included at `/fonts/schibsted-grotesk-OFL.txt` and `/fonts/instrument-sans-OFL.txt`; byte equality and served HTTP responses were checked. Fontsource metadata and license hashes are retained in the evidence directory. No font binaries were edited, converted or renamed.

Vite processes the official package CSS into locally served, hashed WOFF2 assets. Shared tokens use the packages' `Variable` family aliases. Normal weight ranges, body italic, Latin and Latin-ext subsets are available; browsers request subsets/styles as needed. `font-display: swap` and declared system fallbacks remain. Both live entry pages have no Google Fonts stylesheet or preconnect; archived design exports remain historical and unchanged. This follows [Fontsource's Vite-compatible installation workflow](https://fontsource.org/docs/getting-started/install) and [variable-font guidance](https://fontsource.org/docs/getting-started/variable).

## Verification: rendered glyphs, not just declarations

New `tests/browser/fonts.mjs`, included in CI, tests Home and Contact at 320/390/768/1440 in light and dark themes. Every visual case blocks external-origin requests, waits for local fonts, and uses Chromium's `CSS.getPlatformFontsForNode` to confirm actual custom-font glyphs in the heading and intro. All 16 cases use Schibsted Grotesk/Instrument Sans with no fallback glyphs in those primary text samples, failed requests or overflow. The separate admin setup heading also uses the intended display face. Italic and extended-Latin loading were exercised with synthetic text. This is local Chromium evidence; it does not claim that every Unicode character belongs to these Latin families.

On Home the two normal Latin files total 76,844 bytes: Schibsted 46,752 + Instrument 30,092. All six emitted files total 152,388 bytes, including optional italic/extended subsets. Only used faces were requested in normal-page measurements. This is actual transferred font content, not a claim of zero loading cost, a Lighthouse improvement or field Core Web Vitals. No JS font loader, external service or subscription was added.

## Design assessment

Reviewed the new 1440px desktop and 390px mobile screenshots, both themes, against the already inspected Figma 123:36–39 direction. The headings below follow the supplied [Adobe MAX Design criteria](https://max.adobe.com/creativity-awards/). This is an implementation review, not an Adobe endorsement, scored award assessment, owner approval or real-user study. The prior 77/100 provisional assessment is not reweighted or replaced.

| Design heading | Page/state inspected | Finding and concrete response |
|---|---|---|
| Creative concept and originality | Home hero and example handoff | The continuous coral ribbon still explains incoming work → routine step → human control. Correct fonts preserve the intended personality rather than replacing the concept. This is the supplied Figma direction, not invented customer proof. |
| Visual impact and aesthetic execution | Desktop and mobile Home/Contact; both themes | Fallback metrics previously prevented typography review. Actual Schibsted and Instrument now render: stronger display letterforms, consistent wordmark/heading rhythm and clear body/label hierarchy. The coral, mint and teal composition remains legible. Mobile header contact wraps to two readable lines, preserving its full label and 44px target. No corrective layout change was needed after the font swap. |
| Scalability and adaptability | 320/390/768/1440; Home 200% text; long enquiry content | Intended fonts pass reflow, enlarged-text and maximum-content checks. Diagram labels remain at least 13px and card text 21px on mobile. The three cards reflow independently of the decorative ribbon. Both local font and fallback strategies remain available. |
| Brand storytelling and cohesion | Home → expanded example → enquiry and receipt | Shared fonts now load consistently on public and private entry points. Synthetic examples still identify tool roles, steps, human oversight and boundaries; no vendor certification, client result or savings claim was added. |
| Functionality and usability | Tabs, FAQs, contact invalid/sending/retry/success | Real-font geometry did not regress keyboard controls, error associations, retained drafts, pending lock, stable retries or focused receipts. Required information and privacy links remain readable. Engineering checks below are separate from design judgment. |

Motion remains a short, purposeful sequential reveal rather than an infinite loop. The prior 100/350/850ms observed sequence remains documented; the intended-font run repeats finite-motion, visible-final-state and reduced-motion checks. No new animation dependency or motion was added. Adobe-tool use is not applicable to this tool-neutral implementation review; Adobe provenance is unverified, not replaced with code quality. Photography/Video are absent, not failures; the simple supplied vector illustration retains its documented provenance.

## Final checks

| Check | Result and boundary |
|---|---|
| Backend/unit suite | PASS 33/33; unchanged server/API logic |
| TypeScript, production build and public/private boundary checks | PASS |
| Font browser suite | PASS 16 actual-glyph public renders; admin setup heading; local assets, italic/Latin-ext and licenses |
| Public flow | PASS 80 route/theme/width cases and interaction assertions |
| Repeated failure recovery | PASS 8 keyboard/draft/stable-ID cases |
| Release acceptance | PASS 10 offline/real 20-second-timeout/429/invalid-JSON/saved-false retries, metadata, print, Back/refresh |
| Maximum-content enquiry matrix | PASS 16 cases, both intents, pending lock, privacy draft retention and receipts |
| Work-in-motion suite | PASS 8 width/theme cases, 200% text, keyboard tabs/disclosures, reduced/finite motion and form errors |
| Automated accessibility | PASS 57 Axe 4.13.0 scans, zero reported violations; not WCAG certification |
| Local admin guard | PASS 8 unconfigured 503/no-store/error-only checks and disabled draft 404 |

No final test failures. The first admin-guard attempt found no running middleware server; restarting the local server and rerunning passed. All public submissions are synthetic and mocked. The administrative check uses deliberately absent configuration; it is not evidence of valid, non-owner, expired or revoked Clerk sessions. All seven browser suites pass locally; remote CI has not run on this unpushed branch.

Unrun: Safari/Firefox; actual screen readers; representative-user usability; current hosted exact-font checks/performance; authenticated owner journey; fresh live private-save/readback; production recovery/promotion smoke. No claim of email delivery or booked appointment.

## Exact remaining launch gates: decisions versus execution

The following reconciles current source with the dated provisioning/recovery/operations records. It does not assert fresh provider configuration: this continuation read repository evidence and ran local checks only.

| Gate | What remains | Owner decision/access versus safe technical work |
|---|---|---|
| G01: visual acceptance | Review the new Figma opening and signature interaction before full-page expansion; then review the implemented intended-font candidate and hosted comparison when authorized. | **Owner:** visual acceptance. **Completed locally:** actual-font screenshots, five-heading review, responsive/keyboard/contrast checks. |
| G02/G03: production authentication | Last recorded Clerk production connection was prepared but unsaved; domain/DNS/certificates were verified historically. Current project connection/key consistency, explicit admin origins, immutable production owner ID, verified primary email and active session need fresh proof. | **Owner/access:** approve any still-required production integration expansion and enroll/sign in through the normal provider flow; no credentials in chat. **After authorization/access:** check the exact production instance and bind/verify identity. No disconnect, secret rotation, preview-ID reuse or authentication bypass is appropriate. |
| G04: authenticated owner and denials | Fresh list/detail/filter/status/history/reconciliation and conflict recovery; logout/Back clearing; legitimate non-owner, expired and revoked-session probes. | **Owner/access:** a normal owner session; an authorized test identity if needed. **Completed locally:** unit auth/boundary tests and absent-configuration guard. **Not substitutable:** local mocks cannot establish live session behavior. |
| G05: durable live request path | Fresh designated synthetic follow-up/call/partner saves, unchanged retry deduplication, exact private readback/index/owner visibility, conflict/idempotence and truthful receipts against the intended deployment. | **Technical, once live scope/deployment and access are authorized:** execute exact-reference tests without enumerating customers. **Owner decision:** no new feature decision needed; current no-deploy/no-access-change restriction prevents treating this as ready to run. |
| G06: recovery and rollback | Historical selected-record SQL/Blob/combined drills exist; ongoing backup custody, full/production recovery, account-loss recovery, consistent cross-provider capture, deletion-ledger restore and a current rollback drill remain unproved. | **Owner:** acceptable loss exposure/export cadence, accountable custodian, accessible private destination and recovery access; any real paid tradeoff only if encountered. **Technical later:** revalidate capabilities/known-good deployment, isolated restore and deletion exclusions using designated synthetic records. No destructive production exercise. |
| G07: manual follow-up | Named inbox reviewer, actual review cadence and ability to reply from hello@levarum.com. Automatic delivery is not a prerequisite or current promise. | **Owner:** name the reviewer, choose a sustainable cadence and confirm mailbox access. **Prepared locally:** existing inbox/reconcile/reply/status runbook; truthful copy and receipts verified. No email sent. |
| G08: privacy operation | Actual retention/deletion practice and accountability; coordinated Blob/index/history/backup/correspondence deletion, plus quiescence/suppression to prevent an in-flight retry restoring deleted content. | **Owner:** factual retention practice, responsible person and unresolved identity/legal decisions. **Technical later:** bounded synthetic procedure/restore-exclusion validation after the chosen operation is concrete. Current API has no deletion endpoint or automatic retention job; do not promise them. |
| G09: promotion | Exact release candidate, current rollback target, approved production promotion and immediate real-domain public/private synthetic smoke. | **Owner:** reserved visual approval and explicit release authorization under the present no-push/PR/merge/deploy instruction. **Completed locally:** source, tests and reviewable evidence. No deployment was attempted. |

Outstanding business fields remain explicitly unresolved: reviewer; inbox cadence; backup custodian/destination; export/check cadence and acceptable loss exposure; retention/deletion practice. Nothing was guessed. Existing approved isolated Neon/Blob provisioning is historical evidence, not work to repeat blindly. No new service, payment, committee or invented delivery SLA is required by this review.

Safe local work for this font continuation is complete: package/license provenance, self-hosted delivery, actual-glyph tests, regression checks, CI coverage, screenshots and reconciled gate inventory. Operational verification that genuinely depends on authenticated systems remains open; more synthetic UI passes would not close it.

## Evidence

Machine-readable records and unchanged screenshot originals: `docs/evidence/font-verification-20261001/`. Full synthetic artifacts: ignored `work/font-verification/`. Earlier assessment evidence remains in `docs/evidence/design-assessment-20261001/` for comparison. Library upload is authorized for copies of this report and selected intended-font Home/Contact screenshots; upload identities are recorded separately after successful transfer. Originals stay local.
