# Levarum

Back-office automation for owner-run businesses, sold by showing someone their
own week. One short intake turns into two completely separate things: a
prospect-facing **Game Plan**, and an internal **Operator Console** the
consultant works every lead from.

One lever, whole operation.

The single conversion goal is a booked 15-minute call. Email is the gate that
unlocks the plan; the call is the conversion, not the email.

---

## Quick start

```bash
npm install
cp .env.example .env    # then fill in at least OPERATOR_USER / OPERATOR_PASSWORD
npm run dev
```

- Public site: <http://localhost:5173>
- Operator console: <http://localhost:5173/operator>

`npm run dev` runs the whole app — pages, persistence, session and drafting —
on one port. There is nothing else to start.

The console needs `OPERATOR_USER` and `OPERATOR_PASSWORD` set to open at all.
With them unset it refuses every sign-in and says so, which is the safe failure
for an unconfigured deployment.

Without `ANTHROPIC_API_KEY` the app still works end to end: every draft falls
back to a deterministic version derived from the intake and is labelled
**Offline draft** in the console, so nothing is ever presented as generated
when it wasn't.

## Scripts

| Script                   | What it does                                                  |
| ------------------------ | ------------------------------------------------------------- |
| `npm run dev`            | The whole app and API on one port                              |
| `npm run build`          | Typecheck, then production build to `dist/`                    |
| `npm run typecheck`      | `tsc -b` across the app and server projects                    |
| `npm run preview`        | Serve `dist/` (pair with `npm run serve:api`)                  |
| `npm run serve:api`      | Standalone API for non-Vercel hosts or `preview`               |
| `npm run check:boundary` | Fails if the prospect/operator boundary is violated            |
| `npm run check:contrast` | Fails if any token pair drops below WCAG AA in either theme    |

---

## The design system

Rust, petrol, and a warm neutral ladder, in a 60-30-10 split. The tokens in
`src/styles/tokens.css` are the single source of colour and the direct port of
the design project's `--lv-*` system.

| Role  | Token                     | Job                                                        |
| ----- | ------------------------- | ---------------------------------------------------------- |
| 10%   | `--lv-accent` `#8F3D14`   | **Commit actions only**: primary buttons, active nav, focus rings |
| 30%   | `--lv-sec` `#2E5C74`      | Links, eyebrows, step markers, chips, card rails            |
| 60%   | `--lv-rung-1..4`          | The tint ladder that gives sections their rhythm            |

Three rules do most of the work:

- **Rust is never decoration.** Not on an inline link, not on a badge, not on
  a chip. If it is rust, clicking it commits to something.
- **One commit action per viewport.**
- **Full-bleed dark bands are petrol-ink, not neutral black.**

Past the eight brand bases, every colour is a `color-mix()` derivation, so the
light and dark themes cannot drift apart by hand. `npm run check:contrast`
resolves the token graph the way a browser does and fails on any pair below its
AA target in either theme — it caught the first derivation of `--lv-wait` at
4.42:1.

### Dark theme and the flash guard

Dark is a `[data-theme="dark"]` block that mirrors `:root` rather than
filtering it: the ground becomes petrol-ink, the accent lifts off the rust
base so a commit action still reads as one, and every rung is re-derived
against the new ground.

The reported black-frame flash is guarded in `index.html`, not in React. A
script in the `<head>` sets `data-theme` **and** `color-scheme` synchronously
before first paint, so the render-blocking stylesheet resolves the right tokens
on its first pass and the canvas the browser paints behind the page is already
correct. `src/theme.ts` reads that decision rather than repeating it; if the
decision lived in a module loaded with the JS bundle there would be a frame of
the wrong theme on every cold load.

---

## The motion layer

The site sells automation, so a site that sits still is an argument against the
product. `src/motion/` holds the primitives:

