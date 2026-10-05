# Levarum public pilot

## Selected Figma intake release

Release branch: `feat/figma-intake-launch`. Visual source: [Levarum intake](https://www.figma.com/design/Zi1nn0L1xyQTGuIpxtGl0n?node-id=2019-20198).

The prepared client uses the Figma navy, gold, cream and Quicksand typography. It starts at step 1; business and workload are single-choice groups, recurring jobs are independent multi-select toggles, and Back/Continue/logo preserve in-memory answers. Step 3 opens the plan without collecting contact data. Refresh starts a fresh intake; answers are not stored in the browser.

The plan fills priorities and discovery questions from the selected jobs. Hours and money display “Not estimated from these answers.” The qualitative workload choices cannot honestly be converted to numeric hours or savings. The optional call form asks for actual weekly hours, email and consent, and uses the existing private `/api/leads` contract. It confirms only after `saved: true`. “Book a 15-min call” becomes “Request a 15-min call” to preserve the existing manual scheduling boundary. The header return link restarts the intake at `/`; this release does not port the Figma marketing homepage.

Verification: `npm test`, `npm run build`, and `npm run test:browser`. Browser cases cover desktop (1440px), tablet (800px), mobile (400px), single/multiple selection, deselection, forward/back navigation, answer persistence, logo navigation, keyboard/focus, rendered contrast, overflow and submission failures. Browser submission responses are mocked; these checks do not prove production storage or owner receipt.

Release blocker: original Figma SVG asset downloads return HTTP 403 under the current cloud network policy. The asset-load test fails until all five original assets are downloaded into `public/figma/`. Do not merge or promote this release while that check fails. Preview and production browser verification, plus an actual private-storage round trip, remain NOT RUN. Production has not been changed by this release preparation. Preserve the previous production deployment as the rollback target when this release is shipped.

A short intake produces a practical Game Plan and an optional request for a
15-minute conversation. Scheduling is handled manually by Levarum through
hello@levarum.com. The site never claims an appointment has been booked.

## MVP contract

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
