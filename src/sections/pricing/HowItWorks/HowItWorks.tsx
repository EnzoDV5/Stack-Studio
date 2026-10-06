import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { pad2 } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface HowItWorksProps {
  eyebrow: string
  title: string
  steps: { title: string; body: string }[]
  cta: CtaLink
  tone?: Tone
}

/** Introduces the plan choice, conversation and agreed scope. */
export function HowItWorks({ eyebrow, title, steps, cta, tone = 'paper' }: HowItWorksProps) {
  const headingId = useId()
  return (
    <Section
      tone={tone}
      spacing="none"
      className="pt-10 pb-12 md:pt-16 md:pb-16"
      aria-labelledby={headingId}
    >
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="minimal"
          eyebrow={eyebrow}
          title={title}
          aside={
            <Button to={cta.to} withArrow>
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
