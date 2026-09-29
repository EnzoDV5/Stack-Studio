/**
 * The service stage clips encoded by encode.mjs into public/media/services/{stage}.mp4.
 * All are royalty-free for commercial use with no attribution required; the licence was
 * checked on each item when it was chosen (29 Sep 2026). Coverr "premium" items and Mixkit
 * "Restricted License" items were excluded. Record any replacement here and in
 * public/media/services/README.md.
 *
 * `start` and `duration` pick the loop (seconds); `fade` is the crossfade that closes it.
 */
export const clips = [
  {
    stage: 'build',
    // A development team building together: the former Partner clip, moved here for Build.
    title: 'People coding on a computer (cottonbro studio)',
    source: 'https://www.pexels.com/video/people-coding-on-computer-6804109/',
    download: 'https://videos.pexels.com/video-files/6804109/6804109-uhd_4096_2160_25fps.mp4',
    license: 'Pexels License (https://www.pexels.com/license/)',
    sourceId: 'pexels-6804109-4k',
    start: 2,
    duration: 10,
  },
  {
    stage: 'takeover',
    // People examining an existing project and its reports together: review before takeover.
    title: 'People discussing while looking at a laptop (Kindel Media)',
    source: 'https://www.pexels.com/video/people-discussing-while-looking-at-the-laptop-7687649/',
    download: 'https://videos.pexels.com/video-files/7687649/7687649-uhd_3840_2160_30fps.mp4',
    license: 'Pexels License (https://www.pexels.com/license/)',
    sourceId: 'pexels-7687649-4k',
    start: 0,
    duration: 8.5,
  },
  {
    stage: 'run',
    // Live network cabling and status lights: the infrastructure we keep running.
    title: 'Blue colored cables (Dima Krivoy)',
    source: 'https://www.pexels.com/video/blue-colored-cables-1085656/',
    download: 'https://videos.pexels.com/video-files/1085656/1085656-uhd_3840_2160_25fps.mp4',
    license: 'Pexels License (https://www.pexels.com/license/)',
    sourceId: 'pexels-1085656-4k',
    start: 0.5,
    duration: 10,
  },
  {
    stage: 'grow',
    // A designer editing an existing visual layout: changes and redesign work, not another code clip.
    title: 'A woman making a graphic design (ArtHouse Studio)',
    source: 'https://www.pexels.com/video/a-woman-making-a-graphic-design-7204567/',
    download: 'https://videos.pexels.com/video-files/7204567/7204567-uhd_3840_2160_24fps.mp4',
    license: 'Pexels License (https://www.pexels.com/license/)',
    sourceId: 'pexels-7204567-4k',
    start: 2,
    duration: 10,
  },
  {
    stage: 'partner',
    // A team planning together around one table: ongoing, embedded partnership.
    title: 'Teammates working on a project (MART PRODUCTION)',
    source: 'https://www.pexels.com/video/teammates-working-in-a-project-7534861/',
    download: 'https://videos.pexels.com/video-files/7534861/7534861-uhd_4096_2160_25fps.mp4',
    license: 'Pexels License (https://www.pexels.com/license/)',
    sourceId: 'pexels-7534861-4k',
    start: 1,
    duration: 10,
  },
]
