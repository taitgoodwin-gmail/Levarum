# Product and operating workflows

> Implementation checkpoint (2026-09-30): public flows are implemented and browser-tested. Preview Clerk/Neon and isolated private Blob are provisioned; the verified owner ID is bound. Cloud persistence, reconciliation and concurrent status changes pass. Owner inbox/details/status/filter/reconciliation/logout browser checks passed. Production configuration/recovery and remaining negative-session probes remain gates. Production is unchanged. [Verification](verification.md) and [operations](OPERATIONS.md) supersede historical planning-state statements below.


These describe target launch behavior, not completed implementation. Requirements are in REQUIREMENTS.md.

## W01 — Explore and start (R01, R02, R10, R12)

An owner arrives on Home, understands the offer, and can explore How it works, What we automate or Questions. Navigation and footer remain consistent; theme choice persists without storing lead data. “Build my Game Plan” opens `/start`. The FAQ opens and closes using keyboard controls and reports its state. Contact opens hello@levarum.com. A broken or unknown URL presents a route back to Home. No CTA may end at a static prototype file in production.

## W02 — Complete intake and obtain a plan (R03–R06)

Start with explicit business and hours selection; select one or more of five known challenges; continue to the explanation step; review a summary and enter email plus consent. Back navigation retains answers. The email gate is a storage/contact consent point, not a claim of automatic email delivery.

On submit, validate client-side, disable repeat submission while pending and POST to `/api/leads` with intent plan. The server normalizes/validates and saves a private record. Only saved:true advances to the plan. The plan names selected opportunities and the first recommended job, with reviewed estimates if R06 is satisfied. Customers can print/save the plan; delivery by email is not promised.

For missing selections or invalid email, remain on the step and identify the field. For timeout, offline, throttle or storage failure, keep the answers and show a retry action plus contact alternative. Reuse the request identifier for an unchanged retry. Notification failure after a successful save must not misreport the lead as lost. Refresh behavior is explicit: current in-memory draft is not guaranteed to survive refresh.

## W03 — Request and arrange a call (R07, R09)

From a saved plan, the prospect supplies optional availability including timezone, then explicitly submits a call request. Send the accepted intake fields with intent call and preferences. Durable save leads to “Call request received; nothing is booked yet.” No fake calendar slot or invite is shown.

The owner reviews the private call request or receives a verified notification, replies from hello@levarum.com, agrees a time/timezone and sends an invitation through their calendar. Only this agreement creates an appointment. Apple Mail handles correspondence; it is not evidence of a website booking integration. If a real scheduler is later added, document availability, timezone conversion, conflicts, cancellation, rescheduling and webhook retry handling before changing the confirmation copy.

## W04 — Apply as a partner (R08–R10)

Visitor opens Partners, enters name, work description, contribution category and email, and consents to storage/contact. Submit calls the proposed `/api/partners`. Show an acknowledgement only after private save. Resetting the form starts a new request ID. Invalid input, failure, duplicate retry and pending behavior follow W02. The owner receives or retrieves a separate partner-type record and follows up manually; do not promise work or finalized terms merely because the form was accepted.

## W05 — Review and respond to leads (R09, R11; secure UI required)

Launch operation uses the secure dashboard; an authorized Vercel private-store administrator provides a recovery path. Filter by known plan/call/partner path, inspect only relevant records, reply privately and avoid copying personal data into design artifacts. Assign a review owner and cadence before inviting traffic. A synthetic record of each type proves access and follow-up. Notifications, if configured, supplement storage; they do not replace it.

Required admin: unauthenticated visitor sees sign-in without records; server verifies identity and owner authorization; authorized owner sees an inbox and detail; status moves New → Contacted → Booked → Done, with an explicit ability to correct status. “Booked” requires an actual agreed appointment. Each update records actor/time, persists on refresh and rejects unauthorized/stale updates. Expired sessions and sign-out immediately revoke read/write access. Demo seeded records and browser-only authentication do not satisfy this workflow.

## W06 — Privacy and failure operations (R10, R13)

For access/deletion requests to hello@levarum.com, the owner verifies the requester, locates matching records privately, handles copies/notifications consistently and records completion without publishing personal data. Define retention before adding a promise to the notice. If saves fail, do not display success; investigate storage/configuration using redacted logs. Pause affected acquisition routes if the owner cannot receive/retrieve leads. Never solve a storage issue by making the store public.

## W07 — Change, preview and release (R01–R14)

Maintain requirements and the execution plan as the handoff between planning in ChatGPT and implementation in Codex. Work from a branch; connect each change to requirement IDs; update decisions and evidence as they change. Build a reviewable preview using synthetic data and screenshots for desktop/mobile. Review fidelity and functioning journeys before replacing Home. Publish the tested commit, then run public smoke checks and privately verify only the identified synthetic submissions. Record deployment and rollback IDs. If production breaks, restore the last known-good deployment; do not delete leads as part of a rollback.
