/**
 * Capture the local Stack Studio site and render the README artwork.
 * Start `npm run dev -- --host 127.0.0.1`, then run `node scripts/readme/render.mjs`.
 */
import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { launch } from '../mockups/browser.mjs'

const root = join(import.meta.dirname, '../..')
const outputDir = join(root, 'docs/readme')
const baseUrl = process.env.README_SITE_URL ?? 'http://127.0.0.1:5173'
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const asDataUrl = (bytes, type) => `data:${type};base64,${Buffer.from(bytes).toString('base64')}`
const imageData = (path) => asDataUrl(readFileSync(join(root, path)), 'image/png')
const fontData = (path) => asDataUrl(readFileSync(join(root, path)), 'font/woff2')

mkdirSync(outputDir, { recursive: true })

const font = fontData(
  'node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
)
const mono = fontData(
  'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2',
)
const logo = imageData('public/StackLogo1.png')
const browser = await launch()

async function capture(path, width, height, scale, scrollY = 0) {
  const page = await browser.newPage()
  try {
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: scale,
      isMobile: width < 500,
      hasTouch: width < 500,
    })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle2', timeout: 60000 })
    await page.evaluate(() => document.fonts.ready)
    await pause(2200)
    if (scrollY) {
      await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), scrollY)
      await pause(700)
    }
    return asDataUrl(await page.screenshot({ type: 'png' }), 'image/png')
  } finally {
    await page.close()
  }
}

const home = await capture('/', 1440, 900, 1.5)
const work = await capture('/work', 1440, 900, 1.5, 420)
const services = await capture('/services', 1440, 900, 1.5)
const mobileHome = await capture('/', 390, 844, 2)
const mobileBrief = await capture('/start', 390, 844, 2)

const shared = `
  @font-face { font-family: InterTight; src: url('${font}'); font-weight: 100 900; }
  @font-face { font-family: JetBrains; src: url('${mono}'); font-weight: 500; }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 100%; height: 100%; }
  body { color: #f5f1ec; font-family: InterTight, Arial, sans-serif; overflow: hidden; }
  .canvas { position: relative; width: 100%; height: 100%; overflow: hidden;
    background: radial-gradient(circle at 76% 72%, #502010 0, #1d100d 31%, #0c0b0b 66%); }
  .canvas::before { content: ''; position: absolute; inset: 0; opacity: .28;
    background-image: linear-gradient(#fff1 1px, transparent 1px), linear-gradient(90deg, #fff1 1px, transparent 1px);
    background-size: 82px 82px; }
  .canvas::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: #ff5a16; }
  .eyebrow { font: 500 19px JetBrains, monospace; letter-spacing: .19em; color: #ff6726; text-transform: uppercase; }
  .laptop { position: absolute; border: 15px solid #242428; border-radius: 26px 26px 12px 12px;
    background: #070708; box-shadow: 0 2px 0 #787579 inset, 0 38px 80px #000b, 0 0 0 2px #525056; overflow: hidden; }
  .laptop img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .laptop::after { content: ''; position: absolute; top: 5px; left: 50%; width: 5px; height: 5px;
    border-radius: 50%; background: #555; }
  .deck { position: absolute; height: 18px; border-radius: 0 0 50% 50%;
    background: linear-gradient(#9b9998, #474749 48%, #b6b2af 75%, #424145); box-shadow: 0 13px 18px #0009; }
  .deck::after { content: ''; position: absolute; width: 16%; height: 4px; left: 42%; top: 1px;
    border-radius: 0 0 10px 10px; background: #3a3a3c; }
  .phone { position: absolute; padding: 12px; background: #111114; border: 4px solid #64646a;
    border-radius: 45px; box-shadow: 0 32px 60px #000b, inset 0 0 0 2px #333; }
  .phone img { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 31px; }
  .phone::after { content: ''; position: absolute; width: 28%; height: 17px; top: 16px; left: 36%;
    background: #0c0c0d; border-radius: 0 0 15px 15px; }
`

async function render(name, width, height, content, quality = 90) {
  const page = await browser.newPage()
  try {
    await page.setViewport({ width, height, deviceScaleFactor: 1 })
    await page.setContent(
      `<!doctype html><html><head><style>${shared}</style></head><body>${content}</body></html>`,
    )
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(async () => Promise.all([...document.images].map((img) => img.decode())))
    const file = join(outputDir, name)
    await page.screenshot({ path: file, type: 'webp', quality })
    console.log('rendered', file)
  } finally {
    await page.close()
  }
}

