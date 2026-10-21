# /public/media

Drop real videos here using the file names in src/data/media.ts:

- showreel.mp4 (home hero, 1920x1080, muted loop, ideally < 4 MB, H.264)
- gc-solar-preview.mp4, mpg-foundation-preview.mp4, sample-preview.mp4 (hover previews, 1600x1200, < 1.5 MB)
- gc-solar-hero.mp4, mpg-foundation-hero.mp4 (case study heroes, 2400x1350)

Until they exist, <Video> shows its poster or an animated brand-gradient placeholder.

## Case study site captures (/public/media/projects)

`{id}-screen.webp` (2160 wide), `{id}-screen-1440.webp`, `{id}-screen-small.webp` (1080 wide) and
`{id}-screen-720.webp` are full-page captures of the live client sites' homepages at a 1440 CSS px
viewport, saved at 1.5×, 1×, 0.75× and 0.5×, and
scrolled inside the laptop on each case study:

- gc-solar: https://gcsolar-redesign-demo.netlify.app/
- mpg-foundation: https://mpgf.org.za/
- salon-friend: https://salon-friends.web.app/

```bash
npm run mockups:capture -- --full            # all three (or add a project id)
```

It prints each page's CSS height: update it in `src/data/media.ts` (`siteCapture`) if it
changed. 1.5× is the ceiling, because WebP can't exceed 16383 px on a side and the MPG page is
about 9600 CSS px tall.

MPG uses `scripts/mockups/capture-full-mpg.mjs` to stitch viewport captures. Its animated
sections disappear in Chrome's ordinary full-page screenshot; the stitched capture keeps the
content visible at all four output widths.

## Device mockups (/public/media/projects/mockups)

Every project card, Home showcase, case study hero and gallery image is a device mockup of
the real client site, rendered from fresh captures. Nothing is drawn by hand, so rerun both
steps whenever a client site changes:

```bash
npm run mockups:capture   # viewport screenshots of each live site into .mockups/raw (gitignored)
npm run mockups:render    # device scenes into public/media/projects/mockups
```

Both take an optional project id (`npm run mockups:render -- salon-friend`).

Each project has its own composition for its Work card (`card`, 4:3) and its Home showcase
(`showcase`, 16:9: the Home hero backdrop, the work reel and the case study hero), so no two
projects and no two pages repeat a mockup:

| Project        | Work card        | Home showcase                          |
| -------------- | ---------------- | -------------------------------------- |
| GC Solar       | Laptop and phone | Tablet, laptop and phone (three pages) |
| MPG Foundation | Tablet and phone | Browser window and phone               |
| Salon Friend   | Three phones     | Laptop between two phones              |

Every scene is rendered separately at each output width (never downscaled), so text stays
sharp at every size: cards 2400/1600/1200/800, showcases and full gallery images
3840/2560/1920/1280/960 (3840 covers a full-bleed retina screen), half gallery images
2000/1200/900/600. The in-between widths keep phones and 1× screens from fetching a file twice
the size they show. Files are
`{project}-{name}-{width}.webp`.

- `scripts/mockups/shots.mjs`: which pages to capture per site (desktop 1440×900 at 2×,
  tablet 1180×820 at 2×, mobile 390×844 at 3×, reduced motion, lazy images loaded), plus
  per-site fixes: GC Solar's demo host has no SPA rewrite so inner pages are opened
  client-side; the Netlify badge, GC Solar's fixed bottom blur and MPG's dated announcement
  bar are hidden.
- `scripts/mockups/scenes.mjs`: which captures go in which scene and layout, the output
  shapes and widths (keep in sync with `mockupShapes` in `src/data/media.ts`) and each
  client's background colours.
- `scripts/mockups/render.mjs`: laptop, tablet, phone and browser drawn in plain HTML and CSS
  and screenshotted by Chrome, sized in vw.

Needs a local Chrome or Edge (set `CHROME_PATH` if it isn't found). `puppeteer-core` is a
dev dependency for this only: it drives that installed browser, downloads nothing and never
ships with the site. Paths and alt text live in `src/data/media.ts` (`mockup()`).

## Client logos (/public/logos/clients)

Transparent WebP logos, shown straight on each case study's dark title, beside the name, with
no plate or background (`ClientLogo`, sized by optical weight so wordmarks and marks balance).
Every logo used must be drawn for dark backgrounds: GC Solar's already is; MPG Foundation's
and Salon Friend's are drawn for light, so they use generated `-on-dark` versions (black and
grey inverted, brand colours kept):

```bash
node scripts/mockups/logos.mjs   # regenerate {id}-on-dark.webp after replacing a logo
```

## Services devices (/public/media/phone, /public/media/laptop)

`{device}/{id}/frame-{nn}-{width}.webp`: transparent frames of a 3D device with an
illustrative app on screen (not a client's: most client work is websites), played by
`ImageSequence` on the Services page:

- `phone/app`: 80 frames (3:4) at 480 and 800 wide. An orange iPhone 17 Pro spins from its
  back to face the viewer with a bookings app (`screens/bookings.html`), scrubbed by the
  scroll in "Apps and software" (`AppShowcase`). About 1.5 MB at 800 wide.
- `laptop/desktop`: 72 frames (4:3) at 800, 1200 and 1800 wide, supersampled (rendered at
  twice the size, then scaled down). A MacBook Pro opens its lid and turns to face the copy,
  its display waking on a stock and orders app (`screens/desktop.html`, rendered at 2x),
  scrubbed by the scroll in "Desktop software" (`DesktopShowcase`). About 1.2 MB at 800,
  2 MB at 1200 and 3.1 MB at 1800 wide; each visitor loads one set.

They are rendered from the models in `assets/models` with three.js in headless Chrome, so
the site ships images only:

```bash
node scripts/devices/render.mjs                # every sequence (about 30 s)
node scripts/devices/render.mjs desktop 0,89   # one sequence, a few frames, for a quick look
```

Devices, looks and motion are in `scripts/devices/shots.mjs`. If you change a frame count,
widths or aspect, change `deviceMotion` in `src/data/media.ts` too
(`tests/devices.test.ts` checks every frame exists). Frames load only as a section
approaches. A screen can also be a client's mobile capture from .mockups/raw
(`npm run mockups:capture`).
