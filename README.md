# Levarum public pilot

A short intake produces a practical Game Plan and an optional request for a
15-minute conversation. Scheduling is handled manually by Levarum through
hello@levarum.com. The site never claims an appointment has been booked.

## MVP contract

**Contract currency warning (9 October 2026):** the contract below is the historical proposed baseline carried by this branch. [PR #10](https://github.com/taitgoodwin-gmail/Levarum/pull/10), README at `d7c266c5b0037d56e9b4bf563209760d8a683238`, records owner acceptance on 7 October and the 8 October moderated digital-test amendment. Use that accepted contract for current decisions; do not merge this older contract over it. Reconcile README explicitly before merging PR #9. The intelligence proposals remain unapproved and cannot alter the accepted gates.

**Status:** proposed baseline for owner review and implementation traceability. This section defines the smallest complete Levarum release to validate with a real pilot. Existing implemented behavior is not automatically accepted merely because it exists.

### Core user journey

Small-business owner → provides minimum business context and consent → receives a useful Game Plan → optionally requests help → request is durably stored → Levarum can retrieve and act on it → the user receives an honest confirmation of what happened and what did not happen.

### MVP requirements

**LVR-MVP-01 — Capture the minimum useful context**

A small-business owner can provide the minimum information needed to identify repetitive operational work without a sales call.

Acceptance:
- business type, weekly back-office-hours band, at least one challenge, valid email, and explicit consent are collected;
- missing or invalid required data is rejected clearly;
- the flow works without requiring an account or payment.

**LVR-MVP-02 — Persist the intake safely**

The product confirms an intake only after the validated request has been durably stored in the intended private production store.

Acceptance:
- a successful response is returned only after the private write succeeds;
- storage failure does not produce a false success;
- repeat submissions are handled deliberately without overwriting different content.

**LVR-MVP-03 — Deliver immediate customer value**

After a valid intake, the customer receives a useful, understandable Game Plan tied to the submitted challenges.

Acceptance:
- the plan identifies concrete opportunities or next questions;
- it does not invent savings, ROI, delivery timing, or implementation certainty;
- the customer can print or save the plan;
- degraded/AI-unavailable behavior remains useful and honestly labeled when AI is used.

**LVR-MVP-04 — Provide an honest next step**

The customer can request a short conversation without being told or led to believe that an appointment has already been booked.

Acceptance:
- the request is stored with optional timing/time-zone preferences;
- confirmation states that Levarum will follow up and that the meeting is not yet confirmed;
- direct email/contact remains available.

**LVR-MVP-05 — Give Levarum one workable operator queue**

An authorized Levarum operator can retrieve a submitted request, understand the customer context and required next action, and update its working status without copying data across several systems.

Acceptance:
- production records are accessible only to authorized operators;
- the operator can distinguish new, in-progress, waiting, and closed work;
- the source intake and follow-up context remain traceable;
- no public read endpoint exposes private submissions.

**LVR-MVP-06 — Handle failures and retries deliberately**

Invalid input, duplicates, timeouts, unavailable storage, notification failures, and retry attempts produce defined outcomes without data loss or false confirmation.

Acceptance:
- each material failure path has an observable customer/operator state;
- notification failure does not discard a successfully saved lead;
- retries are safe and rate/abuse controls fail predictably;
- not-tested conditions are labeled NOT RUN rather than assumed to work.

**LVR-MVP-07 — Work on real customer devices**

The complete core journey is usable on the agreed desktop and mobile viewport set and supports basic keyboard and accessibility expectations.

Acceptance:
- intake, Game Plan, call request, confirmation, privacy, and error states are verified at representative desktop and mobile sizes;
- focus order and keyboard completion work for the core journey;
- no critical content or action is clipped, hidden, or unreachable.

**LVR-MVP-08 — Complete one real production pilot**

One real participant can complete the end-to-end journey in production and Levarum can receive, process, and respond using the intended operating process.

Acceptance:
- production submission and retrieval are verified end to end;
- customer and operator assistance, defects, elapsed effort, and exceptions are recorded;
- the pilot result distinguishes product behavior from manual rescue;
- the result informs the next product/commercial decision without claiming broader market validation.

### Proposed technical / NFR requirements

**Status:** proposed 2 October production-engineering gap pass. These requirements make production constraints explicit; they do not authorize implementation beyond the accepted pilot scope or invent numerical SLA, retention, rate, or recovery targets.

**LVR-NFR-01 — Production release and configuration integrity**  
**Gate:** required before a real production pilot.

Every production release identifies the source revision/deployment, validates required production configuration before success, fails closed when a required secret/store/config value is unavailable, and has a known rollback path.

Acceptance:
- the deployed version can be tied to a specific source revision and build;
- missing/invalid required configuration blocks the affected capability without false success;
- secrets are not committed or exposed in public output/logs;
- rollback to the prior verified release is documented and does not silently discard accepted lead records.

**LVR-NFR-02 — Data lifecycle, access, and deletion honesty**  
**Gate:** required before handling a real participant's data.

The service records the selected retention/deletion policy for intake and call-request records and can honor an authorized access/deletion request without claiming deletion from systems or backups it cannot verify.

Acceptance:
- stored lead classes and their selected retention/deletion treatment are explicit;
- an authorized deletion/access procedure is defined and testable;
- private submissions remain inaccessible from public routes;
- unavailable backup/provider deletion guarantees are stated as limits rather than assumed.

**LVR-NFR-03 — Production observability without leaking customer data**  
**Gate:** required before a real production pilot.

Production-critical intake/storage paths provide enough correlated status/error evidence to distinguish validation failure, storage failure, notification failure, throttling/abuse rejection, and successful durable save without logging secrets or unnecessary submitted content.

Acceptance:
- material failure classes are distinguishable in production evidence;
- a saved lead and a failed notification cannot be confused;
- logs/diagnostics omit secrets and unnecessary PII;
- monitoring/diagnostics cannot override persisted product state or fabricate success.

**LVR-NFR-04 — Distributed abuse and resource protection**  
**Gate:** required before traffic expands beyond a bounded pilot.

Externally reachable mutation endpoints enforce production-effective body/origin/rate/abuse controls across instances. The existing in-memory per-instance throttle is explicitly insufficient for this gate.

Acceptance:
- distributing requests across instances cannot bypass the selected production rate/abuse rule;
- oversize, invalid-origin, honeypot/bot, and excessive-request cases reject predictably;
- rejected attempts create no unintended durable side effect;
- legitimate below-policy traffic remains usable.

**LVR-NFR-05 — Versioned interface and data-contract compatibility**  
**Gate:** required before independently evolving the public API/operator retrieval path.

Material changes to intake/call payload meaning, storage record shape, or independently deployed producer/consumer interfaces use an explicit compatibility/version boundary rather than silently reinterpreting old records.

Acceptance:
- supported prior records remain readable or have a tested migration path;
- incompatible field/semantic changes are detected before release;
- a breaking change creates an explicit successor/version or blocks deployment;
- historical records are not silently rewritten to appear as newly collected data.

**LVR-NFR-06 — Recoverability proportional to service dependence**  
**Gate:** recovery strategy must be an explicit pilot decision; independently verified recovery is required before the service depends on stored records for repeated customer delivery.

The project identifies what customer/operator data must survive a primary-store or deployment failure and tests the selected recovery approach to a fresh destination where that recovery is claimed.

Acceptance:
- required recoverable data/artifacts are named;
- the selected backup/provider-durability boundary is explicit;
- a claimed recovery path is verified to a fresh destination without overwriting an accepted state;
- numeric RPO/RTO values remain decisions unless evidence/business needs justify them.
- proposed 6 October clarification: supplier shutdown or account termination has an explicit export/portability and exit plan; identify what can be recovered independently, the destination, responsible operator and any unrecoverable provider-held history. Verify a claimed restore before relying on it. Evidence: [Relay.app shutdown notice](https://relay.app/) states the September 2026 shutdown included deletion of accounts, workflows and run history; this establishes a provider-exit risk, not Levarum data loss.

**LVR-NFR-07 — Bounded timeout and degraded behavior**  
**Gate:** required for customer-facing production flows.

Customer-facing requests have explicit timeout/degraded behavior so an unavailable dependency cannot create an endless wait or false completion. Long-running/AI work, if later enabled, must not block the page request indefinitely.

Acceptance:
- storage/API dependency timeouts produce a defined honest customer/operator state;
- a timeout never returns successful-save confirmation;
- useful non-AI/degraded behavior remains available where the requirement calls for it;
- numerical performance targets are added only when the journey/risk/economics justify them.

### Explicit non-goals for this MVP

Unless later evidence shows they are required for the first real pilot, the MVP does not require a full CRM, automated calendar booking, a broad research hub, a large authenticated customer portal, automated plan email delivery, advertising tracking, or generalized multi-agent automation.

### Traceability rule

For every consequential implementation issue, use:
**Requirement ID → approved user-journey/UI target → acceptance test → implementation issue → code/PR → verification evidence → production result.**

The approved visual target may live in Figma, but Figma does not redefine product scope by itself. If requirements, Figma, code, and production disagree, classify the mismatch and update the correct source deliberately rather than allowing silent drift.


## Daily intelligence and improvement

**Work key:** `levarum-intelligence-loop`. The owner-directed routine works from this repository and updates existing files only. README is the product/operating baseline; AGENTS.md and its shared delivery baseline govern execution. Historical Drive material is reference, not a competing working authority. Keep private customer/operator records out of this public repository.

A chat-attached scheduled task is configured for 12:15 a.m. America/New_York daily, within the owner's midnight–6:07 a.m. Eastern window. Mondays include a deeper review. This is a configured schedule, not evidence of a successful unattended run. Local execution requires the computer on and the app available. Check Eastern time between stages and stop new work before 6:07; a prompt cutoff is not an enforceable scheduler timeout.

Execution order:
1. Read current requirements, decisions, open PRs/issues and prior evidence; distinguish main/production from unmerged candidates.
2. Gather changed competitor, customer-problem and official vendor sources; prioritize material changes and rotate deeper freshness checks.
3. Validate and deduplicate evidence; assess customer value, offering differentiation, effort and delivery risk before proposing scope.
4. Inspect accessible UI/UX and real customer-to-owner journeys against existing requirement IDs and the selected design target.
5. Update existing research/status/requirements sections with evidence-backed proposals; preserve approved decisions and unrelated content.
6. Verify consistency and committed content through readback; use a branch/PR for protected main.
7. Notify only for meaningful findings, material updates, failures or required owner decisions.

Each actionable finding records its source URL, retrieved/publication dates where available, observed change, confidence/limitations, customer impact, requirement mapping, acceptance test, dependencies and disposition. A vendor claim or attractive competitor feature does not prove demand or justify implementation. Record coverage failures and NOT RUN tests; partial coverage must not produce an all-clear.

Reuse the existing branch/PR for this work key while open; check state before mutations to avoid duplicates. Keep run evidence in this section or the existing execution record rather than creating daily documents/logs. Requirement proposals do not authorize new scope, pricing, spending, customer contact, production-data processing or release. Review the first three scheduled runs and adjust sources/cadence based on useful findings and owner effort.

**Manual pilot on 6 October 2026:** repository discovery, current AGENTS/README retrieval and protected-main detection passed. The selected connection resolves to repository owner `taitgoodwin-gmail`. The pilot caught stale Drive/Squarespace instructions; current repo guidance specifies React/Vite on Vercel. Existing draft [PR #8](https://github.com/taitgoodwin-gmail/Levarum/pull/8) separately reports blocked design assets and unrun production/pilot checks; those statuses are recorded PR evidence, not new runtime verification. This documentation pilot tests existing-file persistence and reviewability. Full market coverage, live UI/runtime checks, independent review and unattended execution remain NOT RUN.

Guidance: [OpenAI scheduled tasks](https://learn.chatgpt.com/docs/automations) recommends durable instructions, accessible context, testing and reviewing initial runs; [GitHub file editing](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files) recommends branch/PR review for default-branch changes. Readback proves saved content, not product acceptance.

### Latest manual sweep 6 October 2026

**Result: PARTIAL VERIFIED.** This owner-requested manual run executed the saved workflow in this chat; it does not prove a scheduler-triggered unattended run. Existing work key/branch/PR reused: `levarum-intelligence-loop`, `codex/levarum-intelligence-loop`, [PR #9](https://github.com/taitgoodwin-gmail/Levarum/pull/9). No new repository documents, Drive writes, merge or deployment.

**Coverage:** refreshed current main AGENTS, this README, the active intake-candidate README, the older design-candidate README, design handoff and open PRs; read recent GitHub Actions and the failed candidate job steps. Retrieved five relevant first-party external pages: Relay.app, Zapier AI pricing guidance, Make pricing, Lindy pricing and Marshland homepage. This is an initial bounded watchlist, not complete market research or proof of newness relative to a prior snapshot.

| Source checked 6 October | Observed evidence | Implication and disposition |
| --- | --- | --- |
| [Relay.app](https://relay.app/) | Official notice says shutdown occurred September 2026 and accounts, workflows and run history were deleted. Prior pricing URL failed; root notice resolves why. | High-confidence provider-exit signal. Extend proposed LVR-NFR-06 acceptance with portability, independent recovery boundaries and supplier exit. Do not recommend Relay as an active supplier. No Levarum dependency or data loss established. |
| [Zapier AI pricing](https://help.zapier.com/hc/en-us/articles/46597632373389-AI-by-Zapier-new-model-based-pricing-starting-June-15-2026) | Article updated 12 August describes model-tier task multipliers and a per-step usage pause. | Cost depends on model/tool work. Map to LVR-MVP-03 and LVR-NFR-07: propose usage assumptions and honest budget/degraded states before any AI-backed promise. No vendor purchase or Levarum price approved. |
| [Make pricing](https://www.make.com/en/pricing) | Credits are the billing unit; AI features may consume more, and exhaustion can stop scenarios. | Include usage/exhaustion in operating estimates and failure-path acceptance. Vendor fact, not a measured Levarum cost. |
| [Lindy pricing](https://www.lindy.ai/pricing) | Page markets shared credits, scheduled routines and pauses when credits run out. | Treat as an adjacent DIY alternative. Differentiate Levarum through scoped delivery, tested recovery and accountable operation; do not claim these are proven strengths yet. |
| [Marshland](https://marshland.software/) | Advertises a one-week $750 workflow audit and monthly managed AI; emphasizes clear ownership. | Direct-service benchmark for offer clarity and exit/ownership. A proposal should expose scope, deliverable, exclusions and owner responsibilities. Advertised price/outcomes are not verified sales, performance or demand; do not copy price or guarantee savings. |

**Proposed clarification for LVR-MVP-03 / LVR-NFR-07:** any later AI/automation-backed Game Plan or service proposal identifies the selected vendor/model, billing unit, volume/tool-call assumptions, third-party charges, budget alert/stop policy and customer/operator state if budget is exhausted. Acceptance: a worked estimate exposes assumptions rather than inventing ROI; a controlled exhausted-budget case produces an honest degraded/paused state; no paid resource is enabled without authorization. This is a proposal, not added pilot implementation or approved commercial terms.

**Delivery findings:** [PR #8](https://github.com/taitgoodwin-gmail/Levarum/pull/8) remains a draft candidate at `9918e597`; its [CI run](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/37385077656) reports dependency install, tests, build/boundary check and browser install successful, but “Check intake flow and assets” failed. Its README reports missing SVGs and NOT RUN production storage/owner/pilot checks. Classification: verified CI check failure; missing-asset cause is recorded candidate evidence, not independently diagnosed from job logs in this sweep. Main, PR #4 and the operator candidate remain distinct. Do not combine their passes into launch acceptance. Earlier README-only [CI](https://github.com/taitgoodwin-gmail/Levarum/actions/runs/37421230967) passed for `38311aee`; that is mechanical evidence, not product acceptance.

**Blocked checks:** opening the public site through the browser tool failed because the administrator-enforced security policy could not be verified. No browser-security bypass or alternate UI automation was attempted. Desktop/mobile visual review, keyboard interaction, customer submission, private readback and operator follow-through are BLOCKED/NOT RUN for this sweep. Marshland's initially guessed .ai URL failed; the discovered official .software site was read. Search snippets were used for discovery only. No customer feedback, analytics or willingness-to-pay behavior was measured.

**Next checks:** restore permitted browser access and verify the actual selected-design/customer journey; resolve PR #8 asset/release failures in its existing workstream; decide/verify retention, recovery and supplier-exit treatment; review these requirement proposals; then review the first three actual scheduled runs. Keep meaningful alerts for supplier shutdowns, failing release checks and access failures. Reuse these existing sections/watchlist; do not create daily files.

### Latest scheduled sweep 9 October 2026

**Result: PARTIAL VERIFIED; PREPARE → verified documentation, pending review.** Run began at 00:12 Eastern, inside the authorized midnight–06:07 window (earlier than configured 00:15; cadence remains unverified). Work key `levarum-intelligence-loop`; reuse PR #9. Prior 8 October attempts stopped outside the window; no successful sweep is inferred from them.

**Material change — contract drift:** [PR #10](https://github.com/taitgoodwin-gmail/Levarum/pull/10) at `d7c266c5` records the accepted Hand-Off List contract, 15 MVP IDs (11 withdrawn) and 7 NFR IDs. LVR-MVP-10 now requires five moderated digital prototype sessions before pilot opening; broader LVR-MVP-01/03/09 changes wait for that evidence. This branch and main still carry the older proposed contract. Classification: high-confidence repository documentation conflict; approval provenance is recorded in PR #10, not independently reconstructed from owner conversations. Customer impact: avoid shipping the wrong journey or overriding owner gates. Acceptance: reconcile the README against PR #10, preserve its changed acceptance lines and withdrawn ID, and verify the moderated-test gate remains explicit before merge. Dependency/disposition: existing PR #10/#9 reconciliation; no automatic contract replacement or scope expansion.

**Delivery state checked:** open PRs #11–15 add separate print, operator queue, failure/observability, release/data and device/abuse increments. Latest GitHub Actions runs at their reported heads succeed; PR bodies retain hosted, private-store, recovery, keyboard and pilot checks as BLOCKED/NOT RUN. PR #8 remains separate at `9918e597`. Overlapping lead API/schema/README work requires reconciliation; green CI across separate branches does not prove one integrated release. Sources: [open PRs](https://github.com/taitgoodwin-gmail/Levarum/pulls), [Actions](https://github.com/taitgoodwin-gmail/Levarum/actions). No tests or integration build executed by this sweep.

**Market freshness:** re-read the five first-party watchlist URLs above on 9 October. Relay closure, Zapier model-tier usage (article updated 12 August), Make credits, Lindy pricing and Marshland audit/managed-service claims remain consistent with the previously recorded material findings. No new material change established; no new requirement proposed. This is a bounded comparison of recorded facts, not a full-page diff, complete market inventory, measured demand or customer research. Preserve existing-tool-first differentiation under accepted LVR-MVP-03/15; competitor advertised price does not authorize Levarum pricing or prospect-facing billing terms.

**Coverage limits/circuit breaker:** current AGENTS, shared delivery skill, main file inventory, branch README, accepted-contract README, design handoff, open PRs and recent CI summaries read. Browser action remains BLOCKED by the prior administrator-policy verification failure; no changed prerequisite is evidenced, so the permission/configuration retry rule prevents another attempt. Live visual/keyboard/customer submission/private readback/operator follow-through and five-owner sessions NOT RUN. No customer records accessed, Drive writes, new files, merge or deployment. Official OpenAI scheduled-task HTML and GitHub contents guidance consulted; optional OpenAI Markdown fetch failed with unsupported content type, HTML remained accessible.

**Next READY work:** reconcile PR #9 with accepted-contract PR #10; restore permitted browser-policy verification before UI checks; complete the gated moderated test and integrated candidate acceptance in their existing workstreams. Retention choice, recovery destination/drill and distributed policy remain recorded dependencies. First-three-run review remains incomplete. Verify this README through exact committed readback; independent review and production acceptance are NOT RUN.

## Run and check

Requires Node 24.

```sh
npm ci
npm test
npm run build
npm run dev
```

`npm run build` includes the prospect/operator boundary check and TypeScript.
GitHub Actions runs the tests and build on pushes and pull requests.

## Production setup

The Vite client and `api/leads.ts` deploy on Vercel. Create a **private** Blob
store and connect it to the project. The server needs `BLOB_READ_WRITE_TOKEN`
(or the SDK's OIDC configuration, `BLOB_STORE_ID` and platform token).
Use `vercel env pull .env.local` for development; never commit credentials.

The intake endpoint fails closed with 503 if storage is unavailable. It only
confirms a submission after a private write succeeds. No read endpoint is public.

The public site does not load the original operator app or localStorage inbox.
`/api/draft` is disabled. The original design and components remain in the repo
for future authenticated operator work, but are not in the active rendering path.

## Receiving leads

Open this project's private Blob store in the Vercel dashboard:

- `leads/plan/`: saved Game Plan intakes
- `leads/call/`: explicit call requests, including time preferences

Open a record to retrieve the prospect's email and answers. These records are
private: only authorized store administrators can read them. Both paths contain
opaque request identifiers and content hashes, not email addresses.

For the pilot, review call requests manually and reply from **hello@levarum.com**.
Automated email notifications are optional and are **not enabled by merely
setting the contact email**. To enable them, set `RESEND_API_KEY` and
`LEAD_EMAIL_FROM` to a verified sender, redeploy, and verify receipt. Notification
failures do not discard a saved lead. The application does not email the plan;
visitors can print or save it directly from their browser.

## Behavior and protections

- Required business type, hours band, at least one known challenge, valid email,
  and explicit consent, validated on both client and server.
- An 8 KB body limit, honeypot, origin check, and best-effort per-instance throttle.
  Add a platform-wide rate rule before scaling traffic; an in-memory counter is
  not a distributed rate limiter.
- Repeat requests use the same opaque content-addressed path. A retry can update
  the receipt timestamp but cannot overwrite different intake content.
- Internal AI generation is off. No speculative hours or money savings appear.
- No advertising tracking or persistent browser lead store in the public pilot.
- Privacy notice and contact link are available throughout the flow.

## Launch verification

Before accepting traffic, verify an intake and call request from the public URL,
then retrieve those records from private storage. Check mobile layout, invalid
inputs, retry handling, `/privacy`, and that `/api/draft` stays disabled.

The pilot is not a full CRM. Authenticated operator access, plan email delivery,
calendar integration, automated retention, and distributed abuse controls remain
follow-up work. Keep the private store under routine review and handle access or
deletion requests through hello@levarum.com.
