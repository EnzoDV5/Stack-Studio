// Encodes the Services quick-pick icons: each source SVG in public/Icons wraps one large
// transparent PNG of orange line art with a lot of empty margin. The art is cropped to a padded
// square and small WebP renditions are written with headless Chrome's canvas encoder (local
// Chrome via puppeteer-core), a few KB each instead of ~0.5 MB.
//
//   node scripts/icons/encode.mjs [sourceDir] [outDir] [widths] [quality]
//   node scripts/icons/encode.mjs public/Icons public/media/services/icons 192,128,96
/* global createImageBitmap, OffscreenCanvas -- used inside page.evaluate, in Chrome */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from '../mockups/browser.mjs'

const [
  sourceDir = 'public/Icons',
  outDir = 'public/media/services/icons',
  widthsArg = '192,128,96',
  quality = '0.9',
] = process.argv.slice(2)
const widths = widthsArg.split(',').map(Number)

/** Source file → icon id (the Services section it stands for). */
const icons = {
  'NewWesbite.svg': 'new-website',
  'AppsAndSoftware.svg': 'apps',
  'DeesktopSoftware.svg': 'desktop',
  'FixAndImprove.svg': 'fix-or-improve',
  'HostingAndCare.svg': 'hosting-and-care',
  'Questions.svg': 'questions',
}

mkdirSync(outDir, { recursive: true })
const browser = await launch()
const page = await browser.newPage()

for (const [file, id] of Object.entries(icons)) {
  const svg = readFileSync(join(sourceDir, file), 'utf8')
  const png = svg.match(/data:image\/png;base64,[^"]+/)?.[0]
  if (!png) throw new Error(`${file}: no embedded PNG`)

  const results = await page.evaluate(
    async (dataUrl, widths, quality) => {
      const bitmap = await createImageBitmap(await (await fetch(dataUrl)).blob())
      const { width, height } = bitmap
      const source = new OffscreenCanvas(width, height)
      const sctx = source.getContext('2d')
      sctx.drawImage(bitmap, 0, 0)
      const d = sctx.getImageData(0, 0, width, height).data

      // The bounds of the art (the background is transparent).
      let minX = width
      let minY = height
      let maxX = -1
      let maxY = -1
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (d[(y * width + x) * 4 + 3] < 26) continue
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }

      // A square around the art with a little room for the stroke.
      const side = Math.round(Math.max(maxX - minX, maxY - minY) * 1.06)
      const cx = (minX + maxX) / 2
      const cy = (minY + maxY) / 2
      const crop = new OffscreenCanvas(side, side)
      crop
        .getContext('2d')
        .drawImage(
          source,
          Math.round(cx - side / 2),
          Math.round(cy - side / 2),
          side,
          side,
          0,
          0,
          side,
          side,
        )

      const out = []
      for (const w of widths) {
        // Halve in steps first so the final downscale stays sharp.
        let src = crop
        while (src.width / 2 >= w) {
          const step = new OffscreenCanvas(Math.round(src.width / 2), Math.round(src.height / 2))
          const c = step.getContext('2d')
          c.imageSmoothingQuality = 'high'
          c.drawImage(src, 0, 0, step.width, step.height)
          src = step
        }
        const canvas = new OffscreenCanvas(w, w)
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(src, 0, 0, w, w)
        const blob = await canvas.convertToBlob({ type: 'image/webp', quality })
        const bytes = new Uint8Array(await blob.arrayBuffer())
        let binary = ''
        for (let i = 0; i < bytes.length; i += 0x8000)
          binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
        out.push({ w, type: blob.type, b64: btoa(binary) })
      }
      return { side, out }
    },
    png,
    widths,
    Number(quality),
  )

  for (const { w, type, b64 } of results.out) {
    if (type !== 'image/webp') throw new Error(`Chrome returned ${type}`)
    const bytes = Buffer.from(b64, 'base64')
    const target = join(outDir, `${id}-${w}.webp`)
    writeFileSync(target, bytes)
    console.log(
      target,
      `${w}x${w}`,
      `${(bytes.length / 1024).toFixed(1)} KB`,
      `(crop ${results.side}px)`,
    )
  }
}
await browser.close()
