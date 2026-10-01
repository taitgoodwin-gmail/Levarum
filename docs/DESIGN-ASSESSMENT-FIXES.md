# Design assessment implementation — 2026-10-01

## Exact continuation and scope

Baseline `be7df2b9e17e7b286c4834fa169b90d017f4c27e` was fetched from `origin/dot/cloud-mvp-20261001`. Clean local branch `codex/design-assessment-fixes-20261001` continues that checkpoint. `origin/main` is older (`2e7b9fa`); `origin/codex/current-design-audit-fixes` is an ancestor (`9e65a57`); `origin/claude/levarum-production-motion-4kawpx` is a separate history. None was overwritten. Root AGENTS.md and required current documents were read; no repository `.agents/skills` files existed at this checkpoint, and `/workspace/.agents` was empty.

Home and enquiry now implement the supplied Round 3 direction. Backend, API contracts, routes, owner code, dependencies/lockfile, secrets and access configuration are unchanged. Source is committed locally only: the documented Git integration deploys pushed branches, so there is no push, PR, merge or deployment under this task's restriction. A portable Git bundle is provided separately.

## Figma evidence and intentional adaptations

Actual images and design context were inspected for [desktop Home 123:36](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=123-36), [mobile Home 123:37](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=123-37), [desktop enquiry 123:38](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=123-38) and [mobile enquiry 123:39](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=123-39). Motion context for 123:36 was read. No Figma document was edited.

The existing joined-L asset is retained. Original ribbon node124:40 and arrow124:32 were exported read-only through Figma's Plugin API after the asset HTTP endpoint returned403. Local SVGs preserve their 622×530 and22×22 geometry. No temporary Figma URLs are used by the application. On mobile, the ribbon is decoratively clipped behind independently reflowing cards; text is never scaled with it. Three chronological steps, minimum13px labels and21px card text replace the 9–10px fine labels. Both themes retain legible light/mint diagram cards, with the final human step in teal.

The desktop hierarchy, coral commitments/closing band, dark teal example area, mint illustration and “Less repeat. More room.” concept follow the supplied reference. Intentional adaptations: roomier text, three compact keyboard tabs at every width, native details disclosures, expandable worked examples, existing binary persistent theme control, existing form-validation/receipt contracts, and finite rather than looping motion. This is not pixel-parity certification.

## Design review using the supplied Adobe headings

