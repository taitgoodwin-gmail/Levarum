# User and operator journeys

Current target: task-first exploration and direct contact, 2026-09-30. [Requirements](REQUIREMENTS.md) and the [v2 contract](LEAD-V2-CONTRACT.md) define acceptance. New source is implemented but fresh tests/deployment remain pending. The [previous questionnaire journeys](archive/2026-09-30-before-task-first/WORKFLOWS.md) and dated verification retain historical results; they are not evidence that this new flow passes.

## W01 — Understand the service and choose a next step

A busy business operator arrives on a service-led Home, recognizes a concrete repeated task and sees how an example could work with human controls. Explore a task leads to /start; Discuss your work leads directly to /contact. Navigation exposes the offer, process and questions without forcing an assessment funnel. Partner and privacy routes remain discoverable. Compact mobile navigation and persistent theme work across pages. A ready prospect can describe unlisted work without selecting an unrelated task. Unknown URLs provide recovery. (R01/R02/R10/R12)

## W02 — Explore one task immediately

At /start, the visitor chooses one of five task buttons. Guidance appears immediately on the same screen: what could change, checks before building and decisions kept with a person. There are no business/hours questions, no submit-to-view gate and no automatic ranking. No submission POST is made. With nothing selected, a clear prompt explains the next action; an optional known task query parameter can select a genuine public task but contains no personal data.

Switching a task updates the announced guidance. Print/save outputs useful guidance rather than navigation/contact controls. Discuss this task opens the contextual ContactRequest in the same tab with the selected task visibly summarized. Back returns to exploration and preserves that tab’s state. Personal drafts remain in memory; refreshing clears them. Guidance is an idea to investigate, not a completed assessment or savings promise. (R03/R05/R06/R12)

## W03 — Discuss directly or from a selected task

/contact works on a fresh direct load and requires no prior exploration. Collect email, a genuine problem description, chosen follow-up purpose and unchecked consent. The description is required when no task is selected; it is optional when contextual contact already supplies a selected task. Business category is optional; weekly hours are not asked. No default category, hours band, task or hidden message is invented. Call availability/timezone is optional. A selected task remains visible when entering from exploration; changing task context or purpose resets consent.

Submit uses POST /api/leads with numeric schemaVersion2. Plan means manual email follow-up; call means a request to arrange a call. The payload omits unspecified business/hours, includes only genuine task/message context, and preserves compatible consent/retry protections. Server validation rejects a request with neither known task nor meaningful message. Pending state locks changes; only saved:true shows the purpose-specific receipt.

Email follow-up receipt confirms private saving and manual review, not an automatically delivered plan. Call receipt states that no appointment is booked; the owner will arrange a time by email. Offline, timeout, 429 or storage failure retains values and offers retry plus hello@levarum.com. An unchanged retry reuses identity. Historical unversioned clients still use the exact legacy contract; v2 does not reinterpret their records. (R04/R07/R09/R10/R13)

## W04 — Express partner interest

A potential implementation partner reads who the collaboration is for and submits name, work description, category and email with explicit storage/contact consent. /api/partners privately saves before acknowledgement. Invalid, pending, failure and retry states follow W03. Acknowledgement explains that interest is not an offer of work and terms are agreed separately. Adding another application creates a new request identity. (R08/R09/R10/R12)

## W05 — Review and respond as the owner

Anonymous visitors to /admin see sign-in without records. Clerk verifies the account; each API request requires the immutable configured owner ID, active session and verified exact primary email. A non-owner is denied even if they reach a deep link. The owner filters inbox by request type/status, opens details, reads human-readable tasks or the actual message, and uses email to reply. Optional business/hours are shown only when genuinely provided or labeled absent; unknown context is never invented. Legacy records without message remain readable. Counts explicitly refer to indexed records; reconciliation recovers missing index entries from durable Blob records.

New, Contacted and Done support all types; Booked applies only to calls. Changing status does not send messages or create appointments. Expected-version conflicts prompt refresh; successful updates and history commit atomically. Logout or session denial clears visible/cached private records. Browser Back must not restore them. Review cadence, recovery and production resource setup are release gates, not inferred from a working preview. (R09/R11; A01–A08)

## W06 — Privacy and operational recovery

The owner receives access/deletion requests at hello@levarum.com, verifies the requester privately, and handles Blob content, database index/history and correspondence consistently. No unimplemented retention/deletion job is promised. Investigate failures with redacted logs. If the owner cannot retrieve leads, pause affected acquisition until recovery; never make storage public to debug it. (R10/R13; A08)

## W07 — Review and release

Maintain the mapping from need → journey → requirement → screen/state → API → verification. Review wireframes, logo contexts and editable responsive Figma screens before coding the selected direction. Review the implemented preview with synthetic data before production replacement. Record remaining limitations honestly; automated audits and AI walkthroughs do not establish real-user usability or screen-reader conformance. Deployment rollback preserves stored customer records. (R01–R14; A01–A08)
