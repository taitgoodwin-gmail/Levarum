# Levarum Design System

Back-office automation for owner-run businesses. This design system is the visual and
verbal source of truth for Levarum's marketing site, its Game Plan intake flow, and the
internal submissions inbox.

---

## 1. The company, in one paragraph

Levarum sells **back-office automation to owner-run service businesses** — trades, dental
and medical practices, salons, agencies, small shops, property managers — anywhere in the
US, delivered entirely remotely. The offer is deliberately small and legible: answer three
questions, get a free **Game Plan** naming the jobs worth handing off first and roughly how
many hours a week each gives back, then a fifteen-minute call with no pitch. Builds take
days, not months, run on tools the owner already pays for, and are handed over with the
logins plus two weeks of fixes.

The product's whole argument is *honesty as differentiation*. The site says out loud that
there are no customer stories yet, labels published industry figures as not-our-results,
leaves a card empty and marked RESERVED where a testimonial would go, and tells you the
admin auth is a prototype that is not secure. Nothing here should ever look like a growth-
hacked SaaS landing page.

**Contact in the source:** hello@levarum.co

### Surfaces represented

| Surface | What it is | Files it came from |
|---|---|---|
| Marketing site | Home, How it works, What we automate, Questions, Partners | `pages/Levarum Home v2.dc.html`, `Levarum How It Works.dc.html`, `Levarum What We Automate.dc.html`, `Levarum Questions.dc.html`, `Levarum Partners.dc.html` |
| Game Plan intake | 3-step wizard → email gate → generated plan → call booking | `pages/Levarum Start.dc.html` |
| Admin inbox | Sign-in, submissions list, New/Contacted/Booked/Done workflow | `pages/Levarum Admin.dc.html` |

### Sources this system was built from

Everything here was read from a **mounted local codebase** attached to this project as
`levarum-design/`. No Figma file, repository URL, or slide deck was provided.

```
levarum-design/
├─ levarum-tokens.css              # v1.0 token set — SUPERSEDED, see note below
├─ levarum-styleguide.html         # v1.0 written style guide (contrast matrix, gaps)
└─ pages/
   ├─ Levarum Home v2.dc.html      # ground truth for the current visual system
   ├─ Levarum How It Works.dc.html
   ├─ Levarum What We Automate.dc.html
   ├─ Levarum Questions.dc.html
   ├─ Levarum Partners.dc.html
   ├─ Levarum Start.dc.html
   └─ Levarum Admin.dc.html
```

The reader of this file may not have that folder. Everything needed is restated here.

> **Two token systems existed in the source. This system follows the newer one.**
> `levarum-tokens.css` / `levarum-styleguide.html` describe **v1.0**: a `--color-*`
> namespace, Poppins + Lora, paper `#F2EDE4`, rust `#BF4F1F` as the single accent, and no
> dark mode. Every built page uses a **later, wider `--lv-*` system**: Schibsted Grotesk +
> Instrument Sans, paper `#FBF6F2`, a deepened action rust `#8F3D14`, petrol `#2E5C74` as a
> genuine secondary, eight brand hues, four background "rungs", and a full dark theme. The
> built pages are the product, so they win. The v1 files are kept in the source folder as
> history and are documented in `guidelines/v1-legacy.md`.

---

## 2. Content fundamentals

### Voice

