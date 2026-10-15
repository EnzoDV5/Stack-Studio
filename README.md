# Stack Studio: website

The production site for **Stack Studio**, a two-person web studio in Centurion, South
Africa. It is a brand-led, cinematic, conversion-focused portfolio with one job: move a
visitor from _"who are you?"_ to **Start a project**.

Built with Vite, React 19, strict TypeScript, Tailwind CSS v4, React Router, GSAP
(ScrollTrigger and SplitText), Lenis and zod.

- **Conventions for contributors and AI sessions:** [`CLAUDE.md`](./CLAUDE.md)
- **Design system:** [`docs/design-system.md`](./docs/design-system.md)
- **Sitemap and user flow:** [`docs/sitemap.md`](./docs/sitemap.md),
  [`docs/user-flow.md`](./docs/user-flow.md)

## Setup

Requires Node 20+ (developed on Node 24).

```bash
npm install
cp .env.example .env.local   # optional, see Environment below
npm run dev                  # http://localhost:5173
```

## Scripts

| Command                                  | What it does                                            |
| ---------------------------------------- | ------------------------------------------------------- |
| `npm run dev`                            | Dev server with HMR                                     |
| `npm run build`                          | Type-check (`tsc -b`), then production build to `dist/` |
| `npm run preview`                        | Serve the built `dist/` locally                         |
| `npm run lint` / `lint:fix`              | ESLint (flat config)                                    |
| `npm run format` / `format:check`        | Prettier (sorts Tailwind classes)                       |
| `npm run typecheck`                      | TypeScript only                                         |
| `npm test`                               | Unit tests (node:test, no extra dependencies)           |
| `node scripts/generate-placeholders.mjs` | Regenerate placeholder favicon, icons and OG image      |

## Environment

All variables are read in one place, `src/lib/config.ts`. Only `VITE_*` variables reach the
browser, so never put secrets here.

| Variable             | Purpose                                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_FORM_ENDPOINT` | Where the Start a project brief is POSTed as JSON (e.g. `https://formspree.io/f/xxxx`). Empty = local stub that logs and shows success. |
| `VITE_ANALYTICS_ID`  | Plausible site id (your domain). Empty = analytics fully disabled; no script is loaded.                                                 |

Tracked events: `Start project click` (with `location`), `Brief step complete` (`step`,
`index`), `Brief submitted`, `Brief submit error`, `WhatsApp click`, `Email click`, plus
pageviews on route change. In Plausible, add goals with these names for conversion
reporting.

## Where to replace things

Every placeholder string in `src/data` is marked `// COPY:`. List them all with:

```bash
grep -rn "COPY:" src/data
```

