/**
 * Makes the on-dark versions of client logos drawn for light backgrounds (and the on-light
 * version of one drawn for dark), so each can sit straight on either page tone with no plate.
 *
 *   node scripts/mockups/logos.mjs
 *
 * Neutral pixels (black, greys) are inverted, so black type turns white and mid grey turns
 * light grey; coloured pixels and transparency are kept, so the brand colours don't change.
 * Writes public/logos/clients/{id}-on-dark.webp (or -on-light) next to each source logo.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from './browser.mjs'

const dir = join(import.meta.dirname, '../../public/logos/clients')
/**
 * Source logo → the tone it's made for, and the share of the width to start from (the part
 * to the left is kept as it is).
 */
const logos = [
  ['mpg-foundation', 'on-dark', 0],
  ['salon-friend', 'on-dark', 0],
  // GC Solar is drawn for dark: white "SOLAR" beside a green block with white "GC", which
  // stays. The block's muted green would read as neutral, so only "SOLAR" is inverted.
  ['gc-solar', 'on-light', 0.38],
]

const browser = await launch()
const page = await browser.newPage()

for (const [id, tone, from] of logos) {
  const source = `data:image/webp;base64,${readFileSync(join(dir, `${id}.webp`)).toString('base64')}`
  const output = await page.evaluate(
    async (src, from) => {
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
      const startX = Math.round(canvas.width * from)
      for (let i = 0; i < px.length; i += 4) {
        if ((i / 4) % canvas.width < startX) continue
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
    },
    source,
    from,
  )
  const file = join(dir, `${id}-${tone}.webp`)
  writeFileSync(file, Buffer.from(output.split(',')[1], 'base64'))
  console.log('wrote', file)
}

await browser.close()
