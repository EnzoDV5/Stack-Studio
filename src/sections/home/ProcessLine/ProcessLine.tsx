import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { TextLink } from '@/components/ui/TextLink'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { distance, duration, ease, processTimeline, stagger } from '@/lib/motion-tokens'
import {
  barReveal,
  columnAt,
  columnCentre,
  columnFromX,
  stepState,
  stepsAt,
  type Span,
} from '@/lib/process-timeline'
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

/** The animated parts of the plan, collected once per mount. */
interface Parts {
  playheads: HTMLElement[]
  bands: HTMLElement[]
  bars: { el: HTMLElement; span: Span }[]
}

/**
 * How a project runs, as a real project plan: one row per step, one column per week, and
 * a bar for each step's span, so the overlaps are visible. Signature motion: when the plan
 * enters, the steps slide in and a playhead sweeps the weeks once on its own, drawing each bar
 * under it. Then the plan is the visitor's: hovering (or tapping) a week glides the playhead
 * there, drawing or retracting the bars up to it, a soft band follows the column and the
 * readout beside the plan rolls to that week; clicking a week (or its label, or the arrow
 * keys) keeps it there. The technology strip runs underneath (ambient). The full sticky
 * version (ProcessPinned) lives on /services. Reduced motion: the whole plan, static.
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
  const headerTrackRef = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 64rem)')
  const isTouch = useIsTouch()
  const reducedMotion = useReducedMotion()
  const count = columns.length
  const last = count - 1
  // The column the playhead is in (drives dimming and the readout), the week the visitor
  // picked (where it rests), and whether the entrance has finished (hover waits for it).
  const [column, setColumn] = useState(0)
  const [picked, setPicked] = useState(last)
  const [ready, setReady] = useState(false)
  // Imperative animation state, never read during render.
  const motion = useRef({ position: 0, shown: 0, hover: -1, parts: null as Parts | null })

  const spans = steps.map((step) => step.span)
  const spansKey = spans.map((span) => `${span.from}-${span.to}`).join(',')
  const running = stepsAt(spans, column)
  const interactive = !reducedMotion
  // The readout needs room beside the plan and a moving playhead. Otherwise every row
  // shows its own summary.
  const readout = wide && !reducedMotion
  const trackStyle = {
    '--columns': count,
    gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
  } as CSSProperties

  /** Draws the plan for the current playhead position: playhead, bars and column band. */
  const render = () => {
    const state = motion.current
    const parts = state.parts
    if (!parts) return
    const position = state.position
    gsap.set(parts.playheads, { xPercent: position * 100 })
    for (const { el, span } of parts.bars) {
      const hidden = (1 - barReveal(span, count, position)) * 100
      el.style.clipPath = `inset(0% ${hidden}% 0% 0% round 999px)`
    }
    const next = columnAt(position, count)
    if (next === state.shown) return
    state.shown = next
    setColumn(next)
    gsap.to(parts.bands, {
      xPercent: next * 100,
      duration: duration.fast,
      ease: ease.out,
      overwrite: 'auto',
    })
  }

  const { contextSafe } = useGSAP(
    () => {
      const board = boardRef.current
      if (!board || reducedMotion) return

      const parts: Parts = {
        playheads: gsap.utils.toArray<HTMLElement>('[data-playhead]', board),
        bands: gsap.utils.toArray<HTMLElement>('[data-band]', board),
        bars: gsap.utils.toArray<HTMLElement>('[data-bar]', board).flatMap((el) => {
          const span = spans[Number(el.dataset.bar)]
          return span ? [{ el, span }] : []
        }),
      }
      Object.assign(motion.current, { parts, position: 0, shown: 0, hover: -1 })
      gsap.set(parts.bands, { xPercent: 0 })
      render()

      // The entrance: step names slide in one after another, the weeks fade down, the band
      // and playhead appear, then the playhead sweeps the whole plan and rests on the last
      // column with every bar drawn.
      const intro = gsap.timeline({
        paused: true,
        onComplete: () => setReady(true),
      })
      intro
        .from(
          '[data-step-label]',
          {
            opacity: 0,
            x: -distance.small * 1.5,
            duration: duration.base,
            ease: ease.out,
            stagger: stagger.base,
          },
          0,
        )
        .from(
          '[data-column]',
          {
            opacity: 0,
            y: -distance.small / 2,
            duration: duration.fast,
            ease: ease.out,
            stagger: stagger.tight,
          },
          0,
        )
        .from(
          [...parts.bands, ...parts.playheads],
          { opacity: 0, duration: duration.fast, ease: ease.out },
          processTimeline.sweepDelay,
        )
        .to(
          motion.current,
          {
            position: columnCentre(last, count),
            duration: processTimeline.sweep,
            ease: processTimeline.sweepEase,
            onUpdate: render,
          },
          processTimeline.sweepDelay,
        )

      const st = gsap.timeline({
        scrollTrigger: {
          trigger: board,
          start: processTimeline.start,
          once: true,
          onEnter: () => void intro.play(),
        },
      }).scrollTrigger
      // Mounted already past the start (a deep link, a lazy mount): play now.
      if (st && st.scroll() >= st.start) void intro.play()
    },
    { scope: boardRef, dependencies: [count, spansKey, reducedMotion], revertOnUpdate: true },
  )

  /** Glides the playhead to the middle of a week. Replaces any glide (or the sweep). */
  const glideTo = (target: number) =>
    contextSafe(() => {
      gsap.to(motion.current, {
        position: columnCentre(target, count),
        duration: processTimeline.glide,
        ease: ease.out,
        overwrite: true,
        onUpdate: render,
      })
    })()

  const pick = (target: number) => {
    const next = Math.min(last, Math.max(0, target))
    setPicked(next)
    setReady(true)
    motion.current.hover = -1
    glideTo(next)
  }

  /** The week under the pointer, or -1 when it's over the step names. */
  const columnUnder = (clientX: number) => {
    const track = headerTrackRef.current
    if (!track) return -1
    const box = track.getBoundingClientRect()
    const x = clientX - box.left
    return x < 0 ? -1 : columnFromX(x, box.width, count)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!interactive || isTouch || !ready) return
    const target = columnUnder(event.clientX)
    if (target < 0 || target === motion.current.hover) return
    motion.current.hover = target
    glideTo(target)
  }

  const onPointerLeave = () => {
    if (!interactive || motion.current.hover < 0) return
    motion.current.hover = -1
    glideTo(picked)
  }

  const onBoardClick = (event: { clientX: number }) => {
    if (!interactive) return
    const target = columnUnder(event.clientX)
    if (target >= 0) pick(target)
  }

  const onWeekKey = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = Math.min(last, Math.max(0, i + step))
    pick(next)
    const buttons = event.currentTarget.parentElement?.querySelectorAll('button')
    buttons?.[next]?.focus()
  }

  const playhead = (withHead = false) =>
    interactive && (
      <span data-playhead="" aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute inset-y-0 left-0 w-px bg-(--tone-fg)" />
        {withHead && (
          <span className="absolute top-0 left-0 size-2 -translate-x-1/2 rounded-pill bg-(--tone-fg)" />
        )}
      </span>
    )

  // A soft highlight on the playhead's column, across every row.
  const band = () =>
    interactive && (
      <span
        data-band=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 bg-(--tone-fg)/5"
        style={{ width: `${100 / count}%` }}
      />
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
          {/* Clicking anywhere on the plan picks the week under the pointer: a shortcut for
              pointers. Keyboard and screen reader users pick weeks with the week buttons
              (and the arrow keys), which do the same thing. */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            ref={boardRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onClick={onBoardClick}
            className={cn(
              'self-start overflow-hidden rounded-lg border border-tone',
              interactive && 'cursor-pointer',
            )}
            style={{ '--label-w': readout ? '13rem' : '22rem' } as CSSProperties}
          >
            <div className="grid lg:grid-cols-[var(--label-w)_1fr]">
              <p
                aria-hidden="true"
                className="hidden border-r border-tone px-6 py-4 eyebrow text-muted lg:block"
              >
                {stepLabel}
              </p>
              <div
                ref={headerTrackRef}
                className={cn(styles.track, 'relative grid')}
                style={trackStyle}
              >
                {band()}
                {columns.map((col, i) => {
                  const label = (
                    <>
                      <span className="lg:hidden">{col.short}</span>
                      <span className="hidden lg:inline">{col.label}</span>
                    </>
                  )
                  const cell = 'relative px-2 py-4 text-left font-mono text-micro uppercase lg:px-3'
                  if (!interactive)
                    return (
                      <span key={col.label} aria-hidden="true" className={cn(cell, 'text-muted')}>
                        {label}
                      </span>
                    )
                  const titles = stepsAt(spans, i)
                    .map((s) => steps[s]?.title)
                    .join(', ')
                  return (
                    <button
                      key={col.label}
                      type="button"
                      data-column=""
                      aria-pressed={ready && picked === i}
                      aria-label={`${col.label}: ${titles}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        pick(i)
                      }}
                      onKeyDown={(event) => onWeekKey(event, i)}
                      className={cn(
                        cell,
                        'transition-colors duration-(--duration-micro) focus-visible:outline-offset-[-4px]',
                        column === i ? 'text-(--tone-fg)' : 'text-muted hover:text-(--tone-fg)',
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
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
                        'px-4 pt-4 transition-opacity duration-(--duration-fast) lg:border-r lg:border-tone lg:px-6 lg:py-5',
                        state === 'upcoming' && 'opacity-35',
                      )}
                    >
                      <div data-step-label="" className="flex items-baseline gap-3">
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
                    </div>

                    <div
                      className={cn(styles.track, 'relative grid items-center py-3')}
                      style={trackStyle}
                    >
                      {band()}
                      <span
                        data-bar={i}
                        className={cn(
                          'relative flex h-8 min-w-0 items-center rounded-pill bg-orange px-3 text-ink transition-opacity duration-(--duration-fast)',
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
              {/* The week rolls up into place whenever it changes. */}
              <div className="mt-3 overflow-hidden">
                <p key={column} className={cn('text-heading-xl', styles.roll)}>
                  {columns[column]?.label}
                </p>
              </div>
              <div className="mt-8 grid gap-8 border-t border-tone pt-8">
                {[0, 1].map((slot) => (
                  <div key={slot} className="grid">
                    {steps.map((step, i) => (
                      <div
                        key={step.id}
                        className={cn(
                          'transition-[opacity,translate] duration-(--duration-fast) ease-out-expo [grid-area:1/1]',
                          running[slot] === i
                            ? 'translate-y-0 opacity-100'
                            : 'pointer-events-none translate-y-3 opacity-0',
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
