# Levarum — Requirements Log

Living record of requirements across the design project (claude.ai/design,
"Levarum Website Project Aug 18 2026") and this repo. Append new requirements
under **Backlog** with a date; move them when their state changes.

**The goal every requirement serves:** a skeptical owner-run trades business
books the 15-minute call, and every lead is worked to a conclusion in the
operator console — live on a real domain, with nothing fake left in the chain.

---

## 1. Implemented — in this repo

- Prospect Game Plan flow: Intake → Gate (email unlocks plan) → Reveal → Booking.
- Operator Console at `/operator` (unlinked from prospect surface): SignIn → Inbox → Detail.
- **AI-generated solutions in the portal**: `/api/draft` (Vercel Function) calls
  Claude to draft an approach per submission; shown in operator Detail with
  regenerate; deterministic fallback labelled "Offline draft" when no API key.
- Submission store: on-device, refresh-safe, cross-tab change feed.
- Prospect/operator boundary enforced by `npm run check:boundary`.
- Vercel deploy configuration.
- Single-source brand constant (`src/brand.ts`) after MindLever → Levarum rename.

## 2. Implemented — in the design project (Aug 18, 2026 session)

- Five-page public site: Home v2, How It Works, What We Automate, Questions, Start;
  plus Admin (login gate + submissions inbox, New → Contacted → Booked → Done),
  Journeys (customer + admin decision tree, two tracks one handoff), Flow Map,
  Site Check (master audit: token drift, contrast, spacing/type/radius, 0 broken · 85 passing).
- Colour system: three candidate 60-30-10 schemes scored on AA contrast, CTA
  salience, trades-audience trust fit, secondary headroom. Winner: **deep rust
  (#8F3D14) accent — commit actions only; petrol (#2E5C74) secondary — links,
  eyebrows, markers, chips; neutral tint ladder** for section rhythm. All
  derivations `color-mix()` off existing tokens; `:root` parity across pages
  (100 tokens); every contrast pair AA+.
- Colour discipline: accent never on inline links or badges; one commit action
  per viewport; dark bands are petrol-ink, not neutral black; hours encoded as
  display figures + shared-scale bars, not body copy.
- A11y: landmarks, skip links, labels, alt text, prefers-reduced-motion.
- 390px: no horizontal scroll, ≥44px targets, two real `minmax()` overflow bugs fixed.
- Launch Plan page (Fable strategy pass): phases in dependency order, owners,
  model tiers, reconciliation position, decision gates, funnel stress test,
  week-one instrumentation.

## 3. Open decision gates — owner decisions, block later phases

- Logo mark A (lifted-ground plate) vs mark B (currently everywhere).
- Pricing policy for the cost FAQ (range only the owner can set).
- Recovery for the leave-Home drop-off (no capture/follow-up today).
- "Gone quiet after three tries" policy in the lead workflow.
- Home nav Start + hero CTA: dual rust commit actions in one viewport.
- Auth identity: repo signs in as `operator@levarum.co`; design Admin gate uses
  `owner` / `levarum` — one decision wearing two hats.
- **Phone number**: none anywhere on the site; for a trades audience that is
  disqualifying and it doubles as the gate-drop-off recovery. Needs a real number.

## 4. Reconciliation (design project ↔ this repo)

Position from the launch plan: **repo = deployment vehicle + backend of record;
design project = design system + page source of record.** Merge via an extracted
design-system bridge (token table, component specs, usage rules), mapping
`--lv-*` onto `src/styles/tokens.css` and retiring the ember-era vocabulary.
Port public pages into the React app in visit order; re-skin the operator
console; delete stale `design/project/MindLever*.dc.html`. One source of truth
per file type after the merge; dual-editing is how drift starts.

## 5. Backlog — logged 2026-08-18, not yet implemented

- **National audience, remote-only delivery**: the site must not read local.
  No site visits are offered — the 15-minute call, the build, and the handover
  are all remote. Sweep copy for local framing; make remote delivery an
  explicit reassurance, not a caveat.
- **Implementation-partner track**: an invitation for implementation partners
  to sign up and help think through delivery. Needs its own quiet path (not
  competing with the customer CTA), a partner intake distinct from the Game
  Plan form, a partner lead type in the Admin/Operator inbox, and a partner
  track on the Journeys map.
- **Expanded use cases beyond trades** — appointment-driven small practices.
  Market basis: no-show rates run ~30% in dental (without automated reminders),
  ~27% medical, ~20% salons/barbers, ~18% professional services, ~12%
  veterinary; ~$200 lost per missed physician appointment; automated SMS
  reminders and two-way confirmations recover 34–50%. Curated shortlist, not a
  wall: trades + small medical offices (PT, chiropractic, dental), plus one or
  two more (salon/barber, veterinary). Each use case told before/after in the
  owner's world, ending on the number it gives back.
- **"How it strings together" tech section**: a high-level visual of how the
  pieces connect for a given use case (call → text-back → booking → reminder →
  invoice), naming familiar tools, without exposing prompts, configurations, or
  anything that gives away the build (the trade secrets stay out).

- **Use cases on the public site**: the offer is too conceptual for someone who
  doesn't know what AI can do. Concrete named scenarios per trade (what happens
  today vs what runs automatically), placed in the visit path.
- **Light/dark mode toggle**: dark palette derived from existing tokens, AA
  re-scored, persisted preference, honours `prefers-color-scheme`.
- **AI-draft continuity**: the merged Admin/Operator console keeps the
  `/api/draft` Claude-generated solution draft per lead (repo behaviour), inside
  the rust/petrol design system.
- Motion layer (Claude Code): scroll-driven reveals, spring physics on hours
  bars, view transitions between intake steps; all behind reduced-motion.
- Real form endpoint replacing prototype `formEndpoint`; server-side auth
  replacing both client-side gates.
- Week-one instrumentation: funnel numbers incl. server-measured email-gate
  conversion (settles the soft-gate question with data).
- **Booking tool for the 15-minute call** (owner decision, recommendation
  logged): personal number stays off the site. Google Calendar appointment
  schedules (included with Workspace) = email reminders only, no SMS — and the
  no-show data says SMS is the lever (automated SMS cuts no-shows 34–50%).
  Recommendation: Calendly Standard (~$12/mo) embedded in the Booking step for
  SMS reminders + follow-up workflows now; evaluate Cal.com (API-first, open
  source) at the Claude Code phase for a fully-integrated, self-branded embed.
- **Agentic interaction feel**: the site currently reads static — traditional
  click-through — which undercuts the product. Make the experience demonstrate
  automation: conversational pacing on the intake (one question at a time,
  structured inputs — NOT a free-text chatbot), the plan assembling itself
  line-by-line as if an agent is working, brief working states with honest
  narration. Prototype-feasible pacing now; spring physics and scroll-driven
  motion land in the Claude Code phase. Everything behind
  prefers-reduced-motion; nothing may fake capability the product lacks.
- **Social proof**: the site currently has zero testimonials or named results —
  the biggest psychological gap for a skeptical audience. Until real customer
  results exist, use honest interim proof (the site's own automations as the
  demo); log real results as they land.

## 6. Deployment

- Vercel project: https://vercel.com/tait-2293s-projects/levarum
- Deploys from this repo; `api/draft.ts` runs as a Vercel Function in
  production. `ANTHROPIC_API_KEY` must be set in Vercel env for live drafts.

## 7. Process

- Requirements are logged in this file, in the repo, as they are raised.
- Design decisions are made in the design project and recorded here once settled.
- Model routing: strongest tier for judgment/divergent design and strategy;
  mid tier for checklist execution; fastest for mechanical sweeps.
