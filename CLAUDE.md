# CLAUDE.md — Stack Studio website

Production marketing site for **Stack Studio**, a two-person web studio in Centurion, South
Africa (founders Enzo De Vittorio and Armand Naudé). The site removes four doubts in order
(**Find → Understand → Trust → Contact**) and every page pushes toward one action:
**Start a project** (`/start`). Read `docs/user-flow.md`, `docs/sitemap.md`,
`docs/design-system.md` and `docs/motion-map.md` before changing structure, flow, visuals or
motion.

## Stack (do not add dependencies without a clear, written reason)

Vite + React 19 + TypeScript (strict, `noUncheckedIndexedAccess`) · Tailwind CSS v4 via
`@tailwindcss/vite`, CSS-first `@theme` config (no `tailwind.config.js`) · React Router v8
(declarative `BrowserRouter` + `useRoutes`, lazy routes) · GSAP + ScrollTrigger + SplitText via
`@gsap/react`'s `useGSAP` · Lenis (synced to GSAP's ticker) · zod · @fontsource (Inter Tight
variable, JetBrains Mono) · ESLint 9 flat config · Prettier with the Tailwind plugin.

**Not allowed:** UI kits, 3D libraries (on the site: `scripts/devices` renders the iPhone and MacBook models
offline with three.js from a CDN and the site ships the frames), Framer Motion / `motion`, CSS-in-JS, icon packs (inline
SVG instead). Components from registries like shadcn/Aceternity are ported to GSAP and
Tailwind by hand (e.g. `MacbookScroll`), not installed with their CLI. Pins: ESLint stays on 9 (jsx-a11y does not support 10 yet) and TypeScript on 6.0
(typescript-eslint supports `<6.1`).

## Commands

```bash
npm run dev          # dev server
npm run build        # tsc -b && vite build — must pass with zero errors
npm run lint         # eslint — must pass with zero errors
npm run typecheck    # tsc -b (app, node and test projects)
npm test             # node:test on tests/*.test.ts (pure lib helpers and data rules)
npm run format       # prettier --write (sorts Tailwind classes)
npm run preview      # serve dist/
node scripts/generate-placeholders.mjs   # regenerate placeholder favicon/OG PNGs
npm run mockups:capture  # screenshot the live client sites (local Chrome, puppeteer-core; --full for the laptop captures)
npm run mockups:render   # render the project device mockups (public/media/README.md)
npm run readme:render    # capture the local site and render README mockups (requires the dev server)
node scripts/devices/render.mjs          # Services phone and laptop frames from the 3D models (local Chrome)
node scripts/founders/encode.mjs <photo> public/media/founders/<id>  # 4:5 WebP founder portraits (local Chrome)
node scripts/services-media/encode.mjs   # encode the service stage videos (needs ffmpeg; public/media/services/README.md)
node scripts/illustrations/encode.mjs     # card illustrations: WebP renditions of the SVGs in public/Illustrations
node scripts/cursor/render.mjs           # logo cursors in public/cursor (macOS sips for the PNGs)
```

## Folder conventions

```
src/
  app/          App, router (routes.tsx, AppRoutes), providers (AppProviders, LenisProvider, IntroProvider)
  pages/        one folder per route: Home, Work, CaseStudy, Services, Process, Studio, Start, Privacy, NotFound
  sections/     grouped per page (home/, work/, case-study/, services/, process/, studio/, start/) + shared/
  components/
    ui/         Button, MagneticButton, Eyebrow, Heading, Container, Tag, Accordion, Marquee, TextLink, Divider,
                Logo, StackMark, WhatsAppButton
    layout/     Header, Footer, MobileMenu, PageTransition, Preloader, Cursor, GridOverlay, GrainOverlay,
                Section, SkipLink, DeferredSection, ToneController
    media/      Image, Video, MediaReveal, ServiceMedia, MacbookScroll, ClientLogo, ImageSequence,
                IllustrationScene, CodeEditor, ProcessJourney
    motion/     SplitReveal, Parallax, CountUp, DrawLine, StaggerGroup, MaskedHeading
    seo/        PageMeta
  hooks/        useLenis, useReducedMotion, useIsTouch, useMediaQuery, useInView, useAnalytics,
                useScrollRefresh
  lib/          gsap.ts (plugins registered ONCE), lenis.ts, estimate.ts, cn.ts, motion-tokens.ts,
                config.ts (env), analytics.ts, format.ts, lazy-page.ts, brief-schema.ts (zod),
                brief-reducer.ts, brief-draft.ts, submit-brief.ts, scroll-refresh.ts (debounced
                ScrollTrigger.refresh), tone.ts, count-up.ts, reel.ts, path-layout.ts (pure motion maths),
                code-highlight.ts (CodeEditor syntax colours)
  data/         ALL copy + content (typed): site, navigation, projects, services, process, pricing,
                faqs, testimonials, clients, media, studio, pages, brief
  types/        shared content types (one file per domain, re-exported from types/index.ts)
  styles/       index.css (entry) → tokens.css, base.css, typography.css, utilities.css
tests/          node:test files for pure helpers (run with Node's TypeScript stripping and the
                @/ alias hook in scripts/test-hooks.mjs; no test framework dependency)
```

