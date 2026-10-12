import { useId, type CSSProperties } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { PaymentSchedule, PolicyItem } from '@/types'

export interface PoliciesListProps {
  eyebrow: string
  title: string
  scheduleLabel: string
  schedules: PaymentSchedule[]
  items: PolicyItem[]
  vatNote: string
  /** Heading level for the policy titles. */
  itemHeading?: 'h2' | 'h3'
  tone?: Tone
}

/** Payment schedules as milestone bars, then the commercial policies. Used on /process. */
export function PoliciesList({
  eyebrow,
  title,
  scheduleLabel,
  schedules,
  items,
  vatNote,
  itemHeading: H = 'h3',
  tone = 'dark',
}: PoliciesListProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          eyebrow={eyebrow}
          title={title}
          size="heading-xl"
        />

        <div className="mt-12 grid gap-10 xl:grid-cols-2">
          {schedules.map((schedule) => (
            <div key={schedule.id}>
              <H className="text-heading-md">{schedule.label}</H>
              <p className="mt-1 eyebrow text-muted">{scheduleLabel}</p>
              {/* A list on phones; from sm, one bar with segments sized by their share. */}
              <ol
                className="mt-5 flex flex-col overflow-hidden rounded-md border border-tone sm:flex-row"
                aria-label={schedule.appliesTo}
              >
                {schedule.milestones.map((m) => (
                  <li
                    key={m.label}
                    style={{ '--share': m.percent } as CSSProperties}
                    className="flex items-baseline gap-4 border-b border-tone p-3 last:border-b-0 sm:block sm:min-w-26 sm:grow-(--share) sm:basis-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
                  >
                    <span className="block w-12 shrink-0 numeric text-heading-md text-accent sm:w-auto">
                      {m.percent}%
                    </span>
                    <span className="block text-micro text-muted sm:mt-1">{m.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <dl className="mt-14 grid gap-x-12 gap-y-8 border-t border-tone pt-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id}>
              <dt>
                <H className="text-heading-md">{item.title}</H>
              </dt>
              <dd className="mt-2 space-y-1 text-muted">
                {item.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-small text-muted">{vatNote}</p>
      </div>
    </Section>
  )
}
