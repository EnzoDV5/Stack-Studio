import { Section, type Tone } from '@/components/layout/Section'
import { PlanCard, type PlanCardProps } from '@/sections/pricing/PlanCard'
import { SectionHeader } from '@/sections/shared/SectionHeader'

export interface MonthlyPlansProps {
  eyebrow: string
  title: string
  plans: (PlanCardProps & { id: string })[]
  footnotes: string[]
  tone?: Tone
}

/** Three ongoing options shown together so their scope is easy to compare. */
export function MonthlyPlans({
  eyebrow,
  title,
  plans,
  footnotes,
  tone = 'dark',
}: MonthlyPlansProps) {
  return (
    <Section tone={tone} spacing="none" className="pt-section pb-8 md:pb-10">
      <div className="container-site">
        <SectionHeader variant="inline" eyebrow={eyebrow} title={title} />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map(({ id, ...plan }) => (
            <PlanCard key={id} {...plan} />
          ))}
        </ul>
        <div className="mt-8 space-y-1 text-small text-muted">
          {footnotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>
    </Section>
  )
}
