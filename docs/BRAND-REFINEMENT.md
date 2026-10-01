# Brand refinement — 2026-09-30

Three editable alternatives are available in the [Figma context comparison](https://www.figma.com/design/OWG4WbjbMmMILS4LKHzL6L?node-id=29-35). The older Lift/Flow/Monogram components and review boards remain intact on the same page. This is an expert design comparison, not research with users or trademark clearance.

| Direction | Rationale | Tradeoff | Component references |
|---|---|---|---|
| Refined Lift | An open L and rising stroke retain continuity with the current preview. | The arrow motif is common and can resemble an external-link symbol. | Lockup29:20; symbol29:23 |
| Wordmark first | Gives the name more prominence and suits the quieter editorial layout. | The L favicon has less meaning without repeated exposure; typography alone is less distinctive. | Lockup29:25; symbol29:27 |
| Connected work | Two offset brackets and a join suggest a deliberate handoff. | Can read as a generic software/integration icon. | Lockup29:29; symbol29:32 |

Selected for the next preview implementation: Wordmark first. This is a project judgment based on legibility, fewer competing shapes and fit with the editorial composition—not a Figma/OpenAI prescription or proven preference. The local application now defaults to the lowercase wordmark across public and admin layouts, with a matching L favicon. Explicit legacy variants remain compatible and the supplied originals remain archived. The currently linked8989 deployment still uses earlier Lift until a new preview is recorded.

Component set29:34 has Direction×Format variants. Native vector geometry and native text remain editable; wordmarks share Levarum/Wordmark text style. Color fills bind to existing semantic ink/accent variables; gap binds to space/12. Light and dark contexts inherit the existing theme modes. Main components sit outside review frame29:35. Every direction is shown in a light header, dark mobile navigation,16/24/32px favicon samples and monochrome. This is a logo context board, not a complete navigation interaction specification.

Structural output verified six variants with semantic paint/gap bindings. One composition screenshot exposed default vector outlines; removed those outlines from five vector masters, then inspected the corrected board at1×. No clipped wording or overlapping logo/nav content observed. Local32-test/build/boundary and80-case browser passes follow the implementation. Narrow-mobile/light and desktop/dark screenshots were inspected; no overlap or clipping observed. Owner visual review remains pending. Perceptual recognition and trademark distinctiveness are untested.

Foundation and component organization follow the official Figma materials linked in [UX-REDESIGN.md](UX-REDESIGN.md#authorities-limits-and-open-evidence). Those materials support reusable design artifacts, not the aesthetic choice itself.