| What                                           | Where                                                                                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **All copy**                                   | `src/data/*.ts` (`pages.ts` for page copy, `brief.ts` for the enquiry flow, `navigation.ts` for chrome labels)                                               |
| **Contact details, WhatsApp, socials, domain** | `src/data/site.ts`                                                                                                                                           |
| **Case studies**                               | `src/data/projects.ts` (add an entry for a new `/work/:slug` page; update `public/sitemap.xml`)                                                              |
| **Prices, packages, plans, add-ons**           | `src/data/pricing.ts` (placeholders; set `isPlaceholder: false` when final)                                                                                  |
| **Images and videos**                          | `src/data/media.ts`. Put files in `public/media/` and reference them as `/media/…`. Videos use the file names already listed (see `public/media/README.md`). |
| **Client logos**                               | Add SVGs to `public/logos/` and set `logo: '/logos/x.svg'` in `src/data/clients.ts` (text tiles until then)                                                  |
| **Stack logo**                                 | `src/components/ui/Logo/Logo.tsx` (inline SVG placeholder), `public/favicon.svg`, and the inline shell in `index.html`                                       |
| **Favicon, touch icons, OG image**             | Replace the files in `public/` (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192/512.png`, `og-image.png` at 1200×630)                        |
| **Founder portraits**                          | `src/data/media.ts` → `founders`                                                                                                                             |
| **Privacy notice**                             | `src/data/pages.ts` → `privacyContent` (have it reviewed for POPIA before launch)                                                                            |
| **Static SEO fallbacks**                       | `<head>` in `index.html` (used by link previews that don't run JavaScript)                                                                                   |
| **Fonts**                                      | `@fontsource` imports in `src/main.tsx` plus the `--font-*` tokens in `src/styles/tokens.css`                                                                |

When you move images from picsum to local files, remove the two `preconnect` links in
`index.html`.

The home technology strip is configured in `src/data/technologies.ts`. Edit its typed,
categorised catalogue to add or remove tools; primary categories determine the two
rows. SVGs are served locally from `public/logos/technologies/` with pinned sources
and licences documented in that folder. Run `node scripts/sync-technology-logos.mjs`
to fetch the selected assets again. The strip pauses on hover or with its keyboard /
touch control and becomes static, wrapped rows with reduced motion enabled.

## Connecting the enquiry form

1. For EmailJS team notifications, client auto-replies and brief PDFs, follow [the EmailJS setup guide](docs/emailjs-setup.md).
2. To store project briefs and Contact messages in Firestore, follow [the Firebase setup guide](docs/firebase-setup.md).
3. Optionally set `VITE_FORM_ENDPOINT` to a Formspree-compatible JSON endpoint as a secondary brief delivery channel.
4. Set the values in your hosting build environment and rebuild before publishing.

The brief sends the validated answers, a human-readable summary, the estimate and page
metadata. It includes a honeypot field; also enable the provider's spam protection.

## Deploying to GoDaddy (cPanel / Apache)

1. **Build locally:** `npm run build`. The output is in `dist/`, and includes
   `dist/.htaccess` (copied from `public/`).
2. **Open the File Manager** in GoDaddy (My Products → Web Hosting → Manage → cPanel
   Admin → File Manager), or connect with FTP/SFTP (e.g. FileZilla, using the FTP account
   from cPanel).
3. **Go to `public_html/`** (or the domain's document root). Back up or remove any old
   site files.
4. **Upload the contents of `dist/`**, not the folder itself: `index.html`, `.htaccess`,
   `assets/`, `media/` and the icon files. In File Manager, enable _Settings → Show Hidden
   Files_ to confirm `.htaccess` is there.
5. **Enable SSL** (cPanel → SSL/TLS Status → AutoSSL). Once HTTPS works, uncomment the
   HTTPS redirect in `.htaccess`.
6. **Test:** load a deep link directly (e.g. `https://stackstudio.co.za/work/gc-solar`) and
   refresh. It should load the page, not a 404. `/nope` should show the on-brand 404.
7. **Submit** `https://stackstudio.co.za/sitemap.xml` in Google Search Console.

`.htaccess` handles SPA fallback, real 404s for missing assets and media, long-term
caching for hashed assets, compression and basic security headers. If deep links 404,
check that `mod_rewrite` is enabled and that `.htaccess` was uploaded.

To redeploy, rebuild and upload `dist/` again. The old hashed `assets/` files can be
deleted.

## Project structure (short)

```
src/
  app/        App shell, router (lazy routes), providers (Lenis, intro state)
  pages/      One folder per route
  sections/   Page sections grouped by page, plus shared/
  components/ ui, layout, media, motion, seo
  hooks/      useLenis, useReducedMotion, useIsTouch, useMediaQuery, useInView, useAnalytics,
              useScrollRefresh
  lib/        gsap, lenis, estimate, brief schema/reducer/submit, config, analytics, motion tokens,
              scroll refresh, pure motion maths (tone, count-up, reel, path layout)
  data/       All content (typed)
  types/      Content types
  styles/     tokens, base, typography, utilities
tests/        node:test unit tests (npm test)
```

Motion per section and the page-flow rules: [docs/motion-map.md](docs/motion-map.md).

See `CLAUDE.md` for the full conventions.
