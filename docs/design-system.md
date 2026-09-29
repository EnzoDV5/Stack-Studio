# Stack Studio design system

The Stack identity is kept, not rebranded: near-black, a sparing Stack orange, warm paper,
a square grid-line motif, faint grain, mono uppercase eyebrows and heavy, tightly tracked
headlines. The feel should be wow on first load, then calm, confident and editorial: craft
rather than decoration.

Source of truth: `src/styles/tokens.css` (`@theme static`) and `src/lib/motion-tokens.ts`.

## Colour

| Token                 | Value     | Use                                                               |
| --------------------- | --------- | ----------------------------------------------------------------- |
| `ink`                 | `#0A0A0A` | Primary dark surface, text on orange and paper                    |
| `ink-800 / 700 / 600` |           | Raised surfaces, cards, borders on dark                           |
| `paper`               | `#F4F0EA` | Primary light surface, text on ink                                |
| `paper-200 / 300`     |           | Fills and borders on paper                                        |
| `white`               | `#FFFFFF` | Occasional light surface (`tone-white`)                           |
| `orange`              | `#FF5A14` | Accent + CTA. Primary buttons, markers, one closing band per page |
| `orange-deep`         | `#B93D0A` | Orange **text** on paper/white (AA 4.9:1)                         |
| `orange-soft`         | `#FFE3D6` | Highlight tint on paper                                           |
| `grey-50 … grey-950`  | neutral   | UI greys                                                          |
| `error` / `success`   |           | Validation (used on ink surfaces)                                 |

Tailwind's default palette is cleared (`--color-*: initial`), so only these exist.

**Contrast rules (WCAG AA):**

- Orange on ink is 6.3:1, fine for any text. Orange on paper is 2.7:1, **never use it for
  text**; use `orange-deep`.
- Text on an orange button is **ink**. White on orange fails.
- Muted text: `grey-400` or lighter on ink, `grey-600` or darker on paper. `grey-500` is
  decorative only.

### Section tones

Wrap every section in `<Section tone="dark | paper | white | orange">`. A tone sets CSS
variables that components read automatically:

| Variable             | Utility           | Meaning                            |
| -------------------- | ----------------- | ---------------------------------- |
| `--tone-bg/fg`       | (set by tone)     | Background and text                |
| `--tone-muted`       | `text-muted`      | Secondary text, AA on that surface |
| `--tone-accent-text` | `text-accent`     | Orange text safe for that surface  |
| `--tone-marker`      | `bg-marker`       | Small orange squares and bullets   |
| `--tone-border`      | `border-tone`     | Hairlines                          |
| `--tone-surface`     | `bg-tone-surface` | Cards                              |
| `--grid-line`        | `bg-grid`         | Grid motif line colour             |

Rhythm: group neighbouring sections into `dark` and `paper` chapters (a change roughly
every two viewports), not one tone per section: the page colour flows between tones, so
alternating every section looks like flashing. `orange` is reserved for the closing CTA band, which
the app shell renders at the end of every page except `/start`.

## Typography

Families are tokens. To swap one, change the `@fontsource` import in `src/main.tsx` and the
token value:

- `--font-sans` / `--font-display`: **Inter Tight Variable** (headings and body)
- `--font-mono`: **JetBrains Mono 500** (eyebrows, labels, numbers)
- A metric-adjusted Arial fallback (`Inter Tight Fallback`, in `base.css`) keeps layout
  shift near zero while the font swaps in.

Fluid scale (from 375px to 1600px). Each token also carries line-height, tracking and
weight:

