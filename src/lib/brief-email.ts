/**
 * Template parameters for the two EmailJS templates (docs/emailjs/): the team notification
 * and the client auto-reply linked to it. Both receive the same parameters.
 *
 * `content_html` is inserted raw (`{{{content_html}}}`), so every value in it is escaped here.
 * Email clients ignore <style> and classes, hence inline styles on tables. Pure, no React.
 */
import type { BriefRecordCopy } from '@/data/brief'
import { formatSubmitted, type BriefRecord } from './brief-record'

export interface StudioEmailDetails {
  name: string
  email: string
  url: string
  responsePromise: string
  whatsappHref?: string
}

export interface BriefEmailContext {
  copy: BriefRecordCopy
  studio: StudioEmailDetails
  /** "Download PDF" link (/brief?download#…). */
  pdfUrl: string
  /** Firestore ids, when the brief was also stored there. */
  ids?: { contactId: string; enquiryId: string } | null
}

export type BriefEmailParams = Record<string, string>

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const multiline = (value: string) => escapeHtml(value).replace(/\r?\n/g, '<br>')

const font = "Arial,'Helvetica Neue',Helvetica,sans-serif"
const mono = "'JetBrains Mono',Menlo,Consolas,'Courier New',monospace"
const s = {
  heading: `padding:28px 0 10px;border-bottom:2px solid #0a0a0a;font-family:${mono};font-size:11px;line-height:1.4;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#b93d0a`,
  label: `padding:12px 16px 12px 0;width:36%;vertical-align:top;border-bottom:1px solid #dcd4c8;font-family:${font};font-size:13px;line-height:1.5;color:#525252`,
  value: `padding:12px 0;vertical-align:top;border-bottom:1px solid #dcd4c8;font-family:${font};font-size:15px;line-height:1.5;color:#0a0a0a`,
  text: `padding:14px 0 4px;font-family:${font};font-size:15px;line-height:1.6;color:#0a0a0a`,
  link: 'color:#b93d0a;text-decoration:underline',
}

function headingRow(index: number, title: string): string {
  return `<tr><td colspan="2" style="${s.heading}">${String(index).padStart(2, '0')} &middot; ${escapeHtml(title)}</td></tr>`
}

function row(label: string, valueHtml: string): string {
  return `<tr><td style="${s.label}">${escapeHtml(label)}</td><td style="${s.value}">${valueHtml}</td></tr>`
}

/** The brief as email-safe HTML rows: contact, project answers, then the free-text note. */
export function briefHtml(record: BriefRecord, copy: BriefRecordCopy): string {
  const { contact } = record
  const none = escapeHtml(copy.none)
  const email = escapeHtml(contact.email)
  const phone = contact.phone
    ? `<a href="tel:${escapeHtml(contact.phone.replace(/[^\d+]/g, ''))}" style="${s.link}">${escapeHtml(contact.phone)}</a>`
    : none

  let index = 1
  const rows = [
    headingRow(index++, copy.sections.contact),
    row(copy.labels.name, escapeHtml(contact.name)),
    row(copy.labels.email, `<a href="mailto:${email}" style="${s.link}">${email}</a>`),
    row(copy.labels.phone, phone),
    row(copy.labels.company, contact.company ? escapeHtml(contact.company) : none),
    headingRow(index++, copy.sections.project),
    ...record.answers.map(([label, value]) => row(label, value ? multiline(value) : none)),
  ]
  if (contact.message) {
    rows.push(
      headingRow(index++, copy.sections.message),
      `<tr><td colspan="2" style="${s.text}">${multiline(contact.message)}</td></tr>`,
    )
  }

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%">${rows.join('')}</table>`
}

export function briefEmailParams(record: BriefRecord, ctx: BriefEmailContext): BriefEmailParams {
  const { copy, studio } = ctx
  const { contact } = record
  const reason = copy.reasons[record.path]
  const submittedAt = formatSubmitted(record.submittedAt)
  const plainBrief = [
    `Reference: ${record.ref}`,
    `Received: ${submittedAt}`,
    `Enquiry: ${reason}`,
    '',
    `${copy.labels.name}: ${contact.name}`,
    `${copy.labels.email}: ${contact.email}`,
    `${copy.labels.phone}: ${contact.phone || copy.none}`,
    `${copy.labels.company}: ${contact.company || copy.none}`,
    '',
    ...record.answers.map(([label, value]) => `${label}: ${value || copy.none}`),
    ...(contact.message ? ['', `${copy.sections.message}: ${contact.message}`] : []),
    '',
    `PDF: ${ctx.pdfUrl}`,
  ].join('\n')
  const pdfLink = `<a href="${escapeHtml(ctx.pdfUrl)}" style="${s.link}">Download the PDF brief</a>`
  const contentHtml = [
    `<p style="${s.text}"><strong>Reference:</strong> ${escapeHtml(record.ref)}<br><strong>Received:</strong> ${escapeHtml(submittedAt)}<br><strong>Enquiry:</strong> ${escapeHtml(reason)}</p>`,
    record.estimate.recommendation
      ? `<p style="${s.text}"><strong>Indicative estimate:</strong> ${escapeHtml(record.estimate.recommendation)}<br>${escapeHtml(copy.estimateNote)}</p>`
      : '',
    briefHtml(record, copy),
    `<p style="${s.text}">${pdfLink}</p>`,
  ].join('')

  return {
    // Subjects: the team template uses {{subject}}, the auto-reply {{client_subject}}.
    subject: copy.email.teamSubject(record.ref, reason, contact.name),
    client_subject: copy.email.clientSubject(record.ref),

    reference: record.ref,
    reason,
    submitted_at: submittedAt,
    page_url: record.page,

    // The existing EmailJS Contact Us preset reads these field names. Keep them populated
    // while the dashboard template is replaced with the structured brief version below.
    name: contact.name,
    email: contact.email,
    title: reason,
    time: submittedAt,
    message: plainBrief,
    content_html: contentHtml,

    client_name: contact.name,
    client_first_name: contact.name.trim().split(/\s+/)[0] ?? contact.name,
    client_email: contact.email,
    client_phone: contact.phone || copy.none,
    client_company: contact.company || copy.none,
    client_message: contact.message,
    reply_to: contact.email,

    recommendation: record.estimate.recommendation,
    estimate_note: copy.estimateNote,
    brief_html: briefHtml(record, copy),
    pdf_url: ctx.pdfUrl,

    studio_name: studio.name,
    studio_email: studio.email,
    studio_url: studio.url,
    studio_host: studio.url.replace(/^https?:\/\//, ''),
    response_promise: studio.responsePromise,
    whatsapp_url: studio.whatsappHref ?? '',

    contact_id: ctx.ids?.contactId ?? '',
    enquiry_id: ctx.ids?.enquiryId ?? '',
  }
}
