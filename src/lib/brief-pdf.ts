/** A printable copy of the brief shared by the success screen and email download link. */
import { jsPDF } from 'jspdf'
import type { BriefRecordCopy } from '@/data/brief'
import { formatSubmitted, type BriefRecord } from './brief-record'

export interface StudioDetails {
  name: string
  url: string
}

export interface BriefLogoImages {
  mark: string
  wordmark: string
}

const W = 595.28
const H = 841.89
const M = 46
const RIGHT = W - M
const CONTENT = W - 2 * M
const BOTTOM = H - 78
const VALUE_X = M + 190
const VALUE_W = RIGHT - VALUE_X

// The site's palette, from src/styles/tokens.css.
const c = {
  ink: '#0a0a0a',
  orange: '#ff5a14',
  orangeDeep: '#b93d0a',
  paper: '#f4f0ea',
  line: '#dcd4c8',
  muted: '#525252',
  white: '#ffffff',
}

/** jsPDF's built-in font uses WinAnsi. Replace punctuation it cannot print. */
export function pdfText(value: string): string {
  return value
    .replace(/[\u00a0\u2007\u2009\u202f]/g, ' ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/•/g, '·')
    .replace(/[^\r\n\u0020-\u007e\u00a0-\u00ff]/g, '')
}

export function briefPdfFilename(record: BriefRecord): string {
  const name = record.contact.name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return `stack-studio-brief-${record.ref}${name ? `-${name}` : ''}.pdf`
}

class Writer {
  y = 102
  readonly doc: jsPDF
  readonly logo?: BriefLogoImages

  constructor(doc: jsPDF, logo?: BriefLogoImages) {
    this.doc = doc
    this.logo = logo
  }

  font(style: 'normal' | 'bold', size: number, color = c.ink, spacing = 0) {
    this.doc.setFont('helvetica', style)
    this.doc.setFontSize(size)
    this.doc.setTextColor(color)
    this.doc.setCharSpace(spacing)
  }

  lines(value: string, width: number): string[] {
    return this.doc.splitTextToSize(pdfText(value), width) as string[]
  }

  label(value: string, x: number, y: number, color = c.muted) {
    this.font('bold', 7.5, color, 1.1)
    this.doc.text(pdfText(value).toUpperCase(), x, y)
    this.doc.setCharSpace(0)
  }

  rule(y: number, color = c.line, width = 0.65) {
    this.doc.setDrawColor(color)
    this.doc.setLineWidth(width)
    this.doc.line(M, y, RIGHT, y)
  }

  paintPage(continued = false) {
    this.doc.setFillColor(c.white)
    this.doc.rect(0, 0, W, H, 'F')

    if (this.logo) {
      // The supplied transparent PNG artwork, repeated on each page.
      this.doc.addImage(this.logo.mark, 'PNG', M, 34, 29, 29, 'stack-studio-mark')
      this.doc.addImage(this.logo.wordmark, 'PNG', M + 38, 34, 87, 29, 'stack-studio-wordmark')
      this.label('STUDIO', M + 40, 69, c.ink)
    } else {
      this.font('bold', 14, c.ink, 1)
      this.doc.text('STACK', M, 48)
      this.label('STUDIO', M + 1, 61, c.ink)
    }
    // Right-aligned document label balances the logo at the other edge.
    this.font('bold', 7.5, c.muted, 1.1)
    this.doc.text('PROJECT BRIEF', RIGHT, 51, { align: 'right' })
    this.doc.setCharSpace(0)
    this.rule(80, c.ink, 1)

    if (continued) {
      this.font('bold', 18)
      this.doc.text('Project brief', M, 116)
      this.y = 143
    } else {
      this.y = 102
    }
  }

  ensure(height: number) {
    if (this.y + height <= BOTTOM) return
    this.doc.addPage()
    this.paintPage(true)
  }

  section(index: number, title: string, minimumBodyHeight = 0) {
    const groupHeight = 65 + minimumBodyHeight
    if (groupHeight <= BOTTOM - 143 && this.y + groupHeight > BOTTOM) {
      this.doc.addPage()
      this.paintPage(true)
    }
    this.ensure(65)
    this.y += 31
    this.font('bold', 11, c.orangeDeep)
    this.doc.text(String(index).padStart(2, '0'), M, this.y)
    this.font('bold', 15, c.ink)
    this.doc.text(pdfText(title), M + 34, this.y)
    this.rule(this.y + 13)
    this.y += 29
  }

  row(label: string, value: string) {
    this.font('normal', 11)
    const valueLines = this.lines(value, VALUE_W)
    this.font('normal', 9)
    const labelLines = this.lines(label, VALUE_X - M - 48)
    let offset = 0

    while (offset < valueLines.length) {
      if (BOTTOM - this.y < 52) this.ensure(52)
      const capacity = Math.max(1, Math.floor((BOTTOM - this.y - 20) / 15))
      const chunk = valueLines.slice(offset, offset + capacity)
      const height = Math.max(chunk.length * 15 + 17, labelLines.length * 12 + 17)
      const baseline = this.y + 17

      if (offset === 0) {
        this.font('normal', 9, c.muted)
        this.doc.text(labelLines, M + 34, baseline, { lineHeightFactor: 1.3 })
      }
      this.font('normal', 11)
      this.doc.text(chunk, VALUE_X, baseline, { lineHeightFactor: 1.36 })
      this.y += height
      this.rule(this.y)
      offset += chunk.length
    }
  }

  message(text: string) {
    this.font('normal', 11)
    for (const line of this.lines(text, CONTENT - 34)) {
      this.ensure(31)
      this.doc.text(line, M + 34, this.y + 17)
      this.y += 17
    }
    this.y += 6
  }
}

/** A restrained, branded A4 record with the same answers as the email and success screen. */
export function createBriefPdf(
  record: BriefRecord,
  copy: BriefRecordCopy,
  studio: StudioDetails,
  logo?: BriefLogoImages,
): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
  const w = new Writer(doc, logo)
  const { contact } = record
  const reason = copy.reasons[record.path]
  const submitted = formatSubmitted(record.submittedAt)

  doc.setProperties({
    title: pdfText(`${studio.name} ${copy.title} ${record.ref} - ${contact.name}`),
    subject: pdfText(`${reason} - ${contact.name}`),
    author: studio.name,
    creator: studio.url,
  })
  w.paintPage()

  w.label('New project enquiry', M, w.y + 14, c.orangeDeep)
  w.font('bold', 39)
  doc.text(pdfText(copy.title), M, w.y + 60)
  w.font('normal', 23)
  const nameLines = w.lines(contact.name, CONTENT).slice(0, 2)
  doc.text(nameLines, M, w.y + 97, { lineHeightFactor: 1.17 })
  const metaY = w.y + 97 + (nameLines.length - 1) * 27 + 42
  w.rule(metaY, c.ink, 0.8)
  const meta: [string, string][] = [
    [copy.labels.reference, record.ref],
    [copy.labels.submitted, submitted],
    [copy.sections.project, reason],
  ]
  const col = CONTENT / 3
  meta.forEach(([label, value], index) => {
    const x = M + col * index
    w.label(label, x, metaY + 18)
    w.font('bold', 10, c.ink)
    doc.text(w.lines(value, col - 17).slice(0, 2), x, metaY + 38, { lineHeightFactor: 1.25 })
  })
  w.rule(metaY + 68)
  w.y = metaY + 87

  if (record.estimate.recommendation) {
    w.font('bold', 20)
    const lines = w.lines(record.estimate.recommendation, CONTENT - 40)
    const height = 64 + lines.length * 23
    w.ensure(height)
    doc.setFillColor(c.paper)
    doc.rect(M, w.y, CONTENT, height, 'F')
    doc.setFillColor(c.orange)
    doc.rect(M, w.y, 3, height, 'F')
    w.label(copy.sections.estimate, M + 20, w.y + 23, c.orangeDeep)
    w.font('bold', 20)
    doc.text(lines, M + 20, w.y + 52, { lineHeightFactor: 1.16 })
    w.font('normal', 8.5, c.muted)
    doc.text(pdfText(copy.estimateNote), M + 20, w.y + height - 15)
    w.y += height + 1
  }

  let index = 1
  w.section(index++, copy.sections.contact, 4 * 36)
  w.row(copy.labels.name, contact.name)
  w.row(copy.labels.email, contact.email)
  w.row(copy.labels.phone, contact.phone || copy.none)
  w.row(copy.labels.company, contact.company || copy.none)

  w.section(index++, copy.sections.project, record.answers.length * 40)
  for (const [label, value] of record.answers) w.row(label, value || copy.none)

  if (contact.message) {
    w.section(index++, copy.sections.message, 60)
    w.message(contact.message)
  }

  w.section(index++, 'Record', 40)
  w.row(copy.labels.source, record.page)

  const pages = doc.getNumberOfPages()
  const host = studio.url.replace(/^https?:\/\//, '')
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(c.line)
    doc.setLineWidth(0.65)
    doc.line(M, H - 58, RIGHT, H - 58)
    doc.setFillColor(c.orange)
    doc.rect(M, H - 44, 5, 5, 'F')
    w.font('bold', 8, c.ink, 0.45)
    doc.text(pdfText(`${studio.name}  /  ${host}`), M + 13, H - 39)
    w.font('normal', 8, c.muted)
    doc.text(`${record.ref}     ${page} / ${pages}`, RIGHT, H - 39, { align: 'right' })
    doc.setCharSpace(0)
  }

  return doc
}
