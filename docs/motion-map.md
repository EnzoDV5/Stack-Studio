# Motion map

Every section on every page, its one signature motion and how that motion is triggered.
Keep this file current: any change to a section's motion updates its row here, and the
rules at the bottom must hold for every page.

Trigger types:

| Type      | Meaning                                                                         |
| --------- | ------------------------------------------------------------------------------- |
| `load`    | Plays once when the page is revealed (after the preloader or page wipe)         |
| `enter`   | Plays once when the section scrolls into view                                   |
| `scrub`   | Tied to scroll position, reverses on scroll up                                  |
| `pin`     | The section holds still (GSAP pin or CSS sticky column) while the scroll plays  |
| `hover`   | Pointer or focus interaction only; nothing moves on scroll                      |
| `ambient` | A continuous loop (marquee, video) that doesn't depend on scroll or interaction |
| `none`    | Static                                                                          |

## 1. Audit before the restructure (commit 9ac926b)

### Home

| #   | Section           | Tone   | Opener                   | Motion                                           | Trigger       |
| --- | ----------------- | ------ | ------------------------ | ------------------------------------------------ | ------------- |
| 1   | HomeHero          | dark   | own                      | SplitReveal lines on the h1, showreel video      | load          |
| 2   | TechnologyMarquee | dark   | eyebrow                  | Two opposing CSS marquee rows                    | ambient       |
| 3   | FeaturedWork      | paper  | SectionHeader (stacked)  | MediaReveal clip on 2 cards, hover video preview | enter + hover |
| 4   | ServiceShowcase   | dark   | SectionHeader (stacked)  | Flip stage/rail swap on click                    | hover (click) |
| 5   | ProcessPinned     | paper  | stacked (custom, sticky) | Sticky column, active step, 160vh+               | pin           |
| 6   | PricingTeaser     | dark   | SectionHeader (stacked)  | StaggerGroup rise on 3 cards                     | enter         |
| 7   | StudioSnippet     | paper  | stacked (custom)         | Parallax portraits                               | scrub         |
| 8   | Testimonial       | paper  | eyebrow                  | SplitReveal lines on the quote                   | enter         |
| 9   | ClosingCta        | orange | eyebrow                  | SplitReveal words on the title                   | enter         |

Clashes and repeats:

- The same stacked SectionHeader opens sections 3, 4, 5 and 6 (3→4 and 5→6 adjacent in look).
- SplitReveal runs three times: hero (1), Testimonial (8), ClosingCta (9). 8→9 are adjacent
  and both `enter` line reveals.
- StudioSnippet (7) and Testimonial (8) are both paper: no tone change between them.
- The work sits third, below the marquee, so the first screen shows no work.
- ProcessPinned takes about 1.6 viewports in the middle of the page.
- FeaturedWork (3) and PricingTeaser (6) both fade/rise content on `enter`.

### Work

| #   | Section    | Tone   | Motion                                                        | Trigger       |
| --- | ---------- | ------ | ------------------------------------------------------------- | ------------- |
| 1   | PageTitle  | paper  | Static                                                        | none          |
| 2   | WorkGrid   | paper  | StaggerGroup rise, re-run on every filter change; hover video | enter + hover |
| 3   | ClosingCta | orange | SplitReveal words                                             | enter         |

Clashes: 2→3 both `enter`. The filter change re-runs the rise instead of moving the grid.

### Case study

| #   | Section       | Tone   | Motion                                    | Trigger |
| --- | ------------- | ------ | ----------------------------------------- | ------- |
| 1   | PageTitle     | dark   | Static                                    | none    |
| 2   | CaseMeta      | dark   | Static                                    | none    |
| 3   | CaseNarrative | paper  | FadeUp per chapter, sticky chapter labels | enter   |
| 4   | CaseGallery   | dark   | MediaReveal clip per image                | enter   |
| 5   | CaseMetrics   | dark   | StaggerGroup rise on the numbers          | enter   |
| 6   | Testimonial   | paper  | SplitReveal lines                         | enter   |
| 7   | CaseOutro     | dark   | Magnetic CTA, hover zoom on next project  | hover   |
| 8   | ClosingCta    | orange | SplitReveal words                         | enter   |

Clashes: 3→4→5→6 are four `enter` reveals in a row. FadeUp is used on whole text blocks.

### Services