- **`useReveal`** — sections and cards arrive as they are scrolled to, once.
- **`useSpring`** — a damped-spring integrator on rAF. Hours bars and totals
  accelerate, overshoot a hair and settle, so a bar reads as a measurement
  being taken rather than a value being tweened. Written here rather than
  pulled in as a dependency: it is forty lines, and the bundle is what someone
  on a phone in a van waits for.
- **`transition()`** — wraps a state change in a View Transition. Named
  elements on the intake (the progress track, the card, the heading) are
  matched across a step change, which is what makes the three questions read
  as one continuous conversation rather than three pages.
- **`usePlanAssembly`** — the Game Plan builds a line at a time.

Two rules hold across all of it.

**Nothing fakes capability.** A working state is only shown while work is
actually happening, and it names the work being done. "Reading your answers"
is held for exactly as long as the `POST /api/submit` is in flight — not a
timer, so a fast network makes it brief, which is correct. The row-by-row pace
is the reader's, because a plan that appears whole is a plan nobody reads. What
it deliberately never says is anything about consulting a model: the drafting
call runs for the operator's console, and narrating it on the prospect's screen
would claim their plan came from somewhere it did not.

**Every piece checks `prefers-reduced-motion` before its first render** and
falls back to the finished state, never to a faster animation. `useReveal`
attaches no attributes at all, so there is no transition to interrupt;
`useSpring` returns the target on its first call; `transition()` skips the API;
`usePlanAssembly` renders the whole plan on frame one with no working state.
The blanket stop in `base.css` catches anything added later without thinking
about it.

---

## The two surfaces

### Public site (`/`)

Six pages, in visit order, each killing one objection:

| Route               | The objection it kills                                     |
| ------------------- | ---------------------------------------------------------- |
| `/`                 | "I don't know what this is or whether it's for me"          |
| `/how-it-works`     | "This is a six-week consulting engagement"                  |
| `/what-we-automate` | "This is vague AI hand-waving"                              |
| `/questions`        | Everything left, the awkward ones included                  |
| `/start`            | — the intake itself                                         |
| `/partners`         | a quiet path for implementation partners, not a second CTA  |

Three structural rules travel as code rather than convention:

- **Hours bars share one scale everywhere.** `src/prospect/content/scale.ts`:
  four hours a week fills a bar. A figure on the home page means the same thing
  as a figure in someone's own plan. A page that rescaled its bars to its own
  biggest number would silently turn a cross-page comparison into a lie.
- **The ranked 01–05 rhythm is data.** The lead card gets both sides of the
  story, 02 and 03 the same shape at less weight, 04 and 05 pair up quietly.
  Something that leaks two hours a week should not look like something that
  leaks four.
- **Every use case is told before/after** in one owner's week, ending on the
  hours it hands back.

The intake is conversational but explicitly **not a chatbot**: one question at
a time with structured inputs — taps and a select, never a free-text box
pretending to understand. The pacing is what makes it read as a conversation;
the structure is what stops it misunderstanding anyone.

### Operator console (`/operator`)

Behind server-side auth, unlinked from the prospect nav. Reads the server lead
list as an inbox.

- **Two lead kinds share one inbox** — a Game Plan request and an
  implementation partner — because one place to work leads beats two. A partner
  carries no draft: there is no intake behind one, and generating a plan for it
  would invent work.
- **Draft approach** written by Claude from the intake answers, badged with
  where it came from, regenerable.
- **Recommended workflow stack** maps each named pain to a real, buildable
  recipe from the operator-only catalog: trigger, ordered steps, tools, build
  effort, monthly cost. Any pain can be swapped to its alternative.
- **The build estimate** derives from whatever stack is currently chosen, and
  is marked *your sizing only, never shown to the prospect*.

---

## The boundary

The two surfaces **share no layout, no component, and no rendering path**. They
share the design tokens, the domain and store modules, and the theme toggle in
`src/components/`. That is all.

`npm run check:boundary` fails if:

1. `src/prospect` imports anything from `src/operator`, or vice versa.
2. A named tool appears under `src/prospect` outside the two reviewed,
   data-only content modules (comments excluded — a comment is not a surface).
