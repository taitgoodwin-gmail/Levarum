# Game Plan intake — UI kit

The three-question wizard that is the product's front door, through to a booked call.
One file, five states, all driven by local React state.

| State | What it shows |
|---|---|
| `step1` | Business type select + hours-a-week choice chips, in one card |
| `step2` | Five pain-point check rows, Back + Next, "pick at least one" validation |
| `step3` | What you will get, as three numbered lines |
| `gate` | Two stat cards, a summary of what you told me, and the email ask |
| `plan` | Hours headline, ranked job rows with meters, fix-first block, three call slots and the booked state |

## The one piece of real logic worth keeping

Hours are computed, not faked: each pain carries a `lo`/`hi` range, the total is summed and
then **capped by the band the user picked** for back-office hours, so the plan can never
claim back more time than the person says they spend. The fix-first recommendation is the
largest-range pain, and its `why` is always about sequencing rather than savings.

## Files

- `index.html` — entry point
- `IntakeApp.jsx` — all five states plus the `PAINS` data table lifted from the source

## Differences from the source

The source persists answers to `localStorage` (`levarum.start.v1`), mirrors the route into
the hash, POSTs to an optional `formEndpoint`, and narrates a staged plan reveal
("Reading your answers…", "Sizing the biggest leaks…"). This kit keeps the visuals and the
arithmetic and drops the persistence, the network call and the staged reveal — nothing is
sent anywhere. The source's three voice presets (`plain` / `punchy` / `warm`) are
represented here by the default `plain` copy.