| Utility            | Size (min → max)    | Line height / tracking | Use                              |
| ------------------ | ------------------- | ---------------------- | -------------------------------- |
| `text-display-2xl` | 52px → 200px        | 0.86 / −0.055em, 800   | Home hero, closing CTA           |
| `text-display-xl`  | 44px → 128px        | 0.9 / −0.05em, 800     | Large display text               |
| `text-display-lg`  | 36px → 80px         | 0.95 / −0.045em, 750   | Section headlines                |
| `text-heading-xl`  | 28px → 48px         | 1.02 / −0.035em, 700   | Inner-page titles, cards, prices |
| `text-heading-lg`  | 22px → 32px         | 1.1 / −0.025em, 650    | Sub-headings                     |
| `text-heading-md`  | 18px → 22px         | 1.25 / −0.015em, 600   | Small headings                   |
| `text-body-lg`     | 17px → 21px         | 1.55                   | Intros, lead paragraphs          |
| `text-body`        | 16px                | 1.6                    | Body                             |
| `text-small`       | 14px                | 1.5                    | Meta, captions                   |
| `eyebrow`          | 12px mono uppercase | 0.16em tracking        | `01 · WORK` labels               |
| `text-micro`       | 11px                | 0.12em                 | Disclaimers, keycaps             |

Heading level (`as`) and visual size (`size`) are independent in `<Heading>`. Keep one h1
per page. Use the `numeric` utility for prices and counters (tabular figures).

Only Home has a hero. Other routes use `PageTitle`: a compact h1 and intro with no grid
or hero media. Its h1 is static unless the page opts into `reveal` (Services and Pricing
do; see `docs/motion-map.md`). Case studies add their hero media as a separate band
under the meta. Match its tone to the first content section so cream backgrounds use ink
titles and dark backgrounds use paper titles. A dark header-height inset keeps the fixed
navigation readable above either background, and the title section is `solid` so it
keeps its tone over that inset while the rest of the page tone flows.

**Eyebrows:** `<Eyebrow index={1} label="Selected work" />` renders an orange square marker,
then `01 · SELECTED WORK`.

## Spacing, layout and grid

- Base unit: `--spacing: 0.25rem` (so `p-4` is 1rem).
- `--spacing-gutter`: fluid page padding, 20px → 48px. `container-site` = max 1600px plus
  gutters.
- `--spacing-section` (`py-section`): 80px → 176px of vertical rhythm. `py-section-sm` for
  lighter sections.
- `--spacing-header`: 72px, the fixed header height (use it for top offsets and sticky
  positions).
- Layout grid: 12 columns (`lg:grid-cols-12`) with editorial offsets, e.g. text in
  `col-span-5` and media from `col-start-7`.
- Grid motif: `--grid-size: 72px` squares via `bg-grid`, or `<GridOverlay fade="radial |
top | bottom | edges" />`.
- Radius: `xs 2`, `sm 6`, `md 10`, `lg 16`, `pill`. Mostly square-ish with pill buttons.

## Buttons and links

`<Button>` renders a router Link (`to`), an anchor (`href`) or a button.

| Variant     | Look                                    | Use                               |
| ----------- | --------------------------------------- | --------------------------------- |
| `primary`   | Orange pill, ink text, tone-colour fill | The main action (Start a project) |
| `secondary` | Outline in the current colour           | Secondary actions                 |
| `ghost`     | Text with arrow, no padding             | Inline actions                    |
| `inverse`   | Ink pill on orange sections             | CTAs on the orange band           |

Sizes are `sm` (40px), `md` (52px) and `lg` (68px). `withArrow` adds the sliding arrow. On
hover, a fill wipes up from below. `analytics={{ event, props }}` tracks clicks.
`<MagneticButton>` has the same API and leans toward the pointer on desktop only.
`<TextLink>` has an animated underline (`underline` or `quiet`); external links get an
arrow icon and "(opens in a new tab)".

Focus: every interactive element shows a 2px `:focus-visible` outline (orange on dark,
ink on light).

## Motion

Principles: restrained, **at most one signature motion idea per section**, and fast in with
a long settle.

| Token (`motion-tokens.ts`) | Value              | CSS twin             |
| -------------------------- | ------------------ | -------------------- |
| `duration.micro`           | 0.25s              | `--duration-micro`   |
| `duration.fast`            | 0.6s               | `--duration-fast`    |
| `duration.base`            | 0.9s               | `--duration-base`    |
| `duration.slow`            | 1.2s               | `--duration-slow`    |
| `ease.out`                 | `expo.out`         | `--ease-out-expo`    |
| `ease.outQuart`            | `power4.out`       | `--ease-out-quart`   |
| `ease.inOut`               | `expo.inOut`       | `--ease-in-out-expo` |
| `stagger.tight/base/loose` | 0.04 / 0.08 / 0.14 |                      |
| `trigger.start`            | `top 75%`          |                      |
| `trigger.heading`          | `top 90%`          |                      |

