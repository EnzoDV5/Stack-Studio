import { Section, type Tone } from '@/components/layout/Section'
import { TextLink } from '@/components/ui/TextLink'
import { PlanCard, type PlanCardProps } from '@/sections/services/PlanCard'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface MonthlyPlansProps {
  /** Optional small label above the title. */
  eyebrow?: string
  title: string
  plans: (PlanCardProps & { id: string })[]
  footnotes: string[]
  /** Eyebrow number, when the plans are one of a page's numbered groups. */
  index?: number
  /** Anchor for links to the plans, e.g. "plans". */
  id?: string
  /** "Go deeper" link beside the title (how care runs, on /process). */
  more?: CtaLink
  tone?: Tone
}

/** Three ongoing options shown together so their scope is easy to compare. */
export function MonthlyPlans({
  eyebrow,
  title,
  plans,
  footnotes,
  index,
  id,
  more,
  tone = 'dark',
}: MonthlyPlansProps) {
  return (
    <Section id={id} tone={tone} spacing="none" className="pt-section pb-8 md:pb-10">
      <div className="container-site">
        <SectionHeader
          variant="inline"
          eyebrow={eyebrow}
          index={index}
          title={title}
          aside={
            more && (
              <TextLink to={more.to} arrow>
                {more.label}
              </TextLink>
            )
          }
        />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map(({ id: planId, ...plan }) => (
            <PlanCard key={planId} {...plan} />
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
