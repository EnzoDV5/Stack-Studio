import { useId, useRef, useState, type CSSProperties } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { TextLink } from '@/components/ui/TextLink'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, processTimeline } from '@/lib/motion-tokens'
import { barTiming, columnAt, stepState, stepsAt } from '@/lib/process-timeline'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import { TechnologyMarquee, type TechnologyMarqueeProps } from '@/sections/shared/TechnologyMarquee'
import type { CtaLink, ProcessStep, TimelineColumn } from '@/types'
import styles from './ProcessLine.module.css'

export interface ProcessLineProps {
  index?: number
  eyebrow: string
  title: string
  steps: ProcessStep[]
  stepLabel: string
  /** Label above the live readout, e.g. "Where we are". */
  nowLabel: string
  /** The timeline's columns (weeks, then after launch). Step spans index into these. */
  columns: TimelineColumn[]
  /** "Go deeper" link to the full process. */
  more: CtaLink
  /** The tools behind the work, as one slow row under the plan. */
  technologies?: Omit<TechnologyMarqueeProps, 'tone'>
  tone?: Tone
}

/** Clip-path states for a bar that draws from its left end. */
const hiddenBar = 'inset(0% 100% 0% 0% round 999px)'
const shownBar = 'inset(0% 0% 0% 0% round 999px)'

/**
 * How a project runs, as a real project plan: one row per step, one column per week, and
 * a bar for each step's span, so the overlaps are visible. Signature motion: a playhead
 * sweeps the weeks with scroll (scrubbed, no pin) and each bar draws under it; on desktop a
 * readout beside the plan shows the week and what's running in it. The technology strip runs
 * underneath as one slow row (ambient). The full sticky version (ProcessPinned) lives on
 * /services.
 */
export function ProcessLine({
  index,
  eyebrow,
  title,
  steps,
  stepLabel,
  nowLabel,
  columns,
  more,
  technologies,
  tone = 'dark',
}: ProcessLineProps) {
  const headingId = useId()
  const boardRef = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 64rem)')
  const reducedMotion = useReducedMotion()
  const [column, setColumn] = useState(0)

  const count = columns.length
  const spans = steps.map((step) => step.span)
  const spansKey = spans.map((span) => `${span.from}-${span.to}`).join(',')
  const running = stepsAt(spans, column)
  // The readout needs room beside the plan and a moving playhead. Otherwise every row
  // shows its own summary.
  const readout = wide && !reducedMotion
  const trackStyle = {
    '--columns': count,
    gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
  } as CSSProperties

  useGSAP(
    () => {
      const board = boardRef.current
      if (!board || reducedMotion) return

      let shown = -1
      const plan = gsap.timeline({
        defaults: { ease: ease.none },
        scrollTrigger: {
          trigger: board,
          start: processTimeline.start,
          end: processTimeline.end,
          scrub: processTimeline.scrub,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const next = columnAt(plan.progress(), count)
          if (next === shown) return
          shown = next
          setColumn(next)
        },
      })

      plan.fromTo('[data-playhead]', { xPercent: 0 }, { xPercent: 100, duration: 1 }, 0)
      gsap.utils.toArray<HTMLElement>('[data-bar]', board).forEach((bar) => {
        const span = spans[Number(bar.dataset.bar)]
        if (!span) return
        const { position, duration } = barTiming(span, count)
        plan.fromTo(bar, { clipPath: hiddenBar }, { clipPath: shownBar, duration }, position)
      })
    },
    { scope: boardRef, dependencies: [count, spansKey, reducedMotion], revertOnUpdate: true },
  )

  const playhead = (withHead = false) =>
    !reducedMotion && (
      <span data-playhead="" aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute inset-y-0 left-0 w-px bg-(--tone-fg)" />
        {withHead && (
          <span className="absolute top-0 left-0 size-2 -translate-x-1/2 rounded-pill bg-(--tone-fg)" />
        )}
      </span>
    )

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

        <div
          className={cn(
            'mt-12 grid gap-10 lg:mt-16',
            readout && 'lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12',
          )}
        >
          <div
            ref={boardRef}
            className="self-start overflow-hidden rounded-lg border border-tone"
            style={{ '--label-w': readout ? '13rem' : '22rem' } as CSSProperties}
          >
            <div aria-hidden="true" className="grid lg:grid-cols-[var(--label-w)_1fr]">
              <p className="hidden border-r border-tone px-6 py-4 eyebrow text-muted lg:block">
                {stepLabel}
              </p>
              <div className={cn(styles.track, 'relative grid')} style={trackStyle}>
                {columns.map((col) => (
                  <span
                    key={col.label}
                    className="px-2 py-4 font-mono text-micro text-muted uppercase lg:px-3"
                  >
                    <span className="lg:hidden">{col.short}</span>
                    <span className="hidden lg:inline">{col.label}</span>
                  </span>
                ))}
                {playhead(true)}
              </div>
            </div>

            <ol>
              {steps.map((step, i) => {
                const state = reducedMotion ? 'active' : stepState(step.span, column)
                return (
                  <li
                    key={step.id}
                    className="grid border-t border-tone lg:grid-cols-[var(--label-w)_1fr]"
                  >
                    <div
                      className={cn(
                        'flex items-baseline gap-3 px-4 pt-4 transition-opacity duration-(--duration-micro) lg:border-r lg:border-tone lg:px-6 lg:py-5',
                        state === 'upcoming' && 'opacity-35',
                      )}
                    >
                      <span className="eyebrow text-accent">{pad2(i + 1)}</span>
                      <div className="min-w-0">
                        <h3 className="text-heading-md">{step.title}</h3>
                        <p className={readout ? 'visually-hidden' : 'mt-1 text-small text-muted'}>
                          {step.summary}
                        </p>
                      </div>
                      <span className="ml-auto shrink-0 text-small text-muted lg:hidden">
                        {step.duration}
                      </span>
                    </div>

                    <div
                      className={cn(styles.track, 'relative grid items-center py-3')}
                      style={trackStyle}
                    >
                      <span
                        data-bar={i}
                        className={cn(
                          'flex h-8 min-w-0 items-center rounded-pill bg-orange px-3 text-ink transition-opacity duration-(--duration-micro)',
                          step.span.from === count && styles.ongoing,
                          state === 'done' && 'opacity-45',
                        )}
                        style={{
                          gridColumn: `${step.span.from} / ${step.span.to + 1}`,
                          gridRow: 1,
                        }}
                      >
                        <span className="hidden truncate font-mono text-micro uppercase lg:block">
                          {step.duration}
                        </span>
                      </span>
                      {playhead()}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          {readout && (
            <aside aria-hidden="true" className="self-start">
              <p className="eyebrow text-muted">{nowLabel}</p>
              <p className="mt-3 text-heading-xl">{columns[column]?.label}</p>
              <div className="mt-8 grid gap-8 border-t border-tone pt-8">
                {[0, 1].map((slot) => (
                  <div key={slot} className="grid">
                    {steps.map((step, i) => (
                      <div
                        key={step.id}
                        className={cn(
                          'transition-opacity duration-(--duration-micro) [grid-area:1/1]',
                          running[slot] === i ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        <p className="eyebrow text-accent">
                          {pad2(i + 1)} · {step.title}
                        </p>
                        <p className="mt-3 text-small text-muted">{step.summary}</p>
                        <ul className="mt-4 grid gap-1.5 text-small">
                          {step.points.map((point) => (
                            <li key={point} className="flex items-baseline gap-2">
                              <span className="size-1.5 shrink-0 -translate-y-0.5 rounded-pill bg-orange" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>

        <div className="mt-12">
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
