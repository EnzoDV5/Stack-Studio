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
    // A designer drawing on a graphics tablet: the first sketch, the start of every build.
    title: 'Writing on a graphics tablet',
    source: 'https://coverr.co/videos/writing-on-a-graphics-tablet-HGosg0oNwP',
    download: 'https://cdn.coverr.co/videos/coverr-writing-on-a-graphics-tablet-2744/1080p.mp4',
    license: 'Coverr License (https://coverr.co/license)',
    sourceId: 'coverr-2744',
    start: 0.2,
    duration: 9.5,
  },
  {
    stage: 'takeover',
    // Code on a laptop screen being read through: auditing what the client already has.
    title: 'Coding on a laptop',
    source: 'https://coverr.co/videos/coding-on-a-laptop-rXf1Hyrfkk',
    download: 'https://cdn.coverr.co/videos/coverr-coding-on-a-laptop-2116/1080p.mp4',
    license: 'Coverr License (https://coverr.co/license)',
    sourceId: 'coverr-2116',
    start: 1,
    duration: 10,
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
    // Results presented on a dashboard: measuring and improving what's live.
    title: 'A young man showing results in a meeting',
    source: 'https://coverr.co/videos/a-young-man-showing-results-in-a-meeting-vRPGR76WtO',
    download:
      'https://cdn.coverr.co/videos/coverr-a-young-man-showing-results-in-a-meeting-726/1080p.mp4',
    license: 'Coverr License (https://coverr.co/license)',
    sourceId: 'coverr-726',
    start: 1,
    duration: 10,
  },
  {
    stage: 'partner',
    // Two people working through something together: a team that knows your systems.
    title: 'Teamwork in the office',
    source: 'https://coverr.co/videos/teamwork-in-the-office-Sf189e49k5',
    download: 'https://cdn.coverr.co/videos/coverr-teamwork-in-the-office-7943/1080p.mp4',
    license: 'Coverr License (https://coverr.co/license)',
    sourceId: 'coverr-7943',
    start: 1.5,
    duration: 10,
  },
]
