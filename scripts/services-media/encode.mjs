/**
 * Downloads and encodes the service stage videos listed in clips.mjs into
 * public/media/services. Needs ffmpeg (set FFMPEG to its path if it isn't on PATH).
 *
 *   node scripts/services-media/encode.mjs          # every clip
 *   node scripts/services-media/encode.mjs run      # one stage
 *
 * For each clip: a seamless loop (the last second crossfades back into the first frame, so
 * there is no jump when it repeats), silent H.264 at 1920×1080 and 1280×720 with capped
 * bitrates and faststart, and WebP posters (the loop's first frame) at 1920, 960 and 480 wide.
 * Originals are cached in .media-cache (gitignored).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { clips } from './clips.mjs'

const root = join(import.meta.dirname, '../..')
const cacheDir = join(root, '.media-cache')
const outDir = join(root, 'public/media/services')
mkdirSync(cacheDir, { recursive: true })
const ffmpeg = process.env.FFMPEG ?? 'ffmpeg'
const run = (args) => execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args])

const renditions = [
  { suffix: '', width: 1920, height: 1080, crf: 23, maxrate: '3800k' },
  { suffix: '-720', width: 1280, height: 720, crf: 24, maxrate: '1800k' },
]

const only = process.argv[2]
for (const clip of clips.filter((c) => !only || c.stage === only)) {
  const original = join(cacheDir, `${clip.stage}-${clip.sourceId}.mp4`)
  if (!existsSync(original)) {
    const res = await fetch(clip.download)
    if (!res.ok) throw new Error(`${clip.stage}: download failed (${res.status}) ${clip.download}`)
    writeFileSync(original, Buffer.from(await res.arrayBuffer()))
  }

  const { start = 0, duration = 10, fade = 1 } = clip
  for (const r of renditions) {
    const scale = `scale=${r.width}:${r.height}:force_original_aspect_ratio=increase:flags=lanczos,crop=${r.width}:${r.height},fps=25`
    // body = [fade, fade + duration); its last `fade` seconds dissolve into head = [0, fade),
    // which ends on the frame the body starts with, so the loop point is invisible.
    const filter = [
      `[0:v]${scale},split[a][b]`,
      `[a]trim=start=${fade}:end=${fade + duration},setpts=PTS-STARTPTS[body]`,
      `[b]trim=start=0:end=${fade},setpts=PTS-STARTPTS[head]`,
      `[body][head]xfade=transition=fade:duration=${fade}:offset=${duration - fade},format=yuv420p[v]`,
    ].join(';')
    const file = join(outDir, `${clip.stage}${r.suffix}.mp4`)
    run([
      '-ss',
      String(start),
      '-t',
      String(duration + fade + 0.5),
      '-i',
      original,
      '-filter_complex',
      filter,
      '-map',
      '[v]',
      '-an',
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-profile:v',
      'high',
      '-crf',
      String(r.crf),
      '-maxrate',
      r.maxrate,
      '-bufsize',
      String(parseInt(r.maxrate) * 2) + 'k',
      '-movflags',
      '+faststart',
      file,
    ])
    console.log(`${clip.stage}${r.suffix}.mp4`, `${(statSync(file).size / 1e6).toFixed(2)} MB`)
  }

  // Posters: the first frame of the loop, so the swap from poster to video is seamless.
  for (const [suffix, width] of [
    ['', 1920],
    ['-960', 960],
    ['-480', 480],
  ]) {
    const file = join(outDir, `${clip.stage}-poster${suffix}.webp`)
    run([
      '-i',
      join(outDir, `${clip.stage}.mp4`),
      '-frames:v',
      '1',
      '-vf',
      `scale=${width}:-2:flags=lanczos`,
      '-c:v',
      'libwebp',
      '-quality',
      '82',
      file,
    ])
  }
  console.log(`${clip.stage} posters done`)
}