### Component rules

- **One component per file.** Every component, section and page lives in its own folder:
  `Name/Name.tsx`, `Name/Name.module.css` (only if needed) and `Name/index.ts` (barrel:
  `export { Name } from './Name'` plus `export type { NameProps } ...`).
- Contexts live in their own non-component file (`XContext.ts`) so fast-refresh stays happy.
- **Tailwind utilities** for layout, spacing, colour and type. **CSS Modules** only for things
  that get messy in Tailwind: keyframes, complex effects, pseudo-elements, `clip-path`, masks.
  In CSS Modules use theme variables (`var(--color-orange)`), never raw hex.
- **Wrap every CSS Module in `@layer components { … }`** so Tailwind utilities passed via
  `className` can override it. The layer order is declared in an inline `<style>` in
  `index.html`: split CSS chunks can load before `index.css`, and otherwise the first
  layer mentioned would claim its position. Don't remove it.
- Merge classes with `cn()` from `@/lib/cn`.
- Import with the `@/` alias (maps to `src/`). No deep relative imports across folders.

### Sections

- Every section is **standalone and reusable**: it takes props (content, `tone`, `index`
  for the eyebrow number) and has **no hardcoded copy**. Pages (and the `app/` shell) read
  `src/data/*` and pass data down. Sections and components never import `src/data`.
  The only exceptions are `components/seo/PageMeta` (site-wide defaults from
  `data/site`) and type-only imports.
- The orange **ClosingCta band is rendered by the app shell** (`App.tsx`) at the end of
  every page except `/start`. Pages must not add their own. Use `CtaBanner` for a
  mid-page CTA and `CaseOutro` at the end of a case study.
- Pre-fill the brief from CTAs with `/start?type=<ProjectPackage id>` or
  `/start?plan=<MonthlyPlan id>`.
- Sections render inside `<Section tone="dark|paper|white|orange">`. **The site is
  dark-only: every section uses `tone="dark"`** (and section `tone` props default to
  `'dark'`), so the page background never switches colour as you scroll. The paper and
  white tones and the tone flow remain available but are unused; don't reintroduce light
  sections without a decision to bring back tone chapters.
  Use orange only for the single closing CTA band per page (it is `solid`, so it paints
  itself rather than turning the page orange).
- Eyebrows follow `NN · LABEL` (mono, uppercase, letter-spaced) via `<Eyebrow index label />`.
- Open sections with `SectionHeader` and pick a `variant` (`stacked`, `split`, `minimal`,
  `inline`) that differs from both neighbours.
- **At most one signature motion idea per section**, and neighbours never share a trigger
  type. See "Page flow" below and `docs/motion-map.md`.

### Content and copy

- All copy lives in `src/data/*.ts`, typed by `src/types`. **Every placeholder string is
  marked with a `// COPY:` comment** so they can all be found and rewritten
  (`grep -rn "COPY:" src/data`).
- All media paths live in `src/data/media.ts`, all served locally from `/public/media` with
  explicit dimensions (`/media/*.mp4` showreel and previews may not exist yet). Nothing else
  hardcodes a URL, and nothing loads from a remote image host.
  Project cards (`thumbnail`, Work), showcases (`showcase`, Home and the case study hero) and
  galleries are device mockups of the real client sites (`mockup()`, generated by
  `scripts/mockups`), each project with its own composition; add a scene there rather than a
  stock photo. Client logos sit straight on the case study title via `ClientLogo`
  (on-dark files, no plate: `scripts/mockups/logos.mjs`).
- Prices in `src/data/pricing.ts` are **obviously fake placeholders** (repeated digits). The
  offer is not final: keep the `ProjectPackage`, `MonthlyPlan` and `AddOn` model flexible, and
  keep `lib/estimate.ts` a **pure function** that only reads pricing data.
- Env vars are read **only** in `src/lib/config.ts` (`VITE_FORM_ENDPOINT`, `VITE_ANALYTICS_ID`).

## Theme (see docs/design-system.md)

Tokens live in `src/styles/tokens.css` (`@theme`). The default Tailwind colour palette is
cleared: use only `ink`, `ink-*`, `paper`, `paper-*`, `white`, `orange`, `orange-deep`,
`grey-50…950` and `error`.

