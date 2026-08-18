# Claude Code Brief — Levarum: motion, merge, and real infrastructure

Paste this brief (or point Claude Code at this file) with the repo
`taitgoodwin-ctrl/Levarum` checked out. Work on a branch.

## Context — read first, in this order

1. `REQUIREMENTS.md` (repo root; if absent, the owner will attach it — commit
   it at root as your first commit). It is the requirements log and decision
   record for the whole project.
2. `design/HANDOFF.md` and `design/chats/` — the original design intent.
   **Warning:** the `design/project/MindLever*.dc.html` files are stale, two
   design generations old. The current design truth lives in the owner's
   claude.ai/design project ("Levarum Website Project Aug 18 2026"); the owner
   will export a fresh handoff bundle into `design/` — ask for it if missing.
3. `src/styles/tokens.css` — the old ember-era vocabulary you will migrate.

## The design system you are implementing (current truth)

- **Rust `#8F3D14`** — the 10% accent, commit actions ONLY: primary buttons,
  active nav, focus rings. Never on inline links, badges, or decoration.
- **Petrol `#2E5C74`** — the 30% secondary: links, eyebrows, step markers,
  chips, FAQ accents, card rails.
- **Warm neutral tint ladder** — section rhythm between AND within pages;
  full-bleed dark bands are petrol-ink, never neutral black.
- All derivations `color-mix()` from base tokens; no new hex values.
- Dark theme: a `[data-theme="dark"]` block mirroring `:root`, toggle in nav,
  defaults to `prefers-color-scheme`, persisted on device, pre-paint script
  with NO flash (a black-frame flash on navigation was reported — guard it).
- Every contrast pair WCAG AA in both themes. One commit action per viewport.
- Ember-era token mapping (from the reconciliation pass): `--warm` → page
  ground, `--charcoal` → ink, `--ember` retires as an action colour (becomes
  display/spark only), `--canvas` → tint ladder; go/wait status colours stay
  console-only, re-derived inside the rust/petrol family.

## Workstreams, in order

### 1. Token bridge
Replace `src/styles/tokens.css` vocabulary with the `--lv-*` system (single
source of truth for colour). Add the dark block and theme boot script
(pre-paint, double-bind-guarded). Do not restyle components ad hoc — they
inherit the new tokens.

### 2. Port the public site
Port the five public pages from the design bundle into the React app in visit
order — Home, How it works, What we automate, Questions, Start — preserving:
hours bars on one shared scale, ranked 01–05 card rhythm, use-case
before/after stories, the objection each page kills (see the Journeys map in
the bundle). Re-skin the operator console to the new system. Delete the stale
MindLever files once ported. Keep `npm run check:boundary` passing.

### 3. Motion layer (the reason this handoff exists)
The site must *feel* like automation working, not static pages. All motion
behind `prefers-reduced-motion` with instant-render fallback.

- Scroll-driven reveals (IntersectionObserver or CSS scroll-driven
  animations): sections and cards arrive with intent, hours bars fill on
  first view.
- Spring physics on the hours bars and plan totals (Framer Motion or
  equivalent) — weight, not linear easing.
- View Transitions API between intake steps (Intake → Gate → Reveal →
  Booking) so the three questions feel like one continuous conversation.
- Plan assembly: the revealed Game Plan builds line-by-line with brief honest
  working states ("reading your answers", "sizing the three biggest leaks") —
  never faking capability; timings match real work where real work happens
  (`/api/draft`).
- Conversational pacing on Start: one question at a time, structured inputs.
  Explicitly NOT a free-text chatbot.

### 4. Real infrastructure
- `POST /api/submit`: replace the empty `formEndpoint` — persist submissions
  server-side (Vercel KV/Postgres; keep the localStorage store as the offline
  fallback and for the console's live feed).
- Server-side auth for `/operator` (session cookie against an env credential
  to start; NOT the client-side gate). Keep `/api/draft` working; note
  `ANTHROPIC_API_KEY` in Vercel env.
- Instrumentation: emit the week-one funnel events named in REQUIREMENTS.md
  (home→start rate, gate conversion — server-measured, plan→booking clicks,
  submissions, booked calls).

### 5. Case studies (format only, honest content)
Owner likes the sectionai.com/case-studies pattern: scannable cards, each
leading with a transformation headline + one concrete metric. Build the
section and route with that card format, populated ONLY with the honest
interim proof ("this site runs on the automations it sells") until real
customer results exist. No invented testimonials.

## Definition of done
`npm run typecheck`, `npm run build`, `npm run check:boundary` all pass; both
themes AA; reduced-motion path verified; Vercel preview deploy renders all
routes; a submission made on the preview appears in the operator console and
a status change persists. Open a PR — do not merge to main directly.

## Do not
- Invent colours, testimonials, pricing, or a phone number (all owner
  decisions — see REQUIREMENTS.md gates).
- Ship any motion that ignores `prefers-reduced-motion`.
- Treat `design/project/MindLever*` as current design.
