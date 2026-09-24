# CLAUDE.md — Stack Studio website

Production marketing site for **Stack Studio**, a two-person web studio in Centurion, South
Africa (founders Enzo De Vittorio and Armand Naudé). The site removes four doubts in order
(**Find → Trust → Understand → Contact**) and every page pushes toward one action:
**Start a project** (`/start`). Read `docs/user-flow.md`, `docs/sitemap.md` and
`docs/design-system.md` before changing structure, flow or visuals.

## Stack (do not add dependencies without a clear, written reason)

Vite + React 19 + TypeScript (strict, `noUncheckedIndexedAccess`) · Tailwind CSS v4 via
`@tailwindcss/vite`, CSS-first `@theme` config (no `tailwind.config.js`) · React Router v8
(declarative `BrowserRouter` + `useRoutes`, lazy routes) · GSAP + ScrollTrigger + SplitText via
`@gsap/react`'s `useGSAP` · Lenis (synced to GSAP's ticker) · zod · @fontsource (Inter Tight
variable, JetBrains Mono) · ESLint 9 flat config · Prettier with the Tailwind plugin.

**Not allowed:** UI kits, 3D libraries, Framer Motion / `motion`, CSS-in-JS, icon packs (inline
SVG instead). Pins: ESLint stays on 9 (jsx-a11y does not support 10 yet) and TypeScript on 6.0
(typescript-eslint supports `<6.1`).

## Commands

```bash
npm run dev          # dev server
npm run build        # tsc -b && vite build — must pass with zero errors
npm run lint         # eslint — must pass with zero errors
npm run format       # prettier --write (sorts Tailwind classes)
npm run preview      # serve dist/
node scripts/generate-placeholders.mjs   # regenerate placeholder favicon/OG PNGs
```

## Folder conventions

```
src/
  app/          App, router (routes.tsx, AppRoutes), providers (AppProviders, LenisProvider, IntroProvider)
  pages/        one folder per route: Home, Work, CaseStudy, Services, Pricing, Studio, Start, Privacy, NotFound
  sections/     grouped per page (home/, work/, case-study/, services/, pricing/, studio/, start/) + shared/
  components/
    ui/         Button, MagneticButton, Eyebrow, Heading, Container, Tag, Accordion, Marquee, TextLink, Divider, Logo
    layout/     Header, Footer, MobileMenu, PageTransition, Preloader, Cursor, GridOverlay, GrainOverlay,
                Section, SkipLink, DeferredSection, WhatsAppButton
    media/      Image, Video, MediaReveal
    motion/     SplitReveal, FadeUp, Parallax, StaggerGroup
    seo/        PageMeta
  hooks/        useLenis, useReducedMotion, useIsTouch, useMediaQuery, useInView, useAnalytics
  lib/          gsap.ts (plugins registered ONCE), lenis.ts, estimate.ts, cn.ts, motion-tokens.ts,
                config.ts (env), analytics.ts, format.ts, lazy-page.ts, submit-brief.ts, brief-schema.ts
  data/         ALL copy + content (typed): site, navigation, projects, services, process, pricing,
                faqs, testimonials, clients, media, studio, pages, brief
  types/        shared content types (one file per domain, re-exported from types/index.ts)
  styles/       index.css (entry) → tokens.css, base.css, typography.css, utilities.css
```

### Component rules

- **One component per file.** Every component, section and page lives in its own folder:
  `Name/Name.tsx`, `Name/Name.module.css` (only if needed) and `Name/index.ts` (barrel:
  `export { Name } from './Name'` plus `export type { NameProps } ...`).
- Contexts live in their own non-component file (`XContext.ts`) so fast-refresh stays happy.
- **Tailwind utilities** for layout, spacing, colour and type. **CSS Modules** only for things
  that get messy in Tailwind: keyframes, complex effects, pseudo-elements, `clip-path`, masks.
  In CSS Modules use theme variables (`var(--color-orange)`), never raw hex.
- Merge classes with `cn()` from `@/lib/cn`.
- Import with the `@/` alias (maps to `src/`). No deep relative imports across folders.

### Sections

- Every section is **standalone and reusable**: it takes props (content, `tone`, `index`
  for the eyebrow number) and has **no hardcoded copy**. Pages read `src/data/*` and pass
  data down. Sections never import from `src/data` directly, except `sections/shared`
  wrappers documented in their file.
- Sections render inside `<Section tone="dark|paper|white|orange">`. Alternate dark and paper
  for rhythm, and use orange only for the single closing CTA band per page.
- Eyebrows follow `NN · LABEL` (mono, uppercase, letter-spaced) via `<Eyebrow index label />`.
- **At most one signature motion idea per section.**

### Content and copy

- All copy lives in `src/data/*.ts`, typed by `src/types`. **Every placeholder string is
  marked with a `// COPY:` comment** so they can all be found and rewritten
  (`grep -rn "COPY:" src/data`).
- All media paths live in `src/data/media.ts` (picsum with fixed seeds and explicit
  dimensions, and `/media/*.mp4` videos that may not exist yet). Nothing else hardcodes a URL.
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
- `prefers-reduced-motion`: Lenis is not created (native scroll), SplitText is skipped,
  Parallax is static, the preloader and page-wipe are skipped, the marquee stops. Content is
  always visible. Check `useReducedMotion()` in every motion component.
- Cursor and magnetic effects only on `(hover: hover) and (pointer: fine)` (`useIsTouch`).
- The preloader runs once per session (`sessionStorage`) and takes under 1.5s. The page
  transition is an orange/black panel wipe with a scroll reset. The header hides on scroll
  down and shows on scroll up.
- Anything that changes layout after mount (lazy sections, images without dimensions)
  must call `ScrollTrigger.refresh()` (`DeferredSection` does this for you).

## Performance and accessibility

- Routes are lazy (`lib/lazy-page.ts`, preloaded during the page wipe). Heavy below-fold
  home sections use `DeferredSection` with `React.lazy`.
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
