/**
 * Renders device mockups of the client sites from the captures in .mockups/raw
 * (run capture.mjs first) into public/media/projects/mockups.
 *
 *   node scripts/mockups/render.mjs                 # every scene
 *   node scripts/mockups/render.mjs salon-friend    # one project
 *
 * Each scene is plain HTML and CSS (laptop, phone and browser drawn in CSS, no image
 * assets) screenshotted by Chrome. Everything is sized in vw, so the same scene renders
 * crisp at full size and at the half-size -small variant.
 */
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from './browser.mjs'
import { scenes, themes } from './scenes.mjs'
import { shots, sites } from './shots.mjs'

const root = join(import.meta.dirname, '../..')
const rawDir = join(root, '.mockups/raw')
const outDir = join(root, 'public/media/projects/mockups')
mkdirSync(outDir, { recursive: true })

const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString('base64')}`
const font = dataUri(
  join(
    root,
    'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
  ),
  'font/woff2',
)
const capture = (project, name, device) =>
  dataUri(join(rawDir, `${project}-${name}-${device}.png`), 'image/png')

/** What the browser's address bar shows for a desktop capture. */
function address(project, name) {
  const shot = shots.find((s) => s.project === project && s.name === name && s.device === 'desktop')
  const host = new URL(sites[project].url).host
  const path = (shot?.path ?? '/') + (shot?.anchor ?? '')
  return { host, path: path === '/' ? '' : path }
}

/* ---------- devices ---------- */

function laptop({ image, w, x, y }) {
  return `
  <div class="laptop" style="--w:${w}vw; left:${x}vw; top:${y}vw">
    <div class="lid">
      <div class="screen"><img src="${image}" alt=""></div>
      <div class="notch"></div>
      <div class="glare"></div>
    </div>
    <div class="base"><div class="scoop"></div></div>
    <div class="contact"></div>
  </div>`
}

const statusIcons = `
  <svg viewBox="0 0 18 12" class="sig"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
  <svg viewBox="0 0 16 12" class="wifi"><path d="M8 11.6a1.6 1.6 0 1 0 0-.01zM3.9 7.6a5.8 5.8 0 0 1 8.2 0l-1.4 1.4a3.8 3.8 0 0 0-5.4 0zM1 4.7a9.9 9.9 0 0 1 14 0l-1.4 1.4a7.9 7.9 0 0 0-11.2 0z"/></svg>
  <svg viewBox="0 0 27 13" class="batt"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2"/><path d="M25 4.5v4a2 2 0 0 0 0-4z" opacity=".4"/></svg>`

function phone({ image, w, x, y }) {
  return `
  <div class="phone" style="--w:${w}vw; left:${x}vw; top:${y}vw">
    <i class="btn action"></i><i class="btn vol-up"></i><i class="btn vol-down"></i><i class="btn power"></i>
    <div class="frame">
      <div class="bezel">
        <div class="pscreen">
          <div class="status"><span class="time">9:41</span><span class="icons">${statusIcons}</span></div>
          <img class="page" src="${image}" alt="">
          <div class="island"></div>
          <div class="home-bar"></div>
          <div class="pglare"></div>
        </div>
      </div>
    </div>
    <div class="contact"></div>
  </div>`
}

function browser({ image, host, path, w, x, y, z = 2 }) {
  return `
  <div class="browser" style="--w:${w}vw; left:${x}vw; top:${y}vw; z-index:${z}">
    <div class="bar">
      <span class="lights"><i></i><i></i><i></i></span>
      <span class="nav"><svg viewBox="0 0 10 16"><path d="M8 2 2 8l6 6"/></svg><svg viewBox="0 0 10 16" class="off"><path d="M2 2l6 6-6 6"/></svg></span>
      <span class="url"><svg viewBox="0 0 12 14" class="lock"><rect x="1" y="6" width="10" height="7.5" rx="1.6"/><path d="M3.4 6V4.4a2.6 2.6 0 0 1 5.2 0V6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>${host}<span class="path">${path}</span></span>
      <span class="tools"><svg viewBox="0 0 16 16"><path d="M8 2v12M2 8h12"/></svg></span>
    </div>
    <div class="bscreen"><img src="${image}" alt=""></div>
  </div>`
}

/* ---------- layouts (all units vw; H = scene height in vw) ---------- */

