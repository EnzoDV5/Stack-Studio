import emailjs from '@emailjs/browser'
import { site } from '@/data/site'
import { config } from './config'
import { createBriefPdf } from './brief-pdf'
import type { SubmissionWriteResult } from './firebase-submissions'
import type { BriefPayload } from './submit-brief'

export interface BriefEmailResult {
  status: 'sent' | 'skipped'
}

function reasonLabel(path: BriefPayload['path']): string {
  switch (path) {
    case 'build':
      return 'New build'
    case 'existing':
      return 'Existing website help'
    case 'run':
      return 'Hosting and care'
    case 'develop':
      return 'Development partner'
    case 'unsure':
      return 'Not sure yet'
  }
}

function summaryText(payload: BriefPayload): string {
  return Object.entries(payload.summary)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')
}

export async function sendBriefEmails(
  payload: BriefPayload,
  submission?: SubmissionWriteResult | null,
): Promise<BriefEmailResult> {
  if (!config.emailjs) return { status: 'skipped' }

  const pdf = createBriefPdf(payload)
  const title = `${reasonLabel(payload.path)} brief from ${payload.brief.contact.name}`
  const submittedAt = new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Johannesburg',
  }).format(new Date(payload.meta.submittedAt))

  await emailjs.send(
    config.emailjs.serviceId,
    config.emailjs.briefTemplateId,
    {
      title,
      subject: title,
      to_email: config.emailjs.toEmail,
      studio_name: site.name,
      studio_email: site.email,
      client_name: payload.brief.contact.name,
      client_email: payload.brief.contact.email,
      client_phone: payload.brief.contact.phone || 'Not supplied',
      client_company: payload.brief.contact.company || 'Not supplied',
      client_message: payload.brief.contact.message || 'Not supplied',
      reply_to: payload.brief.contact.email,
      enquiry_reason: reasonLabel(payload.path),
      project_path: payload.path,
      estimate_kind: payload.result.kind,
      recommendation: payload.result.recommendation,
      submitted_at: submittedAt,
      page_url: payload.meta.page,
      summary_text: summaryText(payload),
      contact_id: submission?.contactId ?? '',
      enquiry_id: submission?.enquiryId ?? '',
      brief_pdf: pdf.content,
      brief_pdf_filename: pdf.filename,
    },
    {
      publicKey: config.emailjs.publicKey,
      blockHeadless: true,
      blockList: {
        watchVariable: 'client_email',
      },
      limitRate: {
        id: 'stack-studio-brief',
        throttle: 10_000,
      },
    },
  )

  return { status: 'sent' }
}
