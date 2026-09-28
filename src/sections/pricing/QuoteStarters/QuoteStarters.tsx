import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaContent, CtaLink } from '@/types'

export interface QuoteStarter {
  id: string
  name: string
  for: string
  includes: string[]
  /** Indicative range, e.g. "R 18 000 – R 24 500". */
  range: string
  /** Monthly line, e.g. "plus R 1 250/month for hosting and care". */
  monthly?: string
  /** Into the quote builder, pre-filled with this quote. */
  cta: CtaLink
}

export interface QuoteStartersProps {
  eyebrow: string
  title: string
  intro: string
  quotes: QuoteStarter[]
  rangeLabel: string
  /** The last card: for anything the starting quotes don't cover. */
  custom: CtaContent
  notes: string[]
  tone?: Tone
}

/**
 * Ready-made starting quotes instead of a price list. Each shows who it suits, what it
 * covers and an indicative range, and opens the quote builder pre-filled so the visitor
 * adjusts it rather than starting from zero. Signature motion: the cards rise in, one after
 * the other, as they enter.
 */
export function QuoteStarters({
  eyebrow,
  title,
  intro,
  quotes,
  rangeLabel,
  custom,
  notes,
  tone = 'dark',
}: QuoteStartersProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />

        <StaggerGroup as="ul" className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {quotes.map((quote) => (
            <li
              key={quote.id}
              className="flex flex-col rounded-lg border border-tone bg-tone-surface p-7 md:p-8"
            >
              <h3 className="text-heading-lg">{quote.name}</h3>
              <p className="mt-2 text-small text-muted">{quote.for}</p>

              <div className="mt-8 border-y border-tone py-5">
                <p className="eyebrow text-muted">{rangeLabel}</p>
                <p className="mt-2 numeric text-heading-md">{quote.range}</p>
                {quote.monthly && <p className="mt-1 text-small text-muted">{quote.monthly}</p>}
              </div>

              <ul className="mt-6 flex-1 space-y-2 text-small">
                {quote.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                to={quote.cta.to}
                variant="secondary"
                size="sm"
                withArrow
                className="mt-8 self-start"
                aria-label={`${quote.cta.label}: ${quote.name}`}
                analytics={{
                  event: 'Start project click',
                  props: { location: `pricing-quote:${quote.id}` },
                }}
              >
                {quote.cta.label}
              </Button>
            </li>
          ))}

          <li className="flex flex-col justify-between gap-8 rounded-lg bg-orange p-7 text-ink md:p-8">
            <div>
              <h3 className="text-heading-lg">{custom.title}</h3>
              {custom.body && <p className="mt-3 text-ink/80">{custom.body}</p>}
            </div>
            <Button
              to={custom.to}
              variant="inverse"
              withArrow
              className="self-start"
              analytics={{ event: 'Start project click', props: { location: 'pricing-custom' } }}
            >
              {custom.label}
            </Button>
          </li>
        </StaggerGroup>

        <div className="mt-8 space-y-1 text-small text-muted">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>
    </Section>
  )
}
