/** Sends a general website enquiry through the existing Contact Us template. */
import emailjs from '@emailjs/browser'
import { config } from './config'
import { contactEmailParams, type ContactEnquiry } from './contact-email'

export async function sendContactEmail(enquiry: ContactEnquiry): Promise<void> {
  if (!config.emailjs) throw new Error('EmailJS is not configured.')

  await emailjs.send(
    config.emailjs.serviceId,
    config.emailjs.contactTemplateId,
    contactEmailParams(enquiry),
    {
      publicKey: config.emailjs.publicKey,
      blockHeadless: true,
      limitRate: { id: 'stack-studio-contact', throttle: 10_000 },
    },
  )
}
