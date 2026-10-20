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
| 6   | StudioSnippet     | paper  | stacked (custom)         | Parallax portraits                               | scrub         |
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

| #   | Section         | Tone   | Motion                                        | Trigger |
| --- | --------------- | ------ | --------------------------------------------- | ------- |
| 1   | PageTitle       | paper  | Static                                        | none    |
| 2   | StageExplorer   | paper  | "What do you need?" index, Websites dropdowns | none    |
| 3   | AppShowcase     | dark   | iPhone turns to face the viewer (frames)      | scrub   |
| 4   | DesktopShowcase | dark   | MacBook opens and turns, once (frames)        | enter   |
| 5   | StageExplorer   | paper  | Fix or improve: illustration assembles, idles | enter   |
| 6   | ProcessLine     | dark   | Timeline enters and responds to hover         | enter   |
| 7   | NextSteps       | dark   | Four step cards deal out of a pile into a row | scrub   |
| 8   | FaqSection      | dark   | Accordion, sticky heading                     | hover   |
| 9   | ClosingCta      | orange | SplitReveal words                             | enter   |

No adjacent clashes.

### Pricing

| #   | Section      | Tone   | Motion                                 | Trigger |
| --- | ------------ | ------ | -------------------------------------- | ------- |
| 1   | PageTitle    | paper  | Heading compiles                       | load    |
| 2   | HowItWorks   | paper  | Video reveal and three editorial steps | enter   |
| 3   | MonthlyPlans | dark   | Partner stack mark spreads on hover    | hover   |
| 4   | PoliciesList | paper  | Static                                 | none    |
| 5   | FaqSection   | paper  | Accordion                              | click   |
| 6   | ClosingCta   | orange | SplitReveal words                      | enter   |

### Studio

| #   | Section             | Tone   | Opener                  | Motion                                                  | Trigger       |
| --- | ------------------- | ------ | ----------------------- | ------------------------------------------------------- | ------------- |
| 1   | PageTitle           | paper  | own                     | Static                                                  | none          |
| 2   | StudioIntro         | paper  | eyebrow + title         | Illustration assembles                                  | enter         |
| 3   | FounderProfiles     | dark   | SectionHeader (stacked) | Parallax portraits                                      | scrub         |
| 4   | ValuesGrid (how)    | dark   | SectionHeader (stacked) | MediaReveal on its image                                | enter         |
| 5   | StackDiagram        | dark   | SectionHeader (split)   | Build filter lights the spine; tools open their details | hover (click) |
| 6   | ValuesGrid (values) | paper  | SectionHeader (minimal) | Icons assemble in turn; they hop on hover               | enter         |
| 7   | Testimonial         | paper  | eyebrow                 | SplitReveal lines                                       | enter         |
| 8   | ClosingCta          | orange | eyebrow                 | SplitReveal words                                       | enter         |

