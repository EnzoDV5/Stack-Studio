import emailjs from '@emailjs/browser'
import { config } from './config'

// EmailJS allows one request per second. Share that spacing across both forms without
// the SDK's storage-based cooldown, which also locks out retries after failed requests.
const MIN_SEND_INTERVAL_MS = 1_100 // Small margin for timer rounding and network jitter.
let nextSendAt = 0

export async function sendEmailTemplate(
  templateId: string,
  params: Record<string, unknown>,
): Promise<void> {
  if (!config.emailjs) throw new Error('EmailJS is not configured.')
  const sendAt = Math.max(Date.now(), nextSendAt)
  nextSendAt = sendAt + MIN_SEND_INTERVAL_MS
  const wait = sendAt - Date.now()
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))

  await emailjs.send(config.emailjs.serviceId, templateId, params, {
    publicKey: config.emailjs.publicKey,
    blockHeadless: true,
    limitRate: { throttle: 0 },
  })
}
