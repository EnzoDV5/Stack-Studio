import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink, ProjectPackage } from '@/types'

export interface PricingTeaserProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  fromLabel: string
  packages: ProjectPackage[]
  monthly: {
    eyebrow: string
    title: string
    body: string
    fromLabel: string
    perMonth: string
    fromPrice: number
  }
  cta: CtaLink
  estimateCta: CtaLink
  notes: string[]
  tone?: Tone
}

/** "From" prices per package plus the monthly plan hook. Cards stagger in. */
export function PricingTeaser({
  index,
  eyebrow,
  title,
  intro,
  fromLabel,
  packages,
  monthly,
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
          className="mt-16 grid gap-px overflow-hidden rounded-lg border border-tone bg-(--tone-border) sm:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {packages.map((pkg) => (
            <li
              key={pkg.id}
              className={cn(
                'relative flex flex-col gap-6 bg-(--tone-bg) p-7 md:p-8',
                pkg.highlighted && 'bg-ink-700',
              )}
            >
              {pkg.highlighted && (
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-orange" />
              )}
              <div>
                <h3 className="text-heading-lg">{pkg.name}</h3>
                <p className="mt-2 text-small text-muted">{pkg.bestFor}</p>
              </div>
              <p className="mt-auto">
                <span className="block eyebrow text-muted">{fromLabel}</span>
                <span className="mt-1 block numeric text-heading-xl">
                  {formatPrice(pkg.fromPrice)}
                </span>
              </p>
            </li>
          ))}
        </StaggerGroup>

        <div className="mt-8 grid gap-6 rounded-lg border border-tone p-7 md:p-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Eyebrow label={monthly.eyebrow} className="mb-4" />
            <h3 className="text-heading-xl">{monthly.title}</h3>
            <p className="mt-3 text-muted">{monthly.body}</p>
          </div>
          <p className="lg:col-span-3 lg:col-start-10 lg:text-right">
            <span className="block eyebrow text-muted">{monthly.fromLabel}</span>
            <span className="numeric text-display-lg">{formatPrice(monthly.fromPrice)}</span>
            <span className="text-muted">{monthly.perMonth}</span>
          </p>
        </div>

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
