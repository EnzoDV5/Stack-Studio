import emailjs from '@emailjs/browser'
import { config } from './config'
import { createEmailQueue, validateEmailSize } from './email-delivery'

// EmailJS allows one request per second. Share that spacing across both forms without
// the SDK's storage-based cooldown, which also locks out retries after failed requests.
const sendQueued = createEmailQueue(async (templateId, params) => {
  if (!config.emailjs) throw new Error('EmailJS is not configured.')
  return emailjs.send(config.emailjs.serviceId, templateId, params, {
    publicKey: config.emailjs.publicKey,
    blockHeadless: true,
    limitRate: { throttle: 0 },
  })
})

export async function sendEmailTemplate(
  templateId: string,
  params: Record<string, unknown>,
): Promise<void> {
  if (!config.emailjs) throw new Error('EmailJS is not configured.')
  validateEmailSize(params)
  await sendQueued(templateId, params)
}
