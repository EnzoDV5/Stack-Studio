// Crops a founder photo to 4:5 (from the top, keeping the headroom) and encodes WebP
// renditions with headless Chrome's canvas encoder (local Chrome via puppeteer-core, so no
// ffmpeg needed). Canvas output carries no EXIF, so camera and location data are dropped.
//
//   node scripts/founders/encode.mjs <photo.jpg> public/media/founders/<id> [widths] [quality]
//   node scripts/founders/encode.mjs ~/Downloads/enzo.jpg public/media/founders/enzo
/* global createImageBitmap, OffscreenCanvas -- used inside page.evaluate, in Chrome */
import { readFileSync, writeFileSync } from 'node:fs'
import { launch } from '../mockups/browser.mjs'

const [input, outBase, widthsArg = '1200,800,480', quality = '0.84'] = process.argv.slice(2)
const widths = widthsArg.split(',').map(Number)
const dataUrl = `data:image/jpeg;base64,${readFileSync(input).toString('base64')}`

const browser = await launch()
const page = await browser.newPage()
const results = await page.evaluate(
  async (dataUrl, widths, quality) => {
    const bitmap = await createImageBitmap(await (await fetch(dataUrl)).blob())
    const cropW = bitmap.width
    const cropH = Math.min(bitmap.height, Math.round((cropW * 5) / 4))
    const out = []
    for (const w of widths) {
      const h = Math.round((w * 5) / 4)
      // Halve in steps first so the final downscale stays sharp.
      let src = bitmap
      let sw = cropW
      let sh = cropH
      let first = true
      while (sw / 2 >= w) {
        const step = new OffscreenCanvas(Math.round(sw / 2), Math.round(sh / 2))
        const c = step.getContext('2d')
        c.imageSmoothingQuality = 'high'
        if (first) c.drawImage(src, 0, 0, cropW, cropH, 0, 0, step.width, step.height)
        else c.drawImage(src, 0, 0, step.width, step.height)
        src = step
        sw = step.width
        sh = step.height
        first = false
      }
      const canvas = new OffscreenCanvas(w, h)
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      if (first) ctx.drawImage(src, 0, 0, cropW, cropH, 0, 0, w, h)
      else ctx.drawImage(src, 0, 0, sw, sh, 0, 0, w, h)
      const blob = await canvas.convertToBlob({ type: 'image/webp', quality })
      const bytes = new Uint8Array(await blob.arrayBuffer())
      let binary = ''
      for (let i = 0; i < bytes.length; i += 0x8000)
        binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
      out.push({ w, h, type: blob.type, b64: btoa(binary) })
    }
    return { source: [bitmap.width, bitmap.height], crop: [cropW, cropH], out }
  },
  dataUrl,
  widths,
  Number(quality),
)
await browser.close()

console.log('source', results.source.join('x'), 'crop', results.crop.join('x'))
for (const { w, h, type, b64 } of results.out) {
  if (type !== 'image/webp') throw new Error(`Chrome returned ${type}`)
  const file = `${outBase}-${w}.webp`
  writeFileSync(file, Buffer.from(b64, 'base64'))
  console.log(file, `${w}x${h}`, `${Math.round(Buffer.from(b64, 'base64').length / 1024)} KB`)
}
