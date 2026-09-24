import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaContent } from '@/types'

export interface PriceItem {
  name: string
  price: string
}

export interface PricingSummaryProps {
  eyebrow: string
  title: string
  groups: { id: string; title: string; items: PriceItem[] }[]
  addOns?: { title: string; items: PriceItem[] }
  more: CtaContent
  notes: string[]
  tone?: Tone
}

/** Grouped "from" prices (Build, Take over, Run, Partner) plus the estimator nudge. */
export function PricingSummary({
  eyebrow,
  title,
  groups,
  addOns,
  more,
  notes,
  tone = 'dark',
}: PricingSummaryProps) {
  const headingId = useId()
  return (
    <Section tone={tone} className="pt-8" aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} />
        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-x-16">
          {groups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-4 eyebrow text-accent">{group.title}</h3>
              <ul className="divide-y divide-(--tone-border) border-y border-tone">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-6 py-4">
                    <span className="text-heading-md">{item.name}</span>
                    <span className="shrink-0 numeric text-muted">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {addOns && (
            <div>
              <h3 className="mb-4 eyebrow text-accent">{addOns.title}</h3>
              <ul className="divide-y divide-(--tone-border) border-y border-tone text-small">
                {addOns.items.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-6 py-3">
                    <span>{item.name}</span>
                    <span className="shrink-0 numeric text-muted">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-col gap-6 rounded-lg border border-tone p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-heading-lg">{more.title}</p>
            {more.body && <p className="mt-2 max-w-[56ch] text-muted">{more.body}</p>}
          </div>
          <Button
            to={more.to}
            withArrow
            className="shrink-0"
            analytics={{ event: 'Start project click', props: { location: 'pricing-summary' } }}
          >
            {more.label}
          </Button>
        </div>

        <div className="mt-6 text-small text-muted">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>
    </Section>
  )
}
