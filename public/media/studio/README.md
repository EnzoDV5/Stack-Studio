# Studio page photos

Stock photos chosen (2026-09-29) to match what each Studio section says. They are illustrative
scenes, not Stack Studio staff, clients or endorsements; swap them for real studio photos when
there are some. Both use the [Pexels License](https://www.pexels.com/license/): free for
commercial use, no attribution required.

| Files                   | Section                                                  | Source                                                  |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `one-team-{w}.webp`     | Who we are: "Design, motion and development in one team" | [Pexels 1181472](https://www.pexels.com/photo/1181472/) |
| `growing-team-{w}.webp` | How we work: "Built to grow"                             | [Pexels 3183150](https://www.pexels.com/photo/3183150/) |

Downloaded at 4000 × 2670 from
`https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=4000`,
cropped and encoded to WebP (quality 84) with ffmpeg:

- `one-team`: 4:5 crop (`crop=2136:2670:1480:0`, both people in frame) at 1600, 1000 and 640
  wide, plus 1200 and 800 downscaled from the 1600 file (quality 84) to close the gaps.
- `growing-team`: 2:1 crop (`crop=4000:2000:0:335`) at 3200, 2000 and 1200 wide, plus 1600 and
  800 downscaled from the 3200 file (quality 84).

Paths, sizes and alt text are in `src/data/media.ts` (`studioPhoto`).
