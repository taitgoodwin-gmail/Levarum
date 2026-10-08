# Levarum public pilot

A short intake produces a practical Hand-Off List and an optional request for a
15-minute conversation. The live site still calls the list a "Game Plan" until the
LVR-MVP-03 change below ships. Scheduling is handled manually by Levarum through
hello@levarum.com. The site never claims an appointment has been booked.

## MVP contract

**Status:** accepted by the owner for build on 7 October 2026. Updated that day to the v4 offering spec (owner decisions 1 to 7; the spec is in the owner's Drive, "Levarum_Offering spec (decisions, requirements, metrics)_2026-10-07_v4"). Requirements marked **Changed** or **New** are not yet implemented. Build order: LVR-MVP-01, 03 and 09 wait for the five-owner test (LVR-MVP-10); everything else may start now. This section defines the smallest complete Levarum release to validate with a real pilot. Existing implemented behavior is not automatically accepted merely because it exists.

### Core user journey

Small-business owner → provides minimum business context and consent → receives a useful Hand-Off List → optionally requests help → request is durably stored → Levarum can retrieve and act on it → the user receives an honest confirmation of what happened and what did not happen.

### MVP requirements

**LVR-MVP-01 — Capture the minimum useful context**

A small-business owner can provide the minimum information needed to identify repetitive operational work without a sales call.

Acceptance:
- business type, weekly back-office-hours band, at least one challenge, valid email, and explicit consent are collected;
- missing or invalid required data is rejected clearly;
- the flow works without requiring an account or payment;
- **Changed:** the intake also asks which paid tools the owner runs and whether each tool's AI or reminder feature is switched on, which two systems they retype things between, and whether the phone is answered live;
- **Changed:** clinic, legal and accounting selections receive an honest "not in our first version" message.

**LVR-MVP-02 — Persist the intake safely**

The product confirms an intake only after the validated request has been durably stored in the intended private production store.

Acceptance:
- a successful response is returned only after the private write succeeds;
- storage failure does not produce a false success;
- repeat submissions are handled deliberately without overwriting different content.

**LVR-MVP-03 — Deliver immediate customer value**

After a valid intake, the customer receives a useful, understandable Hand-Off List tied to the submitted challenges. **Changed:** the artefact is renamed from "Game Plan".

Acceptance:
- the plan identifies concrete opportunities or next questions;
- it does not invent savings, ROI, delivery timing, or implementation certainty;
- the customer can print or save the plan;
- degraded/AI-unavailable behavior remains useful and honestly labeled when AI is used;
- **Changed:** for each selected challenge the list shows what the owner's existing tool already says it does (named tool, as the vendor's own claim), what Levarum would build, what Levarum will not automate, and how the time would be counted;
- **Changed:** no numeric hours or dollar figure appears on the prospect surface in any mode; the `lo`/`hi` values in `src/domain/pains.ts` are removed or fenced behind a documented operator-only flag with a source note;
- **Changed:** the printed or saved list keeps the next step and the contact address (the current print rule hides both).

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
- no public read endpoint exposes private submissions;
- **Changed:** the new fields from LVR-MVP-09 (assessment choice, fee stated, yes or no) and LVR-MVP-12 (minute counts) render in the operator view.

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
- **Changed:** intake, Hand-Off List, the assessment step (LVR-MVP-09), call request, confirmation, privacy, and error states are verified at representative desktop and mobile sizes;
- focus order and keyboard completion work for the core journey;
- no critical content or action is clipped, hidden, or unreachable.

**LVR-MVP-08 — Complete one real production pilot** (**Changed:** two stages)

One real participant can complete the end-to-end journey in production and Levarum can receive, process, and respond using the intended operating process.

Acceptance:
- production submission and retrieval are verified end to end;
- customer and operator assistance, defects, elapsed effort, and exceptions are recorded;
- the pilot result distinguishes product behavior from manual rescue;
- the result informs the next product/commercial decision without claiming broader market validation;
- **Changed:** the pilot has two stages, each with its own done-check: stage 1 is the website journey end to end with one real owner; stage 2 is that owner's first build and the start of Operate (LVR-MVP-13, 14);
- **Changed:** the participant is a home-services or trades owner;
- **Changed:** the pilot does not open until LVR-MVP-10 has run;
- **Changed:** the pilot record adds the participant's answer to "What would you do next with this?" and the two-week minute count (LVR-MVP-12).

**LVR-MVP-09 — Offer the paid Hand-Off Assessment at the next-step screen** (**New**)

After the Hand-Off List, the owner can request the credited, fixed-fee Hand-Off Assessment as an alternative to, or alongside, the free 15-minute call, and the choice is stored.

