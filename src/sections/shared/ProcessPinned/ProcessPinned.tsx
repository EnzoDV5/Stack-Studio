import { useId, useRef, useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import type { ProcessStep, SectionIntro } from '@/types'

export interface ProcessPinnedProps {
  intro: SectionIntro
  steps: ProcessStep[]
  stepLabel: string
  index?: number
  /** Anchor id, e.g. "process" for /services#process. */
  id?: string
  tone?: Tone
}

/**
 * Sticky-scroll process. On desktop the left column pins (CSS sticky, so it works with
 * Lenis and without JS) and shows the active step number and progress. Steps scroll past
 * on the right and light up as they reach the middle of the viewport. On mobile it's a
 * plain stacked list.
 */
export function ProcessPinned({
  intro,
  steps,
  stepLabel,
  index,
  id,
  tone = 'paper',
}: ProcessPinnedProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const headingId = useId()
  const [active, setActive] = useState(0)
  const isDesktop = useMediaQuery('(min-width: 64rem)')

  useGSAP(
    () => {
      if (!isDesktop) return
      const items = gsap.utils.toArray<HTMLElement>('[data-step]', rootRef.current)
      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        })
      })
    },
    { scope: rootRef, dependencies: [isDesktop, steps.length], revertOnUpdate: true },
  )

  const current = steps[active]
  const progress = ((active + 1) / steps.length) * 100

  return (
    <Section id={id} tone={tone} grid aria-labelledby={headingId}>
      <div ref={rootRef} className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--spacing-header)+3rem)]">
            <Eyebrow label={intro.eyebrow} index={index} className="mb-6" />
            <Heading id={headingId} size="display-lg" className="max-w-[12ch]" compile>
              {intro.title}
            </Heading>
            {intro.intro && (
              <p className="mt-6 max-w-[40ch] text-body-lg text-muted">{intro.intro}</p>
            )}

            <div className="mt-16 hidden lg:block" aria-hidden="true">
              <div className="flex items-end gap-4">
                <span className="font-display numeric text-display-xl text-accent">
                  {pad2(active + 1)}
                </span>
                <span className="pb-3 font-mono numeric text-small text-muted">
                  / {pad2(steps.length)}
                </span>
              </div>
              <p className="mt-3 text-heading-md">{current?.title}</p>
              <div className="mt-6 h-px w-full max-w-sm bg-(--tone-border)">
                <div
                  className="h-px bg-orange transition-[width] duration-(--duration-base) ease-out-expo"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {steps.map((step, i) => (
            <li
              key={step.id}
              data-step=""
              className={cn(
                'border-t border-tone py-10 transition-opacity duration-(--duration-fast) lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center',
                isDesktop && i !== active && 'lg:opacity-30',
              )}
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="eyebrow text-accent">
                  {stepLabel} {pad2(i + 1)}
                </span>
                <span className="eyebrow text-muted">{step.duration}</span>
              </div>
              <h3 className="text-display-lg">{step.title}</h3>
              <p className="mt-5 max-w-[46ch] text-body-lg text-muted">{step.summary}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {step.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-pill border border-tone px-3.5 py-1.5 text-small"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
