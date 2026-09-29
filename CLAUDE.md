# CLAUDE.md — Stack Studio website

Production marketing site for **Stack Studio**, a two-person web studio in Centurion, South
Africa (founders Enzo De Vittorio and Armand Naudé). The site removes four doubts in order
(**Find → Trust → Understand → Contact**) and every page pushes toward one action:
**Start a project** (`/start`). Read `docs/user-flow.md`, `docs/sitemap.md`,
`docs/design-system.md` and `docs/motion-map.md` before changing structure, flow, visuals or
motion.

## Stack (do not add dependencies without a clear, written reason)

Vite + React 19 + TypeScript (strict, `noUncheckedIndexedAccess`) · Tailwind CSS v4 via
`@tailwindcss/vite`, CSS-first `@theme` config (no `tailwind.config.js`) · React Router v8
(declarative `BrowserRouter` + `useRoutes`, lazy routes) · GSAP + ScrollTrigger + SplitText via
`@gsap/react`'s `useGSAP` · Lenis (synced to GSAP's ticker) · zod · @fontsource (Inter Tight
variable, JetBrains Mono) · ESLint 9 flat config · Prettier with the Tailwind plugin.

**Not allowed:** UI kits, 3D libraries, Framer Motion / `motion`, CSS-in-JS, icon packs (inline
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
npm run mockups:capture  # screenshot the live client sites (local Chrome, puppeteer-core)
npm run mockups:render   # render the project device mockups (public/media/README.md)
```

## Folder conventions

```
src/
  app/          App, router (routes.tsx, AppRoutes), providers (AppProviders, LenisProvider, IntroProvider)
  pages/        one folder per route: Home, Work, CaseStudy, Services, Pricing, Studio, Start, Privacy, NotFound
  sections/     grouped per page (home/, work/, case-study/, services/, pricing/, studio/, start/) + shared/
  components/
    ui/         Button, MagneticButton, Eyebrow, Heading, Container, Tag, Accordion, Marquee, TextLink, Divider,
                Logo, WhatsAppButton
    layout/     Header, Footer, MobileMenu, PageTransition, Preloader, Cursor, GridOverlay, GrainOverlay,
                Section, SkipLink, DeferredSection, ToneController
    media/      Image, Video, MediaReveal, ServiceMedia, MacbookScroll
    motion/     SplitReveal, Parallax, CountUp, DrawLine, StaggerGroup, MaskedHeading
    seo/        PageMeta
  hooks/        useLenis, useReducedMotion, useIsTouch, useMediaQuery, useInView, useAnalytics,
                useScrollRefresh
  lib/          gsap.ts (plugins registered ONCE), lenis.ts, estimate.ts, cn.ts, motion-tokens.ts,
                config.ts (env), analytics.ts, format.ts, lazy-page.ts, brief-schema.ts (zod),
                brief-reducer.ts, brief-draft.ts, submit-brief.ts, scroll-refresh.ts (debounced
                ScrollTrigger.refresh), tone.ts, count-up.ts, reel.ts, path-layout.ts (pure motion maths)
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
- Sections render inside `<Section tone="dark|paper|white|orange">`. **Group neighbouring
  sections into tone chapters** (e.g. dark → paper → dark → paper on Home) rather than
  alternating every section: the page colour flows between tones, and a change every
  section reads as flashing. Aim for a change no more than every ~2 viewports; sections
  shorter than `tone.minSection` (0.9 viewport) never take over the page colour anyway.
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
- All media paths live in `src/data/media.ts` (picsum with fixed seeds and explicit
  dimensions, and `/media/*.mp4` videos that may not exist yet). Nothing else hardcodes a URL.
  Project thumbnails, heroes and galleries are device mockups of the real client sites
  (`mockup()`, generated by `scripts/mockups`); add a scene there rather than a stock photo.
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
- `prefers-reduced-motion`: Lenis is not created (native scroll), SplitText is skipped,
  Parallax is static, the preloader and page-wipe are skipped, the marquee stops. Content is
  always visible. Check `useReducedMotion()` in every motion component.
- Cursor and magnetic effects only on `(hover: hover) and (pointer: fine)` (`useIsTouch`).
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
4. **At most one pinned section per page.** Home: WorkReel. Services: ProcessPinned. Case
   study: CaseDevice (the MacBook scroll).
5. **Scroll budget:** Home stays about 11 viewports on desktop, footer included (11.05 at
   1440×900). The WorkReel pin is `reel.shrinkScroll` + `reel.panelScroll` × (panels − 1)
   viewports.
6. **Only animate transform, opacity and clip-path** (no width, flex, letter-spacing or
   stroke offsets). Toggle will-change on while moving and off after. Videos play only when
   visible and needed.
7. **Vary the openers**: neighbouring sections never use the same `SectionHeader` variant.
8. **Every Home section ends with a "go deeper" link** (`<TextLink arrow>`) to its page or
   anchor.

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
- Last measured Lighthouse scores (mobile, local preview, after the Sept 2026 Home
  restructure): Home 83–85, Work 88, Studio 87, Start 86, case study 84, Pricing 81–83,
  Services 82, Privacy 82; accessibility, best practices and SEO 100 everywhere. On the same
  machine the previous build scored Home 74–77 (it scored 91 on the faster machine used
  before). Home's LCP is the hero intro while the preloader holds the h1; the rest is
  vendor script evaluation. Remote picsum images still limit Work and the case study.
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

A static build is hosted on GoDaddy (Apache). `public/.htaccess` provides the SPA fallback,
caching and compression. See the README.

## Git

Commit after each logical phase. Messages are imperative and scoped
(`feat(start): add budget step`).
