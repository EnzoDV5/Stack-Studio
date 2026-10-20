// Encodes the card illustrations: each source SVG in public/Illustrations wraps one large PNG
// (2-4 MB). Chrome draws the SVG exactly as a page would, and responsive WebP renditions are
// written with its canvas encoder (local Chrome via puppeteer-core), so a card downloads the
// width it is shown at instead of the whole source.
//
//   node scripts/illustrations/encode.mjs [sourceDir] [outDir] [quality]
//
// Widths per illustration are below; keep them in sync with `illustration()` in
// src/data/media.ts.
/* global Image, OffscreenCanvas -- used inside page.evaluate, in Chrome */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from '../mockups/browser.mjs'

const [sourceDir = 'public/Illustrations', outDir = 'public/media/illustrations', quality = '0.9'] =
  process.argv.slice(2)

/** Source file → id and widths (largest first). */
const illustrations = {
  // The work reel's closing card: at most ~384 CSS px wide, so 1200 covers 3× screens.
  'StartToFinish.svg': { id: 'start-to-finish', widths: [1200, 800, 480] },
  // Services, Fix or improve: up to ~880 CSS px wide beside its intro.
  'FixOrImprove.svg': { id: 'fix-or-improve', widths: [1760, 1200, 800, 480] },
  // Studio, the intro beside the story: up to ~640 CSS px wide (40vw on large screens).
  'Studio.svg': { id: 'studio', widths: [1280, 960, 640, 480] },
}

mkdirSync(outDir, { recursive: true })
const browser = await launch()
const page = await browser.newPage()

for (const [file, { id, widths }] of Object.entries(illustrations)) {
  const svg = readFileSync(join(sourceDir, file))
  const dataUrl = `data:image/svg+xml;base64,${svg.toString('base64')}`

  const results = await page.evaluate(
    async (src, widths, quality) => {
      const img = new Image()
      img.src = src
      await img.decode()
      const ratio = img.naturalHeight / img.naturalWidth
      // Rasterise at twice the largest width, then halve in steps so the edges stay crisp.
      const first = widths[0] * 2
      let canvas = new OffscreenCanvas(first, Math.round(first * ratio))
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)

      const out = []
      for (const w of widths) {
        let src = canvas
        while (src.width / 2 >= w) {
          const step = new OffscreenCanvas(Math.round(src.width / 2), Math.round(src.height / 2))
          const c = step.getContext('2d')
          c.imageSmoothingQuality = 'high'
          c.drawImage(src, 0, 0, step.width, step.height)
          src = step
        }
        const target = new OffscreenCanvas(w, Math.round(w * ratio))
        const ctx = target.getContext('2d')
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(src, 0, 0, target.width, target.height)
        const blob = await target.convertToBlob({ type: 'image/webp', quality })
        const bytes = new Uint8Array(await blob.arrayBuffer())
        let binary = ''
        for (let i = 0; i < bytes.length; i += 0x8000)
          binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
        out.push({ w, h: target.height, type: blob.type, b64: btoa(binary) })
      }
      return out
    },
    dataUrl,
    widths,
    Number(quality),
  )

  for (const { w, h, type, b64 } of results) {
    if (type !== 'image/webp') throw new Error(`Chrome returned ${type}`)
    const bytes = Buffer.from(b64, 'base64')
    const target = join(outDir, `${id}-${w}.webp`)
    writeFileSync(target, bytes)
    console.log(target, `${w}x${h}`, `${(bytes.length / 1024).toFixed(1)} KB`)
  }
}
await browser.close()