| #   | Section       | Tone   | Motion                                        | Trigger |
| --- | ------------- | ------ | --------------------------------------------- | ------- |
| 1   | PageTitle     | paper  | Static                                        | none    |
| 2   | StageExplorer | paper  | "What do you need?" index, Websites dropdowns | none    |
| 3   | AppShowcase   | dark   | iPhone turns to face the viewer (frames)      | scrub   |
| 4   | StageExplorer | paper  | Take over, Run, Grow, Partner                 | none    |
| 5   | ProcessPinned | dark   | Sticky column, active step                    | pin     |
| 6   | FaqSection    | dark   | Accordion, sticky heading                     | hover   |
| 7   | ClosingCta    | orange | SplitReveal words                             | enter   |

No adjacent clashes.

### Pricing

| #   | Section            | Tone   | Opener                  | Motion            | Trigger |
| --- | ------------------ | ------ | ----------------------- | ----------------- | ------- |
| 1   | PageTitle          | paper  | own                     | Static            | none    |
| 2   | PricingSummary     | paper  | SectionHeader (stacked) | Static            | none    |
| 3   | PlanTabs           | dark   | SectionHeader (stacked) | Instant tab swap  | hover   |
| 4   | IncludedVsExcluded | paper  | left column             | Static            | none    |
| 5   | RatesStrip         | dark   | eyebrow + title         | Static            | none    |
| 6   | PoliciesList       | paper  | SectionHeader (stacked) | Static            | none    |
| 7   | FaqSection         | dark   | sticky left column      | Accordion         | hover   |
| 8   | ClosingCta         | orange | eyebrow                 | SplitReveal words | enter   |

Clashes: 2→3 use the same stacked opener.

### Studio

| #   | Section             | Tone   | Opener                  | Motion             | Trigger |
| --- | ------------------- | ------ | ----------------------- | ------------------ | ------- |
| 1   | PageTitle           | paper  | own                     | Static             | none    |
| 2   | StudioIntro         | paper  | eyebrow + title         | MediaReveal clip   | enter   |
| 3   | FounderProfiles     | dark   | SectionHeader (stacked) | Parallax portraits | scrub   |
| 4   | ValuesGrid (how)    | paper  | SectionHeader (stacked) | StaggerGroup rise  | enter   |
| 5   | ValuesGrid (values) | dark   | SectionHeader (stacked) | StaggerGroup rise  | enter   |
| 6   | Testimonial         | paper  | eyebrow                 | SplitReveal lines  | enter   |
| 7   | ClosingCta          | orange | eyebrow                 | SplitReveal words  | enter   |

Clashes: 4→5→6→7 are four `enter` reveals in a row; 3→4→5 share the stacked opener.

### Start

| #   | Section   | Tone | Motion                                                 | Trigger                     |
| --- | --------- | ---- | ------------------------------------------------------ | --------------------------- |
| 1   | PageTitle | dark | Static                                                 | none                        |
| 2   | BriefFlow | dark | Step panel fade between questions; success SplitReveal | hover (interaction) + enter |

Clash: the success heading uses SplitReveal on a page whose title does not.

## 2. The map now

### Home

Order, as a story: what the visitor needs, how Stack works, indicative pricing, proof,
client voices and the founders, then the closing band. Measured on the preview build: 11.05 viewports tall at
1440×900 (footer included), 10.79 at 390×844. Heights below are in viewports.

