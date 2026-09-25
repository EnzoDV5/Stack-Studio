# Homepage Services media

Downloaded on 2026-09-24. These are illustrative stock scenes of development work,
not Stack Studio employees, client projects or endorsements. Every website asset is
served locally. The gallery catalogue and accessible descriptions live in
`src/data/media.ts` (`serviceMedia`).

## Videos

All five clips are silent, 8-second, 960 × 540 H.264 MP4s at 24 fps, encoded with
CRF 28 and `faststart`. WebP posters are extracted from the optimised clips.

| Local file   | Source                                                                                                                                                                  | Licence                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| build.mp4    | [Software developer working on code, screen close up — Mixkit 1728](https://mixkit.co/free-stock-video/software-developer-working-on-code-screen-close-up-1728/)        | [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree) |
| takeover.mp4 | [Complex programming codes on a programmer’s screen — Mixkit 41654](https://mixkit.co/free-stock-video/complex-programming-codes-on-a-programmers-screen-41654/)        | Mixkit Stock Video Free License                                         |
| grow.mp4     | [Experienced programmer working on a powerful computer — Mixkit 41656](https://mixkit.co/free-stock-video/experienced-programmer-working-on-a-powerful-computer-41656/) | Mixkit Stock Video Free License                                         |
| partner.mp4  | [Team collaboration in a colorful workspace — Mixkit 100319](https://mixkit.co/free-stock-video/team-collaboration-in-a-colorful-workspace-100319/)                     | Mixkit Stock Video Free License                                         |
| run.mp4      | [Blue colored cables — Dima Krivoy / Pexels 1085656](https://www.pexels.com/video/blue-colored-cables-1085656/)                                                         | [Pexels License](https://www.pexels.com/license/)                       |

The visible licence on each selected Mixkit item was checked. Restricted-license
clips from the same search results were excluded. Licence terms were checked at
download time; retain these records if replacing assets.

Original downloads:

- `https://assets.mixkit.co/videos/1728/1728-720.mp4`
- `https://assets.mixkit.co/videos/41654/41654-720.mp4`
- `https://assets.mixkit.co/videos/41656/41656-720.mp4`
- `https://assets.mixkit.co/active_storage/video_items/100319/1722990360/100319-video-720.mp4`
- `https://videos.pexels.com/video-files/1085656/1085656-hd_1280_720_25fps.mp4`

## Photographs

All photographs use the [Pexels License](https://www.pexels.com/license/). Images
are centre-cropped to 1200 × 800 WebP (quality 78), with 480 × 320 variants
(quality 70). Posters use 960 × 540 and 480 × 270. Shared relevant images are reused
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

## Re-encoding a replacement

Use a commercially permitted source, save the original outside `public`, and encode:

```sh
ffmpeg -ss 1 -i original.mp4 -t 8 -an -vf "scale=960:540:force_original_aspect_ratio=increase,crop=960:540,fps=24" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart output.mp4
ffmpeg -ss 1 -i output.mp4 -frames:v 1 poster.png
```

Convert the poster to WebP at the two sizes above. The homepage showcase uses one
item per service (`serviceMedia`); the other photos here are currently unused. Only
the service on the stage, while visible, receives a video source. Switching away
from a clip pauses and resets it. Reduced motion uses static images, and a manual
pause control is available for playing clips.