function layout(scene, H) {
  const { project, layout: kind } = scene
  const desktop = scene.desktop && capture(project, scene.desktop, 'desktop')
  const mobile = scene.mobile && capture(project, scene.mobile, 'mobile')

  if (kind === 'laptop-phone') {
    // Laptop height ≈ 0.674w, phone height ≈ 2.07w.
    const lw = H > 60 ? 60 : 52
    const pw = H > 60 ? 15 : 13
    const lx = 50 - lw / 2 - lw * 0.12
    const ly = (H - lw * 0.674) / 2
    const px = lx + lw - pw * 0.35
    const py = ly + lw * 0.674 + lw * 0.03 - pw * 2.07
    return (
      laptop({ image: desktop, w: lw, x: lx, y: ly }) +
      phone({ image: mobile, w: pw, x: px, y: py })
    )
  }
  if (kind === 'browser') {
    const w = 64
    const { host, path } = address(project, scene.desktop)
    return browser({ image: desktop, host, path, w, x: 50 - w / 2, y: (H - w * 0.659) / 2 })
  }
  if (kind === 'browser-stack') {
    const w = 50
    const back = capture(project, scene.back, 'desktop')
    const b = address(project, scene.back)
    const f = address(project, scene.desktop)
    const top = (H - w * 0.659 - 9) / 2
    return (
      browser({ image: back, ...b, w, x: 12, y: top, z: 2 }) +
      browser({ image: desktop, ...f, w, x: 38, y: top + 9, z: 3 })
    )
  }
  if (kind === 'phone') {
    const w = 42
    return phone({ image: mobile, w, x: 50 - w / 2, y: (H - w * 2.07) / 2 })
  }
  throw new Error(`Unknown layout ${kind}`)
}

/* ---------- page ---------- */

