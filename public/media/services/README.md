# Services media (Home and the Services page)

Downloaded on 2026-09-24. These are illustrative stock scenes of development work,
not Stack Studio employees, client projects or endorsements. Every website asset is
served locally. The gallery catalogue and accessible descriptions live in
`src/data/media.ts` (`serviceMedia`).

## Videos

One looping clip per service stage, used on Home (the "What do you need?" path chooser) and on
each Services page stage block. Chosen 2026-09-29 to show what each stage is about:

| Stage     | Local file   | What it shows                                | Source                                                                                                                                                   | Licence                                           |
| --------- | ------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Build     | build.mp4    | A software team building together            | [People coding on a computer — cottonbro studio / Pexels 6804109](https://www.pexels.com/video/people-coding-on-computer-6804109/)                       | [Pexels License](https://www.pexels.com/license/) |
| Take over | takeover.mp4 | People reviewing an existing project         | [People discussing around a laptop — Kindel Media / Pexels 7687649](https://www.pexels.com/video/people-discussing-while-looking-at-the-laptop-7687649/) | Pexels License                                    |
| Run       | run.mp4      | Live network cabling and status lights       | [Blue colored cables — Dima Krivoy / Pexels 1085656](https://www.pexels.com/video/blue-colored-cables-1085656/) (4K original)                            | [Pexels License](https://www.pexels.com/license/) |
| Improve   | grow.mp4     | A designer editing an existing visual layout | [A woman making a graphic design — ArtHouse Studio / Pexels 7204567](https://www.pexels.com/video/a-woman-making-a-graphic-design-7204567/)              | Pexels License                                    |
| Partner   | partner.mp4  | A team planning a project together           | [Teammates working on a project — MART PRODUCTION / Pexels 7534861](https://www.pexels.com/video/teammates-working-in-a-project-7534861/)                | Pexels License                                    |

The Pexels License allows free commercial use with no attribution. These are illustrative
stock scenes, not Stack Studio staff, clients or endorsements. The download URLs and loop
points are in `scripts/services-media/clips.mjs`.

Each stage has:

- `{stage}.mp4`: 1920 × 1080, 25 fps, silent H.264 (High, CRF 23, max 3.8 Mb/s), faststart.
- `{stage}-720.mp4`: 1280 × 720 (CRF 24, max 1.8 Mb/s). The player picks the smallest encode
  that is sharp at the size the clip is actually drawn (`lib/video-source.ts`, which allows
  for `object-fit: cover` in tall boxes), so small slots never fetch the 1080p file.
- `{stage}-poster.webp` (1920) and `-poster-{1280,960,720,480}.webp`: the loop's first
  frame, so the poster → video swap is invisible.

Each is a roughly 10-second seamless loop: the last second crossfades back into the first frame.
Only the stage on screen loads video, and reduced motion shows the posters only.

### Re-encoding or replacing a clip

Edit `scripts/services-media/clips.mjs` (source, licence, loop start/length), then run the
encoder. It needs ffmpeg on PATH (or `FFMPEG=/path/to/ffmpeg`) and caches originals in
`.media-cache` (gitignored):

```sh
node scripts/services-media/encode.mjs          # all stages
node scripts/services-media/encode.mjs run      # one stage
```

Update the alt text in `src/data/media.ts` (`serviceMedia`) to describe the new clip.

## Photographs

All photographs use the [Pexels License](https://www.pexels.com/license/). Images
are centre-cropped to 1200 × 800 WebP (quality 78), with 480 × 320 variants
(quality 70). Shared relevant images are reused
across services instead of downloading duplicate assets.

| Local basename   | Source                                                                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| wireframes       | [Pexels 196644 — interface wireframes](https://www.pexels.com/photo/196644/)                                                                  |
| mobile-design    | [Pexels 196645 — page layout sketches](https://www.pexels.com/photo/white-printer-paper-196645/)                                              |
| development      | [Pexels 7988086 — application development](https://www.pexels.com/photo/a-person-doing-computer-programming-7988086/)                         |
| code-review      | [Pexels 6308163 — code on a monitor](https://www.pexels.com/photo/text-on-computer-monitor-6308163/)                                          |
| pair-programming | [Pexels 7988747 — shared code review](https://www.pexels.com/photo/men-looking-at-the-code-on-the-board-7988747/)                             |
| network          | [Pexels 5408005 — data-centre server racks](https://www.pexels.com/photo/server-racks-on-data-center-5408005/)                                |
| analytics        | [Serpstat / Pexels 572056 — analytics workspace](https://www.pexels.com/photo/silver-imac-displaying-line-graph-placed-on-desk-572056/)       |
| backend          | [Pexels 1181675 — developer workstation](https://www.pexels.com/photo/1181675/)                                                               |
| automation       | [Matheus Bertelli / Pexels 16094040 — AI assistant](https://www.pexels.com/photo/man-using-laptop-wit-chat-gpt-16094040/)                     |
| architecture     | [Pexels 3861943 — API planning](https://www.pexels.com/photo/woman-writing-on-whiteboard-3861943/)                                            |
| collaboration    | [Mikhail Nilov / Pexels 7731371 — reviewing software together](https://www.pexels.com/photo/person-pointing-finger-on-laptop-screen-7731371/) |

Photo downloads use the source’s image endpoint:
`https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=1400`.

The stage clips replaced the Build, Take over and Improve photographs (wireframes, code-review,
analytics), which stay here unused; `collaboration` is still used on the Studio page.