3. `src/prospect` imports the operator-only solution catalog.
4. Anything under `src/prospect` carries a `{ tool, action }` step or a
   trigger-plus-steps recipe, however it got there.

**On rule 2**, which used to be an outright ban on tool names: the line moved,
on purpose, and the reasoning is in the script. `REQUIREMENTS.md` §5 asks for a
section that names familiar tools "without exposing prompts, configurations, or
anything that gives away the build", and the design pages do exactly that —
`/what-we-automate` lists the tools each job runs on, and `/how-it-works` walks
seven stations and then says out loud that the wiring is not on the page. For a
skeptical trades audience, "built on tools you already pay for and can cancel"
is the reassurance that makes the offer real.

So the boundary sits where it always belonged. **A tool name is a receipt; the
recipe is the product.** Rule 4 checks for the recipe directly.

`src/App.tsx` picks a surface from the URL and does nothing else. The console's
only inbound link is one quiet footer entry.

---

## Infrastructure

### Persistence

`POST /api/submit` is the record of truth. `server/store.ts` writes to Vercel KV
over its REST API when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set, and to
process memory otherwise — and it **reports which**, so the console says whether
a lead is durable rather than letting anyone assume it. Talking to KV with plain
`fetch` rather than through the SDK keeps the function dependency-free and
cold-starting fast.

The on-device store (`src/store/submissions.ts`) is no longer the record of
truth. It stays for the two jobs it was always best at: an offline fallback so a
submission made on a phone with no signal is not lost, and a cross-tab change
feed so an open console sees a new intake without a reload.

The server stores the intake, not the derived draft — a draft is regenerable, so
persisting one would be storing a cache. `hydrateLeads()` builds the skeleton on
read, and `mergeServerLeads()` keeps a *finished* draft over the skeleton that
arrives with a poll, so a 20-second refresh does not re-run the drafting call
across the whole inbox forever.

### Auth

A signed, HttpOnly, `SameSite=Strict` session cookie, issued only after a
constant-time credential check against the environment, and required by every
read of the lead list. The signature is an HMAC over the expiry, so the server
holds no session table and a stolen cookie expires on its own.

This replaces a client-side gate that was never authentication: it was a boolean
in React state, and anyone who opened the console could set it.

What it is deliberately **not**, yet: multi-user, revocable before expiry, or
rate-limited beyond the constant-time compare. It is one operator and one
credential, which is the shape of the business today. The next step, when there
is a second operator, is a real identity provider — not more of this.

### Instrumentation

`src/analytics.ts` emits the week-one funnel events as `sendBeacon` calls:
`home_to_start`, `gate_view` / `gate_unlock` / `gate_abandon`, `plan_to_booking`,
`submission`, `booking_confirmed`. `/api/events` writes them as structured log
lines — the numbers wanted are counts, and a count needs a log line, not a
pipeline.

Gate conversion is measured at both ends, client and server, because a
client-only number would be quietly wrong for anyone running a blocker — and
that is the number meant to settle the soft-gate question with data.

No third-party script, no cookie, and no identifier beyond an anonymous
per-visit id.

---

## Deploying

Configured for Vercel. Vite is auto-detected, so the defaults build `dist/`.

- **`api/*.ts`** — the endpoints as Vercel Functions. In dev they are mounted
  by a Vite plugin, which does not exist in a static build; without these
  functions the endpoints would simply be absent and the site would look like
  it worked while losing every lead. They read Vercel's pre-parsed request body
  rather than re-reading the stream, which would hang.
- **`vercel.json`** — an SPA rewrite. Every route but `/` is client-side with
  no `index.html` of its own, so without the rewrite they 404 on a fresh visit
  or a refresh. The negative lookahead keeps `/api/*` out of the fallback.

Environment variables to set in the Vercel project:

