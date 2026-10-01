# Marketing site — UI kit

A click-through recreation of Levarum's public site, composed from this design system's
components. Five screens, routed by hash so every link behaves as it does in the product.

| Route | Screen | Source page |
|---|---|---|
| `#home` | Hero with the example plan, dark problem band, five weeks on a Tuesday, cited figures, honest proof, page links, closing CTA | `Levarum Home v2.dc.html` |
| `#how` | Three numbered steps with their asides, two automation lines, what-you-keep block | `Levarum How It Works.dc.html` |
| `#what` | The five jobs ranked by hours, lead job at full width | `Levarum What We Automate.dc.html` |
| `#questions` | Nine-question accordion, one open at a time | `Levarum Questions.dc.html` |
| `#partners` | Four-field partner form with validation and its sent state | `Levarum Partners.dc.html` |

## Files

- `index.html` — entry point; loads the bundle, the screens, and routes between them
- `Shell.jsx` — nav, footer, partner banner, hash router
- `HomeScreen.jsx` · `HowItWorksScreen.jsx` · `WhatWeAutomateScreen.jsx` · `QuestionsScreen.jsx` (also exports `PartnersScreen`)

## What is real and what is not

Real: hash routing, the business-type select, the accordion, the partner form's validation
and sent state, the theme switch (persisted), the meters filling on scroll-in.

Not real: nothing is submitted anywhere. The Start CTA and both "Build my Game Plan" buttons
open the intake kit at `../intake/index.html`. Copy is lifted verbatim from the source pages.

## Deliberate omissions

The source has no imagery, no testimonials and no pricing page, so neither does this kit.
The RESERVED card on the home page is empty on purpose — that is the design.
