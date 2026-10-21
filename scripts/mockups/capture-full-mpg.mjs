import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const width = 1440
const viewportHeight = 900
const scale = 1.5
const stripHeight = 450
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * MPG's in-view reveals disappear in Chrome's fullPage screenshot. Capture each part while
 * visible and stitch the page together. The story's sticky image is made static for the still.
 */
export async function captureFullMpg(browser, outputDir) {
  const page = await browser.newPage()
  const compositor = await browser.newPage()

  try {
    await page.setViewport({ width, height: viewportHeight, deviceScaleFactor: scale })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto('https://mpgf.org.za/', { waitUntil: 'networkidle2', timeout: 60000 })
    await page.addStyleTag({
      content:
        '.announce { display: none !important; } ' +
        '.story__stack--mark { position: static !important; } ' +
        '.story__stack--mark .story__figure--photo { display: none !important; }',
    })
    await page.evaluate(() => document.body.classList.remove('has-announce'))
    await page.evaluate(() => document.fonts.ready)

    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y)
      await wait(200)
    }

    await compositor.evaluate(
      ({ w, h }) => {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        document.body.append(canvas)
      },
      { w: Math.round(width * scale), h: Math.round(height * scale) },
    )

    for (let targetY = 0; targetY < height; targetY += stripHeight) {
      const desiredScroll = Math.min(Math.max(targetY - 150, 0), height - viewportHeight)
      const actualScroll = await page.evaluate((top) => {
        scrollTo({ top, behavior: 'instant' })
        return scrollY
      }, desiredScroll)
      const finalStrip = viewportHeight - (targetY - actualScroll) >= height - targetY
      await wait(500)
      const shot = await page.screenshot({ type: 'png' })
      await compositor.evaluate(
        async ({ data, sourceY, destinationY, cropHeight, w }) => {
          const image = new Image()
          image.src = `data:image/png;base64,${data}`
          await image.decode()
          document
            .querySelector('canvas')
            .getContext('2d')
            .drawImage(image, 0, sourceY, w, cropHeight, 0, destinationY, w, cropHeight)
        },
        {
          data: Buffer.from(shot).toString('base64'),
          sourceY: Math.round((targetY - actualScroll) * scale),
          destinationY: Math.round(targetY * scale),
          cropHeight: Math.round((finalStrip ? height - targetY : stripHeight) * scale),
          w: Math.round(width * scale),
        },
      )
      if (finalStrip) break
    }

    for (const [outputWidth, suffix] of [
      [2160, ''],
      [1440, '-1440'],
      [1080, '-small'],
      [720, '-720'],
    ]) {
      const dataUrl = await compositor.evaluate((w) => {
        const master = document.querySelector('canvas')
        if (w === master.width) return master.toDataURL('image/webp', 0.9)
        const variant = document.createElement('canvas')
        variant.width = w
        variant.height = Math.round((master.height * w) / master.width)
        variant.getContext('2d').drawImage(master, 0, 0, variant.width, variant.height)
        return variant.toDataURL('image/webp', 0.9)
      }, outputWidth)
      const file = join(outputDir, `mpg-foundation-screen${suffix}.webp`)
      writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'))
      console.log('captured', file)
    }
    console.log(
      `  mpg-foundation: ${height} CSS px tall → siteCapture height ${Math.round(height * scale)}`,
    )
  } finally {
    await page.close()
    await compositor.close()
  }
}
