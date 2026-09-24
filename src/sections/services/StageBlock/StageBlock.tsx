import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { pad2 } from '@/lib/format'
import type { OfferRow } from '@/lib/offer'
import type { CtaLink } from '@/types'

export interface StageBlockProps {
  id: string
  index: number
  name: string
  line: string
  summary: string
  rows: OfferRow[]
  /** Stage-level notes, e.g. "Hosting-only available on request." */
  notes?: string[]
  cta: CtaLink
  labels: { includes: string; examples: string }
}

/** One stage: number, name and line, summary, expandable offering rows and a pre-filled CTA. */
export function StageBlock({
  id,
  index,
  name,
  line,
  summary,
  rows,
  notes = [],
  cta,
  labels,
}: StageBlockProps) {
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-28 border-t border-tone pt-12 pb-20 first:border-t-0 first:pt-0"
    >
      <p className="mb-5 eyebrow text-accent">{pad2(index)}</p>
      <h2 id={headingId} className="text-display-lg">
        {name}
      </h2>
      <p className="mt-3 text-heading-lg text-muted">{line}</p>
      <p className="mt-6 max-w-[56ch] text-body-lg">{summary}</p>

      <Accordion
        className="mt-10"
        headingLevel="h3"
        titleClassName="text-heading-lg"
        items={rows.map((row) => ({
          id: row.id,
          title: row.name,
          meta: row.price,
          content: (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="numeric text-heading-md sm:hidden">{row.price}</p>
                <p className="mt-2 text-body-lg sm:mt-0">{row.summary}</p>
                {row.notes.length > 0 && (
                  <ul className="mt-4 space-y-1 text-small text-muted">
                    {row.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                )}
                {row.examples.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-3 eyebrow text-muted">{labels.examples}</p>
                    <div className="flex flex-wrap gap-2">
                      {row.examples.map((example) => (
                        <Tag key={example}>{example}</Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {row.includes.length > 0 && (
                <div>
                  <p className="mb-3 eyebrow text-muted">{labels.includes}</p>
                  <ul className="space-y-2">
                    {row.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-marker" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ),
        }))}
      />

      {notes.length > 0 && (
        <div className="mt-6 space-y-1 text-small text-muted">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}

      <Button
        to={cta.to}
        withArrow
        className="mt-10"
        analytics={{ event: 'Start project click', props: { location: `services-stage:${id}` } }}
      >
        {cta.label}
      </Button>
    </section>
  )
}
