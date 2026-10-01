# UX round 2 — simple service site

Status: ready-to-implement proposal, 2026-09-30. The user rejected the current visual and journey experience, including unnecessary controls and printing an alleged solution. This supersedes the explorer-led presentation as a design direction; it does **not** claim changes are implemented or verified. Preserve earlier designs/source/evidence. No backend contract change is needed.

## Offer and information architecture

Levarum should read as a service someone can hire, with examples that explain the work. The site is not an assessment, automation product or solution generator.

Public structure: **Home → contact → acknowledgement**. Home contains three inline examples, three engagement steps and four practical questions. Header: **Examples**, **How we work**, **Tell us what you need**. The first two links scroll to real Home sections; the final link opens `/contact`. Footer: Partners, Privacy, hello@levarum.com. Keep a simple accessible theme control if both themes remain; it must change the actual theme and retain the preference.

One primary action label throughout: **Tell us what you need**. Secondary action: **See examples**, an ordinary link to `/#examples`, not another tool or assessment.

### Home copy

Eyebrow: **AUTOMATION FOR SMALL BUSINESSES**

H1: **Spend less time on repeat admin.**

Body: **Levarum helps connect the tools and steps behind your everyday work—from following up on invoices to moving information between systems. We agree what to build before work starts.**

Primary CTA: **Tell us what you need** → `/contact`

Secondary link: **See examples** → `/#examples`

No second hero slogan, artificial proof card, “no account needed” selling point, benefit counter or interactive demonstration.

### Examples — `#examples`

Heading: **What could we make easier?**

Intro: **A few examples. We check your tools and process before recommending a change.**

| Example | Today | Possible change | Human control, integrated into the example |
|---|---|---|---|
| **Following up on invoices** (`#example-invoices`) | You check unpaid invoices and write reminders. | Send reminders using agreed timing and wording. | Disputed invoices go to a person before another reminder is sent. |
| **Moving information between tools** (`#example-information`) | You enter the same details in more than one place. | Transfer agreed information between compatible systems. | Failed updates and duplicates are flagged for review. |
| **Keeping track of new enquiries** (`#example-enquiries`) | You check different inboxes and keep track of who needs a reply. | Bring enquiries together and make the next action clear. | A person handles urgent requests and pricing decisions. |

Show all three without a carousel, tabs, scenario radios, task selector or “generate” action. Use plain visual before/after hierarchy. Do not draw fake inputs or buttons inside an example. One section-level **Tell us what you need** link is sufficient; repeated controls on every card are unnecessary. Human boundaries are useful content, not a separate repeated disclaimer panel.

### How we work — `#how-we-work`

Heading: **Start with one task.**

1. **Tell us what happens today.** Describe the task and the tools you use. You do not need to choose new software first.
2. **Check what would help.** We review what could change, what the tools support and which decisions should stay with a person.
3. **Agree the work before building.** Scope, price, access, handover and support are agreed before work starts.

Do not promise a free audit, implementation timescale, fixed price or particular integration. Do not include an illustrative demo as an engagement step.

### Four questions — `#questions`

| Question | Answer |
|---|---|
| **What does it cost?** | We agree the scope and price before work starts. Any additional software costs are discussed as part of that scope. |
| **Can you work with the tools I already use?** | Tell us what you use today. We check compatibility and access before recommending a change. |
| **What happens after I get in touch?** | We review your request and reply by email. If you prefer a call, we arrange a time together. |
| **Who handles changes and support?** | We agree handover, support and responsibility for changes before building. |

Use real native disclosure controls only if collapsing answers improves the layout; four short visible answers are also acceptable. No questionnaire/printing FAQ, fabricated testimonials or placeholder case studies. Link the actual privacy notice at the contact form and footer.

Closing: **Have a task in mind?** / **Tell us what you need**. No duplicate explainer paragraph.

## Contact: one clear request

Page title: **Tell us what you need.**

Intro: **Describe the work you want to make easier. We’ll review your request and reply by email.**

Order and behavior:

1. **What would you like help with?** — required textarea, maximum1000 characters. Helper: **Tell us what happens today and which tools you use. Please leave out passwords, payment information and sensitive client details.** Require a genuine nonblank description even when arriving through an old task link. Do not insert a fabricated default message.
2. **Email** — required, email autocomplete, maximum254 characters.
3. Optional unchecked **I’d prefer a call.** Selecting it reveals **Availability and timezone (optional)**, maximum500 characters, and **We’ll arrange a time by email. This does not book a call.** No slots or assumed15-minute duration.
4. Unchecked required consent: **I agree that Levarum can store these details and contact me about this request.** Link **Privacy notice** with accurate new-tab behavior if used.
5. Submit: **Send request**. Pending: **Sending…**, with the controls disabled. Preserve the existing honeypot, stable retry identity and validation/focus behavior.

Remove optional business category: the free-text task provides useful context without categorizing the visitor. Changing the call preference resets consent; changing a genuine task context does too. Collapsing call preferences must not submit stale availability as email-follow-up data. Drafts remain in memory; retain a quiet **Your draft clears if you refresh this page.** notice near the form rather than foregrounding infrastructure language.

### Receipt and failure copy

Only show a receipt after the existing durable `{saved:true}` acknowledgement.

- Heading: **Thanks — we’ve received your request.**
- Body: **We’ll review what you shared and reply to [submitted email].**
- Call-only sentence: **We’ll arrange a time by email. Your call is not booked yet.**
- Link: **Back to Levarum**. Do not send the person back into an explorer or offer to print a solution.

