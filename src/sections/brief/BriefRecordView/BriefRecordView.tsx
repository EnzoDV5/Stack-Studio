import { useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import type { BriefRecordCopy } from '@/data/brief'
import type { BriefRecord } from '@/lib/brief-record'
import { pad2 } from '@/lib/format'
import type { CtaLink } from '@/types'

export interface BriefRecordViewProps {
  record: BriefRecord
  copy: Pick<BriefRecordCopy, 'sections' | 'labels' | 'none' | 'estimateNote'> & {
    download: string
    home: CtaLink
  }
  onDownload: () => Promise<void>
  tone?: Tone
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid gap-1 border-t border-tone py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6"
        >
          <dt className="text-small text-muted">{label}</dt>
          <dd className="break-words whitespace-pre-line">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * A received brief, laid out like its PDF: reference, estimate and download on the left,
 * the numbered contact, project and message sections on the right.
 */
export function BriefRecordView({
  record,
  copy,
  onDownload,
  tone = 'dark',
}: BriefRecordViewProps) {
  const [downloading, setDownloading] = useState(false)
  const { contact } = record
  const none = copy.none

  const download = () => {
    if (downloading) return
    setDownloading(true)
    onDownload()
      .catch((error: unknown) => console.error(error))
      .finally(() => setDownloading(false))
  }

  const sections: { title: string; rows?: [string, string][]; text?: string }[] = [
    {
      title: copy.sections.contact,
      rows: [
        [copy.labels.name, contact.name],
        [copy.labels.email, contact.email],
        [copy.labels.phone, contact.phone || none],
        [copy.labels.company, contact.company || none],
      ],
    },
    {
      title: copy.sections.project,
      rows: record.answers.map(([label, value]) => [label, value || none]),
    },
  ]
  if (contact.message) sections.push({ title: copy.sections.message, text: contact.message })

  return (
    <Section tone={tone} className="pt-8">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <aside className="space-y-6 lg:col-span-4">
          {record.estimate.recommendation && (
            <div className="border border-l-4 border-tone border-l-orange p-6">
              <p className="eyebrow text-accent">{copy.sections.estimate}</p>
              <p className="mt-3 font-display text-heading-lg">{record.estimate.recommendation}</p>
              <p className="mt-3 text-small text-muted">{copy.estimateNote}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <Button type="button" onClick={download} aria-busy={downloading} withArrow>
              {copy.download}
            </Button>
            <Button to={copy.home.to} variant="secondary">
              {copy.home.label}
            </Button>
          </div>
        </aside>

        <div className="space-y-12 lg:col-span-7 lg:col-start-6">
          {sections.map((section, i) => (
            <section key={section.title} aria-labelledby={`brief-section-${i}`}>
              <h2 id={`brief-section-${i}`} className="mb-4 eyebrow text-accent">
                {pad2(i + 1)} · {section.title}
              </h2>
              {section.rows && <Rows rows={section.rows} />}
              {section.text && (
                <p className="border-t border-tone pt-4 whitespace-pre-line">{section.text}</p>
              )}
            </section>
          ))}
          <p className="text-small break-all text-muted">
            {copy.labels.source}: {record.page}
          </p>
        </div>
      </div>
    </Section>
  )
}