Acceptance:
- the assessment is described by what the owner receives (the report's contents) and by its turnaround;
- no fee, price band or billing rule, including the credit-against-build rule, appears on the site (owner rule, 7 October 2026: the site does not give the details of how Levarum bills); the screen says the assessment is a paid step and that Levarum gives the fee in the follow-up, before the owner commits to anything;
- there is no setting to show the fee on the site;
- the owner's choice (free call, assessment, both, neither) is stored on the call-request record as one field;
- after the follow-up, the operator records on the same record the fee stated and whether the owner said yes or no;
- no payment is taken on the site in the pilot; the confirmation states that Levarum will follow up with the fee and that nothing is booked or charged yet;
- no hours or dollar savings figure appears anywhere in the offer copy.

**LVR-MVP-10 — Run the five-owner printed-list test before the pilot opens** (**New**)

Five real home-services or trades owners are each handed the printed list and asked one question: "What would you do next with this?"

Acceptance:
- five owners, none known to Levarum or MindLeverX as a prior client, each with a recorded business type and ticked challenges;
- each answer recorded verbatim and coded "call you", "nothing", or "I already have this in [named tool]";
- the log is kept as one row per owner in a private Google Sheet in the owner's own Levarum Drive folder, never in the website store;
- the pilot (LVR-MVP-08) does not open until all five records exist;
- the result is reported as counts, with no claim beyond the five.

**LVR-MVP-11 — Withdrawn**

Withdrawn by the owner on 7 October 2026, before it was built. It asked for a public page carrying the refusal list and the ownership statement. The public site does not set out how Levarum runs its business or how it bills. The number is not reused.

**LVR-MVP-12 — Publish the counting method and count before claiming** (**New**)

Levarum publishes how it counts time saved and writes no number for any client until a two-week count of the owner's minutes on one task has been taken.

Acceptance:
- the method page states what is counted, over what period, and what is not counted;
- the pilot record stores the owner's intake hours band and the counted minutes side by side;
- any figure later shown to a prospect prints its assumptions next to it;
- the `lo`/`hi` bands are not used as inputs to any displayed figure.

**LVR-MVP-13 — Deliver the pilot build inside client-owned accounts with the review step and consent controls** (**New**)

The first build runs in the client's own accounts, holds no credentials, card data or PHI in Levarum's store, starts in approval mode, and carries the disclosure and opt-out controls.

Acceptance:
- the client is the sender of record for every outbound message; Levarum holds no sending account in its own name for that client;
- every sending step is in approval mode at handoff, and a written list records which steps the owner has released;
- any SMS step passes every SMS consent item (S1 to S15 in spec section 11) before a text is sent;
- email steps lead with the transactional content and carry the client's name, postal address and opt-out where the message is commercial;
- conversational interactions carry an "automated assistant" label;
- no card number, CVV or PHI enters any Levarum-controlled system; payment is by hosted link only;
- a signed data-processing addendum is in place before data moves;
- at handoff the client holds all credentials and a one-page "who fixes what" sheet.

**LVR-MVP-14 — Attach Operate to every Assessment and every build** (**New**)

Operate (run, watch, fix) is required with every build for a first period of three months; the Operate scope and monthly price are stated in every Assessment report and on every build quote.

Acceptance:
- the Assessment report uses one fixed template whose fourth heading is "What we would run for you each month";
- the report is drafted from the owner's intake answers and reviewed by a person before it is sent;
- every build quote shows the Operate scope, the monthly price, the length of the first period and that the owner can stop when it ends;
- each lead workflow exists as one build template that is configured, not rebuilt, for each client;
- the monthly offer is made only after the Assessment has mapped the business, never before;
- no monthly price or other billing term appears on the public site.

**LVR-MVP-15 — Partner names, logos and commissions** (**New**)

Levarum may show the logos of the technologies it works with under a label such as "Representative technologies", follows each vendor's brand rules, claims no partnership or title the vendor has not given it, and takes no commission from any vendor it names.

Acceptance:
- logos appear only under a "Representative technologies" (or similar) label, never as "partners"; the four named for now are RingCentral, Zapier, Anthropic and OpenAI (owner decision, 7 October 2026: permission is held);
- each logo or badge is used only as that vendor's brand rules allow, with written approval where required;
- the word "partner" and any badge appear only where the vendor's program gives Levarum that title or badge; Levarum never says it is authorized, certified, approved or endorsed by a vendor unless the vendor's program gives it that title;
- no "Powered by Claude" claim appears until a build runs on Claude;
- Levarum takes no commission, referral fee or other payment from any vendor whose product it names;
- the Hand-Off List starts with what the owner's existing tool already says it does;
- the client holds the vendor account; Levarum refers or sets up and does not resell seats in its own name unless the agreement says it may;
- for each vendor, a record is kept of who gave permission and when, the brand rules read, and each approval received.

### Proposed technical / NFR requirements

**Status:** written in the 2 October production-engineering gap pass; accepted by the owner for build on 7 October 2026, each within its own gate. These requirements make production constraints explicit; they do not authorize implementation beyond the accepted pilot scope or invent numerical SLA, retention, rate, or recovery targets.

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
- **Changed:** the classes added by LVR-MVP-09 and 12 (assessment choice with fee stated and answer, minute counts) are in the explicit retention list; the five-owner test log (LVR-MVP-10) is kept outside the website store;
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