await render(
  'hero.webp',
  1800,
  960,
  `
  <div class="canvas">
    <div style="position:absolute;left:78px;top:62px;display:flex;align-items:center;gap:23px">
      <img src="${logo}" style="width:220px;height:auto" alt="" />
      <span style="font:500 23px JetBrains;letter-spacing:.35em;color:#ddd5cf">STUDIO</span>
    </div>
    <div class="eyebrow" style="position:absolute;left:82px;top:235px">Digital studio · Centurion, ZA</div>
    <h1 style="position:absolute;left:74px;top:278px;margin:0;font-size:126px;line-height:.9;letter-spacing:-.065em;font-weight:850">Build it.<br>Run it.<br><span style="color:#ff5a16">Grow it.</span></h1>
    <p style="position:absolute;left:82px;top:710px;margin:0;font-size:29px;color:#d4ccc6;line-height:1.35">Websites, apps, software and AI<br>built for real business.</p>
    <div class="eyebrow" style="position:absolute;left:82px;bottom:54px;color:#dbd0c8;font-size:16px">Strategy / Design / Development / Care</div>
    <div style="position:absolute;left:1010px;top:40px;width:750px;height:750px;border:2px solid #ff5a163b;border-radius:50%"></div>
    <div style="position:absolute;left:1120px;top:150px;width:530px;height:530px;border:1px solid #ff5a1659;border-radius:50%"></div>
    <div class="laptop" style="left:706px;top:208px;width:970px;height:616px"><img src="${home}" alt="" /></div>
    <div class="deck" style="left:672px;top:824px;width:1038px"></div>
    <div class="phone" style="left:1450px;top:385px;width:244px;height:526px;transform:rotate(5deg)"><img src="${mobileHome}" alt="" /></div>
    <div class="eyebrow" style="position:absolute;right:95px;top:83px;font-size:15px">01 / Studio site</div>
  </div>
`,
)

for (const [name, label, screenshot] of [
  ['desktop-home.webp', '01 / Home', home],
  ['desktop-work.webp', '02 / Selected work', work],
  ['desktop-services.webp', '03 / Services', services],
]) {
  await render(
    name,
    1600,
    1060,
    `
    <div class="canvas">
      <div class="eyebrow" style="position:absolute;left:76px;top:57px">${label}</div>
      <div class="eyebrow" style="position:absolute;right:76px;top:57px;color:#a6a0a0">Stack Studio / Desktop</div>
      <div style="position:absolute;left:70px;top:116px;width:1460px;height:864px;border:2px solid #666064;border-radius:21px;background:#1d1d20;box-shadow:0 36px 75px #000c;overflow:hidden">
        <div style="height:42px;background:#202024;border-bottom:1px solid #424044;display:flex;align-items:center;gap:10px;padding:0 20px">
          <i style="width:12px;height:12px;border-radius:50%;background:#ff5a16"></i><i style="width:12px;height:12px;border-radius:50%;background:#565054"></i><i style="width:12px;height:12px;border-radius:50%;background:#565054"></i>
          <span style="margin:auto;font:500 14px JetBrains;color:#aaa">stack-studio.web.app</span>
        </div>
        <img src="${screenshot}" style="display:block;width:100%;height:820px;object-fit:cover;object-position:top" alt="" />
      </div>
    </div>
  `,
  )
}

for (const [name, label, screenshot] of [
  ['mobile-home.webp', '01 / Home', mobileHome],
  ['mobile-brief.webp', '02 / Project brief', mobileBrief],
]) {
  await render(
    name,
    760,
    1040,
    `
    <div class="canvas">
      <div class="eyebrow" style="position:absolute;left:56px;top:55px">${label}</div>
      <div class="eyebrow" style="position:absolute;right:56px;top:55px;color:#aaa;font-size:15px">Mobile</div>
      <div style="position:absolute;width:610px;height:610px;left:75px;top:215px;border:2px solid #ff5a1645;border-radius:50%"></div>
      <div class="phone" style="left:195px;top:125px;width:370px;height:800px"><img src="${screenshot}" alt="" /></div>
      <span style="position:absolute;left:56px;bottom:48px;font:500 17px JetBrains;letter-spacing:.17em;color:#d3c9c0">STACK STUDIO / RESPONSIVE BY DESIGN</span>
    </div>
  `,
  )
}

await browser.close()
