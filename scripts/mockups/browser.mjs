import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

/** A local Chrome or Edge: CHROME_PATH, else the usual install locations. */
function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean)
  const found = candidates.find((path) => existsSync(path))
  if (!found) throw new Error('No Chrome found. Set CHROME_PATH to a Chrome or Edge executable.')
  return found
}

/** Extra launch options (e.g. `args` for WebGL) are merged in. */
export function launch(options = {}) {
  return puppeteer.launch({ executablePath: chromePath(), headless: true, ...options })
}
