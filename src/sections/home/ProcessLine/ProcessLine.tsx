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
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
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
  /**
   * What sits beside the plan until the visitor points at a week, so the entrance sweep
   * doesn't flick the readout through every week. `hint` invites them to explore.
   */
  overview: ProcessOverview
  /** The timeline's columns (weeks, then after launch). Step spans index into these. */
  columns: TimelineColumn[]
  /** "Go deeper" link to the full process. */
  more: CtaLink
  /** The tools behind the work, as one slow row under the plan. */
  technologies?: Omit<TechnologyMarqueeProps, 'tone'>
  tone?: Tone
}

export interface ProcessOverview {
  label: string
  title: string
  text: string
  hint: { pointer: string; touch: string }
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
 * readout beside the plan rolls to that week (until that first hover it shows an overview,
 * so the entrance sweep doesn't flick it through every week); clicking a week (or its label, or the arrow
 * keys) keeps it there. The technology strip runs underneath (ambient). This is the site's one
 * week-by-week process; /services explains what happens after getting in touch instead
 * (NextSteps). Reduced motion: the whole plan, static.
 */
export function ProcessLine({
  index,
  eyebrow,
  title,
  steps,
  stepLabel,
  nowLabel,
  overview,
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
  // Whether the visitor has pointed at, tapped or keyed to a week. Until then the readout
  // shows the overview: the entrance sweep would otherwise flick it through every week.
  const [explored, setExplored] = useState(false)
  // Imperative animation state, never read during render. `position` is the playhead (0–1),
  // `target` where it's following to; `follow` is set once the plan is mounted.
  const motion = useRef({
    position: 0,
    target: 0,
    shown: 0,
    hover: -1,
    parts: null as Parts | null,
    sweep: null as gsap.core.Tween | null,
    follow: undefined as ((column: number) => void) | undefined,
  })

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

  /**
   * Draws the plan for the current playhead position: the playhead, the band (centred on the
   * playhead, so it glides with it rather than jumping column to column) and every bar.
   */
  const render = () => {
    const state = motion.current
    const parts = state.parts
    if (!parts) return
    const position = state.position
    gsap.set(parts.playheads, { xPercent: position * 100 })
    const bandAt = Math.min(count - 1, Math.max(0, position * count - 0.5))
    gsap.set(parts.bands, { xPercent: bandAt * 100 })
    for (const { el, span } of parts.bars) {
      const hidden = (1 - barReveal(span, count, position)) * 100
      el.style.clipPath = `inset(0% ${hidden}% 0% 0% round 999px)`
    }
    const next = columnAt(position, count)
    if (next === state.shown) return
    state.shown = next
    setColumn(next)
  }

  useGSAP(
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
      const state = motion.current
      Object.assign(state, { parts, position: 0, target: 0, shown: 0, hover: -1, sweep: null })
      const moving = [...parts.playheads, ...parts.bands]
      render()

      // Following: every frame the playhead closes a share of the gap to its target
      // (exponential, frame-rate independent), so retargeting mid-glide stays smooth.
      let following = false
      const stop = () => {
        following = false
        gsap.ticker.remove(tick)
        gsap.set(moving, { willChange: 'auto' })
      }
      const tick = (_time: number, deltaTime: number) => {
        const k = 1 - Math.exp(-(deltaTime / 1000) * processTimeline.follow)
        state.position += (state.target - state.position) * k
        if (Math.abs(state.target - state.position) < 0.0004) {
          state.position = state.target
          stop()
        }
        render()
      }
      state.follow = (target: number) => {
        state.sweep?.kill()
        state.sweep = null
        state.target = columnCentre(target, count)
        if (following) return
        following = true
        gsap.set(moving, { willChange: 'transform' })
        gsap.ticker.add(tick)
      }

      // The entrance: step names slide in one after another, the weeks fade down, the band
      // and playhead appear, then the playhead sweeps the whole plan and rests on the last
      // column with every bar drawn.
      const sweep = gsap.to(state, {
        position: columnCentre(last, count),
        duration: processTimeline.sweep,
        ease: processTimeline.sweepEase,
        onStart: () => gsap.set(moving, { willChange: 'transform' }),
        onUpdate: render,
        onComplete: () => {
          state.target = state.position
          gsap.set(moving, { willChange: 'auto' })
        },
      })
      state.sweep = sweep
      const intro = gsap.timeline({ paused: true, onComplete: () => setReady(true) })
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
        .from(moving, { opacity: 0, duration: duration.fast, ease: ease.out }, 0)
        .add(sweep, processTimeline.sweepDelay)

      // A standalone trigger, not one attached to a timeline: GSAP measures a timeline's
      // trigger a tick later and reports start 0 until then, which made the check below pass
      // on mount and played the plan while it was still far below the fold.
      const st = ScrollTrigger.create({
        trigger: board,
        start: processTimeline.start,
        once: true,
        onEnter: () => void intro.play(),
      })
      // Mounted already past the start (a deep link, a lazy mount): play now.
      if (st.scroll() >= st.start) void intro.play()

      return () => {
        stop()
        state.follow = undefined
      }
    },
    { scope: boardRef, dependencies: [count, spansKey, reducedMotion], revertOnUpdate: true },
  )

  const pick = (target: number) => {
    const next = Math.min(last, Math.max(0, target))
    setPicked(next)
    setReady(true)
    setExplored(true)
    motion.current.hover = -1
    motion.current.follow?.(next)
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
    if (!explored) setExplored(true)
    motion.current.hover = target
    motion.current.follow?.(target)
  }

  const onPointerLeave = () => {
    if (!interactive || motion.current.hover < 0) return
    motion.current.hover = -1
    motion.current.follow?.(picked)
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

  /** One of the readout's two stacked layers (overview, live readout). */
  const layer = (shown: boolean) => ({
    className: cn(
      'transition-[opacity,translate] ease-out-expo [grid-area:1/1]',
      shown
        ? 'translate-y-0 opacity-100 duration-(--duration-base)'
        : 'pointer-events-none translate-y-3 opacity-0 duration-(--duration-micro)',
    ),
    style: { transitionDelay: shown ? '160ms' : '0ms' },
  })

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
            <aside aria-hidden="true" className="grid self-start">
              {/* The overview until the visitor points at a week, then the live readout. Both
                  share one cell and cross-fade: the leaving layer goes quickly, the arriving
                  one follows once it has cleared. */}
              <div {...layer(!explored)}>
                <p className="eyebrow text-muted">{overview.label}</p>
                <p className="mt-3 text-heading-xl">{overview.title}</p>
                <div className="mt-8 border-t border-tone pt-8">
                  <p className="text-small text-muted">{overview.text}</p>
                  <p className="mt-4 flex items-baseline gap-2 text-small">
                    <span className="size-1.5 shrink-0 -translate-y-0.5 rounded-pill bg-orange" />
                    {isTouch ? overview.hint.touch : overview.hint.pointer}
                  </p>
                </div>
              </div>
              <div {...layer(explored)}>
                <p className="eyebrow text-muted">{nowLabel}</p>
                {/* The week rolls like a counter: forward rolls up, back rolls down. Every label
                  is stacked in one cell; only the current one sits in view. */}
                <div className="mt-3 grid overflow-hidden">
                  {columns.map((col, i) => (
                    <p
                      key={col.label}
                      className={cn(
                        'text-heading-xl transition-[translate,opacity] ease-out-expo [grid-area:1/1]',
                        i === column
                          ? 'translate-y-0 opacity-100 duration-(--duration-base)'
                          : cn(
                              'opacity-0 duration-(--duration-micro)',
                              i < column ? '-translate-y-full' : 'translate-y-full',
                            ),
                      )}
                    >
                      {col.label}
                    </p>
                  ))}
                </div>
                <div className="mt-8 grid gap-8 border-t border-tone pt-8">
                  {[0, 1].map((slot) => (
                    <div key={slot} className="grid">
                      {steps.map((step, i) => {
                        const current = running[slot]
                        const shown = current === i
                        // Direction of travel: earlier steps leave upwards, later ones wait below.
                        const away =
                          current === undefined || i > current ? 'translate-y-4' : '-translate-y-3'
                        // Leaving is quick and together; once it has cleared, each line comes in after the one
                        // above it.
                        const reveal = (order: number) => ({
                          className: cn(
                            'transition-[opacity,translate] ease-out-expo',
                            shown
                              ? 'translate-y-0 opacity-100 duration-(--duration-base)'
                              : cn('opacity-0 duration-(--duration-micro)', away),
                          ),
                          style: { transitionDelay: shown ? `${140 + order * 55}ms` : '0ms' },
                        })
                        return (
                          <div
                            key={step.id}
                            className={cn('[grid-area:1/1]', !shown && 'pointer-events-none')}
                          >
                            <p
                              className={cn('eyebrow text-accent', reveal(0).className)}
                              style={reveal(0).style}
                            >
                              {pad2(i + 1)} · {step.title}
                            </p>
                            <p
                              className={cn('mt-3 text-small text-muted', reveal(1).className)}
                              style={reveal(1).style}
                            >
                              {step.summary}
                            </p>
                            <ul className="mt-4 grid gap-1.5 text-small">
                              {step.points.map((point, k) => (
                                <li
                                  key={point}
                                  className={cn(
                                    'flex items-baseline gap-2',
                                    reveal(2 + k).className,
                                  )}
                                  style={reveal(2 + k).style}
                                >
                                  <span
                                    className={cn(
                                      'size-1.5 shrink-0 -translate-y-0.5 rounded-pill bg-orange transition-[scale] duration-(--duration-base) ease-out-expo',
                                      shown ? 'scale-100' : 'scale-0',
                                    )}
                                    style={{
                                      transitionDelay: shown ? `${200 + (2 + k) * 55}ms` : '0ms',
                                    }}
                                  />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
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
