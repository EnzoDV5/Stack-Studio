/** Sends a general website enquiry through the existing Contact Us template. */
import { config } from './config'
import { contactEmailParams, type ContactEnquiry } from './contact-email'
import { sendEmailTemplate } from './emailjs-send'

export async function sendContactEmail(enquiry: ContactEnquiry): Promise<void> {
  if (!config.emailjs) throw new Error('EmailJS is not configured.')

  await sendEmailTemplate(config.emailjs.contactTemplateId, contactEmailParams(enquiry))
}
