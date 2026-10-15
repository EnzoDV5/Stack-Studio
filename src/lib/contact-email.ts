import { escapeHtml } from './brief-email'
import { site } from '@/data/site'

export interface ContactEnquiry {
  name: string
  email: string
  subject: string
  message: string
}

const textStyle = 'margin:0 0 16px;font:15px/1.6 Arial,Helvetica,sans-serif;color:#202020'
const labelStyle =
  'margin:0 0 5px;font:700 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#9a3c12'

export function contactEmailParams(enquiry: ContactEnquiry, submittedAt = new Date()) {
  const name = enquiry.name.trim()
  const email = enquiry.email.trim()
  const topic = enquiry.subject
    .trim()
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 100)
  const message = enquiry.message.trim()
  const firstName = name.split(/\s+/)[0] ?? name
  const time = new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Johannesburg',
  }).format(submittedAt)
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>')

  return {
    subject: `New enquiry: ${topic}`,
    client_subject: 'We received your message | Stack Studio',
    team_eyebrow: 'Contact form',
    team_heading: topic,
    client_eyebrow: 'Message received',
    client_intro:
      'Thanks for getting in touch. We will read your message and reply within one business day.',
    client_copy_intro:
      'Please check the copy of your message below. If anything needs correcting, reply to this email.',
    logo_url: `${site.url}/StackLogo2.png`,
    reference: '',
    pdf_url: '',
    name,
    email,
    title: topic,
    time,
    message,
    reply_to: email,
    client_name: name,
    client_first_name: firstName,
    client_email: email,
    content_html: [
      `<p style="${labelStyle}">From</p><p style="${textStyle}">${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
      `<p style="${labelStyle}">Subject</p><p style="${textStyle}">${escapeHtml(topic)}</p>`,
      `<p style="${labelStyle}">Message</p><p style="${textStyle}">${safeMessage}</p>`,
      `<p style="${textStyle};color:#666">Received ${escapeHtml(time)}</p>`,
    ].join(''),
  }
}
