/** Test the real Firebase initialization in a production bundle with mocked Auth only. */
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { launch } from './mockups/browser.mjs'

const output = await mkdtemp(join(tmpdir(), 'stack-studio-firebase-'))
let browser
let server
try {
  await build({
    logLevel: 'warn',
    define: Object.fromEntries(
      Object.entries({
        VITE_FIREBASE_API_KEY: 'test-api-key',
        VITE_FIREBASE_PROJECT_ID: 'demo-stack-studio',
        VITE_FIREBASE_APP_ID: '1:123456:web:test',
        VITE_FIREBASE_AUTH_DOMAIN: 'demo-stack-studio.firebaseapp.com',
        VITE_FIREBASE_APPCHECK_SITE_KEY: '',
      }).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
    ),
    build: {
      outDir: output,
      emptyOutDir: true,
      lib: {
        entry: fileURLToPath(new URL('../src/lib/firebase.ts', import.meta.url)),
        formats: ['es'],
        fileName: () => 'firebase-check.js',
      },
      minify: true,
    },
  })
  const bundle = await readFile(join(output, 'firebase-check.js'))
  server = createServer((request, response) => {
    const javascript = request.url === '/firebase-check.js'
    response.writeHead(200, { 'Content-Type': javascript ? 'text/javascript' : 'text/html' })
    response.end(javascript ? bundle : '<!doctype html><title>Firebase regression check</title>')
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  browser = await launch()
  const page = await browser.newPage()
  const authRequests = []
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (request.url().startsWith(origin + '/')) {
      void request.continue()
    } else if (request.method() === 'OPTIONS') {
      void request.respond({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      })
    } else if (
      request.url().startsWith('https://identitytoolkit.googleapis.com/v1/accounts:signUp?') &&
      request.method() === 'POST'
    ) {
      authRequests.push(JSON.parse(request.postData()))
      const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
      const token = `${encode({ alg: 'none' })}.${encode({ sub: 'test-visitor', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 })}.test`
      void request.respond({
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          localId: 'test-visitor',
          idToken: token,
          refreshToken: 'test-refresh-token',
          expiresIn: '3600',
        }),
      })
    } else {
      if (
        request.url().startsWith('https://identitytoolkit.googleapis.com/v1/accounts:lookup?') &&
        request.method() === 'POST'
      ) {
        void request.respond({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            users: [
              {
                localId: 'test-visitor',
                createdAt: String(Date.now()),
                lastLoginAt: String(Date.now()),
                providerUserInfo: [],
              },
            ],
          }),
        })
      } else {
        // No live sign-ins, Firestore writes, or email requests are allowed.
        void request.abort()
      }
    }
  })
  await page.goto(origin)
  const result = await page.evaluate(async () => {
    const { firebaseServices } = await import('/firebase-check.js')
    const first = await firebaseServices()
    const second = await firebaseServices()
    return {
      userId: first.userId,
      projectId: first.app.options.projectId,
      authSharesApp: first.auth.app === first.app,
      firestoreSharesApp: first.db.app === first.app,
      reused:
        first.auth === second.auth && first.db === second.db && first.userId === second.userId,
    }
  })
  assert.deepEqual(result, {
    userId: 'test-visitor',
    projectId: 'demo-stack-studio',
    authSharesApp: true,
    firestoreSharesApp: true,
    reused: true,
  })
  assert.equal(authRequests.length, 1)
  assert.equal(authRequests[0].returnSecureToken, true)
  console.log(
    'Firebase production bundle passed: Auth registration, anonymous sign-in, shared Auth/Firestore app, and repeat initialization. No live services called.',
  )
} finally {
  await browser?.close()
  if (server) await new Promise((resolve) => server.close(resolve))
  await rm(output, { recursive: true, force: true })
}