Do not say an email/plan/invitation was sent. Removing “No automatic email has been sent” from the main receipt does not imply that one was sent: the positive statement remains future email review, with no delivery promise. A stored request is the technical success condition, not the headline of the customer experience.

| Failure | Copy / behavior |
|---|---|
| Offline | **We couldn’t connect. Check your connection and try again. Your details are still here.** |
| Timeout or response that cannot confirm saving | **We couldn’t confirm your request was received. Your details are still here. Please try again.** Do not assert that data was definitely lost. |
| Throttled | **Please wait a moment, then try again. Your details are still here.** |
| Other unsuccessful save | **We couldn’t confirm your request was received. Please try again, or email hello@levarum.com.** |

Keep input and consent, focus the error after pending ends, and make retry the next useful keyboard action. Unchanged retry retains request ID; no receipt appears merely because a button was clicked. These are preserved requirements, not a new verification claim for this design.

## Current → decision table

| Current element | Decision | Why |
|---|---|---|
| Abstract hero plus benefit-heavy aside | **Simplify** to explicit service/one benefit | Explain what can be hired before asking visitors to explore. |
| Explore a task primary CTA | **Replace** with Tell us what you need | Direct access to the actual service; examples remain visible without a funnel. |
| Home invoice scenario simulator | **Remove** | Changes illustrative copy rather than doing useful customer work; disproportionate interaction cost. |
| Home task rows + automation catalog + task explorer | **Consolidate** into three inline examples | Stop repeating the same guidance across multiple destinations. |
| Print or save idea | **Remove** | Static general advice is not a generated solution worth presenting as an output. |
| Business-type selector | **Remove** | No demonstrated need beyond information a genuine task description can provide. |
| Email/call radio section | **Simplify** to optional call preference | Email is the next step either way; preserve deliberate call intent without a separate decision stage. |
| Persistent error/pending/consent controls | **Keep** with plain copy | They perform real validation, privacy and recovery work. |
| Multiple “saved privately/manual review/no automation” passages | **Simplify** and place at relevant moment | Explain what happens next without narrating database mechanics. |
| Separate Partners journey | **Keep**, footer-discoverable | Different audience and actual working intake; no forced inclusion in prospect navigation. |
| Secure separate owner application | **Keep** | Operator capabilities and authorization remain necessary; no demo replacement. |
| Old URLs | **Keep compatible** using explicit mapping below | Existing links should reach meaningful content rather than errors or invented selections. |

## Route compatibility and exact API mapping

Compatibility proposal, to implement and test before claiming complete:

| Incoming route | Intended behavior |
|---|---|
| `/` | New service Home. Existing `#examples`/`#how-we-work`/`#questions` links identify real sections. |
| `/start` with no known task | Redirect to `/#examples`; no default selection or invented context. |
| `/start?task=invoices`, `copying`, or `leads` | Redirect to the matching real Home example anchor above. These are informational legacy entries, not submissions. |
| `/start?task=questions` or `booking` | Redirect to `/contact?task=<same known ID>` with a visible **You’re asking about customer questions / booking and reminders** context and a **Clear topic** action. These two old topics remain genuine rather than being mislabeled as one of the three examples. Message stays required. |
| `/contact?task=<one known task ID>` | Show the actual topic; set that one existing pain ID. Clear topic removes it and resets consent. No query value goes into free text or HTML; ignore unknown IDs. Query contains no personal data. Canonical remains `/contact`. |
| `/what-we-automate` | Redirect to `/#examples`; preserve recognized old example hashes with an explicit map, otherwise use the section start. |
| `/how-it-works` and `/questions` | Redirect to matching Home sections after equivalent useful content is present. No unrelated hash-router behavior. |
| `/partners`, `/privacy`, `/admin…`, public APIs | Preserve functional routes and semantics. |

Use redirects appropriate to the existing application/router, preserving Back behavior and focus at the meaningful destination. Avoid rendering an empty intermediate screen. Cross-route focus, direct loads, malformed query handling and old-link mapping require fresh checks. Redirects are an IA change, not an excuse to break public endpoint compatibility.

No backend schema change:

- Submit to `/api/leads` with numeric `schemaVersion:2`, generated/stable `requestId`, genuine `message`, `email`, `consent:true`, existing honeypot field and `pains` containing zero or one actual known context ID. Omit business/hours; never fabricate them.
- Default call preference unchecked maps to existing `intent:'plan'`; checked maps to `intent:'call'`. The stored name `plan` stays an internal compatibility detail, not a promise to send a plan. Use `preferences:''` for plan and actual supplied availability for call.
- A required message for all new UI submissions is stricter presentation, compatible with current v2 validation. Legacy accepted clients, canonical hashes, private save/index/history behavior and partner API stay unchanged.
- Owner detail continues to show genuine task/message/context and existing request kind. No new “service package,” pricing object or intake type is needed.

## Facts versus proposals

Established operating constraints: public contact hello@levarum.com, owner-only private dashboard, manual email follow-up/scheduling, explicit consent, durable storage acknowledgement and unchanged compatible request types. No actual booking or automatic customer email is performed by the site.

Proposed positioning and design choices: small-business service framing, headline, three example selection, compact Home architecture and simplified contact layout. They are judgments to implement/review, not observed conversion or comprehension improvements. Scope/price/access/support must be agreed before any work; no actual price, delivery period, proven customer result or supported software list is asserted. Do not require new research or another owner questionnaire before producing the concrete revised experience; retain final visual review before production replacement.
