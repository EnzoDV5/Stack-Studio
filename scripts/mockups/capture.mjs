/**
 * Captures viewport screenshots of the live client sites into .mockups/raw (gitignored),
 * for scripts/mockups/render.mjs to place in device mockups.
 *
 *   node scripts/mockups/capture.mjs                 # every shot
 *   node scripts/mockups/capture.mjs salon-friend    # one project
 *
 * Captured with prefers-reduced-motion: reduce so scroll-driven sections render in their
 * final state, after scrolling the page once so lazy images load.
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from './browser.mjs'
import { devices, shots, sites } from './shots.mjs'

const outDir = join(import.meta.dirname, '../../.mockups/raw')
mkdirSync(outDir, { recursive: true })

const only = process.argv[2]
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const browser = await launch()

for (const shot of shots.filter((s) => !only || s.project === only)) {
  const page = await browser.newPage()
  const viewport = devices[shot.device]
  await page.setViewport(viewport)
  if (shot.device === 'mobile') {
    await page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    )
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  const site = sites[shot.project]
  await page.goto(site.spa ? site.url + '/' : site.url + shot.path, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  })
  if (site.hide) await page.addStyleTag({ content: `${site.hide} { display: none !important; }` })
  if (site.prepare) await page.evaluate(site.prepare)
  if (site.spa && shot.path !== '/') {
    // Push the route for the site's router (no menu or link clicks, which leave overlays).
    await page.evaluate((path) => {
      history.pushState({}, '', path)
      dispatchEvent(new PopStateEvent('popstate'))
    }, shot.path)
    await page.waitForNetworkIdle({ idleTime: 800, timeout: 30000 }).catch(() => {})
    await wait(1500)
  }
  await wait(1200)

  // Scroll through once so lazy images and in-view reveals have run, then settle.
  await page.evaluate(async () => {
    const step = innerHeight * 0.8
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 120))
    }
    scrollTo(0, 0)
  })
  await wait(600)

  if (shot.anchor) {
    // Land the section just under the site's fixed header, as its own nav link would.
    await page.evaluate((anchor) => {
      const el = document.querySelector(anchor)
      const header = document.querySelector('header, nav, #nav')
      const offset = header ? header.getBoundingClientRect().bottom : 0
      if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY - offset)
    }, shot.anchor)
    // In-view reveals start on arrival; let them finish.
    await wait(2000)
  }
  // Let fonts, images and any header state settle.
  await page.evaluate(() => document.fonts.ready)
  await wait(1200)

  const file = join(outDir, `${shot.project}-${shot.name}-${shot.device}.png`)
  await page.screenshot({ path: file })
  console.log('captured', file)
  await page.close()
}

await browser.close()