Levarum is written as **one person talking to one business owner** — first person
singular, second person direct. "I will show you which jobs are worth handing off first."
"I found 3 places your week is leaking time." "If it is not worth building, I will say so."
The plural "we" appears only where the work is genuinely shared ("what we automate", "we
walk the plan together"); the promises are always singular. Never a corporate "we" for the
sake of sounding bigger.

The intake ships three voice presets, all recognisably the same person:

| Preset | Step 2 heading | Primary CTA |
|---|---|---|
| `plain` (default) | Where does the week actually go? | Build my Game Plan |
| `punchy` | What's eating your week? | Show me the hours |
| `warm` | Where does your week go? | Put my plan together |

### Rules the copy follows

- **Plain words over jargon, always.** "Get invoices out and followed up without you", not
  "AR automation". "Copying details between tools by hand", not "manual data entry".
  There is no "leverage", "solution", "seamless", "unlock potential", or "AI-powered".
- **Concrete over abstract.** Claims are grounded in a named Tuesday: a roofer on a ridge
  with both hands full, a bathroom fitter typing an invoice at the kitchen table on Sunday
  night, a woman with no hot water filling in a form at nine at night. Scenarios carry the
  argument; adjectives do not.
- **Hours, never money, as the unit of value.** Time is the currency of every figure:
  "9 hours a week, across three jobs", "about 506 hours a year — roughly 13 working weeks
  handed back". The v1 guide records that a currency field was deliberately *removed* from
  the product.
- **Honesty is a design element, not a disclaimer.** "No customer stories yet. Here is what
  you can check instead." "These are published industry averages, not our results." "An
  estimate from your answers, not a promise." "PROTOTYPE AUTH — NOT SECURE." A reserved
  empty card reads "First client results go here… Left empty on purpose until there is one."
- **Objections are answered, not deflected.** "Will this replace my staff?" → "No, and I
  will say so if that is what you are hoping for." "Why not just buy software?" → "Often
  you should, and I will tell you when off-the-shelf is the answer."
- **Every ask is de-risked in the same breath.** "About 90 seconds. No account, no card."
  "Your answers stay on your device until you unlock the plan." "Four fields, no pitch deck."
- **Full sentences with terminal punctuation, including headlines.** "Get your week back."
  "You did not start this to do admin." "None of it is clever. It just happens without you."
  Contractions are used sparingly — "did not", "does not", "it is" are more common than
  "didn't", "doesn't", "it's". The `punchy` preset is the one place contractions run free.
- **British-inflected plain English with US context.** "Colour" spellings do not appear in
  UI copy, but the register is British-plain ("Mind checking it?", "plenty that is still
  undecided") while the market and figures are US ("anywhere in the US", "$200").

### Casing

- **Headings and titles: sentence case.** "Five jobs that leak the most time." Never Title
  Case, never ALL CAPS at display size.
- **Eyebrows and micro-labels: ALL CAPS**, 13px, `--lv-track-caps` (0.06em) or
  `--lv-track-caps-wide` (0.08em), Schibsted Grotesk 600. `WHAT IT LOOKS LIKE ON A TUESDAY`,
  `FIX THIS FIRST`, `TODAY`, `ONCE IT IS SET UP`, `RANKED BY HOURS GIVEN BACK`,
  `PROOF, HONESTLY`. These carry a surprising amount of the voice — they are editorial, not
  taxonomic.
- **Button labels: sentence case**, verb-first, and they name the outcome: "Build my Game
  Plan", "Unlock my plan", "Put your name down", "Open the intake form". Not "Submit",
  "Learn more", or "Get started".
- **Status labels: single capitalised word** — New, Contacted, Booked, Done.

### Microcopy patterns

- Errors are questions, not scolds: *"That does not look like an email yet. Mind checking
  it?"*, *"Pick at least one, even if none of them is perfect."*, *"A name would help."*
- Onward links are a phrase plus a trailing arrow: *"All five jobs, with a week from each →"*,
  *"See how each one is built →"*, *"Put your name down →"*.
- Field labels are the question a person would actually ask: *"What kind of business is
  this?"*, *"About how many hours a week go to back-office work?"*, *"Where would you plug
  in?"*
- Working states narrate honestly rather than spinning: *"Reading your answers…"*,
  *"Sizing the biggest leaks…"*, *"Putting them in order…"*

### Emoji

**Never.** There is not one emoji anywhere in the source, and none belongs. The only
non-alphabetic glyphs in use are `→`, `✓`, `+`, `–`, and `·` as a separator in eyebrows.

---

## 3. Visual foundations

### The feel, in one line

Warm paper, near-black ink, one rust action colour and one petrol secondary; big tight
sans-serif figures; flat surfaces separated by hairlines and faint colour bands rather than
shadows. It reads like a well-set trade document, not a dashboard.

### Colour

| Role | Token | Value | Use |
|---|---|---|---|
| Page ground | `--lv-page` | `#FBF6F2` | warm paper; the default background everywhere |
| Card surface | `--lv-surface` | `#FFFFFF` | pure white cards sit *on* the paper |
| Ink | `--lv-ink` | `#1A1A1A` | all primary text and the default logo |
| Quiet ink | `--lv-ink-quiet` | `#5C5A56` | body prose inside cards, meta, footers |
| Hairline | `--lv-line` | `#E9E6E1` | 1px borders, band edges |
| Control line | `--lv-line-control` | `#8F8C88` | field and unselected-chip borders |
| **Action** | `--lv-accent` | `#8F3D14` | button fills, focus rings, current-page underline. **One action colour per screen.** |
| **Secondary** | `--lv-sec` | `#2E5C74` (petrol) | eyebrows, chips, meters, selected state, links, accent borders |
| Positive | `--lv-ok` | `#3E6B4A` (forest) | the Booked status only |
| Dark band | `--lv-dark-petrol` | petrol 32% over `#1A1A1A` | the one dark section per page |

The brand palette is eight hues — ink, rust `#BF4F1F`, petrol, forest, plum `#5B4B8A`,
sand `#A67C4E`, slate `#4A5B7A`, teal `#1F5C57`. Rust and petrol do the UI work; the other
five are logo and illustration options, exposed in the source as a `logoColor` control.
Note the distinction the system draws: **brand rust `#BF4F1F` is the identity colour; action
rust `#8F3D14` is the interface colour** — a deeper, darker rust chosen so white 19px
semibold text clears contrast on it.

**Backgrounds are a four-step ladder, not a gradient.** `--lv-rung-1` … `--lv-rung-4` are
petrol mixed into paper at 0 / 5 / 9 / 14%. A long page alternates rungs, each band edged
with a 1px `--lv-line` top and bottom. There are **no gradient fills anywhere** — no
gradient text, no gradient buttons, no mesh or aurora backgrounds. The only gradient in the
source is a 2-stop hard-edged one faking a half-filled dot on the theme toggle.

**Dark mode is a token swap, not a dim.** `[data-theme="dark"]` repaints the page as petrol
mixed 22% into ink, so the dark theme is warm-blue rather than grey. Nothing is achieved
with `opacity`. The choice persists to `localStorage` under `levarum.theme.v1` and defaults
to the OS preference.

### Type

- **Schibsted Grotesk** — display, headings, figures, buttons, eyebrows, labels, numerals,
  mono-ish table IDs. Weights 500/600/700/800; 800 for anything above 30px.
- **Instrument Sans** — body prose, field values, list rows. Weights 400/500/600.
- **Nothing is set in a serif.** (The superseded v1 guide paired Poppins with Lora; the
  built product dropped the serif entirely.)
- Display sizes are **fluid clamps** (`--lv-d-hero` … `--lv-d-7`); UI sizes are **fixed px**
  (`--lv-t-cap` 13 → `--lv-t-xl` 22). Prose floor is 17px, UI floor 14px, 13px only for
  tracked caps.
- **Tracking is aggressive and negative at display size**: −0.04em on the hero, −0.035em on
  h1, −0.025em on card titles, −0.02em on inline titles. Caps go the other way, +0.06 to
  +0.08em.
- **Leading is tight at the top, generous at the bottom**: hero 0.96, h1 1.02, h2 1.06,
  card title 1.15, body 1.55, long prose 1.6.
- Headlines carry `text-wrap:balance`; paragraphs carry `text-wrap:pretty`. Prose is capped
  at 60–62ch; leads at 560px.

### Space and layout

- 1180px page container, 26px (`--lv-s-7`) gutter. Reading pages narrow to 820px, forms to
  760px, sign-in and hero cards to 520px.
- Two spacing scales: fixed component steps `--lv-s-1` (2px) → `--lv-s-9` (54px), and fluid
  section rhythm `--lv-g-1` (22–28px) → `--lv-g-5` (50–78px). Vertical section padding is
  always `--lv-g-5`.
- **Grids are intrinsic, never breakpoint-switched**:
  `repeat(auto-fit, minmax(min(320px,100%), 1fr))`. Two columns become one on their own.
  Explicit breakpoints exist only for the nav stacking at 680px.
- Everything is laid out with flex/grid and `gap`. Nothing floats, nothing is absolutely
  positioned except the skip link. There are **no sticky headers and no fixed elements** —
  the nav scrolls away with the page.
- Minimum touch target 44px; controls are built at 56px (`--lv-tap`).

### Backgrounds and imagery

There is **no photography, no illustration, no icon art, no texture, no pattern and no
noise anywhere in the source.** Not a single `<img>`. Every page is built from type, rules,
solid colour bands and small geometric primitives (circles, bars, dashed left borders).
When a screen needs visual weight it uses a bigger number, not a picture. If imagery is ever
introduced, keep it warm and matte to sit with the paper ground — but the current system's
answer is: no imagery.

### Cards

The card is the workhorse and comes in five treatments:

1. **Standard** — `--lv-surface` white, 1px `--lv-line`, `--lv-r-card` 20px, `--lv-g-1/2`
   padding, `--lv-shadow-sm`. This is the default.
2. **Ranked** — the same, plus a 3px (`--lv-bw-rank`) or 4px (`--lv-bw-rank-lead`) `--lv-sec`
   **left** border. Used only where items are genuinely ordered by size on the "what we
   automate" list. *This is the one place a coloured left border is legitimate — it is a rank
   marker in the source, not decoration.*
3. **Tinted / callout** — `--lv-sec-tint` fill with a 1.5px `--lv-sec` border. FIX THIS
   FIRST, partner banner, admin explainer.
4. **Outlined statement** — no fill, 1.5px `--lv-ink` border. The plan's fix-first block.
5. **Reserved** — 1.5px **dashed** `--lv-line-control`, no fill. Marks something honestly
   absent.

Inside a dark band, cards become `--lv-dark-petrol-surface` with a 1px
`--lv-dark-petrol-line` border and a 2px `--lv-sec-on-dark` **top** border.

### Borders, shadows, radii

- 1px is the resting hairline. **1.5px always means state** — selected, open, or emphatic.
  3–4px on one edge means rank.
- Radii: 8px chips, 13px controls, 20px cards, 50% numerals and dots, 100px pills. No other
  values, and nothing is fully square.
- Two shadows only: `--lv-shadow-sm` `0 10px 30px rgba(26,26,26,.06)` and `--lv-shadow-lg`
  `0 26px 60px rgba(26,26,26,.10)`. Both are wide, soft and nearly invisible — depth comes
  from surface colour, not shadow. There are **no inner shadows and no ring shadows**.
- **No transparency or blur.** No `backdrop-filter`, no glass, no protection gradients over
  imagery (there is no imagery). The one alpha value in the system is the shadow colour.

### Motion

- One curve for nearly everything: `--lv-ease` `cubic-bezier(.2,.7,.2,1)` — a fast start
  easing to a stop. `--lv-ease-lift` `cubic-bezier(.2,.8,.2,1)` for the logo dome.
- Three durations: `--lv-dur-1` 180ms (control state), `--lv-dur-2` 0.5s (fade, disclosure),
  `--lv-dur-3` 0.7s (entrance).
- Four named entrances: `lvRise` (18px up + fade, the standard section entrance, staggered
  70–80ms down the page), `lvFade` (nav band), `lvLift` (the logo dome rising 9px on load),
  `lvOpen` (accordion body). Plus `lvPulse` for the honest "working…" dot.
- **The signature motion is the hours meter.** Every bar starts at 0% and fills to its value
  over 900ms on scroll-in, driven by an `IntersectionObserver` at a 0.3 threshold, once per
  element. Bars share one scale site-wide: 4 hours a week fills a bar.
- Nothing bounces, overshoots, spins, parallaxes or loops. Under
  `prefers-reduced-motion: reduce` every animation and transition is switched off outright,
  not shortened, and the meter script exits before it observes anything.

### Interaction states

| State | Treatment |
|---|---|
| Button hover | fill darkens to `--lv-accent-hover` (action mixed 20% with ink) **and** `--lv-shadow-sm` appears |
| Button press | `translateY(1px)`, shadow removed — it presses *into* the page, it never scales |
| Card hover | border becomes `--lv-sec`, `--lv-shadow-sm`, `translateY(-2px)` |
| Card press | transform and shadow both removed |
| Field hover | border becomes `--lv-sec` |
| Field focus | border becomes `--lv-accent` |
| Quiet link hover | colour only, ink-quiet → `--lv-sec`; no underline appears |
| Focus-visible | 2px solid `--lv-accent` outline, 3px offset, 8px radius — on every focusable thing |
| Disabled | `opacity:.45` + `pointer-events:none`, expressed as `aria-disabled` |
| Selected (chip/row) | fill flips to `--lv-sec` with white text, or white card with a 1.5px `--lv-sec` border |

No opacity fades on hover, no scale transforms, no colour-only state changes (weight or
border always changes too).

### Accessibility habits visible in the source

Skip link on every page. `role="radiogroup"` / `radio` / `checkbox` with `aria-checked` on
the custom choice rows, and Enter/Space handled explicitly. `aria-expanded` on accordions.
`aria-current="page"` in the nav, with weight *and* an underline carrying the state so
colour is never the only cue. `aria-live="polite"` on the plan's working state.
`role="alert"` on validation. Status is always announced in text next to any coloured pill.

---

## 4. Iconography

**There is no icon set in this product, and that is a deliberate position — do not add one.**

What actually exists:

- **The brand mark**, and nothing else drawn. A filled half-dome sitting on a bar: a lever
  resting on its fulcrum, or a load about to be lifted. Two shapes, `viewBox="0 0 64 64"`:
  `<path d="M6 44 A26 26 0 0 1 58 44 Z">` and `<rect x="6" y="52" width="52" height="9">`.
  Always `currentColor`, drawn at 26px in footers and 30px in navs. On page load the dome
  animates up with `lvLift`; the bar stays put. Copied into `assets/mark.svg` (currentColor),
  `assets/mark-ink.svg`, `assets/mark-rust.svg`.
- **Geometric primitives instead of glyphs.** A 26–34px circle with a 1.5px border holding a
  numeral, for steps. An 11px half-filled dot for the theme toggle. A 26px rounded tick box
  holding `✓`. A 32px circle holding `+` / `–` for the accordion. A 2px vertical rule joining
  timeline stations.
- **Text arrows, not chevrons.** `→` is the only directional glyph and it lives in the link
  label itself ("Read the process →").
- **Dashed vs solid left borders as semantic marks.** A 2px dashed `--lv-line-control` left
  border means "today, the broken way"; a 2px solid `--lv-sec` left border means "once it is
  set up". This pairing does the work an icon set usually does.
- **No icon font, no sprite sheet, no SVG library, no PNG icons, no emoji, no dingbats.**
  Tool names appear as **text chips** ("QuickBooks", "Stripe", "Zapier", "Cal.com",
  "RingCentral") — never as vendor logos.

If a future screen genuinely needs a glyph set, match the system's weight before anything
else: 1.5px strokes, round joins, near-square 24px box, no fills — Lucide at
`stroke-width:1.5` is the closest CDN match. Nothing in this system has been substituted for
you; the absence above is real.

---

## 5. Fonts — one thing to confirm

Both families are Google Fonts and the source loads them from Google's CDN, so **no font
binaries were provided and none are vendored here**. `tokens/fonts.css` `@import`s the same
Google stylesheet the product uses:

```
Schibsted Grotesk — 500, 600, 700, 800
Instrument Sans   — 400, 500, 600, italic 400
```

This is not a substitution — it is the same typefaces the product ships. But because the
`@font-face` rules live on Google's server rather than in this project, the design-system
compiler reports **0 fonts**. If you want self-hosted binaries indexed here, drop the
`.woff2` files in `assets/fonts/` and I will rewrite `tokens/fonts.css` with local
`@font-face` rules.

---

## 6. Index

### Root

| File | What it is |
|---|---|
| `styles.css` | the one stylesheet consumers link; `@import`s only |
| `readme.md` | this file |
| `SKILL.md` | Agent Skills entry point |
| `thumbnail.html` | project tile |

### `tokens/`

`fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `radii.css` ·
`elevation.css` · `motion.css` · `layout.css` · `theme-dark.css` · `base.css`

### `guidelines/`

Foundation specimen cards (Colors, Type, Spacing, Brand, Motion) plus
`v1-legacy.md` — the superseded v1.0 token set and style guide, recorded so the
discrepancy is traceable.

### `components/`

| Group | Components |
|---|---|
| `core/` | Logo, Button, LinkArrow, Card, Eyebrow, Pill, Chip, HoursFigure, Meter, SectionBand |
| `forms/` | TextField, SelectField, ChoiceChip, CheckRow |
| `navigation/` | NavBar, ThemeToggle, Footer, ProgressSteps, SkipLink |
| `feedback/` | Accordion, Alert, StatCard |
| `patterns/` | BeforeAfter, TimelineStep, StepNumber, FixFirstCard, OpportunityRow |

Every component family above has a counterpart on a real Levarum page. **Intentional
additions:** none — no primitive was invented to round out the set. Families a design system
usually carries and this one deliberately does **not** (because the product has no use for
them): Avatar, Tabs, Toast, Tooltip, Modal, Breadcrumb, Table, Icon.

### `ui_kits/`

| Kit | Screens |
|---|---|
| `marketing_site/` | Home, How it works, What we automate, Questions, Partners |
| `intake/` | step 1 → step 2 → step 3 → email gate → generated plan → booked |
| `admin/` | sign-in, submissions inbox with the four-status workflow |

### Known gaps, carried over from the source

- Success / warning / info semantics do not exist; forest is used for Booked and nothing else.
- No loading state on primary buttons other than the plan's narrated working line.
- No disabled secondary button.
- No empty, failure or expired-link state on the plan beyond the send-failure card.
- No number input anywhere; the one that existed was removed with currency.
