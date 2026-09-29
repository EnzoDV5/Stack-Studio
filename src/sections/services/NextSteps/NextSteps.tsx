import { useId, useRef } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { pad2 } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, trigger } from '@/lib/motion-tokens'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface NextStep {
  title: string
  /** How long it takes, e.g. "Within one business day". */
  when: string
  body: string
}

export interface NextStepsProps {
  eyebrow: string
  title: string
  intro: string
  steps: NextStep[]
  promisesLabel: string
  /** What every project comes with, e.g. "A 30-day launch warranty". */
  promises: string[]
  cta: CtaLink
  tone?: Tone
}

/**
 * What happens after someone gets in touch: four steps from the brief to a start date, each with
 * how long it takes, then what every project comes with. Signature motion (an enter, once): a
 * line runs through the steps, left to right (top to bottom on phones), lighting each step as
 * it reaches it. Reduced motion: everything lit, still.
 */
export function NextSteps({
  eyebrow,
  title,
  intro,
  steps,
  promisesLabel,
  promises,
  cta,
  tone = 'dark',
}: NextStepsProps) {
  const headingId = useId()
  const listRef = useRef<HTMLOListElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const list = listRef.current
      if (!list || reducedMotion) return
      const stepEls = gsap.utils.toArray<HTMLElement>('[data-step]', list)
      const dots = gsap.utils.toArray<HTMLElement>('[data-dot]', list)
      const run = duration.slow * 1.4
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: list, start: trigger.start, once: true },
      })
      // The line draws across (or down) at an even pace; each step lights as the line reaches
      // its dot, which sits at the start of its column (i of n along the line).
      timeline.from('[data-line]', { scaleX: 0, scaleY: 0, duration: run, ease: ease.none }, 0)
      stepEls.forEach((step, i) => {
        const at = (run * i) / steps.length
        timeline.from(step, { opacity: 0.25, duration: duration.base, ease: ease.out }, at)
        const dot = dots[i]
        if (dot) {
          timeline.from(
            dot,
            { scale: 0.4, opacity: 0.4, duration: duration.fast, ease: ease.outQuart },
            at,
          )
        }
      })
    },
    { scope: listRef, dependencies: [reducedMotion, steps.length], revertOnUpdate: true },
  )

  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />

        <ol ref={listRef} className="relative mt-14 grid gap-10 md:mt-20 md:grid-cols-4 md:gap-8">
          {/* The track and the line that runs along it: across on desktop, down on phones. */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px bg-(--tone-border) md:top-[7px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"
          />
          <span
            aria-hidden="true"
            data-line=""
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-orange md:top-[7px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto md:origin-left"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="relative pl-10 md:pt-12 md:pl-0">
              <span
                aria-hidden="true"
                data-dot=""
                className="absolute top-0 left-0 size-[15px] rounded-pill border-2 border-orange bg-(--tone-bg)"
              />
              <div data-step="">
                <p className="eyebrow text-accent">{pad2(i + 1)}</p>
                <h3 className="mt-3 text-heading-lg">{step.title}</h3>
                <Tag className="mt-4">{step.when}</Tag>
                <p className="mt-4 max-w-[30ch] text-small text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 border-t border-tone pt-8 md:mt-20">
          <p className="mb-5 eyebrow text-muted">{promisesLabel}</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((promise) => (
              <li key={promise} className="flex items-center gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="size-5 shrink-0 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                {promise}
              </li>
            ))}
          </ul>
        </div>

        <Button
          to={cta.to}
          withArrow
          className="mt-12"
          analytics={{ event: 'Start project click', props: { location: 'services-next-steps' } }}
        >
          {cta.label}
        </Button>
      </div>
    </Section>
  )
}
