# User and operator journeys

Current target: UX correction, 2026-09-30. [Requirements](REQUIREMENTS.md) define acceptance; [traceability](UX-REDESIGN.md) links journeys to evidence. These flows describe the selected implemented design. The redesigned public flows have fresh hosted/local evidence; authenticated redesigned owner interaction remains pending. Exact scope and limitations are in [verification](verification.md#ux-redesign-verification--2026-09-30). Pre-redesign gated flows are [archived](archive/2026-09-30-pre-redesign/WORKFLOWS.md).

## W01 — Understand the service and choose a next step

A busy small-business operator arrives on Home, identifies whether Levarum can help with repetitive administrative work, sees concrete task examples, and can read how the service works. Consistent navigation provides Home, How it works, What we automate, Questions and Partners; the primary action starts the questionnaire. Mobile navigation is compact and explicitly labeled. Theme choice persists. Unknown URLs provide a clear route home. No invented proof, technical implementation detail or unexplained branded term is needed to understand the offer. (R01/R02/R10/R12)

## W02 — Get useful guidance without contacting Levarum

At /start, the visitor selects business type, back-office hours and one or more tasks in one questionnaire. No task is silently selected. Submission validates those answers locally and shows task-specific guidance without email, consent or a network save. The page explains that guidance is a starting point, not a quantified saving or fully assessed plan. Each selected task has a relevant approach, information to gather, and a human-review boundary. No fixed catalog order is described as a personalized priority.

The visitor can edit answers, print/save the guidance locally, leave, or optionally request follow-up. Edit preserves choices; results update after resubmission. Print must exclude navigation, contact forms and unrelated controls. Drafts do not survive refresh by promise. Validation identifies the problem and moves focus appropriately; results/edit transitions focus the new heading. (R03/R05/R06/R12)

## W03 — Optionally request email follow-up or a call

From guidance, the visitor chooses email follow-up or a 15-minute call. Neither is required to access guidance. The form explains what will be stored and why, collects email, and requires an unchecked consent box. Call requests may include availability and timezone. Back returns to guidance without losing answers.

Submit sends /api/leads with intent plan for email follow-up or call for a call request. Disable parallel actions while pending. Only saved:true leads to a saved-request confirmation. Email follow-up confirmation promises manual review, not an automatically delivered plan. Call confirmation explicitly states that no appointment is booked.

Offline, timeout, validation, 429 or storage failure retains entries and offers retry plus hello@levarum.com. Unchanged retries reuse identity; changed content cannot overwrite another request. A saved request remains saved even if optional indexing/notification fails. The owner replies manually, agrees a time/timezone if appropriate, and only then records a call as Booked. (R04/R07/R09/R10/R13)

## W04 — Express partner interest

A potential implementation partner reads who the collaboration is for and submits name, work description, category and email with explicit storage/contact consent. /api/partners privately saves before acknowledgement. Invalid, pending, failure and retry states follow W03. Acknowledgement explains that interest is not an offer of work and terms are agreed separately. Adding another application creates a new request identity. (R08/R09/R10/R12)

## W05 — Review and respond as the owner

Anonymous visitors to /admin see sign-in without records. Clerk verifies the account; each API request requires the immutable configured owner ID, active session and verified exact primary email. A non-owner is denied even if they reach a deep link. The owner filters inbox by request type/status, opens details, understands the request, and uses email to reply. Counts explicitly refer to indexed records; reconciliation recovers missing index entries from durable Blob records.

New, Contacted and Done support all types; Booked applies only to calls. Changing status does not send messages or create appointments. Expected-version conflicts prompt refresh; successful updates and history commit atomically. Logout or session denial clears visible/cached private records. Browser Back must not restore them. Review cadence, recovery and production resource setup are release gates, not inferred from a working preview. (R09/R11; A01–A08)

## W06 — Privacy and operational recovery

The owner receives access/deletion requests at hello@levarum.com, verifies the requester privately, and handles Blob content, database index/history and correspondence consistently. No unimplemented retention/deletion job is promised. Investigate failures with redacted logs. If the owner cannot retrieve leads, pause affected acquisition until recovery; never make storage public to debug it. (R10/R13; A08)

## W07 — Review and release

Maintain the mapping from need → journey → requirement → screen/state → API → verification. Review wireframes, logo contexts and editable responsive Figma screens before coding the selected direction. Review the implemented preview with synthetic data before production replacement. Record remaining limitations honestly; automated audits and AI walkthroughs do not establish real-user usability or screen-reader conformance. Deployment rollback preserves stored customer records. (R01–R14; A01–A08)
