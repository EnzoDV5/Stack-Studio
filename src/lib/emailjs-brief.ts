/**
 * Sends the brief through EmailJS: one request to the team notification template, which has
 * the client auto-reply linked to it in the EmailJS dashboard (so each brief uses two of the
 * monthly requests). Setup: docs/emailjs-setup.md. Loaded on submit only.
 */
import { briefRecordCopy } from '@/data/brief'
import { site, whatsappHref } from '@/data/site'
import { briefEmailParams } from './brief-email'
import { briefRecordUrl, type BriefRecord } from './brief-record'
import { config } from './config'
import { sendEmailTemplate } from './emailjs-send'
import type { SubmissionWriteResult } from './firebase-submissions'

export async function sendBriefEmails(
  record: BriefRecord,
  submission?: SubmissionWriteResult | null,
): Promise<void> {
  if (!config.emailjs) throw new Error('EmailJS is not configured.')

  const params = briefEmailParams(record, {
    copy: briefRecordCopy,
    studio: {
      name: site.name,
      email: site.email,
      url: site.url,
      responsePromise: site.responsePromise,
      whatsappHref: whatsappHref(),
    },
    pdfUrl: await briefRecordUrl(site.url, record, { download: true }),
    ids: submission,
  })

  if (config.emailjs.attachPdf) {
    // Paid plans: EmailJS Variable Attachment, configured on the main template.
    const [{ createBriefPdf, briefPdfFilename }, { loadBriefLogo }] = await Promise.all([
      import('./brief-pdf'),
      import('./brief-logo'),
    ])
    const pdf = createBriefPdf(
      record,
      briefRecordCopy,
      {
        name: site.name,
        url: site.url,
      },
      await loadBriefLogo(),
    )
    params.brief_pdf = pdf.output('datauristring')
    params.brief_pdf_filename = briefPdfFilename(record)
  }

  await sendEmailTemplate(config.emailjs.briefTemplateId, params)
}
