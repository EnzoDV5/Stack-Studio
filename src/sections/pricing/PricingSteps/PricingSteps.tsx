import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { pad2 } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface PricingStepsProps {
  eyebrow: string
  title: string
  steps: { title: string; body: string }[]
  cta: CtaLink
  tone?: Tone
}

/** How a price is reached: estimate, conversation, fixed quote. Static. */
export function PricingSteps({ eyebrow, title, steps, cta, tone = 'paper' }: PricingStepsProps) {
  const headingId = useId()
  return (
    <Section tone={tone} className="pt-10" aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="minimal"
          eyebrow={eyebrow}
          title={title}
          aside={
            <Button
              to={cta.to}
              withArrow
              analytics={{ event: 'Start project click', props: { location: 'pricing-steps' } }}
            >
              {cta.label}
            </Button>
          }
        />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-tone bg-(--tone-border) md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-4 bg-(--tone-bg) p-7 md:p-9">
              <span className="font-display numeric text-display-lg text-accent">
                {pad2(i + 1)}
              </span>
              <h3 className="text-heading-lg">{step.title}</h3>
              <p className="text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
