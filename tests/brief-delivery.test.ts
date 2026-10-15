import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { briefRecordCopy } from '@/data/brief'
import { site } from '@/data/site'
import { briefEmailParams } from '@/lib/brief-email'
import { createBriefPdf, pdfText } from '@/lib/brief-pdf'
import { briefRecordUrl, decodeBriefRecord, type BriefRecord } from '@/lib/brief-record'
import { contactEmailParams } from '@/lib/contact-email'

const record: BriefRecord = {
  v: 1,
  ref: 'SS-261013-7K4Q',
  path: 'build',
  submittedAt: '2026-10-13T12:00:00.000Z',
  contact: {
    name: 'Alex Example',
    email: 'alex@example.com',
    phone: '',
    company: '',
    message: 'Please call me.\n<script>alert(1)</script>',
  },
  answers: [['Project idea', 'A website & booking flow']],
  estimate: { kind: 'website', recommendation: 'R 20 000 – R 30 000' },
  page: 'https://stackstudio.co.za/start',
}

describe('brief delivery record', () => {
  it('renders the same escaped answers for team and linked client templates', async () => {
    const pdfUrl = await briefRecordUrl('https://stackstudio.co.za', record, { download: true })
    const params = briefEmailParams(record, {
      copy: briefRecordCopy,
      studio: {
        name: site.name,
        email: site.email,
        url: site.url,
        responsePromise: site.responsePromise,
      },
      pdfUrl,
    })

    const html = params.brief_html ?? ''
    assert.match(html, /A website &amp; booking flow/)
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
    assert.doesNotMatch(html, /<script>/)
    assert.equal(params.client_email, record.contact.email)
    assert.equal(params.reference, record.ref)
    assert.equal(params.name, record.contact.name)
    assert.equal(params.email, record.contact.email)
    assert.match(params.message ?? '', /A website & booking flow/)
    assert.match(params.message ?? '', /PDF: https:\/\/stackstudio\.co\.za/)
    assert.deepEqual(await decodeBriefRecord(new URL(pdfUrl).hash.slice(1)), record)
  })

  it('creates a readable multi-page PDF for a long answer', () => {
    const mark = readFileSync(new URL('../public/StackLogo2.png', import.meta.url))
    const wordmark = readFileSync(new URL('../public/StackLogo1.png', import.meta.url))
    const longRecord: BriefRecord = {
      ...record,
      answers: [['Project description', 'A detailed requirement with several words. '.repeat(350)]],
    }
    const pdf = createBriefPdf(
      longRecord,
      briefRecordCopy,
      { name: site.name, url: site.url },
      {
        mark: `data:image/png;base64,${mark.toString('base64')}`,
        wordmark: `data:image/png;base64,${wordmark.toString('base64')}`,
      },
    )

    assert.ok(pdf.getNumberOfPages() > 1)
    assert.ok((pdf.output().match(/\/Subtype \/Image/g) ?? []).length >= 2)
    assert.match(pdf.output('datauristring'), /^data:application\/pdf;/)
    assert.equal(pdfText('R 20 000 – R 30 000'), 'R 20 000 - R 30 000')
  })
})

describe('general contact email', () => {
  it('sends the existing Contact Us fields and escapes the shared HTML receipt', () => {
    const params = contactEmailParams(
      {
        name: 'Alex <Morgan>',
        email: 'alex@example.com',
        subject: 'Website question\nUnexpected line',
        message: 'Could you help?\n<script>alert(1)</script>',
      },
      new Date('2026-10-13T12:00:00.000Z'),
    )

    assert.equal(params.reply_to, 'alex@example.com')
    assert.equal(params.client_email, 'alex@example.com')
    assert.equal(params.team_eyebrow, 'Contact form')
    assert.equal(params.pdf_url, '')
    assert.equal(params.logo_url, `${site.url}/StackLogo2.png`)
    assert.equal(params.subject, 'New enquiry: Website question Unexpected line')
    assert.match(
      params.content_html,
      /Could you help\?<br>&lt;script&gt;alert\(1\)&lt;\/script&gt;/,
    )
    assert.doesNotMatch(params.content_html, /<script>/)
  })
})

describe('partnership email', () => {
  it('distinguishes a partnership brief and sends the client the same answers and PDF link', async () => {
    const partnerRecord: BriefRecord = { ...record, path: 'develop' }
    const pdfUrl = await briefRecordUrl(site.url, partnerRecord, { download: true })
    const params = briefEmailParams(partnerRecord, {
      copy: briefRecordCopy,
      studio: {
        name: site.name,
        email: site.email,
        url: site.url,
        responsePromise: site.responsePromise,
      },
      pdfUrl,
    })

    assert.match(params.subject ?? '', /^Partnership enquiry/)
    assert.match(params.client_subject ?? '', /partnership enquiry/)
    assert.match(params.client_intro ?? '', /partnership/)
    assert.match(params.content_html ?? '', /A website &amp; booking flow/)
    assert.match(params.content_html ?? '', /Download your PDF brief/)
    assert.equal(params.logo_url, `${site.url}/StackLogo2.png`)
  })
})