function page(scene, H) {
  const t = themes[scene.project]
  const grain = `url("data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
  )}")`

  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Inter Tight'; src: url(${font}) format('woff2'); font-weight: 100 900; }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 100vw; height: 100vh; overflow: hidden; }
  body { font-family: 'Inter Tight', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  .scene { position: relative; width: 100vw; height: ${H}vw; overflow: hidden; background:
      radial-gradient(ellipse 60% 50% at 50% 46%, ${t.spot}, transparent 70%),
      radial-gradient(ellipse 55% 60% at 18% 12%, ${t.glowA}, transparent 70%),
      radial-gradient(ellipse 60% 55% at 88% 92%, ${t.glowB}, transparent 70%),
      ${t.bg}; }
  .grain { position: absolute; inset: 0; background-image: ${grain}; background-size: 12vw; opacity: ${t.grain}; mix-blend-mode: overlay; pointer-events: none; z-index: 0; }
  img { display: block; }

  /* Laptop: silver aluminium base, black glass lid with a notch. */
  .laptop { position: absolute; z-index: 2; width: var(--w); filter: drop-shadow(0 calc(var(--w) * .035) calc(var(--w) * .045) rgba(0,0,0,${t.shadow * 0.7})); }
  .lid { position: relative; padding: calc(var(--w) * .017) calc(var(--w) * .017) calc(var(--w) * .03);
    background: linear-gradient(#141416, #0b0b0c); border-radius: calc(var(--w) * .032) calc(var(--w) * .032) calc(var(--w) * .006) calc(var(--w) * .006);
    box-shadow: 0 0 0 calc(var(--w) * .0022) #c9ccd2, 0 0 0 calc(var(--w) * .0038) #7b7e85, inset 0 0 0 calc(var(--w) * .0016) #2c2d31; }
  .screen { aspect-ratio: 1440 / 900; overflow: hidden; border-radius: calc(var(--w) * .007) calc(var(--w) * .007) calc(var(--w) * .002) calc(var(--w) * .002); background: #000; }
  .screen img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .notch { position: absolute; top: calc(var(--w) * .017); left: 50%; transform: translateX(-50%); width: calc(var(--w) * .07); height: calc(var(--w) * .0135);
    background: #0b0b0c; border-radius: 0 0 calc(var(--w) * .006) calc(var(--w) * .006); }
  .notch::after { content: ''; position: absolute; left: 50%; top: 42%; width: calc(var(--w) * .0048); aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #33415a, #0a0d14 60%); }
  .glare { position: absolute; inset: calc(var(--w) * .017) calc(var(--w) * .017) calc(var(--w) * .03); pointer-events: none; border-radius: calc(var(--w) * .007);
    background: linear-gradient(118deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.015) 42%, transparent 42.3%); }
  .base { position: relative; width: calc(var(--w) * 1.16); margin-left: calc(var(--w) * -.08); height: calc(var(--w) * .027);
    background: linear-gradient(#f4f5f7 0%, #dcdee2 18%, #c3c6cb 55%, #9ea2a9 88%, #7d8087 100%);
    border-radius: calc(var(--w) * .004) calc(var(--w) * .004) calc(var(--w) * .06) calc(var(--w) * .06) / calc(var(--w) * .004) calc(var(--w) * .004) calc(var(--w) * .018) calc(var(--w) * .018);
    box-shadow: inset 0 calc(var(--w) * .0012) 0 rgba(255,255,255,.95), inset 0 calc(var(--w) * -.002) calc(var(--w) * .003) rgba(0,0,0,.18); }
  .base::after { content: ''; position: absolute; left: 3%; right: 3%; bottom: calc(var(--w) * -.004); height: calc(var(--w) * .006); border-radius: 0 0 50% 50% / 0 0 100% 100%; background: linear-gradient(#6f727a, #3d3f44); z-index: -1; }
  .scoop { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: calc(var(--w) * .14); height: calc(var(--w) * .0085);
    background: linear-gradient(#a7aab0, #cdd0d4); border-radius: 0 0 calc(var(--w) * .012) calc(var(--w) * .012) / 0 0 calc(var(--w) * .008) calc(var(--w) * .008); }
  .contact { position: absolute; left: -4%; right: -4%; bottom: calc(var(--w) * -.03); height: calc(var(--w) * .06); z-index: -1; filter: blur(calc(var(--w) * .012));
    background: radial-gradient(ellipse at center, rgba(0,0,0,${t.shadow}) 0%, transparent 68%); }

  /* Phone: titanium frame, black bezel, Dynamic Island, iOS status bar. */
  .phone { position: absolute; z-index: 3; width: var(--w); filter: drop-shadow(0 calc(var(--w) * .07) calc(var(--w) * .09) rgba(0,0,0,${t.shadow * 0.75})); }
  .frame { position: relative; padding: calc(var(--w) * .016); border-radius: calc(var(--w) * .17);
    background: linear-gradient(140deg, #9c9da2 0%, #4a4b50 18%, #2b2c30 50%, #4a4b50 82%, #8d8e93 100%);
    box-shadow: inset 0 0 0 calc(var(--w) * .004) rgba(255,255,255,.28), inset 0 0 calc(var(--w) * .01) rgba(0,0,0,.5); }
  .bezel { padding: calc(var(--w) * .032); background: #050506; border-radius: calc(var(--w) * .154); }
  .pscreen { --s: calc(var(--w) * .904); position: relative; aspect-ratio: 390 / 844; overflow: hidden; border-radius: calc(var(--w) * .122); background: #fff; }
  .status { position: absolute; inset: 0 0 auto; height: calc(var(--s) * .138); display: grid; grid-template-columns: 1fr calc(var(--s) * .34) 1fr; align-items: center; padding-top: calc(var(--s) * .012); z-index: 2; }
  .time { grid-column: 1; justify-self: center; font-weight: 600; font-size: calc(var(--s) * .044); letter-spacing: -.01em; }
  .icons { grid-column: 3; justify-self: center; display: flex; align-items: center; gap: calc(var(--s) * .014); }
  .icons svg { fill: currentColor; height: calc(var(--s) * .03); width: auto; }
  .icons .batt { height: calc(var(--s) * .032); }
  .page { position: absolute; top: calc(var(--s) * .138); left: 0; width: 100%; height: auto; }
  .island { position: absolute; top: calc(var(--s) * .028); left: 50%; transform: translateX(-50%); width: calc(var(--s) * .32); height: calc(var(--s) * .094); border-radius: 999px; background: #000; z-index: 3; }
  .home-bar { position: absolute; bottom: calc(var(--s) * .02); left: 50%; transform: translateX(-50%); width: calc(var(--s) * .36); height: calc(var(--s) * .013); border-radius: 999px; background: rgba(0,0,0,.85); z-index: 3; mix-blend-mode: difference; filter: invert(1); }
  .pglare { position: absolute; inset: 0; pointer-events: none; z-index: 4; background: linear-gradient(125deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,.03) 34%, transparent 34.3%); }
  .btn { position: absolute; width: calc(var(--w) * .014); border-radius: calc(var(--w) * .006); background: linear-gradient(90deg, #56575c, #a3a4a8 50%, #56575c); }
  .action { left: calc(var(--w) * -.009); top: 18%; height: 3.6%; }
  .vol-up { left: calc(var(--w) * -.009); top: 25.5%; height: 7%; }
  .vol-down { left: calc(var(--w) * -.009); top: 34%; height: 7%; }
  .power { right: calc(var(--w) * -.009); top: 27%; height: 11%; }

  /* Browser: a light macOS window with the real address. */
  .browser { position: absolute; width: var(--w); border-radius: calc(var(--w) * .013); overflow: hidden; background: #fff;
    box-shadow: 0 0 0 1px rgba(0,0,0,.09), 0 calc(var(--w) * .006) calc(var(--w) * .016) rgba(0,0,0,${t.shadow * 0.35}), 0 calc(var(--w) * .04) calc(var(--w) * .09) rgba(0,0,0,${t.shadow * 0.8}); }
  .bar { position: relative; height: calc(var(--w) * .036); display: flex; align-items: center; gap: calc(var(--w) * .014); padding: 0 calc(var(--w) * .014);
    background: linear-gradient(#f7f7f9, #eeeef1); border-bottom: 1px solid #dcdce1; color: #45454b; }
  .lights { display: flex; gap: calc(var(--w) * .0065); }
  .lights i { width: calc(var(--w) * .0088); aspect-ratio: 1; border-radius: 50%; background: #ff5f57; box-shadow: inset 0 0 0 .5px rgba(0,0,0,.12); }
  .lights i:nth-child(2) { background: #febc2e; } .lights i:nth-child(3) { background: #28c840; }
  .nav { display: flex; gap: calc(var(--w) * .01); margin-left: calc(var(--w) * .006); }
  .nav svg, .tools svg { height: calc(var(--w) * .011); fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .nav .off { opacity: .35; }
  .url { position: absolute; left: 50%; transform: translateX(-50%); width: 40%; height: calc(var(--w) * .022); display: flex; align-items: center; justify-content: center; gap: calc(var(--w) * .005);
    border-radius: calc(var(--w) * .006); background: #e3e3e8; font-size: calc(var(--w) * .0098); font-weight: 500; color: #2c2c31; white-space: nowrap; }
  .url .path { color: #8a8a92; font-weight: 400; margin-left: -.1em; }
  .lock { height: calc(var(--w) * .0088); fill: #7a7a82; color: #7a7a82; }
  .tools { margin-left: auto; }
  .bscreen { aspect-ratio: 1440 / 900; overflow: hidden; }
  .bscreen img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  </style></head><body><div class="scene"><div class="grain"></div>${layout(scene, H)}</div>
  <script>
    // Tint each phone's status bar to the top of the page it shows, like Safari does.
    window.tint = async () => {
      for (const phone of document.querySelectorAll('.pscreen')) {
        const img = phone.querySelector('.page')
        await img.decode()
        const c = document.createElement('canvas')
        c.width = img.naturalWidth; c.height = 16
        const ctx = c.getContext('2d')
        ctx.drawImage(img, 0, 0)
        // The most common colour a few pixels down (skips thin progress bars along the edge).
        const d = ctx.getImageData(0, 10, c.width, 1).data
        const counts = new Map()
        for (let i = 0; i < d.length; i += 4 * 4) {
          const key = (d[i] >> 3) + ',' + (d[i + 1] >> 3) + ',' + (d[i + 2] >> 3)
          const hit = counts.get(key) ?? { n: 0, r: d[i], g: d[i + 1], b: d[i + 2] }
          hit.n++
          counts.set(key, hit)
        }
        const { r, g, b } = [...counts.values()].sort((x, y) => y.n - x.n)[0]
        const status = phone.querySelector('.status')
        status.style.background = 'rgb(' + r + ',' + g + ',' + b + ')'
        status.style.color = 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? '#0a0a0a' : '#ffffff'
      }
      await Promise.all([...document.images].map((i) => i.decode()))
      await document.fonts.ready
    }
  </script></body></html>`
}

/* ---------- render ---------- */

const only = process.argv[2]
const browserInstance = await launch()
const tab = await browserInstance.newPage()

for (const scene of scenes.filter((s) => !only || s.project === only)) {
  const [width, height] = scene.size
  const H = (height / width) * 100
  const html = page(scene, H)
  for (const [suffix, scale] of [
    ['', 1],
    ['-small', 0.5],
  ]) {
    await tab.setViewport({
      width: Math.round(width * scale),
      height: Math.round(height * scale),
      deviceScaleFactor: 1,
    })
    await tab.setContent(html, { waitUntil: 'load' })
    await tab.evaluate(() => window.tint())
    const file = join(outDir, `${scene.project}-${scene.name}${suffix}.webp`)
    await tab.screenshot({ path: file, type: 'webp', quality: suffix ? 80 : 86 })
    console.log('rendered', file)
  }
}

await browserInstance.close()
