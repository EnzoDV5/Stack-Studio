/**
 * Makes the on-dark versions of client logos drawn for light backgrounds, so they can sit
 * straight on a dark page with no plate behind them.
 *
 *   node scripts/mockups/logos.mjs
 *
 * Neutral pixels (black, greys) are inverted, so black type turns white and mid grey turns
 * light grey; coloured pixels and transparency are kept, so the brand colours don't change.
 * Writes public/logos/clients/{id}-on-dark.webp next to each source logo.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from './browser.mjs'

const dir = join(import.meta.dirname, '../../public/logos/clients')
const logos = ['mpg-foundation', 'salon-friend']

const browser = await launch()
const page = await browser.newPage()

for (const id of logos) {
  const source = `data:image/webp;base64,${readFileSync(join(dir, `${id}.webp`)).toString('base64')}`
  const output = await page.evaluate(async (src) => {
    const img = new Image()
    img.src = src
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const px = data.data
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i]
      const g = px[i + 1]
      const b = px[i + 2]
      // Neutral: the channels are close together (black, greys, anti-aliased edges).
      if (Math.max(r, g, b) - Math.min(r, g, b) < 36) {
        px[i] = 255 - r
        px[i + 1] = 255 - g
        px[i + 2] = 255 - b
      }
    }
    ctx.putImageData(data, 0, 0)
    return canvas.toDataURL('image/webp', 1)
  }, source)
  const file = join(dir, `${id}-on-dark.webp`)
  writeFileSync(file, Buffer.from(output.split(',')[1], 'base64'))
  console.log('wrote', file)
}

await browser.close()