Neighbouring sections never share a trigger type, and every section's motion is listed in
`docs/motion-map.md` (with the page-flow rules). Signature ideas in use:

| Where             | Idea                                                                        | Component                        |
| ----------------- | --------------------------------------------------------------------------- | -------------------------------- |
| First visit       | Mark and counter preloader, under 1.5s, once per session                    | `Preloader`                      |
| Route change      | Orange then ink panel wipe, scroll reset (or jump to `#hash`)               | `PageTransition`                 |
| Whole page        | Page colours switch to each section's tone in one short fade                | `ToneController`                 |
| Section headings  | Code characters compile into the title once, on a timer, when it enters     | `SectionHeader`, `MaskedHeading` |
| Home hero         | Masked line rise over the showreel; a huge Stack mark fills the right side  | `HomeHero`, `SplitReveal`        |
| Home work         | Full-bleed media shrinks into a card, then a pinned sideways reel           | `WorkReel`                       |
| Home services     | Horizontal accordion (transform + clip-path)                                | `PathChooser`                    |
| Home process      | A playhead sweeps the plan on entry; hover or click a week to glide there   | `ProcessLine`                    |
| Client quotes     | Quote cards rise in one after the other (no images)                         | `ClientVoices`, `StaggerGroup`   |
| Starting quotes   | Quote cards rise in; each opens the estimator pre-filled                    | `QuoteStarters`, `StaggerGroup`  |
| Case study site   | The site on a laptop: the screen swings up and grows, then the site scrolls | `CaseDevice`, `MacbookScroll`    |
| Prices, metrics   | Numbers count up once on enter                                              | `CountUp`                        |
| Closing band      | Code characters compile into the current-tone title once it enters          | `ClosingCta`, `MaskedHeading`    |
| Work media        | Clip-path mask opens while the image settles; Flip on filter                | `MediaReveal`, `WorkGrid`        |
| Work cards        | Hover video preview (desktop)                                               | `ProjectMedia`                   |
| Services, FAQs    | Expanding rows; each service stage has its own layout                       | `Accordion`, `StageBlock`        |
| Services process  | Sticky column with active step and progress                                 | `ProcessPinned`                  |
| Plan tabs         | Cards Flip into the slot they replace                                       | `PlanTabs`                       |
| Portraits, images | Gentle parallax (scroll, or pointer on Home)                                | `Parallax`                       |
| Technologies      | CSS marquee, hover pause and pause control                                  | `TechnologyMarquee`, `Marquee`   |
| Chrome            | Header hides on scroll and follows the page tone; cursor; magnetic CTAs     | `Header`, `Cursor`               |

**Reduced motion** (`prefers-reduced-motion: reduce`): Lenis is not created (native
scroll), there's no preloader, no page wipe (instant swap plus scroll reset), no text
splitting, no parallax, pins, scrubs, Flip or tone flow (sections keep solid backgrounds
and the work reel is a grid), no cursor or magnetic effects, a static marquee and no video
autoplay. All content stays visible.

## Grain and texture

`<GrainOverlay>`: one fixed SVG-noise layer at 5.5% opacity with stepped jitter (static
under reduced motion). No blend modes, to keep compositing cheap.

## Media

- `<Image>`: explicit width/height, `srcSet`, lazy loading and async decoding.
  `priority` is for the LCP image only.
- `<Video>`: muted, inline, looped, `preload="none"`, and plays only while in view. Until
  frames play it shows the poster, or the animated brand gradient when there's no poster.
- Recommended assets: hero video 1920×1080 H.264 under 4 MB; hover previews 1600×1200
  under 1.5 MB; images as WebP/AVIF at 2× their display size.
