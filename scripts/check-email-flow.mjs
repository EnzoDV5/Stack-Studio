/** Local browser verification with every external request intercepted; sends no real mail. */
/* global window */
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'
import { createServer } from 'vite'

const executablePath =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
if (!existsSync(executablePath))
  throw new Error('Set CHROME_PATH to a Chrome or Chromium executable.')

const server = await createServer({ server: { host: '127.0.0.1', port: 0, open: false } })
let browser
try {
  await server.listen()
  const origin = server.resolvedUrls.local[0]
  browser = await puppeteer.launch({ executablePath, headless: true })
  const page = await browser.newPage()
  // Exercise normal visitor behavior; the production SDK still blocks headless browsers.
  await page.evaluateOnNewDocument(() =>
    Object.defineProperty(navigator, 'webdriver', { get: () => false }),
  )
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  const requests = []
  let responseStatus = 429
  let responseText = 'Too Many Requests'
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (
      request.method() === 'POST' &&
      request.url() === 'https://api.emailjs.com/api/v1.0/email/send'
    ) {
      requests.push({ at: Date.now(), body: JSON.parse(request.postData()) })
      void request.respond({
        status: responseStatus,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' },
        body: responseText,
      })
    } else if (request.url().startsWith(origin) || /^(data:|blob:)/.test(request.url())) {
      void request.continue()
    } else if (request.method() === 'OPTIONS') {
      void request.respond({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    } else {
      void request.abort()
    }
  })

  await page.goto(origin, { waitUntil: 'domcontentloaded' })
  await page.evaluate(async () => {
    const { config } = await import('/src/lib/config.ts')
    // Isolate email behavior from Firestore; use dummy public identifiers.
    config.firebase = null
    config.formEndpoint = null
    config.emailjs = {
      publicKey: 'test-public-key',
      serviceId: 'service_test',
      contactTemplateId: 'template_team',
      briefTemplateId: 'template_team',
      attachPdf: false,
    }
    window.history.pushState({}, '', '/contact')
    window.dispatchEvent(new window.PopStateEvent('popstate'))
  })
  await page.waitForSelector('#contact-name')
  for (const [selector, value] of [
    ['#contact-name', 'Email Test'],
    ['#contact-email', 'visitor@example.com'],
    ['#contact-subject', 'Browser verification'],
    ['#contact-message', 'Please help with <script> & booking.'],
  ])
    await page.type(selector, value)
  await page.click('#contact-consent')
  await page.click('button[type="submit"]')
  await page.waitForFunction(() =>
    window.document.body.textContent.includes('Please wait a moment and try again.'),
  )
  assert.equal(requests.length, 1)
  assert.equal(
    await page.$eval('#contact-message', (el) => el.value),
    'Please help with <script> & booking.',
  )
  assert.equal(requests[0].body.template_id, 'template_team')
  assert.equal(requests[0].body.template_params.client_email, 'visitor@example.com')
  assert.match(requests[0].body.template_params.content_html, /&lt;script&gt; &amp; booking/)

  responseStatus = 200
  responseText = 'OK'
  await page.click('button[type="submit"]')
  await page.waitForFunction(() => window.document.body.textContent.includes('Message received.'))
  assert.equal(requests.length, 2)
  assert.ok(requests[1].at - requests[0].at >= 1_000)

  // Exercise the actual brief submission and SDK request for every supported path.
  for (const path of ['build', 'existing', 'run', 'develop', 'unsure']) {
    await page.evaluate(async (path) => {
      const { submitBrief } = await import('/src/lib/submit-brief.ts')
      const result = await submitBrief({
        path,
        brief: {
          path,
          consent: true,
          contact: {
            name: 'Email Test',
            email: 'visitor@example.com',
            phone: '',
            company: '',
            message: 'A test enquiry.',
          },
        },
        summary: { Requirement: 'A booking flow <example> & enquiry' },
        result: { kind: 'consult', recommendation: 'Discuss the project' },
        meta: {
          ref: 'SS-261023-7K4Q',
          submittedAt: '2026-10-23T12:00:00.000Z',
          page: window.location.href,
          userAgent: navigator.userAgent,
        },
      })
      if (!result.emailed) throw new Error('Brief email was not accepted')
    }, path)
    const { body } = requests.at(-1)
    assert.equal(body.template_id, 'template_team')
    assert.equal(body.template_params.reply_to, 'visitor@example.com')
    assert.equal(body.template_params.client_email, 'visitor@example.com')
    assert.match(body.template_params.content_html, /A booking flow &lt;example&gt; &amp; enquiry/)
    assert.match(body.template_params.pdf_url, /\/brief\?download#z/)
    assert.equal(body.template_params.brief_pdf, undefined)
  }
  assert.equal(
    requests.length,
    7,
    'One main request per attempt; linked auto-reply is handled by EmailJS',
  )
  console.log(
    'Email browser checks passed: contact error, retained answers, retry, and all five brief paths. No real emails sent.',
  )
} finally {
  await browser?.close()
  await server.close()
}
