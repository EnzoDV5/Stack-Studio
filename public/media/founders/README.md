# Founder portraits

Real photos of the founders, shown in 4:5 frames on Home (StudioSnippet) and the Studio page
(FounderProfiles).

| Files             | Founder          | Source                                                       |
| ----------------- | ---------------- | ------------------------------------------------------------ |
| `armand-{w}.webp` | Armand Naudé     | Supplied photo, 4243 × 5657 JPEG (3:4), cropped from the top |
| `enzo-{w}.webp`   | Enzo De Vittorio | Supplied photo, 4000 × 6000 JPEG (2:3), crop `600,1000,3000` |

Each photo is cropped to 4:5 and encoded to WebP (quality 0.84) at 1200, 800 and 480 wide. By
default the crop is full width from the top (so the headroom stays and the bottom is trimmed).
A wide shot with a lot of sky can pass an `x,y,width` box in source pixels instead, so the
founder fills the frame like the others:

```bash
node scripts/founders/encode.mjs <photo.jpg> public/media/founders/<id>
node scripts/founders/encode.mjs <photo.jpg> public/media/founders/enzo 1200,800,480 0.84 600,1000,3000
```

The script uses local Chrome (puppeteer-core), so it needs no ffmpeg, and strips EXIF data.
Keep the original JPEG out of `public/` (everything there is deployed). Paths and alt text
are in `src/data/media.ts` (`founderPhoto`).
