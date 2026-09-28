import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { TextLink } from '@/components/ui/TextLink'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink, PaymentSchedule, PolicyItem } from '@/types'

export interface PoliciesListProps {
  eyebrow: string
  title: string
  scheduleLabel: string
  schedules: PaymentSchedule[]
  items: PolicyItem[]
  vatNote: string
  termsLink?: CtaLink
  /** Heading level for the policy titles (h3 under a page section, h2 on /terms). */
  itemHeading?: 'h2' | 'h3'
  tone?: Tone
}

/** Payment schedules as milestone bars, then the commercial policies. Used on Pricing and /terms. */
export function PoliciesList({
  eyebrow,
  title,
  scheduleLabel,
  schedules,
  items,
  vatNote,
  termsLink,
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

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {schedules.map((schedule) => (
            <div key={schedule.id}>
              <H className="text-heading-md">{schedule.label}</H>
              <p className="mt-1 eyebrow text-muted">{scheduleLabel}</p>
              <ol
                className="mt-5 flex overflow-hidden rounded-md border border-tone"
                aria-label={schedule.appliesTo}
              >
                {schedule.milestones.map((m) => (
                  <li
                    key={m.label}
                    style={{ flexGrow: m.percent, flexBasis: 0 }}
                    className="min-w-0 border-r border-tone p-3 last:border-r-0"
                  >
                    <span className="block numeric text-heading-md text-accent">{m.percent}%</span>
                    <span className="mt-1 block text-micro text-muted">{m.label}</span>
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

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-small text-muted">
          <p>{vatNote}</p>
          {termsLink && <TextLink to={termsLink.to}>{termsLink.label}</TextLink>}
        </div>
      </div>
    </Section>
  )
}
