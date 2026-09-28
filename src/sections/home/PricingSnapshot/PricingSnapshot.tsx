import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { CountUp } from '@/components/motion/CountUp'
import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface SnapshotFigure {
  label: string
  /** e.g. "From". */
  prefix: string
  /** The formatted amount, e.g. "R 18 000". Its number counts up. */
  value: string
  /** e.g. "/month". */
  unit?: string
  note: string
}

export interface PricingSnapshotProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  figures: SnapshotFigure[]
  notes: string[]
  estimateCta: CtaLink
  /** "Go deeper" link to the full pricing page. */
  more: CtaLink
  tone?: Tone
}

/**
 * Three headline starting prices. Signature motion: each figure counts up once as it
 * enters (GSAP on a plain object, formatted like the final price).
 */
export function PricingSnapshot({
  index,
  eyebrow,
  title,
  intro,
  figures,
  notes,
  estimateCta,
  more,
  tone = 'paper',
}: PricingSnapshotProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader id={headingId} index={index} eyebrow={eyebrow} title={title} intro={intro} />

        <dl className="mt-14 grid border-y border-tone md:grid-cols-3 lg:mt-20">
          {figures.map((figure) => (
            <div
              key={figure.label}
              className="flex flex-col border-tone py-8 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
            >
              <dt className="eyebrow text-muted">{figure.label}</dt>
              <dd className="mt-6">
                <span className="block text-small text-muted">{figure.prefix}</span>
                <span className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <CountUp value={figure.value} className="font-display numeric text-display-lg" />
                  {figure.unit && <span className="text-body-lg text-muted">{figure.unit}</span>}
                </span>
                <span className="mt-3 block text-small text-muted">{figure.note}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button
              to={estimateCta.to}
              withArrow
              analytics={{ event: 'Start project click', props: { location: 'home-pricing' } }}
            >
              {estimateCta.label}
            </Button>
            <TextLink to={more.to} arrow>
              {more.label}
            </TextLink>
          </div>
          <div className="text-small text-muted lg:text-right">
            {notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
