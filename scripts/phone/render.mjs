/**
 * Renders the phone turn: the iPhone 17 Pro model (assets/models/iphone-17-pro) with a screen
 * on it, as a sequence of transparent WebP frames in
 * public/media/phone/{id}/turn-{frame}-{width}.webp. The site plays them back on scroll
 * (components/media/ImageSequence); it never loads a 3D library. three.js runs only here, in
 * headless Chrome, from a pinned CDN build (scene.js).
 *
 *   node scripts/phone/render.mjs              # every sequence
 *   node scripts/phone/render.mjs app          # one sequence
 *   node scripts/phone/render.mjs app 0,35     # only these frames (quick look)
 *
 * A screen is an HTML page in screens/ (rendered here at 402 × 812 CSS px, 3x) or a mobile
 * capture in .mockups/raw (npm run mockups:capture). Motion, finish and sizes: shots.mjs.
 */
/* global window, document -- used inside page.evaluate, in Chrome */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from '../mockups/browser.mjs'
import { look, sequences, turn } from './shots.mjs'

const root = join(import.meta.dirname, '../..')
const THREE = 'https://cdn.jsdelivr.net/npm/three@0.170.0'
const files = {
  '/model.glb': ['model/gltf-binary', join(root, 'assets/models/iphone-17-pro/iphone-17-pro.glb')],
  '/scene.js': ['text/javascript', join(import.meta.dirname, 'scene.js')],
  '/font.woff2': [
    'font/woff2',
    join(
      root,
      'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
    ),
  ],
}

const html = (config) => `<!doctype html>
<html><head><style>html,body{margin:0;background:transparent}</style>
<script type="importmap">{"imports":{"three":"${THREE}/build/three.module.js","three/addons/":"${THREE}/examples/jsm/"}}</script>
<script>window.__config = ${JSON.stringify(config)}</script>
<script type="module" src="/scene.js"></script>
</head><body></body></html>`

const [filter, only] = process.argv.slice(2)
const selected = sequences.filter((s) => !filter || s.id === filter)
if (!selected.length) throw new Error(`No sequence "${filter}"`)
const frames = only ? only.split(',').map(Number) : Array.from({ length: turn.frames }, (_, i) => i)

const lerp = (a, b, t) => a + (b - a) * t
const angles = (frame) => {
  const t = turn.frames === 1 ? 1 : frame / (turn.frames - 1)
  return {
    turn: lerp(turn.from.turn, turn.to.turn, t),
    tilt: lerp(turn.from.tilt, turn.to.tilt, t),
    roll: lerp(turn.from.roll, turn.to.roll, t),
  }
}
const pad = (n) => String(n).padStart(2, '0')

/** The screen as a PNG: an HTML screen rendered at 3x, or a capture as is. */
async function screenPng(screen) {
  if (!screen.endsWith('.html')) return readFileSync(join(root, '.mockups/raw', `${screen}.png`))
  const tab = await browser.newPage()
  // The iPhone 17 Pro screen below its status bar, so an HTML screen fits it exactly.
  await tab.setViewport({ width: 402, height: 812, deviceScaleFactor: 3 })
  await tab.setRequestInterception(true)
  tab.on('request', (request) => {
    const { pathname, host } = new URL(request.url())
    if (host !== 'screen.local') return void request.continue()
    if (pathname === '/font.woff2')
      return void request.respond({
        contentType: 'font/woff2',
        body: readFileSync(files['/font.woff2'][1]),
      })
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

const browser = await launch({
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
})
try {
  for (const sequence of selected) {
    const outDir = join(root, 'public/media/phone', sequence.id)
    if (!only) rmSync(outDir, { recursive: true, force: true })
    mkdirSync(outDir, { recursive: true })

    const screen = await screenPng(sequence.screen)
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
        return void request.respond({
          contentType: 'image/png',
          body: screen,
        })
      request.respond({ contentType: 'text/html', body: html(look) })
    })
    await tab.goto('http://render.local/', { waitUntil: 'load' })
    await tab.waitForFunction('window.__ready', { timeout: 180_000, polling: 250 })

    let bytes = 0
    for (const frame of frames) {
      for (const width of turn.widths) {
        const height = Math.round(width / turn.aspect)
        const result = await tab.evaluate((args) => window.renderFrame(args), {
          ...angles(frame),
          width,
          height,
        })
        if (result.type !== 'image/webp') throw new Error(`Chrome returned ${result.type}`)
        const data = Buffer.from(result.base64, 'base64')
        if (width === turn.widths.at(-1)) bytes += data.length
        writeFileSync(join(outDir, `turn-${pad(frame)}-${width}.webp`), data)
      }
    }
    console.log(
      `${sequence.id}: ${frames.length} frames at ${turn.widths.join(', ')} wide ` +
        `(${Math.round(bytes / 1024)} KB at ${turn.widths.at(-1)})`,
    )
    await tab.close()
  }
} finally {
  await browser.close()
}