Headings follow the user-supplied [Adobe MAX Design criteria](https://max.adobe.com/creativity-awards/). Findings below are an implementation review, not an Adobe assessment, weighted rubric, new score or representative-user research. The earlier77/100 remains provisional and is not converted.

| Design criterion | Page/state inspected | Finding and implemented response |
|---|---|---|
| Creative concept and originality | Home hero, desktop/mobile | Baseline was the earlier static Round2 checklist. Restored the supplied continuous coral workflow and “Less repeat. More room.” idea, with a clear human ending. This direction's provenance is the supplied Figma work; no claim of novel market research. |
| Visual impact and aesthetic execution | Home/Contact in light/dark,1440/390 and320px | Tiny prototype labels and inconsistent palette reduced clarity. Added a scoped teal/mint/coral public system, larger display hierarchy,13px minimum diagram labels, readable cards and a focused enquiry panel. Final screenshots were inspected; Google Fonts are blocked here, so fallback-font renders do not verify final Schibsted/Instrument typography. |
| Scalability and adaptability |320/390/768/1440, both themes; Home200% text enlargement | Mobile no longer hides the diagram. Cards reflow without shrinking copy. Testing found enlarged long words and the FAQ heading overflowing at320px; wrapping and a missing inter-word space were corrected. Final reflow and enlargement checks pass. |
| Brand storytelling and cohesion | Hero → selected example → process → Contact | The conceptual promise lacked a concrete explanation. Each selected example now exposes tools, ordered steps, a human owner and boundaries. The same palette and joined-L connect Home, enquiry and supporting routes. Every workflow is explicitly synthetic; no client proof, credentials, savings or supported-integration claims were introduced. |
| Functionality and usability | Example tabs, FAQ, enquiry invalid/pending/error/success | Implemented arrow/Home/End tab selection, focusable labeled panel and native keyboard disclosures. Required/length help is associated with fields; optional call help is associated too. Sending has a live status; failure offers “Try again.” Existing stable retry identity, duplicate guard, retained values, consent reset, focused errors/receipts and truthful call-not-booked language are preserved and exercised. |

## Motion assessment — separate from Design

- **Emotional impact and creative intent:** a calm, short ordered reveal directs attention from incoming work to the person responsible. This is a design hypothesis, not measured emotional impact.
- **Technical execution and animation quality:** CSS opacity/14px translation with500ms ease-out and0/160/320ms starts; no animation dependency or continuous work. Final state reached by820ms. Browser timeline samples at100/350/850ms and corresponding local screenshots were inspected. All cards remain visible afterwards.
- **Storytelling and motion elements:** only the existing three workflow cards move; example selection uses a240ms transition. No stock imagery, video or decoration was added to satisfy a category.
- **Pacing, flow and time:** one reveal replaces the Figma two-second infinite loop; repeated disappearance would interrupt reading. Reduced motion removes both card and panel animations, retaining all content.
- **Adobe tools and innovation:** not applicable to this tool-neutral implementation review; Adobe production provenance is unverified. Code quality is not substituted for this award-specific criterion. Photography/Video are absent and not failures. Image Making applies only to the supplied simple vector workflow: provenance, composition and geometry were inspected, without claiming Adobe-tool use or advanced illustration techniques.

Loading cost was checked against a clean build of the exact baseline using the same Node/dependencies: public JS32,246→38,012 bytes (gzip9,619→11,366); public CSS19,012→29,933 bytes (gzip4,105→6,039). New local SVGs total781 bytes. These costs include the entire design/examples change, not only motion; no new runtime dependency. No current Lighthouse/field performance claim is made. Shared/admin output remains unchanged. See [load-cost evidence](evidence/design-assessment-20261001/load-cost.json).

## Requirements and example provenance

`src/domain/guidance.ts` already defines invoice payment-status checks, approved timing/wording and excluded/disputed accounts; moving-information source-of-truth, duplicates and failures; enquiry routing, urgency, named responders and pricing exceptions. The worked examples elaborate those explicit checks as hypothetical steps. Tool roles are accounting system/email, source/destination systems, and form/inbox/request tracker; vendor compatibility has not been verified and is not asserted.

R01/R06: cohesive source-linked visuals with synthetic labeling. R02/R03: direct contact and all existing routes retained; local exploration makes no POST. R04/R07/R10/R13: genuine description, consent, failure/retry and truthful receipt behavior preserved. R05: concrete tools/steps/oversight/boundaries. R11: no private/server code changes; public import boundary passes. R12: mobile/theme/keyboard/reduced-motion evidence below, actual assistive technology still unverified. R14: owner visual acceptance and production gates remain open.

## Final verification

All public save scenarios use synthetic inputs and mocked responses. A mock receipt is not proof of durable production storage, notification delivery or appointment booking.

| Check | Final result |
|---|---|
| `npm test` | PASS33/33 |
| `npm run typecheck` | PASS |
| `npm run build`, including both boundary scripts | PASS |
| `public-flow.mjs` | PASS80 route/width/theme checks plus guidance, consent, duplicate request guard, draft retention, stable retry, receipts, partner and keyboard flows |
| `recovery.mjs` | PASS8 repeated-failure keyboard cases, invalid/whitespace recovery and help association |
| `release-acceptance.mjs` | PASS metadata, print, contextual Back/refresh and10 offline/real20-second-timeout/429/malformed-JSON/saved-false retry cases |
| `round2-contact-matrix.mjs` (compatibility name retained) | PASS16 maximum-content enquiry journeys, both intents, privacy draft retention, pending lock, exact payload and focused receipt |
| `work-in-motion.mjs` (also added to CI) | PASS8 width/theme cases: diagram text, asset geometry, keyboard tabs/disclosures, no POST, reduced motion,200% text. Finite-motion check; invalid/error forms in both themes at320/1440 |
| Axe4.13.0 via Chromium | PASS57 scans, zero reported violations; no conformance claim |
| `admin-negative.mjs` | PASS8 deliberately unconfigured503/no-store/error-only guards and disabled draft404; no authenticated/private access |
| `git diff --check`; backend/owner/lockfile comparison to baseline | PASS; no changes in those areas |

Initial failures were corrected and superseded: native heading-name/retry-label test expectations, a skip-link harness navigation readiness race, and the real320px enlarged-text overflow. No known final suite failure remains. `agent-browser` opened Home with container flags but subsequent commands failed Chromium sandbox setup; verification used the working repository Playwright harness/system Chromium instead.

**Blocked visual check:** Google Fonts stylesheet requests fail with `ERR_TUNNEL_CONNECTION_FAILED` in this environment. Final screenshots and audits use declared fallback fonts; exact-font rendering and font-loading performance remain unrun. The original font configuration is preserved. Initial npm cache permission trouble was resolved with `/tmp/levarum-npm-cache`.

**Unrun:** hosted/exact-font checks, Safari/Firefox, actual screen-reader use, representative-user research, authenticated owner journeys, live private-save/readback, email delivery, current Lighthouse/field performance. Unit and local browser results do not close these.

Reproduce with Node24, `npm ci`, `npm test`, `npm run build`, built Vite preview, and the six scripts above. The CI workflow pins Playwright1.57.0/Axe4.13.0 and now includes `work-in-motion`; CI itself was not run remotely for this unpushed branch. Set `PLAYWRIGHT_MODULE`, `CHROME_PATH`, `AXE_CORE_PATH`, `TEST_BASE_URL`, `TEST_OUT` as in the workflow; local admin checks use middleware port5174 and `TEST_ADMIN_EXPECT_UNCONFIGURED=1`.

[Machine-readable summary](evidence/design-assessment-20261001/summary.json) and per-suite records are committed with selected screenshots:

- [Desktop Home, light](evidence/design-assessment-20261001/home-desktop-light.png)
- [Mobile Home, dark](evidence/design-assessment-20261001/home-mobile-dark.png)
- [Mobile enquiry, light](evidence/design-assessment-20261001/contact-mobile-light.png)
- [320px enquiry error, dark](evidence/design-assessment-20261001/contact-mobile-dark-error.png)

Full local synthetic artifacts remain in ignored `work/design-assessment/`.

## Remaining launch/security decisions

Keep the existing [production release gates](PRODUCTION-RELEASE-GATES.md): explicit visual acceptance; production identity/immutable verified owner binding; fresh authenticated and denied/expired/revoked journeys; owner account recovery, backup custody and operating/privacy commitments; eventual approved promotion and real-domain synthetic smoke. No new access, secret, storage or security decision was made. No merge/deploy/PR is authorized by this report.
