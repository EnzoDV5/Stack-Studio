import { Section, type Tone } from '@/components/layout/Section'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { formatPrice } from '@/lib/format'
import type { MonthlyPlan, ProjectPackage, SectionIntro } from '@/types'

export interface PricingModelsProps {
  project: SectionIntro
  monthly: SectionIntro
  packages: ProjectPackage[]
  plans: MonthlyPlan[]
  labels: {
    from: string
    perMonth: string
    popular: string
    choose: string
    pages: (n: number) => string
    weeks: (a: number, b: number) => string
    minTerm: (n: number) => string
  }
  notes: string[]
  tone?: Tone
}

interface PlanCardProps {
  name: string
  tagline: string
  price: string
  priceSuffix?: string
  fromLabel?: string
  meta: string[]
  includes: string[]
  highlighted?: boolean
  popularLabel: string
  cta: { label: string; to: string; location: string }
}

function PlanCard({
  name,
  tagline,
  price,
  priceSuffix,
  fromLabel,
  meta,
  includes,
  highlighted,
  popularLabel,
  cta,
}: PlanCardProps) {
  return (
    <li
      className={cn(
        'relative grid gap-8 rounded-lg border p-7 md:p-8 xl:grid-cols-2',
        highlighted ? 'border-orange bg-ink-700' : 'border-tone',
      )}
    >
      <div className="flex flex-col">
        {highlighted && (
          <Tag variant="accent" className="mb-5 self-start">
            {popularLabel}
          </Tag>
        )}
        <h3 className="text-heading-lg">{name}</h3>
        <p className="mt-1 max-w-[30ch] text-small text-muted">{tagline}</p>
        <p className="mt-8">
          {fromLabel && <span className="block eyebrow text-muted">{fromLabel}</span>}
          <span className="numeric text-heading-xl">{price}</span>
          {priceSuffix && <span className="text-muted">{priceSuffix}</span>}
        </p>
        {meta.length > 0 && <p className="mt-3 eyebrow text-muted">{meta.join(' · ')}</p>}
        <Button
          to={cta.to}
          variant={highlighted ? 'primary' : 'secondary'}
          size="sm"
          withArrow
          className="mt-8 self-start"
          aria-label={`${cta.label} ${name}`}
          analytics={{ event: 'Start project click', props: { location: cta.location } }}
        >
          {cta.label}
        </Button>
      </div>
      <ul className="space-y-2 border-t border-tone pt-6 text-small xl:border-t-0 xl:border-l xl:pt-0 xl:pl-8">
        {includes.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
            {item}
          </li>
        ))}
      </ul>
    </li>
  )
}

/** Two models side by side: once-off project builds and monthly plans. Fully data-driven. */
export function PricingModels({
  project,
  monthly,
  packages,
  plans,
  labels,
  notes,
  tone = 'dark',
}: PricingModelsProps) {
  return (
    <Section tone={tone}>
      <div className="container-site grid gap-16 xl:grid-cols-2 xl:gap-10">
        {[
          {
            intro: project,
            cards: packages.map((pkg) => (
              <PlanCard
                key={pkg.id}
                name={pkg.name}
                tagline={pkg.tagline}
                fromLabel={labels.from}
                price={formatPrice(pkg.fromPrice)}
                meta={[labels.pages(pkg.includedPages), labels.weeks(...pkg.timelineWeeks)]}
                includes={pkg.includes}
                highlighted={pkg.highlighted}
                popularLabel={labels.popular}
                cta={{
                  label: labels.choose,
                  to: `/start?type=${pkg.id}`,
                  location: `pricing:${pkg.id}`,
                }}
              />
            )),
          },
          {
            intro: monthly,
            cards: plans.map((plan) => (
              <PlanCard
                key={plan.id}
                name={plan.name}
                tagline={plan.tagline}
                price={formatPrice(plan.pricePerMonth)}
                priceSuffix={labels.perMonth}
                meta={plan.minimumTermMonths ? [labels.minTerm(plan.minimumTermMonths)] : []}
                includes={plan.includes}
                highlighted={plan.highlighted}
                popularLabel={labels.popular}
                cta={{
                  label: labels.choose,
                  to: `/start?plan=${plan.id}`,
                  location: `pricing:${plan.id}`,
                }}
              />
            )),
          },
        ].map(({ intro, cards }) => (
          <section key={intro.title} aria-label={intro.title}>
            <Eyebrow label={intro.eyebrow} className="mb-5" />
            <h2 className="text-display-lg">{intro.title}</h2>
            {intro.intro && <p className="mt-4 max-w-[46ch] text-muted">{intro.intro}</p>}
            <StaggerGroup as="ul" className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              {cards}
            </StaggerGroup>
          </section>
        ))}
      </div>
      <div className="container-site mt-12 text-small text-muted">
        {notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </Section>
  )
}
