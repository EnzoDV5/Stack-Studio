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
