import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { ServiceMedia } from '@/components/media/ServiceMedia'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { duration, ease } from '@/lib/motion-tokens'
import { accordionLayout, nextIndex } from '@/lib/path-layout'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import { TechnologyMarquee, type TechnologyMarqueeProps } from '@/sections/shared/TechnologyMarquee'
import type { CtaLink } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'

export interface PathStage {
  id: string
  index: number
  name: string
  /** The self-select line in the visitor's words, e.g. "I need something new." */
  prompt: string
  line: string
  /** 2–3 key offerings, as examples (and their from-prices, where a page shows them). */
  items: { name: string; price?: string }[]
  /** /services#stage-… */
  details: CtaLink
  /** /start?path=… */
  estimate: CtaLink
  media: ServiceMediaItem
}

export interface PathChooserProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  stages: PathStage[]
  labels: { items: string }
  /** "Go deeper" link under the panels. */
  more: CtaLink
  /** The stack behind the work: a large logo strip along the bottom of the section. */
  technologies?: Omit<TechnologyMarqueeProps, 'tone' | 'size'>
  tone?: Tone
}

/** Width of a closed panel (the number and vertical name), rem. */
const COLLAPSED_REM = 5.5

/**
 * "What do you need?": the five stages as a self-select router. Signature motion is
 * interaction only, no scroll animation. Desktop: horizontal accordion panels; the
 * hovered or focused one opens (panels slide with transform and uncover with clip-path,
 * GSAP-driven). Arrow keys move between panels, Enter opens one, and each trigger reports
 * aria-expanded. Mobile: stacked rows that expand on tap.
 */
export function PathChooser({
  index,
  eyebrow,
  title,
  intro,
  stages,
  labels,
  more,
  technologies,
  tone = 'dark',
}: PathChooserProps) {
  const headingId = useId()
  const baseId = useId()
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [width, setWidth] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const placed = useRef({ width: 0, active: -1 })

  useEffect(() => {
    const el = rootRef.current
    if (!isDesktop || !el) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [isDesktop])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!isDesktop || !root || width === 0) return
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const layout = accordionLayout(stages.length, active, width, COLLAPSED_REM * rem)
      root.style.setProperty('--expanded', `${layout.expanded}px`)

      // Snap on first layout and on resize; animate when the open panel changes.
      const animate = !reducedMotion && placed.current.width === width
      const opened = placed.current.active !== active
      placed.current = { width, active }

      gsap.utils.toArray<HTMLElement>('[data-path-panel]', root).forEach((panel, i) => {
        const place = layout.panels[i]
        if (!place) return
        const vars = { x: place.x, clipPath: `inset(0px ${place.clipRight}px 0px 0px)` }
        if (animate) gsap.to(panel, { ...vars, duration: duration.fast, ease: ease.out })
        else gsap.set(panel, vars)
      })
      if (animate && opened) {
        gsap.fromTo(
          root.querySelectorAll(`[data-path-content="${active}"]`),
          { opacity: 0 },
          { opacity: 1, duration: duration.fast, delay: duration.micro / 2, ease: ease.out },
        )
      }
    },
    { scope: rootRef, dependencies: [isDesktop, width, active, reducedMotion, stages.length] },
  )

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = nextIndex(event.key, i, stages.length)
    if (next === null) return
    event.preventDefault()
    triggers.current[next]?.focus()
  }

  const details = (stage: PathStage) => (
    <>
      {stage.items.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 eyebrow text-muted">{labels.items}</p>
          <ul className="divide-y divide-(--tone-border) border-y border-tone">
            {stage.items.slice(0, 3).map((item) => (
              <li
                key={item.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5 text-small"
              >
                <span>{item.name}</span>
                {item.price && <span className="shrink-0 numeric text-muted">{item.price}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button
          to={stage.estimate.to}
          size="sm"
          withArrow
          analytics={{ event: 'Start project click', props: { location: `home-path:${stage.id}` } }}
        >
          {stage.estimate.label}
        </Button>
        <TextLink to={stage.details.to} arrow>
          {stage.details.label}
        </TextLink>
      </div>
    </>
  )

  return (
    <Section tone={tone} aria-labelledby={headingId} className={cn(technologies && 'pb-0')}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          index={index}
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />

        {isDesktop ? (
          <div
            ref={rootRef}
            className="relative mt-12 h-[32rem] overflow-hidden rounded-lg border border-tone"
            style={{ '--collapsed': `${COLLAPSED_REM}rem` } as CSSProperties}
          >
            {stages.map((stage, i) => {
              const open = i === active
              const triggerId = `${baseId}-t-${stage.id}`
              const panelId = `${baseId}-p-${stage.id}`
              return (
                <div
                  key={stage.id}
                  data-path-panel=""
                  className="absolute inset-y-0 left-0 w-(--expanded) border-l border-tone bg-(--tone-bg) first:border-l-0"
                  onPointerEnter={() => setActive(i)}
                >
                  <h3 className="absolute inset-y-0 left-0 w-(--collapsed)">
                    <button
                      ref={(el) => {
                        triggers.current[i] = el
                      }}
                      id={triggerId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onKeyDown={(event) => onKeyDown(event, i)}
                      className={cn(
                        'flex size-full flex-col items-center justify-between py-8 transition-colors duration-(--duration-micro) focus-visible:outline-offset-[-6px]',
                        open ? 'text-(--tone-fg)' : 'text-muted hover:text-(--tone-fg)',
                      )}
                    >
                      <span className="eyebrow text-accent">{pad2(stage.index)}</span>
                      <span className="rotate-180 text-heading-lg [writing-mode:vertical-rl]">
                        {stage.name}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    inert={!open}
                    data-path-content={i}
                    className="absolute inset-y-0 right-0 left-(--collapsed) grid gap-10 p-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] xl:p-10"
                  >
                    <div className="flex min-w-0 flex-col">
                      <p className="max-w-[18ch] font-display text-heading-xl">{stage.prompt}</p>
                      <p className="mt-3 text-muted">{stage.line}</p>
                      <div className="mt-auto">{details(stage)}</div>
                    </div>
                    <div className="relative hidden overflow-hidden rounded-md xl:block">
                      <ServiceMedia item={stage.media} active={open} paused={false} sizes="18rem" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Accordion
            className="mt-12"
            numbered
            headingLevel="h3"
            titleClassName="text-heading-md"
            defaultOpen={stages[0] ? [stages[0].id] : []}
            items={stages.map((stage) => ({
              id: stage.id,
              title: stage.prompt,
              content: (
                <div>
                  <div className="relative mb-6 aspect-video overflow-hidden rounded-md">
                    <ServiceMedia
                      item={stage.media}
                      active={false}
                      paused
                      sizes="(min-width: 640px) 80vw, 100vw"
                    />
                  </div>
                  <p className="text-muted">{stage.line}</p>
                  {details(stage)}
                </div>
              ),
            }))}
          />
        )}

        <div className="mt-12">
          <TextLink to={more.to} arrow>
            {more.label}
          </TextLink>
        </div>
      </div>

      {technologies && (
        <div className="mt-14 lg:mt-16">
          <TechnologyMarquee {...technologies} tone={tone} size="large" />
        </div>
      )}
    </Section>
  )
}
