# /public/media

Drop real videos here using the file names in src/data/media.ts:

- showreel.mp4 (home hero, 1920x1080, muted loop, ideally < 4 MB, H.264)
- gc-solar-preview.mp4, mpg-foundation-preview.mp4, sample-preview.mp4 (hover previews, 1600x1200, < 1.5 MB)
- gc-solar-hero.mp4, mpg-foundation-hero.mp4 (case study heroes, 2400x1350)

Until they exist, <Video> shows its poster or an animated brand-gradient placeholder.

## Case study site captures (/public/media/projects)

`{id}-screen.webp` (1440 wide) and `{id}-screen-small.webp` (720 wide) are full-page captures
of the live client sites, scrolled inside the laptop on each case study:

- gc-solar: https://gcsolar-redesign-demo.netlify.app/
- mpg-foundation: https://mpgf.org.za/
- salon-friend: https://salon-friends.web.app/

Captured in Chrome at a 1440×900 viewport with **prefers-reduced-motion: reduce** emulated, so
pinned and scroll-driven sections render once, in their final state, instead of blank or
repeated. Scroll through the page once first so lazy images load. WebP quality 0.8 (small
0.72). When a site changes, recapture it and update its height in `src/data/media.ts`
(`siteCapture`).

## Device mockups (/public/media/projects/mockups)

Every project thumbnail, case study hero and gallery image is a device mockup (laptop and
phone, browser windows, a single phone) of the real client site, rendered from fresh
captures. Nothing is drawn by hand, so rerun both steps whenever a client site changes:

```bash
npm run mockups:capture   # screenshots of each live site into .mockups/raw (gitignored)
npm run mockups:render    # device scenes into public/media/projects/mockups
```

Both take an optional project id (`npm run mockups:render -- salon-friend`).

- `scripts/mockups/shots.mjs`: which pages to capture per site (desktop 1440×900 at 2×,
  mobile 390×844 at 3×, reduced motion, lazy images loaded), plus per-site fixes: GC Solar's
  demo host has no SPA rewrite so inner pages are opened client-side; the Netlify badge,
  GC Solar's fixed bottom blur and MPG's dated announcement bar are hidden.
- `scripts/mockups/scenes.mjs`: which captures go in which scene, the scene sizes (4:3
  thumbnails, 16:9 heroes and full gallery images, 4:5 half gallery images) and each
  client's background colours.
- `scripts/mockups/render.mjs`: the devices are plain HTML and CSS screenshotted by Chrome,
  sized in vw so the full-size and `-small` (half) files are both crisp.

Needs a local Chrome or Edge (set `CHROME_PATH` if it isn't found). `puppeteer-core` is a
dev dependency for this only: it drives that installed browser, downloads nothing and never
ships with the site. Paths and alt text live in `src/data/media.ts` (`mockup()`).
