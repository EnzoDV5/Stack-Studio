/**
 * Captures the live client sites.
 *
 *   node scripts/mockups/capture.mjs                   # every viewport shot → .mockups/raw
 *   node scripts/mockups/capture.mjs salon-friend      # one project's shots
 *   node scripts/mockups/capture.mjs --full            # full-page captures for the case
 *   node scripts/mockups/capture.mjs --full gc-solar   # study laptop (public/media/projects)
 *
 * Viewport shots (gitignored) are placed in device mockups by render.mjs. Full-page captures
 * are the homepage top to bottom at 1440 wide, saved at 1.5× (2160 px) and 0.75× (1080 px),
 * scrolled inside the laptop on each case study. 1.5× is the ceiling: WebP can't exceed
 * 16383 px on a side, and the longest page is about 9600 CSS px tall.
 *
 * Captured with prefers-reduced-motion: reduce so scroll-driven sections render in their
 * final state, after scrolling the page once so lazy images load.
 */
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from './browser.mjs'
import { devices, shots, sites } from './shots.mjs'

const root = join(import.meta.dirname, '../..')
const rawDir = join(root, '.mockups/raw')
const fullDir = join(root, 'public/media/projects')
mkdirSync(rawDir, { recursive: true })

const args = process.argv.slice(2)
const full = args.includes('--full')
const only = args.find((arg) => !arg.startsWith('--'))
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const agents = {
  mobile:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  tablet:
    'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
}

/** Opens a page of a site ready to capture: per-site fixes applied, lazy content loaded. */
async function open(browser, project, path, device, viewport = devices[device]) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  if (agents[device]) await page.setUserAgent(agents[device])
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  const site = sites[project]
  await page.goto(site.spa ? site.url + '/' : site.url + path, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  })
  if (site.hide) await page.addStyleTag({ content: `${site.hide} { display: none !important; }` })
  if (site.prepare) await page.evaluate(site.prepare)
  if (site.spa && path !== '/') {
    // Push the route for the site's router (no menu or link clicks, which leave overlays).
    await page.evaluate((to) => {
      history.pushState({}, '', to)
      dispatchEvent(new PopStateEvent('popstate'))
    }, path)
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
  return page
}

const browser = await launch()

if (full) {
  for (const project of Object.keys(sites).filter((id) => !only || id === only)) {
    const page = await open(browser, project, '/', 'desktop', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1.5,
    })
    await page.evaluate(() => document.fonts.ready)
    await wait(1500)
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (const [suffix, scale] of [
      ['', 1.5],
      ['-1440', 1],
      ['-small', 0.75],
      ['-720', 0.5],
    ]) {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: scale })
      await wait(800)
      const file = join(fullDir, `${project}-screen${suffix}.webp`)
      await page.screenshot({ path: file, type: 'webp', quality: 88, fullPage: true })
      console.log('captured', file)
    }
    // media.ts needs the page height: siteCapture(id, height, alt).
    console.log(
      `  ${project}: ${height} CSS px tall → siteCapture height ${Math.round(height * 1.5)}`,
    )
    await page.close()
  }
} else {
  for (const shot of shots.filter((s) => !only || s.project === only)) {
    const page = await open(browser, shot.project, shot.path, shot.device)
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

    const file = join(rawDir, `${shot.project}-${shot.name}-${shot.device}.png`)
    await page.screenshot({ path: file })
    console.log('captured', file)
    await page.close()
  }
}

await browser.close()
