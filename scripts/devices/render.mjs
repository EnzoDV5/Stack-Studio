/**
 * Renders the Services device sequences: a 3D model (assets/models) with a screen on it, as
 * transparent WebP frames in public/media/{device}/{id}/frame-{nn}-{width}.webp. The site plays
 * them back (components/media/ImageSequence); it never loads a 3D library. three.js runs only
 * here, in headless Chrome, from a pinned CDN build (phone-scene.js, laptop-scene.js).
 *
 *   node scripts/devices/render.mjs                 # every sequence
 *   node scripts/devices/render.mjs desktop         # one sequence
 *   node scripts/devices/render.mjs desktop 0,59    # only these frames (quick look)
 *
 * A screen is an HTML page in screens/ (rendered at the device's screen size) or a mobile
 * capture in .mockups/raw (npm run mockups:capture). Devices, looks and motion: shots.mjs.
 */
/* global window, document -- used inside page.evaluate, in Chrome */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from '../mockups/browser.mjs'
import { devices, sequences } from './shots.mjs'

const root = join(import.meta.dirname, '../..')
const THREE = 'https://cdn.jsdelivr.net/npm/three@0.170.0'
const font = join(
  root,
  'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
)

const html = (scene, config) => `<!doctype html>
<html><head><style>html,body{margin:0;background:transparent}</style>
<script type="importmap">{"imports":{"three":"${THREE}/build/three.module.js","three/addons/":"${THREE}/examples/jsm/"}}</script>
<script>window.__config = ${JSON.stringify(config)}</script>
<script type="module" src="/${scene}"></script>
</head><body></body></html>`

const [filter, only] = process.argv.slice(2)
const selected = sequences.filter((s) => !filter || s.id === filter)
if (!selected.length) throw new Error(`No sequence "${filter}"`)

const lerp = (a, b, t) => a + (b - a) * t
/** Every key of the motion at this frame, evenly spaced from `from` to `to`. */
const pose = (motion, frame) => {
  const t = motion.frames === 1 ? 1 : frame / (motion.frames - 1)
  return Object.fromEntries(
    Object.keys(motion.to).map((key) => [key, lerp(motion.from[key] ?? 0, motion.to[key], t)]),
  )
}
const pad = (n) => String(n).padStart(2, '0')

const browser = await launch({
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
})

/** The screen as a PNG: an HTML screen rendered at the device's size, or a capture as is. */
async function screenPng(screen, size) {
  if (!screen.endsWith('.html')) return readFileSync(join(root, '.mockups/raw', `${screen}.png`))
  const tab = await browser.newPage()
  await tab.setViewport({ width: size.width, height: size.height, deviceScaleFactor: size.scale })
  await tab.setRequestInterception(true)
  tab.on('request', (request) => {
    const { pathname, host } = new URL(request.url())
    if (host !== 'screen.local') return void request.continue()
    if (pathname === '/font.woff2')
      return void request.respond({ contentType: 'font/woff2', body: readFileSync(font) })
    request.respond({
      contentType: 'text/html',
      body: readFileSync(join(import.meta.dirname, 'screens', screen)),
    })
  })
  await tab.goto('http://screen.local/', { waitUntil: 'load' })
  await tab.evaluate(() => document.fonts.ready)
  const png = await tab.screenshot({ type: 'png' })
  await tab.close()
  return Buffer.from(png)
}

try {
  for (const sequence of selected) {
    const device = devices[sequence.device]
    const { motion } = device
    const frames = only
      ? only.split(',').map(Number)
      : Array.from({ length: motion.frames }, (_, i) => i)
    const outDir = join(root, 'public/media', sequence.device, sequence.id)
    if (!only) rmSync(outDir, { recursive: true, force: true })
    mkdirSync(outDir, { recursive: true })

    const screen = await screenPng(sequence.screen, device.screen)
    const files = {
      '/model.glb': ['model/gltf-binary', join(root, 'assets/models', device.model)],
      [`/${device.scene}`]: ['text/javascript', join(import.meta.dirname, device.scene)],
      '/font.woff2': ['font/woff2', font],
    }
    const tab = await browser.newPage()
    tab.on('console', (m) => m.type() === 'error' && console.error(`  ${m.text()}`))
    tab.on('pageerror', (error) => console.error(`  ${sequence.id}: ${error.message}`))
    await tab.setRequestInterception(true)
    tab.on('request', (request) => {
      const { pathname, host } = new URL(request.url())
      if (host !== 'render.local') return void request.continue()
      const file = files[pathname]
      if (file) return void request.respond({ contentType: file[0], body: readFileSync(file[1]) })
      if (pathname === '/screen.png')
        return void request.respond({ contentType: 'image/png', body: screen })
      request.respond({ contentType: 'text/html', body: html(device.scene, device.look) })
    })
    await tab.goto('http://render.local/', { waitUntil: 'load' })
    await tab.waitForFunction('window.__ready', { timeout: 180_000, polling: 250 })
    // Scenes that can (the laptop) frame the camera once around every pose of the motion.
    const allPoses = Array.from({ length: motion.frames }, (_, i) => pose(motion, i))
    await tab.evaluate(
      (poses, aspect) =>
        window.fit?.(
          poses.filter((_, i) => i % 4 === 0 || i === poses.length - 1),
          aspect,
        ),
      allPoses,
      motion.aspect,
    )

    let bytes = 0
    for (const frame of frames) {
      for (const width of motion.widths) {
        const height = Math.round(width / motion.aspect)
        const result = await tab.evaluate((args) => window.renderFrame(args), {
          ...pose(motion, frame),
          width,
          height,
        })
        if (result.type !== 'image/webp') throw new Error(`Chrome returned ${result.type}`)
        const data = Buffer.from(result.base64, 'base64')
        if (width === motion.widths.at(-1)) bytes += data.length
        writeFileSync(join(outDir, `frame-${pad(frame)}-${width}.webp`), data)
      }
    }
    console.log(
      `${sequence.id}: ${frames.length} frames at ${motion.widths.join(', ')} wide ` +
        `(${Math.round(bytes / 1024)} KB at ${motion.widths.at(-1)})`,
    )
    await tab.close()
  }
} finally {
  await browser.close()
}
