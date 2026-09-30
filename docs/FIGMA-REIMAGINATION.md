# Levarum: Figma-led reimagination brief

Date: 2026-09-30. Status: research and proposed design direction; no new Figma frames, application changes or Lighthouse measurements claimed at this checkpoint.

## Source policy

The user rejected GOV.UK as a UI/UX design reference. Do not use it to justify future Levarum design decisions. Retain historical work as provenance. Use Figma primary guidance for visual composition/prototyping, Google Chrome/web.dev for technical web experience, and W3C for accessibility criteria. These sources do not establish that a particular brand or sales journey is effective.

## Readings and application

- Figma visual hierarchy: https://www.figma.com/resource-library/what-is-visual-hierarchy/ — arrange emphasis around what visitors need to understand and do. Apply to the offer, concrete workflow demonstration and next action; avoid equally weighted repeated cards.
- Figma consistency: https://www.figma.com/resource-library/consistency-in-design/ — cohesive colors, typography and alignment, with deliberate exceptions for emphasis and user needs. Public storytelling and operator workspace should share foundations without identical density.
- Figma libraries: https://www.figma.com/best-practices/components-styles-and-shared-libraries/ — reuse named components/styles. Specify actual button, form, navigation and feedback states rather than disconnected attractive screens.
- Figma Auto Layout: https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout — content-aware sizing and nested layout. Test long labels, error text, narrow widths and both themes; a desktop screenshot is insufficient.
- Figma prototypes: https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma — connect full flows for iteration and testing. Include exploratory prospect, ready-to-contact prospect, partner and owner.
- Google responsive composition: https://web.dev/learn/design/macro-layouts — meaningful content order before larger-screen arrangements. Preserve reading order when layouts rearrange.
- Google Lighthouse: https://developer.chrome.com/docs/lighthouse/overview — performance, accessibility, SEO and technical diagnostics. Scores cannot validate persuasion, brand preference or complete usability.
- Google Web Vitals: https://web.dev/articles/vitals — field targets at the 75th percentile: LCP <=2.5s, INP <=200ms, CLS <=0.1, assessed separately for mobile/desktop. Lighthouse navigation runs do not measure real-user INP; TBT is a lab proxy. No field pass without field data.

## Reimagined direction — hypothesis

A warm, precise automation studio. Make the work visible and understandable before asking visitors to navigate a questionnaire. Strong editorial hierarchy, restrained color, a distinctive wordmark/mark relationship, and an illustrative workflow showing trigger, automated action, human checkpoint and outcome. Use representative examples explicitly labeled as illustrations, never fabricated customer evidence. Motion is optional explanatory enhancement with a static/reduced-motion equivalent.

Proposed homepage order: concrete offer and two intent paths; one worked example; concise range of supported tasks; scope/working relationship; questions and next action. Candidate copy: “Practical automation for the work you repeat.” Candidate actions: “Explore automation ideas” and “Discuss a task.” These are copy hypotheses, not approved final labels. Do not imply Levarum is a self-service automation SaaS product.

Explore task-first guidance versus the existing questionnaire. Challenge every required field: remove or defer fields that do not affect the displayed guidance, subject to documenting compatibility with the existing API before coding. Ready-to-contact visitors should have a direct route. Preserve consent, private durable storage, retry identity and truthful request receipts. Owner work centers on finding a request, understanding intent, deciding next action and recording status; no invented email integration.

The current Lift logo is a candidate, not a settled brand. Compare refined Lift against a wordmark-led direction and a connected-work symbol, each at favicon, mobile and desktop sizes, in both themes.

## Execution sequence and acceptance

1. Baseline: retain exact source and current screenshots; run Lighthouse on the actual application, not Vercel protection. Record version, URL, viewport, throttling, run count and raw reports. Three comparable mobile/desktop runs; report median and range. Private dashboard reports stay local and synthetic-only.
2. Design exploration: create two materially different editable homepage directions in the existing Figma file on new labeled pages. Include desktop/mobile, real copy, workflow illustration and logo contexts. Compare hierarchy, distinctiveness, clarity, navigation effort and implementation cost. Existing frames stay historical.
3. Journey prototype: connect explore-to-guidance, direct contact, partner and operator flows, including edit/back/error/success. Reconcile BA requirements, content and API contracts before implementation.
4. Design system: reuse or deliberately revise existing variables and native component instances. Define type scale, spacing, semantic colors, focus/error/pending states and motion behavior. Inspect screenshots and editable node structure.
5. Implementation: use selected reference; preserve backend security/storage contracts. Compare matching browser/Figma widths and document justified differences. Refresh the requirements-to-journey matrix.
6. Validation: repeat API/type/build/boundary tests and browser journeys; compare Lighthouse baseline versus candidate under the same conditions. Aim for mobile lab performance >=90 as a project target, not proof of UX quality. Resolve actionable accessibility failures and manual checks independently of aggregate score. No score-target changes that break useful interactions.
7. Review and release: deliver preview, source-linked findings, screenshots and Figma alternatives. Owner visual review and existing production/security gates remain. Real-user comprehension and actual assistive-technology tests must be labeled unverified until conducted.

## Current checkpoint

Completed: official-source review, revised design rationale, concept and execution plan. Pending: new Lighthouse baseline, new Figma alternatives, selection, implementation and verification. The existing tested preview remains unchanged.


## Concept construction checkpoint

2026-09-30: new Figma page `16:2` preserves earlier designs. Concept A desktop `16:3`, mobile `16:4`; concept B desktop `16:5`, mobile `16:6`. Native editable text, vectors, button/logo component instances, existing semantic variables and Auto Layout are used. Structural inspection reports no image-filled nodes in inspected A desktop/B mobile; fonts are Instrument Sans and Schibsted Grotesk. Initial screenshot exposed horizontal sizing and duplicate wordmark defects, corrected and inspected again. These are concept compositions, not complete interactive prototypes.

BA/UX recommend A for public service storytelling and B as the task-first exploration utility. Add an illustrative exception-aware workflow demo and a route for unlisted tasks. Direct contact requires a documented additive API contract rather than invented business/hour answers. Logo alternatives and full interaction/state annotations remain outstanding.
