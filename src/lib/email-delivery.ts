/** Shared transport rules, kept independent of browser configuration for verification. */
type EmailParams = Record<string, unknown>
type SendEmail = (templateId: string, params: EmailParams) => Promise<unknown>

export class EmailDeliveryError extends Error {
  readonly status: number | null

  constructor(error: unknown) {
    const response = error && typeof error === 'object' ? error : {}
    const status = 'status' in response ? Number(response.status) : NaN
    const detail =
      'text' in response && typeof response.text === 'string'
        ? response.text
        : error instanceof Error
          ? error.message
          : String(error)
    super(`EmailJS${Number.isFinite(status) ? ` (${status})` : ''}: ${detail}`, { cause: error })
    this.name = 'EmailDeliveryError'
    this.status = Number.isFinite(status) ? status : null
  }
}

/** Serialize starts, including after failures or a suspended browser tab resumes. */
export function createEmailQueue(send: SendEmail, intervalMs = 1_100): SendEmail {
  let tail: Promise<unknown> = Promise.resolve()
  let lastStartedAt = -Infinity

  return (templateId, params) => {
    const pending = tail.then(async () => {
      const wait = lastStartedAt + intervalMs - Date.now()
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
      lastStartedAt = Date.now()
      try {
        return await send(templateId, params)
      } catch (error) {
        throw new EmailDeliveryError(error)
      }
    })
    // A failed request must not prevent the visitor's next manual attempt.
    tail = pending.catch(() => undefined)
    return pending
  }
}

/** EmailJS limits non-attachment template variables to 50 KB. Never truncate answers. */
export function validateEmailSize(params: EmailParams): void {
  const variables = Object.fromEntries(
    Object.entries(params).filter(([key]) => key !== 'brief_pdf'),
  )
  if (new TextEncoder().encode(JSON.stringify(variables)).byteLength > 50_000) {
    throw new EmailDeliveryError({ status: 413, text: 'Template variables exceed 50 KB.' })
  }
}

/** Do not expose provider responses (which can include addresses or credentials) in the UI. */
export function emailFailureMessage(error: unknown, fallback: string): string {
  if (error instanceof EmailDeliveryError) {
    const detail = error.message.toLowerCase()
    if (error.status === 413 || /variables.*50|size.*limit/.test(detail)) {
      return 'This message is too long to email. Your details are still here. Please shorten the message or email us directly.'
    }
    if (/quota|limit.*reached|requests.*exceeded/.test(detail)) {
      return 'The email service has reached its sending limit. Your details are still here. Please email us directly.'
    }
    if (error.status === 429) {
      return 'The email service is busy. Your details are still here. Please wait a moment and try again.'
    }
    if (/gmail|oauth|authentication|insufficient.*scope|invalid_grant/.test(detail)) {
      return 'Our email connection needs attention. Your details are still here. Please email us directly.'
    }
    if (
      error.status === 400 ||
      error.status === 401 ||
      error.status === 403 ||
      error.status === 422
    ) {
      return 'The email service could not process this message. Your details are still here. Please email us directly.'
    }
    if (error.status === null || error.status === 0) {
      return 'We could not reach the email service. Your details are still here. Check your connection and try again.'
    }
    return fallback
  }
  // submitBrief wraps provider failures, sometimes in an array of channel errors.
  if (Array.isArray(error)) {
    for (const cause of error) {
      const message = emailFailureMessage(cause, fallback)
      if (message !== fallback) return message
    }
  } else if (error instanceof Error && error.cause) {
    return emailFailureMessage(error.cause, fallback)
  }
  return fallback
}