| Variable                              | Without it                                        |
| ------------------------------------- | ------------------------------------------------- |
| `ANTHROPIC_API_KEY`                   | every draft is the labelled offline draft          |
| `OPERATOR_USER`, `OPERATOR_PASSWORD`  | **the console cannot be opened at all**            |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN`| leads live in function memory and die on cold start |
| `SESSION_SECRET`                      | derived from the password (fine; see `.env.example`) |

Deploying elsewhere needs a Node handler for the API routes (wrap
`server/api.ts` and `server/handler.ts`, both transport-free for this reason)
and an SPA fallback that leaves `/api/*` alone.

---

## Architecture

```
src/
  brand.ts              the product name, in one place
  App.tsx               picks a surface from the URL, nothing more
  router.tsx            nine routes; navigation runs inside a View Transition
  theme.ts              reads the boot script's decision, changes it after
  analytics.ts          the week-one funnel events
  components/           shared by both surfaces (the theme toggle)
  motion/               reveals, springs, view transitions, reduced motion
  domain/               shared vocabulary and maths, no UI
    types.ts            Pain, Draft, Submission, PartnerLead, WorkflowOption
    pains.ts            the five named pains
    catalog.ts          real-tool workflow recipes (operator-only)
    estimate.ts         hours, money, rounding, the deterministic draft
  store/
    submissions.ts      offline mirror, hydration, cross-tab change feed
    submit.ts           the submit client; a lead is never lost
  ai/drafting.ts        calls the app's own endpoint, never Claude directly
  prospect/             the entire prospect rendering path
    content/            page copy and data, ported from the design project
    pages/ components/  the six public pages
  operator/             the entire operator rendering path
server/
  draft.ts              the only code that talks to the Claude API
  api.ts                submit, leads, session, events — transport-free
  session.ts            HMAC-signed cookie, constant-time credential check
  store.ts              Vercel KV over REST, or memory, and says which
  handler.ts            transport-free draft handling
  vitePlugin.ts         mounts the whole API on the dev server
  index.ts              standalone API for other hosts
api/                    the same handlers as Vercel Functions
design/current/         the design source of truth (Aug 18 2026 export)
scripts/
  check-boundary.mjs    the never-reveal boundary, enforced
  check-contrast.mjs    WCAG AA in both themes, enforced
```

### How the Claude layer works

`src/ai/drafting.ts` (browser) posts the intake answers to `/api/draft`, which
`server/draft.ts` handles by calling `claude-opus-5` with a Zod-validated
structured output. **The API key never reaches the browser.**

Claude returns a phased summary and one workflow pick per pain with a
rationale. Every pick is re-validated against the catalog before it is applied,
so an unexpected response can shift wording but can never inject an option that
does not exist. Any failure — no key, rate limit, network, refusal — falls back
to the deterministic draft and labels it.

---

## Design provenance

`design/current/` is the design source of truth: the Aug 18 2026 export from
the claude.ai/design project. The stale `design/project/MindLever*` files, two
generations old, are deleted.

The split, from the reconciliation pass in `REQUIREMENTS.md` §4: **this repo is
the deployment vehicle and backend of record; the design project is the design
system and page source of record.** One source of truth per file type —
dual-editing is how drift starts.

The product was designed as **MindLever** and rebranded to **Levarum**. The name
lives in `src/brand.ts`.

## Open decisions

`REQUIREMENTS.md` §3 lists what is deliberately unresolved here. The two that
show up most in the code:

- **No phone number, anywhere.** For a trades audience its absence is
  disqualifying, and it doubles as the gate drop-off recovery. It needs a real
  number, which is the owner's to provide — inventing one would be worse than
  the gap, because it would look answered.
- **No pricing figure.** The cost answer states a shape — priced per build,
  agreed in writing before work starts — and no number, because pricing policy
  is an open decision and a plausible range here would settle it by accident.

Also open, and not pre-empted by this build: which logo mark ships, the booking
tool (Calendly against Cal.com), and the dual rust commit actions in the home
hero viewport.
