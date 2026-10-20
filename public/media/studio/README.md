# Studio page photos

A stock photo chosen (2026-09-29) to match what its Studio section says. It is an illustrative
scene, not Stack Studio staff, clients or endorsements; swap it for a real studio photo when
there is one. It uses the [Pexels License](https://www.pexels.com/license/): free for
commercial use, no attribution required.

| Files                   | Section                      | Source                                                  |
| ----------------------- | ---------------------------- | ------------------------------------------------------- |
| `growing-team-{w}.webp` | How we work: "Built to grow" | [Pexels 3183150](https://www.pexels.com/photo/3183150/) |

Downloaded at 4000 × 2670 from
`https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=4000`,
cropped and encoded to WebP (quality 84) with ffmpeg: a 2:1 crop (`crop=4000:2000:0:335`) at
3200, 2000 and 1200 wide, plus 1600 and 800 downscaled from the 3200 file (quality 84).

The "Who we are" section uses the studio illustration instead
(`public/Illustrations/Studio.svg`, encoded by `scripts/illustrations/encode.mjs`).

Paths, sizes and alt text are in `src/data/media.ts` (`studioPhoto`, `studio.oneTeam`).
