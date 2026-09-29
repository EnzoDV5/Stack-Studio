# Founder portraits

Real photos of the founders, shown in 4:5 frames on Home (StudioSnippet) and the Studio page
(FounderProfiles).

| Files                  | Founder          | Source                                  |
| ---------------------- | ---------------- | --------------------------------------- |
| `armand-{w}.webp`      | Armand Naudé     | Supplied photo, 4243 × 5657 JPEG (3:4)  |
| `enzo-placeholder.svg` | Enzo De Vittorio | Placeholder avatar until a photo exists |

Each photo is cropped to 4:5 from the top (full width, so the headroom stays and the bottom is
trimmed) and encoded to WebP (quality 0.84) at 1200, 800 and 480 wide:

```bash
node scripts/founders/encode.mjs <photo.jpg> public/media/founders/<id>
```

The script uses local Chrome (puppeteer-core), so it needs no ffmpeg, and strips EXIF data.
Keep the original JPEG out of `public/` (everything there is deployed). Paths and alt text
are in `src/data/media.ts` (`founderPhoto`).