| #   | Section                | Tone   | Opener                | Signature motion                                                                                                                    | Trigger       | Height |
| --- | ---------------------- | ------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| 1   | HomeHero               | dark   | own                   | Statement line-reveal (1 of Home's 2 type moments); the Stack mark sinks with the scroll, behind the next section                   | load + scrub  | 1.00   |
| 2   | PathChooser            | dark   | SectionHeader split   | Horizontal accordion (transform + clip-path, GSAP); rows on mobile. No scroll motion                                                | hover         | 1.22   |
| 3   | ProcessLine            | dark   | SectionHeader minimal | On entry the steps slide in and a playhead sweeps the plan once, drawing the bars; then hovering or clicking a week glides it there | enter + hover | ~1.1   |
| 4   | PricingSnapshot        | paper  | SectionHeader stacked | Three figures count up once, mid-screen                                                                                             | enter         | 1.05   |
| 5   | WorkReel               | paper  | SectionHeader inline  | Arrives full-bleed; pins (the page's only pin), shrinks into a card, then travels sideways                                          | scrub + pin   | 2.85   |
| 6   | ClientVoices           | paper  | SectionHeader stacked | The quote cards rise in one after the other                                                                                         | enter         | ~1.0   |
| 7   | StudioSnippet          | paper  | SectionHeader split   | Portraits drift toward the pointer (hover parallax)                                                                                 | hover         | 0.92   |
| 8   | ClosingCta (app shell) | orange | eyebrow               | Code characters compile into the readable ink title, once, on a timer when the band enters                                          | enter         | ~0.9   |
| —   | Footer (chrome)        | ink    | —                     | None. Not part of the tone flow, so the band above stays orange                                                                     | none          | 0.76   |

Trigger sequence: load + scrub · hover · enter + hover · enter · scrub + pin · enter · hover · enter. No
two neighbours share a type. Openers go inline · stacked · split · minimal · stacked · split.
Every section ends with a "go deeper" link: All work (header row and last panel), See all
the work, All services, The full process, See all pricing, Meet the studio.

**Tone chapters.** Neighbouring sections share a tone, so the page colour changes rarely:
Home dark → paper (work, clients) → dark (paths, process) → paper (pricing, studio), then
the solid orange band (3 changes, was 7). Case study: dark → paper → dark (2). Services:
paper → dark (1). Pricing: paper → dark (plans, scope) → paper (2). Studio: paper → dark →
paper (2). Sections shorter than `tone.minSection` (0.9 viewport) never take over the page
colour, and `solid` sections (the orange band) paint themselves.

**Continuous flow.** `ToneController` makes every `[data-tone]` section transparent and
switches the page colours (`--page-bg`, `--page-fg`, muted, border, accent, grid, surface,
marker, focus) when a section's top crosses the middle of the viewport (`tone.line`): one
short ease-out fade (`tone.switch`, 0.45s) straight from the old tone to the new one. The
colour never follows the scroll position, so there are no lingering in-between colours and
never a mix of three tones. Measured on Home: seven switches of about 0.4s each. A re-measure
while the page is still (a lazy route arriving) lands instantly. Only the sections on screen
and `body`'s own background are written each frame, because a colour variable on `<html>`
would restyle the whole page; `<html>` gets them only on re-measure. Sections
marked `solid` (the hero, page titles) keep their own background. The header follows
the page tone, so it switches exactly when the page colour does (never at section edges, the
orange band or the footer). This is ambient scroll-linked
colour, not a section's signature motion, so it doesn't count toward rule 1.

**Timing.** Enter animations start with the element well on screen (`trigger.start`, top
at 75%; count-ups at `trigger.startLate`, 62%; the process plan at 70%), so they play in full.
Titles compile the moment they're on screen (`trigger.heading`, top at 90%). The WorkReel shrink happens inside its pin rather than while the section slides in, so the
full-bleed image is seen whole first.

**Deliberate deviations.** StudioSnippet's parallax is pointer-driven, not scroll-driven,
so Home's last two sections read hover · enter. `Parallax trigger="scroll"` is still the
default elsewhere. ProcessLine plays on entry and is then driven by hover and clicks (people
couldn't read a week while it followed the scroll). The readout beside it shows an overview
until the first hover, click or arrow key, so the entrance sweep doesn't flick it through
every week. It shares a trigger with both
neighbours (PathChooser's hover, PricingSnapshot's count-up); the plan's own sweep and the
count-up are far enough apart on the page not to read as a repeat. On /work the closing band's compile follows the WorkGrid's `enter` reveals. The
titles used to scrub with the scroll, which felt jittery, and a card grid and one title
are different enough not to read as a repeat.

### Other pages

**Work:** PageTitle (load: compile) · WorkGrid (enter: MediaReveal clip per card, Flip on filter
change) · ClosingCta (enter). One filter per project (`?filter=<slug>`); a filter change
Flips the cards that stay into place instead of re-running a rise.

**Case study:** PageTitle (load: compile) · CaseMeta (none) · CaseDevice (scrub + pin: the page's
one pin) · CaseNarrative (none) · CaseGallery (scrub: parallax) · CaseMetrics (enter:
CountUp) · Testimonial (none) · CaseOutro (hover) · ClosingCta (enter). CaseDevice shows the
project's live site on a laptop (`MacbookScroll`, a GSAP port of the Aceternity "MacBook
scroll"). The lid and keyboard deck are two planes hinged on one edge under a shared
perspective (no preserve-3d scene), so they stay joined: the laptop starts open, seen from
above; the deck folds away as the lid comes upright and the laptop grows until the screen
fills the view; then a full-page capture of the real site scrolls inside the screen, top to
bottom (`macbook.open` + `macbook.perScreen` per screenful). The narrative is static; the gallery uses Parallax.

**Services:** PageTitle (load: compile) · StageExplorer (none: the "What do you need?"
index and 01 Websites) · AppShowcase (scrub: phone turn, 02 Apps and software) ·
StageExplorer (none: 03 Take over, 04 Run, 05 Grow, 06 Partner) · ProcessPinned (pin,
`#process`) · FaqSection (hover) · ClosingCta (enter). The page groups the offer the way
visitors look for it; the five stages stay the model elsewhere. Build splits into websites and
apps (the offerings the brief files under 'website', then the rest), so apps live only beside
the phone. No sticky nav: the index is a row of jump cards at the top. AppShowcase ("Apps and software") is where apps get their own moment, since most
client work is websites: an orange iPhone 17 Pro spins on its upright axis from its back, through its side, to
face the visitor with an illustrative bookings app on screen, scrubbed as it scrolls up
through the view (`phoneTurn`: phone top at 92% to its centre at 50%, 80 evenly spaced frames, cross-faded, eased by `phoneTurn.ease`). It isn't pinned
(ProcessPinned is the page's one pin). The frames are pre-rendered from a 3D model
(scripts/phone) and drawn on a canvas by `ImageSequence`; no 3D library ships. Reduced
motion: the finished pose as a still image. Each group has
its own layout, picked for what it sells (`StageBlock layout`): Websites `feature` (the
intro beside an image, then dropdowns), Take over `cards`, Run `split` (image column
beside a priced list), Grow `figures` (two rates as large figures, no image) and Partner
`tiers`. Each intro is a name and one line (no paragraph). Loops only play while on screen.

**Pricing:** PageTitle (load: compile) · PricingSteps (none) · QuoteStarters (enter:
cards rise) · PlanTabs (hover: Flip card swap) · IncludedVsExcluded (none) · PoliciesList
(none) · FaqSection (hover) · ClosingCta (enter). No fixed price list: ready-made starting
quotes show the range the estimator computes and open /start pre-filled. Openers: minimal ·
split · inline · own · split · own. Everything from the plans down mounts as it approaches.

**Studio:** PageTitle (load: compile) · StudioIntro (enter: MediaReveal) · FounderProfiles (scrub:
parallax) · ValuesGrid "How we work" (enter: MediaReveal on its image) · ValuesGrid
"Values" (none) · Testimonial (none) · ClosingCta (enter).
Openers: split · stacked · inline.

**Start:** PageTitle (load: compile) · BriefFlow (interaction: step transitions, unchanged). The
success heading no longer line-reveals.

**Privacy, 404:** static.

`none` next to `none` is not a clash: the rule is about motion. Sticky navigation aids
(StageNav, the FAQ heading) are layout, not pins.

## 3. Rules

These are also in CLAUDE.md. Check every change against them and update the tables above.

1. **One signature motion per section.** Two neighbouring sections never share a trigger
   type (no scrub after scrub, pin after pin or enter after enter). The app-shell
   ClosingCta counts as every page's last section.
2. **Titles share one code-to-title language.** Every `PageTitle`, `SectionHeader`, custom
   section opener (`<Heading compile>`) and the `ClosingCta` begins as same-size code characters with the title's exact line length, then
   compiles left to right into readable type. It plays once, on a timer, when the heading
   crosses `trigger.heading` (`maskedHeading` tokens, about 0.6–1s): scrolling starts it but
   never drives it, and it doesn't replay on the way back up. Page titles compile as soon
   as the preloader or page wipe lifts. Nothing compiles under the wipe: a title already on
   screen after a route change starts when it's uncovered. The Home hero keeps its line
   reveal. Card titles, legal subheadings, eyebrow labels and the brief's focused step
   heading stay static.
3. **Staggered rises are only for groups of cards or list items**, never headers and never
   whole sections. `StaggerGroup` is used only for the client quote cards and the starting quote cards; FadeUp was removed.
4. **At most one pinned section per page.** Home: WorkReel. Services: ProcessPinned. Case
   study: CaseDevice.
5. **Scroll budget:** Home is about 11 viewports tall on desktop, footer included (it was
   9–10 before the reel's shrink moved inside its pin and the client quotes got their own
   section). The WorkReel pin
   is `reel.shrinkScroll` + `reel.panelScroll` × (panels − 1) viewports.
6. **Only animate transform, opacity and clip-path.** Turn will-change on while something
   moves and off afterwards. Videos play only while visible and needed: the hero's active
   layer, hovered previews and the open service panel.
7. **Vary the openers.** `SectionHeader` has `stacked`, `split`, `minimal` and `inline`
   variants; neighbouring sections never use the same one.
8. **Every Home section ends with a "go deeper" link** (`<TextLink arrow>`) to its full
   page or anchor.
9. **Reduced motion:** no pins, scrubs, Flip or tone flow. Everything renders in its final
   state, and WorkReel becomes a grid.
