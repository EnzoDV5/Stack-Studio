import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { DrawLine } from '@/components/motion/DrawLine'
import { TextLink } from '@/components/ui/TextLink'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import { TechnologyMarquee, type TechnologyMarqueeProps } from '@/sections/shared/TechnologyMarquee'
import type { CtaLink, ProcessStep } from '@/types'

export interface ProcessLineProps {
  index?: number
  eyebrow: string
  title: string
  steps: ProcessStep[]
  stepLabel: string
  /** "Go deeper" link to the full process. */
  more: CtaLink
  /** The tools behind the work, as one slow row under the steps. */
  technologies?: Omit<TechnologyMarqueeProps, 'tone'>
  tone?: Tone
}

/**
 * How a project runs, and what it's built with. Signature motion: a line draws itself with
 * scroll (scrubbed, no pin) and each step lights up as the line reaches it. Horizontal on
 * desktop, vertical on mobile. The technology strip runs underneath as one slow row
 * (ambient). The full sticky version of the process (ProcessPinned) lives on /services.
 */
export function ProcessLine({
  index,
  eyebrow,
  title,
  steps,
  stepLabel,
  more,
  technologies,
  tone = 'dark',
}: ProcessLineProps) {
  const headingId = useId()
  const horizontal = useMediaQuery('(min-width: 64rem)')

  return (
    <Section tone={tone} spacing="sm" aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="minimal"
          index={index}
          eyebrow={eyebrow}
          title={title}
        />

        <DrawLine
          key={horizontal ? 'h' : 'v'}
          orientation={horizontal ? 'horizontal' : 'vertical'}
          className="mt-14 lg:mt-20"
          lineClassName={
            horizontal ? 'inset-x-0 top-[7px] h-0.5 w-full' : 'inset-y-0 left-[7px] h-full w-0.5'
          }
        >
          <ol
            className={cn('grid', horizontal ? 'gap-6' : 'gap-10 pl-10')}
            style={
              horizontal
                ? { gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }
                : undefined
            }
          >
            {steps.map((step, i) => (
              <li key={step.id} data-draw-step="" className="relative">
                <span
                  data-draw-marker=""
                  aria-hidden="true"
                  className={cn(
                    'block size-4 overflow-hidden rounded-pill border-2 border-orange bg-(--tone-bg)',
                    !horizontal && 'absolute top-1 -left-10',
                  )}
                >
                  <span data-draw-fill="" className="block size-full bg-orange" />
                </span>
                <p className={cn('eyebrow text-accent', horizontal && 'mt-6')}>
                  {stepLabel} {pad2(i + 1)}
                </p>
                <h3 className="mt-3 text-heading-lg">{step.title}</h3>
                <p className="mt-2 text-small text-muted">{step.duration}</p>
              </li>
            ))}
          </ol>
        </DrawLine>

        <div className="mt-14">
          <TextLink to={more.to} arrow>
            {more.label}
          </TextLink>
        </div>
      </div>

      {technologies && (
        <div className="mt-section-sm">
          <TechnologyMarquee {...technologies} tone={tone} />
        </div>
      )}
    </Section>
  )
}
