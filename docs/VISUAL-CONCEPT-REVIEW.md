# Visual concept review — Levarum

Date: 2026-09-30. Author: senior UX/content agent collaborating with BA and engineering. **Current status: concept and brand selection complete for preview; final production visual approval remains open.** The initial critique and A/B proposals below are retained as decision history. The dated selection closeout at the end records what was actually selected and inspected. No participant-study results are asserted. This document does not replace the existing launch gates.

## Basis and limits

Figma describes hierarchy through alignment, contrast, proximity and scale, with emphasis determined by the user's situation. That supports prioritizing the service offer and meaningful actions before repeated decoration; it does not prove that any proposed composition converts better. [Figma: visual hierarchy](https://www.figma.com/resource-library/what-is-visual-hierarchy/)

Figma's consistency guidance supports stable color, typography, alignment, interaction patterns and voice across related screens, while allowing deliberate emphasis. Apply common foundations to public and owner surfaces, then vary density for their different tasks. [Figma: consistency](https://www.figma.com/resource-library/consistency-in-design/)

For an implementable source, use reusable components, semantic layer names, variables, Auto Layout and behavior annotations; resize frames to inspect their behavior. Preserve code mappings where available. [Figma: structure files for better code](https://developers.figma.com/docs/figma-mcp-server/structure-figma-file/)

Connect representative flows in the prototype, including return and recovery, rather than treating static screens as a complete experience. [Figma: prototyping](https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma)

All exact dimensions, colors, copy, logo choices and concept rankings below are Levarum design decisions or hypotheses. None is a Figma mandate. No GOV.UK guidance was used. Expert/AI agreement is not representative-user research.

## Current baseline critique

The mobile screenshot is legible and orderly, with a compact header, consistent type and a visible primary action. The previous contact gate has been removed. Keep those gains.

| Observation | Consequence to investigate | Correction and validation |
|---|---|---|
| Five nearly identical numbered cards, then three numbered process blocks, create a long repetitive scroll. | The visitor must read many similar-looking blocks to discover what is different. | Replace Home's catalog with compact task rows; give the worked example a materially distinct composition. Inspect 320/390 widths and scan order. |
| The worked example is a large bordered list of four sentences. | It describes a workflow but does not visually distinguish trigger, automatic action, exception or human responsibility. | Draw an editable workflow with explicit exception branch and text equivalent. Ask a reviewer to explain what happens on a disputed invoice. |
| Most labels are all-capital eyebrows, numbers and bold headings. | Visual emphasis is spread across low-value labels instead of service understanding. | Keep one eyebrow per section; use sequence numbers only where sequence matters. |
| Home routes both exploration and ready-to-talk visitors toward the questionnaire. | Someone with a defined task must do unnecessary work before contact. | Provide a direct “Discuss your work” path alongside “Explore ideas.” Both remain available in the header/menu. |
| `IntakeFlow` requires business type and admin hours, but `GUIDANCE` depends only on selected tasks. | Required context creates effort without changing immediate value. | Show task guidance first. Defer context until contact, and require only fields with documented operational use. BA/engineering must specify compatible API behavior before implementation. |
| The Lift mark plus rising arrow resembles a navigation/growth symbol at small scale. | Brand meaning and distinctiveness remain unproven; another arrow appears in the CTA. | Compare wordmark, simplified Lift and connected-work treatments at actual sizes; avoid repeated decorative diagonal arrows. |

This is a screenshot/source review. It establishes neither actual abandonment nor comprehension rates.

## Concept A — Editorial worked example

**Intent:** make a small automation service understandable and tangible before asking for input. Recommended public-site direction.

### Composition and copy

Desktop frame 1440; content 1200; 12 columns with 24 gutters and 120 outer margins. Header 80 high, 24–28px wordmark at left, “Examples”, “How it works”, “Questions” links and rust “Discuss your work” button at right. Theme control remains a compact labeled control. Keep existing routes; “Examples” points to `/what-we-automate`.

Hero is an open composition, not two floating cards: seven columns of type, five columns of a native vector work diagram, 64px gap, 72px top/bottom space. Eyebrow “AUTOMATION FOR OWNER-RUN BUSINESSES”; H1 “Practical automation for the work you repeat.” at 66/68, weight 700, maximum 690px. Body at 19/30: “Levarum helps you connect the everyday steps behind your business—from invoice follow-up to moving information between tools. We start with one task and agree the work before building.” Two actions: solid “Explore a task” and outlined “Discuss a task.” Supporting line: “Explore freely. Share your details only when you want a reply.”

Hero diagram: three native vector/text stations, “A task repeats” → “Agreed rules” → “You handle exceptions.” An open rust line connects the first two; the exception branch uses petrol. No fake app screenshots, software logos, counters, savings claims or animation needed to understand it.

Second section spans the content width on a pale petrol wash: heading “An invoice reminder, with the exceptions built in.” Small label “ILLUSTRATIVE WORKFLOW.” Left third shows the starting task in one short paragraph. Right two-thirds show a concrete flow: “Invoice overdue” → “Check current status” → “Send approved reminder”; branch “Disputed or already paid?” → “Pause and flag for review.” Outcome text: “Routine follow-up follows your rules. Exceptions still reach a person.” Add a single sentence that compatibility and rules are checked before implementation. This replaces the existing four-item framed list.

Below: five compact ruled rows labeled “Invoices and payments”, “New inquiries”, “Customer questions”, “Booking and reminders”, “Moving information.” Each has a 24px title, one sentence, and descriptive link “Explore invoice follow-up”, etc. Do not number them: they are choices, not ranked steps. Mobile rows show title and sentence above the link. Follow with three small engagement steps, one ownership/support paragraph and a closing contact pair. No testimonial placeholder or separate repeated catalog grid.

Mobile 390 frame: 20px margins, header 72, hero H1 42/44, body17/27, 32px section gaps. Hero text/actions precede a 240px-high simplified diagram; no desktop absolute positioning. At320 use 20px margins and H1 36/39. Buttons wrap to full width only when both no longer fit. Worked-example nodes stack vertically with the exception beside its decision text inside the same reading order. No horizontal canvas scrolling.

### Journey

Home → Explore a task → choose one or more tasks → read specific guidance immediately → optionally Discuss these ideas → contact preference/email/context/consent → save → receipt. Home → Discuss your work at `/contact` bypasses exploration and lets the visitor describe their task. Do not invent questionnaire answers to satisfy the present backend. API amendment is an engineering/BA dependency, not a styling workaround.

## Concept B — Task explorer

**Intent:** let visitors learn what automation could mean by selecting a familiar problem immediately. Materially different alternative; recommended utility pattern within `/start`, not the primary marketing shell.

Desktop frame1440, content1200, header72. A short full-width intro uses H1 “What keeps landing back on your desk?” at54/58, followed by “Pick a task. See what could change and what should stay in your hands.” Add an explicit service descriptor: “Levarum is an automation implementation service.”

The main content is one full-width explorer surface, not a two-column marketing hero. Left rail320px contains five native task buttons with brief descriptions; right panel fills the remaining space. Default state has no preselected task and reads “Choose a task to see an example.” Selected state has a small task name, H2, a three-node workflow, and two clearly distinguished sections: “What could change” and “Keep a person involved.” Footer of panel has “Discuss this task” and “Print this idea”. Selection never submits information. Do not call it an assessment or AI analysis.

Mobile: intro at36/40; the five task choices become full-width expandable rows. Selecting one reveals its guidance immediately beneath that row, preserving context and avoiding a long scroll to a detached result. Keep a direct “Discuss your work” link above the list. Multi-task selection is a separate “Compare tasks” capability only if the team finds it necessary; it is not required to make this concept useful. No hidden horizontal tab strip or drag interaction.

Below explorer: a restrained band “Ideas are a starting point. Implementation is agreed with you.” with three short steps and link to service details. This concept uses petrol as the predominant framing color, off-white work surfaces and rust only for contact actions; it feels more like an interactive tool than Concept A.

**Risk:** users may mistake the tool for self-service automation software. The service descriptor and separate engagement information are mandatory mitigations. The interaction and empty/selected states add implementation and accessibility work that Concept A's homepage avoids.

## Shared brand and component specification

Use the existing Schibsted Grotesk display and Instrument Sans body families, avoiding a new font dependency solely for novelty. Tokens: page `#FBF6F2`, ink `#1A1A1A`, quiet `#5C5A56`, action `#8F3D14`, petrol `#2E5C74`, white surface. Dark roles must be explicit: page `#20292D`, surface `#2B3438`, text `#EDE6D6`, quiet `#B9B6B1`, action `#D89879` with dark ink, secondary `#A4BAC1`. Validate actual rendered contrast rather than assuming this palette passes everywhere.

Spacing scale4/8/12/16/24/32/48/64/80. Controls48px minimum height as project target; corners8px, workflow surfaces12px. Large decorative rounding is unnecessary. H1 has the strongest weight; body and navigation remain quiet. Underline ordinary links; reserve solid rust for the key action. Public page intro position, content width, button semantics and field/error behavior remain consistent.

Compare these three logo treatments in the same 1440 header,390 header,16/32 favicon and monochrome sheet:

1. **Wordmark-led (recommended baseline):** Levarum in Schibsted Grotesk700,28px, optical kerning; no adjacent arrow. Favicon is a sturdy L in a solid petrol square with sufficient padding. Do not describe this as custom lettering until outlines have actually been refined.
2. **Refined Lift:** one continuous L/rising shape, no overlapping disconnected arrowheads;32px mark beside24px wordmark,16px favicon simplified to L. Use stroke/shape mass that remains clear when rasterized small.
3. **Connected work:** two offset rounded rectangles joined by one short horizontal connector, a metaphor for linked steps; monochrome,28px mark beside24px wordmark. Avoid a chain-link resemblance by keeping the units solid and distinct. This is a concept to inspect, not an asserted meaning users will recognize.

Shared Figma component sets: Header/Desktop/MobileOpen/MobileClosed; Button/Primary/Secondary/Text with hover/focus/disabled/pending; Field/Default/Invalid; Task/Row/Selected; Workflow/Trigger/Action/HumanCheck; Notice/Info/Error/Success; RequestRow/New/Other; StatusControl/Idle/Saving/Conflict. Named light/dark variable modes; Auto Layout with content-sized text and fill-width sections; actual variants or annotated states rather than unlabeled duplicates. Preserve old pages intact under Historical.

## Owner workspace — deliberate contrast

Public composition is spacious and explanatory; admin should be quiet and efficient. Use the same fonts, colors and controls, with32px page title and compact ruled request rows rather than large marketing cards. On desktop a list/detail layout is a future option, but the existing separate detail route is acceptable and avoids needless routing scope. Show request type, received date, status and reference in the list; private identity fields appear only where authorized data exists. Do not invent list data from the current API.

Toolbar groups type/status filters and refresh. Put recovery synchronization under an explicit “Check for missing requests” maintenance control. Details begin with purpose and reply action, then human-readable answers, then status/history. Mark Booked only after an agreed appointment; state changes send no email. Include filter-empty vs truly-empty, load error, stale conflict with refresh, session expiry, denied and logout-cleared states. On mobile use one column,44–48px controls and no sideways tables. No decorative workflow diagram, giant counts or promotional copy in this workspace.

## Selection and validation

| Criterion | A: editorial worked example | B: task explorer |
|---|---|---|
| Clear service offer | Strong; engagement is explicit | Needs persistent service descriptor |
| Immediate relevant usefulness | Good after one Explore action | Strong after task selection |
| Distinctive character | Stronger opportunity through open diagram and typography | Risks resembling a generic software tool |
| Mobile reading effort | Low if compact rows stay concise | Low for one task; grows with expanded tasks |
| Accessibility/performance complexity | Lower; largely semantic static content | Higher; selection state and focus require care |
| Operator compatibility | Shared tokens, deliberately different density | Shared selection patterns, still requires quieter workspace |

Recommendation: construct both concepts in Figma; choose A for the public narrative and B's task-first pattern for `/start`. This combines separate surfaces with defined jobs rather than placing two competing primary experiences on Home. The primary agent may resolve disagreements after inspecting actual frames. No numerical concept scores or conversion uplift are claimed. BA/UX coordination agrees the action labels “Explore a task” and “Discuss your work”, a direct `/contact` path, optional business context only at contact, and removing weekly hours until an operational use is established. The shorter H1 “Make repeat work easier.” can be compared within the same concept; the service eyebrow and body must still explain what Levarum does.

Minimum prototype frames: A/Home desktop+mobile; B/Home desktop+mobile; selected Explorer empty/selected; contact email/call/validation/pending/failure/receipt; partner form/failure/receipt; owner inbox/detail/conflict/session-ended. Supplement with320px and dark-mode representative frames, logo comparison and component states. Link a complete representative journey; annotations name retained inputs, consent reset, unchanged retry identity and durable-save-only receipt.

Acceptance walkthroughs: rushed mobile owner finds a relevant example without giving email; skeptical consultant explains what is hypothetical and what service is offered; ready-to-talk visitor reaches contact without unrelated required questions; partner understands there is no offer of work; owner finds and replies to a synthetic request, distinguishes call request from booking, and recovers from a stale update. These are test scenarios, not completed participant results. Browser/accessibility/security tests remain separate evidence.


## Selection closeout — 2026-09-30

**Selected for the preview: Concept A’s editorial Home, Concept B’s task-first utility on `/start`, and Wordmark-first branding.** This is the team’s authorized expert selection, not a claim of owner production approval or measured conversion improvement. Original concept dimensions/copy above are historical proposals; current source and QA6 define the implemented composition.

The two materially different concepts remain editable on [concept page16:2](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=16-2): A desktop/mobile16:3/16:4, B desktop/mobile16:5/16:6. A gives a first-time visitor the service offer, illustrative process and human boundary before task selection. B provides immediate relevance once a visitor chooses to explore. Keeping them on separate routes avoids making the marketing page look like software that performs automation itself. Direct contact stays available for visitors who already know what they need.

The final Home headline is “Make room for the work that needs you.” The service explanation, rather than the headline alone, says what Levarum does. Its invoice example has routine, disputed and missing-data scenarios; all are labeled illustrations. Compact task rows replace the repetitive catalog. The explorer chooses one task, shows editorial guidance locally, and does not require business type, hours or contact. These are deliberate departures from the initial proposals for a hero diagram, expandable task rows and possible multiple-task comparison.

### Logo decision and inspected context

The [three-direction board29:35](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=29-35) was inspected again for this closeout. It retains refined Lift, Wordmark-first and Connected work, each in a light header, dark mobile navigation,16/24/32px symbol strip and monochrome lockup.

| Direction | Selection judgment | Tradeoff retained |
|---|---|---|
| Refined Lift | Retain as an alternative. | It preserves continuity, but its familiar rising-arrow motif competes with navigation arrows and can suggest growth/results the service has not demonstrated. |
| Wordmark-first | Selected. | The name is immediately legible and gives the editorial offer room. It is deliberately restrained rather than a highly distinctive standalone symbol; recognition is not measured. |
| Connected work | Retain as an alternative. | The connected-step metaphor fits the work, but at small scale can resemble a generic integration/software icon and imply a software product. |

The selected lockup is [29:25](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=29-25): lowercase **levarum**, Schibsted Grotesk700,30px header,−0.03em tracking;26px footer and28px owner header use the same rule. It is typeset branding, not custom-drawn lettering. `src/ui/core/Logo.jsx` is the authoritative implementation. The selected [symbol29:27](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=29-27) maps to `public/favicon.svg`: a compact L-shaped silhouette with a separated top bar. The earlier proposal of a petrol tile is superseded by this actual unboxed rust/light-theme and pale-rust/dark-theme SVG.

Read-only hosted inspection on the `d3c0a8` candidate used1440px/light and390px/dark, with fonts loaded. The actual header wordmark measured114.33px wide in both contexts versus the116px Figma instance: same type rules, small renderer metrics difference, no clipping or competing adjacent icon. Opening the actual390px menu retains the wordmark and exposes text navigation, theme control and the direct-contact action.

The actual favicon SVG was separately rendered at16px and32px, then as black-on-white and white-on-black silhouettes. The L and top bar remained distinguishable in the inspected raster. This confirms a usable small silhouette in those fixtures, not unaided brand recognition or browser-tab testing across every OS. The retained Figma monochrome board supplies the selected wordmark’s monochrome comparison as well.

Evidence: chat work `work/levarum-reimagination/qa7/` contains matching-width hosted Home screenshots, the actual open mobile menu, `favicon-monochrome.png` and `results.json`; the source SVG and board29:35 supply traceable asset provenance. The [QA7 closeout](REIMAGINATION-DESIGN-QA.md#qa7--matching-width-comparison-and-design-acceptance-closeout-2026-09-30) records the application/Figma differences.

**Stage3 acceptance: achieved for reversible design selection and preview handoff.** Alternatives, qualitative rationale, responsive selected frames, logo context/size/theme/monochrome inspection and source mapping now have explicit evidence. Production visual approval remains a separate owner decision.
