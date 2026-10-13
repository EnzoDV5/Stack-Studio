import { jsPDF } from 'jspdf'
import type { BriefPayload } from './submit-brief'

export interface BriefPdf {
  filename: string
  content: string
}

interface PdfRow {
  label: string
  value: string
}

const page = {
  width: 595.28,
  height: 841.89,
  margin: 48,
}

const color = {
  ink: '#0A0A0A',
  paper: '#F4F0EA',
  paperLine: '#DCD4C8',
  orange: '#FF5A14',
  muted: '#737373',
  white: '#FFFFFF',
}

function clean(value: unknown): string {
  if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(', ')
  if (value === null || value === undefined || value === '') return 'Not supplied'
  return String(value)
}

function filenameSafe(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64)
}

function submittedDate(iso: string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Johannesburg',
  }).format(new Date(iso))
}

function addPageIfNeeded(doc: jsPDF, y: number, needed = 80): number {
  if (y + needed <= page.height - page.margin) return y

  doc.addPage()
  doc.setFillColor(color.paper)
  doc.rect(0, 0, page.width, page.height, 'F')
  return page.margin
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  const nextY = addPageIfNeeded(doc, y, 64)
  doc.setDrawColor(color.orange)
  doc.setLineWidth(2)
  doc.line(page.margin, nextY - 12, page.width - page.margin, nextY - 12)
  doc.setTextColor(color.ink)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text(title, page.margin, nextY + 8)
  return nextY + 32
}

function addRows(doc: jsPDF, rows: PdfRow[], y: number): number {
  let cursor = y

  for (const row of rows) {
    cursor = addPageIfNeeded(doc, cursor, 58)
    const labelWidth = 128
    const valueX = page.margin + labelWidth
    const valueWidth = page.width - page.margin - valueX
    const lines = doc.splitTextToSize(row.value, valueWidth) as string[]
    const rowHeight = Math.max(38, lines.length * 15 + 18)

    doc.setFillColor(color.white)
    doc.roundedRect(page.margin, cursor, page.width - page.margin * 2, rowHeight, 6, 6, 'F')
    doc.setDrawColor(color.paperLine)
    doc.roundedRect(page.margin, cursor, page.width - page.margin * 2, rowHeight, 6, 6, 'S')

    doc.setTextColor(color.muted)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.text(row.label.toUpperCase(), page.margin + 14, cursor + 22)

    doc.setTextColor(color.ink)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(lines, valueX, cursor + 22)

    cursor += rowHeight + 8
  }

  return cursor
}

function summaryRows(payload: BriefPayload): PdfRow[] {
  return Object.entries(payload.summary).map(([label, value]) => ({
    label,
    value: clean(value),
  }))
}

export function createBriefPdf(payload: BriefPayload): BriefPdf {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const contact = payload.brief.contact
  const submitted = submittedDate(payload.meta.submittedAt)

  doc.setProperties({
    title: `Stack Studio brief - ${contact.name}`,
    subject: payload.result.recommendation,
    author: 'Stack Studio',
    creator: 'Stack Studio website',
  })

  doc.setFillColor(color.paper)
  doc.rect(0, 0, page.width, page.height, 'F')

  doc.setFillColor(color.ink)
  doc.rect(0, 0, page.width, 172, 'F')
  doc.setFillColor(color.orange)
  doc.rect(page.margin, 44, 22, 22, 'F')

  doc.setTextColor(color.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Stack Studio', page.margin + 34, 62)

  doc.setFontSize(34)
  doc.text('Project brief', page.margin, 116)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`${contact.name} - ${payload.path} - ${submitted}`, page.margin, 140)

  let y = 218
  y = addSectionTitle(doc, 'Client', y)
  y = addRows(
    doc,
    [
      { label: 'Name', value: contact.name },
      { label: 'Email', value: contact.email },
      { label: 'Phone', value: contact.phone },
      { label: 'Company', value: contact.company },
      { label: 'Message', value: contact.message },
    ],
    y,
  )

  y = addSectionTitle(doc, 'Estimate', y + 16)
  y = addRows(
    doc,
    [
      { label: 'Result', value: payload.result.kind },
      { label: 'Recommendation', value: payload.result.recommendation },
    ],
    y,
  )

  y = addSectionTitle(doc, 'Brief Answers', y + 16)
  y = addRows(doc, summaryRows(payload), y)

  y = addSectionTitle(doc, 'Source', y + 16)
  addRows(
    doc,
    [
      { label: 'Submitted', value: submitted },
      { label: 'Page', value: payload.meta.page },
      { label: 'Consent', value: payload.brief.consent ? 'Yes' : 'No' },
    ],
    y,
  )

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i)
    doc.setTextColor(color.muted)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`Stack Studio brief - page ${i} of ${pageCount}`, page.margin, page.height - 24)
  }

  return {
    filename: `stack-studio-brief-${filenameSafe(contact.name)}.pdf`,
    content: doc.output('datauristring'),
  }
}