- **Contrast:** orange `#FF5A14` text is fine on ink, but **fails on paper**: use
  `orange-deep` for orange text on light backgrounds. Text on orange buttons is **ink**, never
  white. Muted text: `grey-400` or lighter on dark, `grey-600` or darker on light.
- Fonts are tokens (`--font-sans`, `--font-display`, `--font-mono`). To swap a family, change
  the `@fontsource` import in `src/main.tsx` and the token value. Nothing else changes.

## Motion rules

- **All GSAP imports go through `@/lib/gsap`** (ESLint enforces this). Use `useGSAP` with
  a `scope` ref so everything reverts on unmount. No raw `useEffect` tweens.
- **All durations and easings come from `src/lib/motion-tokens.ts`** (JS) or the matching
  `--ease-*` / `--duration-*` CSS tokens. Expo-style ease-outs, 0.6–1.2s. Keep both files in
  sync.
- Set hidden start states with `gsap.from`/`fromTo` inside `useGSAP`, never in CSS, so
  content stays visible if JS or motion is off.
- Start enter animations with the element well on screen (`trigger.start`, `top 75%`, or
  `trigger.startLate` for things that should play mid-screen) so people see them in full.
  Titles (`MaskedHeading`) use `trigger.heading` (`top 90%`) and compile as soon as they're
  on screen. Only put a "mounted past the start, play now" check (`st.scroll() >= st.start`)
  on a standalone `ScrollTrigger.create`: a timeline's trigger reports `start` 0 until the
  next tick, so the check passes on mount.
- `prefers-reduced-motion`: Lenis is not created (native scroll), SplitText is skipped,
  Parallax is static, the preloader and page-wipe are skipped, the marquee stops. Content is
  always visible. Check `useReducedMotion()` in every motion component.
- The cursor is the Stack mark as a native CSS cursor (`public/cursor`, `--cursor-default` /
  `--cursor-pointer` in `tokens.css`, desktop pointers only). Use `cursor-(--cursor-pointer)`,
  not `cursor-pointer`, on custom clickable elements. Over `[data-cursor-label]` (project cards)
  `Cursor` morphs the mark into an orange label bubble. Regenerate the cursor art with
  `node scripts/cursor/render.mjs` and copy its paths into `Cursor`. Magnetic effects only on
  `(hover: hover) and (pointer: fine)` (`useIsTouch`).
- The preloader runs once per session (`sessionStorage`) and takes under 1.5s. The page
  transition is an orange/black panel wipe with a scroll reset. The header hides on scroll
  down and shows on scroll up.
- Anything that changes layout after mount calls `requestRefresh()` from
  `@/lib/scroll-refresh` (debounced; skipped when the page height is unchanged unless
  forced). `DeferredSection`, font loading, media loads and any page-height change
  (ResizeObserver) already do this. Focus inside a pinned section survives a refresh.
- Anchors: the fixed-header gap comes from CSS (`html` scroll-padding-top plus the target's
  scroll-margin-top), which Lenis and native scrolling both honour. Don't pass the header
  height as a `scrollTo` offset. `PageTransition` scrolls to `#hash` targets after a route
  change and on same-page hash links.
- **Never put Tailwind `translate-*`, `scale-*` or `rotate-*` utilities on an element
  GSAP animates.** In v4 they use the separate `translate`/`scale`/`rotate` CSS
  properties, which stack with GSAP's `transform`. Park elements with `gsap.set` in a
  layout effect. If you must use an inline `transform`, include `y: 0`/`x: 0` in the
  `from` vars: GSAP parses `translateY(100%)` as pixels and adds `yPercent` on top.
- Don't hide an element you're about to focus with `autoAlpha` (`visibility: hidden`
  blocks focus). Animate `opacity` instead.
- `SplitReveal` children must be static text. Routes remount per pathname
  (`AppRoutes` keys by it), so navigating between two case studies is safe; inside a
  page, give it a `key` if its text changes. It only puts `aria-label` on headings;
  other tags get a visually hidden copy.
- React Compiler lint rules are on: no ref access during render, and no `contextSafe`
  closures created in render and called from effects. Put imperative animation inside
  effects or `useEffectEvent`.

### Page flow (keep `docs/motion-map.md` current)

1. **One signature motion per section.** Two neighbouring sections never share a trigger
   type (load, enter, scrub, pin, hover): no scrub after scrub, no pin after pin. The
   shell's ClosingCta (an enter) is every page's last section. `MaskedHeading` titles
   (every `SectionHeader` and the ClosingCta) compile once, on a timer, when they enter.
   Don't tie them back to the scroll position.
2. **Every title compiles from code; SplitReveal is for the Home hero only.** Page titles
   (`PageTitle`, once the preloader or wipe lifts), section titles (`SectionHeader`, or
   `<Heading compile>` for a custom opener) and the ClosingCta all use `MaskedHeading`, and
   nothing compiles under the wipe. Card titles, legal subheadings, eyebrow labels and the
   brief's focused step heading stay static; the content carries the motion.
