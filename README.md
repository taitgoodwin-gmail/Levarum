# Levarum

One short intake turns into two completely separate things: a prospect-facing
**Game Plan** that sells a discovery call, and an internal **Operator Console**
the consultant scopes and quotes from.

One lever, whole operation.

The single conversion goal is a booked 15-minute call. Email is the gate that
unlocks the costed plan; the call is the conversion, not the email.

---

## Quick start

```bash
npm install
npm run dev
```

- Prospect Game Plan: <http://localhost:5173>
- Operator Console: <http://localhost:5173/operator>

The console is reached by typing that URL. Nothing in the prospect flow links
to it — see [The boundary](#the-boundary) below.

To have Claude write the draft approach, add a key first:

```bash
cp .env.example .env
# then set ANTHROPIC_API_KEY in .env
```

Without a key the app still works end to end: every draft falls back to a
deterministic version derived from the intake and is labelled **Offline draft**
in the console, so nothing is ever presented as generated when it wasn't.

## Scripts

| Script                   | What it does                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| `npm run dev`            | App + draft endpoint on one port                                  |
| `npm run build`          | Typecheck, then production build to `dist/`                       |
| `npm run typecheck`      | `tsc -b` across the app and server projects                       |
| `npm run preview`        | Serve `dist/` (pair with `npm run serve:api`)                     |
| `npm run serve:api`      | Standalone draft API for production or `preview`                  |
| `npm run check:boundary` | Fails the build if the prospect/operator boundary is violated     |

---

## The two surfaces

### Prospect Game Plan (`/`)

Three-step intake → locked result → costed reveal → booking → confirmation.

- **Intake** is seeded with a plausible business so the whole flow clicks
  through without typing. Typing overwrites every seeded value.
- **The gate** shows magnitude without leaking method: the hours figure is
  real and legible, the money figure is blurred, and the recap above it echoes
  the visitor's own answers so the lock reads as *their* plan redacted rather
  than a generic paywall.
- **The reveal** is transparent math, not a claim. Hours × their own hourly
  rate × 4.3 weeks, shown as a rounded range and labelled an estimate. The
  rate slider recomputes it live.
- **Credibility statistics** are deliberately empty `[ stat plus named source ]`
  slots. No percentage or hours figure is hardcoded as fact anywhere.

### Operator Console (`/operator`)

Behind its own internal sign in. Reads the submission store as a live inbox.

- **Draft approach** written by Claude from the intake answers, badged with
  where it came from, regenerable.
- **Recommended workflow stack** maps each named pain to a real, buildable
  recipe from the solution catalog — Claude, Zapier, RingCentral, Cal.com,
  Calendly, Stripe, QuickBooks, HubSpot, Twilio, Make, and others. Each card
  shows the trigger, the step-by-step flow, the tools, build effort, and
  monthly tooling cost. The operator can swap any pain to its alternative.
- **The build estimate** is derived from whatever stack is currently chosen,
  and is marked *your sizing only, never shown to the prospect*.

---

## The boundary

The prospect surface and the operator console **share no layout, no component,
and no rendering path**. They share exactly two things: the brand tokens in
`src/styles/tokens.css`, and the domain and store modules that hold the data.

This is enforced, not just documented. `npm run check:boundary` fails if:

1. `src/prospect` imports anything from `src/operator`, or vice versa.
2. Any named tool from the catalog appears anywhere under `src/prospect` —
   including in comments.
3. `src/prospect` imports the operator-only solution catalog.

`src/App.tsx` picks a surface from the URL and does nothing else: no shared
shell, no nav, no link between them. A prospect is never one tab-switch away
from the console.

**The sign in is simulated in this build** and gates the surface without
authenticating anyone. Replace it with real auth before this goes near
production data.

---

## Architecture

```
src/
  brand.ts              the product name, in one place
  App.tsx               picks a surface from the URL, nothing more
  domain/               shared vocabulary and maths, no UI
    types.ts            Pain, Draft, Submission, WorkflowOption
    pains.ts            the five named pains
    catalog.ts          real-tool workflow recipes (operator-only)
    estimate.ts         hours, money, rounding, the deterministic draft
  store/submissions.ts  localStorage-backed store with a change feed
  ai/drafting.ts        calls the app's own endpoint, never Claude directly
  prospect/             the entire prospect rendering path
  operator/             the entire operator rendering path
server/
  draft.ts              the only code that talks to the Claude API
  handler.ts            transport-free request handling
  vitePlugin.ts         mounts /api/draft on the dev server
  index.ts              standalone API for production
design/                 the Claude Design handoff this was built from
```

### Where the data lives

Unlocking a plan writes a submission record to `localStorage` under
`levarum.submissions.v1`. That store stands in for the database: the console
reads it as an inbox, booking a call flips the record's status, and swapping a
workflow persists. Clearing it re-seeds two example intakes.

Replacing it with a real backend means reimplementing `src/store/submissions.ts`
against an API. Nothing else in the app reads storage directly.

### How the Claude layer works

`src/ai/drafting.ts` (browser) posts the intake answers to `/api/draft`, which
`server/draft.ts` handles by calling `claude-opus-5` with a Zod-validated
structured output. **The API key never reaches the browser.**

Claude returns a phased summary and one workflow pick per pain with a
rationale. Every pick is re-validated against the catalog before it is applied,
so an unexpected response can shift wording but can never inject an option that
does not exist. Any failure — no key, rate limit, network, refusal — falls back
to the deterministic draft and labels it.

The call runs at `effort: 'low'`; choosing between two catalog options and
writing three short phases is a small, well-specified job. Raise it in
`server/draft.ts` if the drafts start reading thin.

---

## Design provenance

Built from the Claude Design handoff in `design/`. `design/project/MindLever Hi-Fi.dc.html`
is the pixel source of truth; the clickable behaviour comes from the prototype
files and transcripts beside it.

The product was designed as **MindLever** and rebranded to **Levarum**. The
name lives in `src/brand.ts`; the design files keep the original name as the
historical record.

Faithful to the design, with two deliberate departures:

- **No simulated iOS status bar.** The `9:41` and battery glyph in the frames
  are device chrome in a mock, not product UI.
- **The console is at `/operator` rather than behind a link on a launcher
  screen.** The prototype's door screen was a prototype launcher; a real
  landing page is prospect-facing, so linking the console from it would break
  the boundary the design is built around.

Everything else matches the frames, including the desktop breakpoints
(840px intake, 920px reveal, 1000px console) and the fixes from the
adversarial design audit: soft ink `#5C5A56` for every muted text, no label
below 12px, and a 44px hit area on the rate slider.
