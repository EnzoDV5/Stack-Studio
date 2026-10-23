import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  createEmailQueue,
  EmailDeliveryError,
  emailFailureMessage,
  validateEmailSize,
} from '@/lib/email-delivery'

describe('email delivery failures', () => {
  it('preserves EmailJS status and text rather than recording [object Object]', () => {
    const error = new EmailDeliveryError({
      status: 412,
      text: 'Gmail_API: insufficient authentication scopes',
    })
    assert.equal(error.status, 412)
    assert.match(error.message, /412.*Gmail_API/)
    assert.match(emailFailureMessage(error, 'fallback'), /connection needs attention/)
  })

  it('finds provider failures wrapped by brief submission', () => {
    const error = new Error('Brief delivery failed', {
      cause: [new EmailDeliveryError({ status: 429, text: 'Too Many Requests' })],
    })
    assert.match(emailFailureMessage(error, 'fallback'), /wait a moment/)
    assert.match(
      emailFailureMessage(
        new EmailDeliveryError({ status: 429, text: 'Monthly quota exceeded' }),
        'fallback',
      ),
      /sending limit/,
    )
    assert.equal(emailFailureMessage(new Error('database failed'), 'fallback'), 'fallback')
  })

  it('does not reveal provider details in messages shown to visitors', () => {
    const message = emailFailureMessage(
      new EmailDeliveryError({ status: 422, text: 'Recipient private@example.com is invalid' }),
      'fallback',
    )
    assert.match(message, /email us directly/)
    assert.doesNotMatch(message, /private@example/)
    assert.match(
      emailFailureMessage(new EmailDeliveryError(new TypeError('Failed to fetch')), 'fallback'),
      /Check your connection/,
    )
  })

  it('measures UTF-8 bytes and excludes only the configured PDF attachment', () => {
    assert.doesNotThrow(() =>
      validateEmailSize({ content_html: 'a'.repeat(40_000), brief_pdf: 'x'.repeat(100_000) }),
    )
    assert.throws(
      () => validateEmailSize({ content_html: '🧡'.repeat(13_000) }),
      (error: unknown) => {
        assert.ok(error instanceof EmailDeliveryError)
        assert.equal(error.status, 413)
        assert.match(emailFailureMessage(error, 'fallback'), /shorten the message/)
        return true
      },
    )
  })
})

describe('email send queue', () => {
  it('spaces concurrent attempts and lets a manual retry follow a failure', async (t) => {
    t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 1000 })
    const starts: number[] = []
    const send = createEmailQueue(async (templateId) => {
      starts.push(Date.now())
      if (templateId === 'fail') throw { status: 429, text: 'Too Many Requests' }
    })
    const failed = assert.rejects(send('fail', {}), EmailDeliveryError)
    const second = send('team', {})
    const third = send('team', {})
    await failed
    assert.deepEqual(starts, [1000])
    // A suspended tab may wake long after multiple timers would have been due.
    t.mock.timers.tick(10_000)
    await second
    assert.deepEqual(starts, [1000, 11_000])
    t.mock.timers.tick(1099)
    assert.equal(starts.length, 2)
    t.mock.timers.tick(1)
    await third
    assert.deepEqual(starts, [1000, 11_000, 12_100])
  })

  it('does not send a second request while the first is still pending', async () => {
    let finish!: () => void
    const firstResponse = new Promise<void>((resolve) => {
      finish = resolve
    })
    const calls: string[] = []
    const send = createEmailQueue(async (templateId) => {
      calls.push(templateId)
      if (templateId === 'first') await firstResponse
    }, 0)
    const first = send('first', {})
    const second = send('second', {})
    await Promise.resolve()
    assert.deepEqual(calls, ['first'])
    finish()
    await Promise.all([first, second])
    assert.deepEqual(calls, ['first', 'second'])
  })
})
