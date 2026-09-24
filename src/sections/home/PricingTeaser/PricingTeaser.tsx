import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface PricingTeaserProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  /** e.g. { label: 'Websites', price: 'From R 18 000', note: 'Once-off build' } */
  items: { label: string; price: string; note: string }[]
  cta: CtaLink
  estimateCta: CtaLink
  notes: string[]
  tone?: Tone
}

/** Three headline starting prices (Websites · Care · Partner) with the estimator CTA. Cards stagger in. */
export function PricingTeaser({
  index,
  eyebrow,
  title,
  intro,
  items,
  cta,
  estimateCta,
  notes,
  tone = 'dark',
}: PricingTeaserProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader id={headingId} index={index} eyebrow={eyebrow} title={title} intro={intro} />

        <StaggerGroup
          as="ul"
          className="mt-16 grid gap-px overflow-hidden rounded-lg border border-tone bg-(--tone-border) md:grid-cols-3 lg:mt-20"
        >
          {items.map((item) => (
            <li key={item.label} className="flex flex-col gap-8 bg-(--tone-bg) p-7 md:p-10">
              <div>
                <h3 className="text-heading-lg">{item.label}</h3>
                <p className="mt-2 text-small text-muted">{item.note}</p>
              </div>
              <p className="mt-auto numeric text-heading-xl">{item.price}</p>
            </li>
          ))}
        </StaggerGroup>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <Button
              to={estimateCta.to}
              withArrow
              analytics={{ event: 'Start project click', props: { location: 'pricing-teaser' } }}
            >
              {estimateCta.label}
            </Button>
            <Button to={cta.to} variant="secondary">
              {cta.label}
            </Button>
          </div>
          <div className="text-small text-muted sm:text-right">
            {notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