3. **Staggered rises are only for groups of cards or list items**, never headers or whole
   sections. `StaggerGroup` is used only for the client quote cards and the starting quote
   cards (FadeUp was removed).
4. **At most one pinned section per page.** Home: WorkReel. Services and Process: none.
   Case study: CaseDevice (the MacBook scroll).
5. **Scroll budget:** Home can run longer to make room for the service and process summaries,
   while leaving detailed offer and timeline content to their own pages. The WorkReel pin is
   `reel.shrinkScroll` + `reel.panelScroll` × (panels − 1) viewports.
6. **Only animate transform, opacity and clip-path** (no width, flex, letter-spacing or
   stroke offsets). Toggle will-change on while moving and off after. Videos play only when
   visible and needed.
7. **Vary the openers**: neighbouring sections never use the same `SectionHeader` variant.
8. **Every Home section ends with a "go deeper" link** (`<TextLink arrow>`) to its page or
   anchor.
9. **Services is what we offer, Process is how we work.** Home is a short summary of the
   whole site with no prices: one stop per page, each with its "go deeper" link. Services shows no project prices (services open the brief with `/start?type=`;
   `stageRows(..., { prices: false })`); its 05 Hosting and care group is the monthly plan
   cards, the only place plan prices appear (`/services#plans`, which the old
   `/pricing` URL redirects to). Process (`/process`) has the next steps, the
   week-by-week timeline, payment terms and how care runs. The brief gives the real estimate.

- **Tone flow:** `ToneController` (app shell) makes `[data-tone]` sections transparent
  (`html.tone-flow`) and switches `--page-*` colours in one short fade (`tone.switch`)
  when a section's top crosses the middle of the viewport. Don't tie the colour to scroll
  position: blending while scrolling reads as a muddy rainbow. Per frame it writes
  only to on-screen sections and `body`'s background (a variable on `<html>` restyles the
  whole page, so `<html>` is only updated on re-measure). Keep it that way. Pass `solid` to a Section whose own media or inset must keep painting
  (the hero, `PageTitle`). The footer is chrome, not a Section. Any new tone-dependent
  colour variable must be added to both `ToneController` and the flow rule in
  `utilities.css`. The header's light/dark style follows the page tone (not each section
  under it), so it changes only when the page colour does; at the very top, before its
  backdrop appears, it takes the surface under it.
- **Reduced motion:** no pins, scrubs, Flip or tone flow. Everything renders in its final
  state; WorkReel becomes a grid.

## Performance and accessibility

- Routes are lazy (`lib/lazy-page.ts`, preloaded during the page wipe), **except Home**,
  which ships in the main bundle because it's the LCP-critical landing page. Heavy
  below-the-fold home sections use `DeferredSection` with `React.lazy`. `index.html`
  contains an inline brand shell in `#root` for instant first paint.
- Last measured Lighthouse performance (mobile, local preview, Oct 2026 performance pass, median
  of 3 interleaved with the previous build on the same machine): Home 74 → 82, case study
  61 → 68, Process 75 → 74, Start 84 → 85 (accessibility, best practices and SEO were 100 in
  the Sept run). Home's LCP is the hero intro while the preloader holds the h1; the rest is
  vendor script evaluation and GSAP tween set-up (each first tween on an element reads its
  computed transform, forcing a layout).
- Every image set has in-between widths (no 2× jumps) and `sizes` measured from the real
  layout, so phones and 1× screens fetch what they show. Card illustrations are WebP
  renditions (scripts/illustrations), never the multi-MB source SVGs in public/Illustrations.
- `<Image>`: explicit width and height, `loading="lazy"` + `decoding="async"` by default,
  `priority` for hero media only. `<Video>`: muted, playsInline, loop, `preload="none"`,
  poster, plays only while in view, and falls back to the poster or a brand gradient on error.
- Semantic landmarks, one `<h1>` per page, visible `:focus-visible` rings, skip link, alt
  text from data, AA contrast. Per-page `<PageMeta>` (React 19 native `<title>`/`<meta>`).
- Target Lighthouse 90+ for performance and accessibility.

## Analytics

`useAnalytics().track(event, props)`, Plausible-compatible, a no-op when
`VITE_ANALYTICS_ID` is empty. Tracked events: `Start project click` (`{ location }`),
`Brief step complete` (`{ step, index }`), `Brief submitted`, `WhatsApp click`.
Pageviews are tracked on route change.

## Deployment

A static build is hosted on Firebase Hosting (`stack-studio-2f8a1`, site `stack-studio`).
`firebase.json` provides the SPA fallback. See the README for the build and deploy commands.

## Git

Commit after each logical phase. Messages are imperative and scoped
(`feat(start): add budget step`).