StackDiagram (the stack as seven layers along a spine) is driven by the visitor: picking a
build slides the pill highlight (clip-path) and filters the diagram to the layers and tools
that build uses: the tools that stay glide to their new place and the ones that return pop in
(GSAP Flip, transforms only); logos hop on hover (squash, jump,
land) and, from tablets up, show their name above; hovering, focusing or tapping a tool lights
the layers it touches and fills the side panel (a bottom bar on small screens). CSS only, off
with reduced motion. The Values icons are `IllustrationScene`s that assemble one after another
as the list crosses the middle of the screen (the arrows ring keeps turning, the pencil
sketches, the path's stops and the eye pulse) and hop and tilt on hover. Clashes: 6→7→8 are all
`enter`; 3→4 share the stacked opener.

### Start

| #   | Section   | Tone | Motion                                                 | Trigger                     |
| --- | --------- | ---- | ------------------------------------------------------ | --------------------------- |
| 1   | PageTitle | dark | Static                                                 | none                        |
| 2   | BriefFlow | dark | Step panel fade between questions; success SplitReveal | hover (interaction) + enter |

Clash: the success heading uses SplitReveal on a page whose title does not.

## 2. The map now

### Home

Home leads with the visitor's need, then shows the services and the way a project runs before
the work, client voices and founders. It stays a summary; full offer and process detail live
on their pages.

| #   | Section                | Tone   | Opener                | Signature motion                                                | Trigger      |
| --- | ---------------------- | ------ | --------------------- | --------------------------------------------------------------- | ------------ |
| 1   | HomeHero               | dark   | own                   | Statement line reveal and showreel                              | load + scrub |
| 2   | PathChooser            | dark   | SectionHeader split   | Horizontal accordion; technology marquee along the bottom       | hover        |
| 3   | ServicesSnippet        | paper  | SectionHeader stacked | Static editorial service rows                                   | none         |
| 4   | ProcessSnippet         | dark   | SectionHeader minimal | Vertical rail and markers reveal as the steps enter             | enter        |
| 5   | WorkReel               | paper  | SectionHeader inline  | Full-bleed entrance, then the page's only pin and sideways reel | scrub + pin  |
| 6   | ClientVoices           | paper  | SectionHeader stacked | Quote cards rise in sequence                                    | enter        |
| 7   | StudioSnippet          | paper  | SectionHeader split   | Portraits drift toward the pointer                              | hover        |
| 8   | ClosingCta (app shell) | orange | eyebrow               | Code compiles into the title on entry                           | enter        |

ProcessSnippet keeps the summary to four steps. The vertical rail and markers reveal once
on entry using transform and opacity. With reduced motion, the complete timeline is visible.
Each chapter has a link to its full page. The technology strip remains below PathChooser.

**Tone chapters.** Neighbouring sections share a tone, so the page colour changes rarely:
Home dark (hero, paths) → paper (services) → dark (process) → paper (work, clients, studio),
then the solid orange band. Case study: dark → paper → dark (2). Services: paper → dark → paper → dark (the
device showcases, then fix or improve and the plans, then the FAQ). Process: paper → dark (next
steps, timeline) → paper (terms, care, FAQ) (2). Studio: paper → dark →
paper (2). Sections shorter than `tone.minSection` (0.9 viewport) never take over the page
colour, and `solid` sections (the orange band) paint themselves.

**Continuous flow.** `ToneController` makes every `[data-tone]` section transparent and
switches the page colours (`--page-bg`, `--page-fg`, muted, border, accent, grid, surface,
marker, focus) when a section's top crosses the middle of the viewport (`tone.line`): one
short ease-out fade (`tone.switch`, 0.45s) straight from the old tone to the new one. The
colour never follows the scroll position, so there are no lingering in-between colours and
never a mix of three tones. A re-measure
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

**Illustrations.** The three line illustrations (Services Fix or improve, the WorkReel's
closing card, Studio "Who we are") are `IllustrationScene`s: clip-path cut-outs of one image
(`media.*.pieces`) that sit hidden, then fly, pop, grow and draw into place once, in time (not
with the scroll), and idle while on screen. They are not scrubbed: the studio asked for them to
play as a moment. `trigger="center"` (the default) plays when the illustration crosses a thin
band across the middle of the screen; `trigger="visible"` (the WorkReel card) waits until it is
fully in view, which is the end of the pinned reel on desktop and the last swipe of the mobile
carousel. IntersectionObserver sees where they really are, sideways reel included. Nothing
assembles under the preloader or page wipe (`useIntro().ready`).

**Deliberate deviations.** On /services the phone turn (AppShowcase) and the laptop
opening (DesktopShowcase) are neighbours and both scrubbed: the studio asked for both devices
to follow the scroll. They read as a pair rather than a repeat: mirrored layouts (phone right,
laptop left), different devices and different motions (a spin, a lid opening). StudioSnippet's parallax is pointer-driven, not scroll-driven,
so Home's last two sections read hover · enter. `Parallax trigger="scroll"` is still the
default elsewhere. ProcessLine (on /process) plays on entry and is then driven by hover and
clicks (people couldn't read a week while it followed the scroll). The readout beside it shows
an overview until the first hover, click or arrow key, so the entrance sweep doesn't flick it
through every week. It sits between the scrubbed NextSteps and the static PoliciesList, so it
shares a trigger with neither neighbour. On /services the Fix or improve illustration plays once (an enter) right after the laptop,
also an enter: the studio asked for every illustration to play as a moment at the middle of the
screen, and the two read differently (a device opening, a drawing assembling). On /work the closing band's compile follows the WorkGrid's `enter` reveals. The
titles used to scrub with the scroll, which felt jittery, and a card grid and one title
are different enough not to read as a repeat.

### Other pages

**Work:** PageTitle (load: compile) · WorkGrid (enter: MediaReveal clip per rounded card, Flip on filter
change) · ClosingCta (enter). One filter per project (`?filter=<slug>`); a filter change
Flips the cards that stay into place instead of re-running a rise.

**Case study:** PageTitle (load: compile) · CaseMeta (none) · CaseDevice (scrub + pin: the page's
one pin) · CaseNarrative (none) · CaseGallery (enter: MediaReveal; scrub: parallax) · CaseMetrics (enter:
CountUp) · Testimonial (none) · CaseOutro (enter: MediaReveal; hover: next project) · ClosingCta (enter). CaseDevice shows the
project's live site on a laptop (`MacbookScroll`, a GSAP port of the Aceternity "MacBook
scroll"). The lid and keyboard deck are two planes hinged on one edge under a shared
perspective (no preserve-3d scene), so they stay joined: the laptop starts open, seen from
above; the deck folds away as the lid comes upright and the laptop grows until the screen
fills the view; then a full-page capture of the real site scrolls inside the screen, top to
bottom (`macbook.open` + `macbook.perScreen` per screenful, times `macbook.portraitScroll` on
portrait screens, where the laptop is small). The narrative is static; the gallery
reveals before its Parallax drift.

**Services:** ServicesHero (load: compile) · StageExplorer (MediaReveal on framed images and video: 01 Websites) · AppShowcase (scrub: phone turn, 02 Apps and software) ·
DesktopShowcase (scrub: the laptop opens, 03 Desktop software) · StageExplorer (none: 04 Fix or
improve) · MonthlyPlans (hover: the Partner card's stack mark spreads its layers, 05 Hosting and
care) · FaqSection (click) · ClosingCta (enter). The page groups the offer the way
visitors look for it; the five stages stay the model elsewhere. Build splits into websites (the
offerings the brief files under 'website'), desktop software (listed in `servicesContent`,
beside the laptop) and apps (the rest, beside the phone), so nothing repeats. A transparent,
viewport-height section rail follows progress and moves the current title beside its marker. The
page introduction is outside the count. Each marker
reveals its own label on hover or focus; below 1280px it becomes a menu, and it fades out past the
last section. No project prices on the page (the brief
gives the estimate); each build service's dropdown opens the brief with it picked
(`/start?type=<id>`). The plan cards in Hosting and care are the one place plan prices appear.
AppShowcase ("Apps and software") is where apps get their own moment, since most
client work is websites: an orange iPhone 17 Pro spins on its upright axis from its back, through its side, to
face the visitor with an illustrative bookings app on screen, scrubbed as it scrolls up
through the view (`phoneTurn`: phone top at 92% to its centre at 50%, 80 evenly spaced frames, cross-faded, eased by `phoneTurn.ease`). It isn't pinned
(the page has no pin). The frames are pre-rendered from a 3D model
(scripts/devices) and drawn on a canvas by `ImageSequence`; no 3D library ships. Reduced
motion: the finished pose as a still image. DesktopShowcase mirrors the phone: a large MacBook on the left (it bleeds off the page edge),
the copy and offerings on the right. As it scrolls through the view (`laptopTurn`: laptop top
at 85% to its centre at 42%, 72 evenly spaced frames, cross-faded) the lid lifts from shut,
the display wakes on an illustrative stock and orders app and it turns to face the copy. Each group has
its own layout, picked for what it sells (`StageBlock layout`): Websites `feature` (the
intro beside an image, then dropdowns), Fix or improve `figures` (one spread: the intro, the
examples as pills and the CTA beside a large illustration). The illustration is an
`IllustrationScene`: clip-path cut-outs of the one image (`media.services.fixOrImprove.pieces`)
fly, pop, grow and draw into place once it crosses the middle of the screen, then idle while
on screen (side cards float, the refresh arrows spin, the plant sways, the
dashed slot and dots pulse). Reduced motion: the plain image. Hosting and care is the MonthlyPlans cards (Website Care, Managed Software
and Partner). Framed images and video reveal on
scroll; loops only play while on screen.

**Process:** PageTitle (load: compile) · NextSteps (scrub: the step cards deal out) ·
ProcessLine (enter + hover: how a project runs, week by week) · PoliciesList (none) ·
CareSteps (enter: one care video) · FaqSection (click) · ClosingCta (enter). Openers: split ·
minimal · split · own · own. NextSteps shows what happens once someone gets in touch, shown
rather than told, in the studio's real order: the brief (with a real
estimate from the "Launch website" starting quote) lands in the inbox, we reply by email with
times to meet, we meet in person or online, then the fixed quote (with its warranty, staging and
ownership ticks). Four cards side by side (one row from xl, two by two below), each with the step above its
small interface; the interfaces line up across the row (subgrid). On desktop they start as a loose, tilted pile in the middle and deal out
into their row as the section scrolls in (`stepsDeal`, transforms only). The section opens the
page, already on screen, so its start is clamped to the top and the pile is whole on arrival; on phones and with
reduced motion they sit in order. CareSteps (on /process) pairs an editorial headline with a video and three numbered steps
on how ongoing care runs, then links to the plans on /services. The video plays
only while visible and stays on its poster with reduced motion.

**Studio:** PageTitle (load: compile) · StudioIntro (enter: the illustration assembles at the middle of the screen) · FounderProfiles (enter:
MediaReveal; scrub: parallax) · ValuesGrid "How we work" (enter: MediaReveal on its image) · StackDiagram (hover and click) · ValuesGrid
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
4. **At most one pinned section per page.** Home: WorkReel. Services and Process: none.
   Case study: CaseDevice.
5. **Scroll budget:** Home can run longer to give the service and process summaries room while
   keeping detailed offer and timeline content on their own pages. The WorkReel pin is
   `reel.shrinkScroll` + `reel.panelScroll` × (panels − 1) viewports.
6. **Only animate transform, opacity and clip-path.** Turn will-change on while something
   moves and off afterwards. Videos play only while visible and needed: the hero's active
   layer, hovered previews and the open service panel.
7. **Vary the openers.** `SectionHeader` has `stacked`, `split`, `minimal` and `inline`
   variants; neighbouring sections never use the same one.
8. **Every Home section ends with a "go deeper" link** (`<TextLink arrow>`) to its full
   page or anchor.
9. **Reduced motion:** no pins, scrubs, Flip or tone flow. Everything renders in its final
   state, and WorkReel becomes a grid.
