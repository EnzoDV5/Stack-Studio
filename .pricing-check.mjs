import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox'],
})

for (const [path, width, id, output] of [
  ['pricing', 1440, 'pricing-plans', '.pricing-desktop.png'],
  ['pricing', 390, 'pricing-plans', '.pricing-phone.png'],
  ['services', 390, 'stage-run', '.services-phone.png'],
]) {
  const page = await browser.newPage()
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })
  await page.goto(`http://127.0.0.1:5173/${path}`, { waitUntil: 'networkidle2' })
  const section = await page.$(`#${id}`)
  if (!section) throw new Error(`Missing ${id}`)
  await section.evaluate((element) => element.scrollIntoView())
  await new Promise((resolve) => setTimeout(resolve, 1800))
  await section.screenshot({ path: output })
  const result = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId)
    return {
      cards: [...(el?.querySelectorAll('li.rounded-lg') ?? [])].map((item) => item.textContent),
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }
  }, id)
  process.stdout.write(`${JSON.stringify({ path, width, result })}\n`)
  await page.close()
}

await browser.close()
