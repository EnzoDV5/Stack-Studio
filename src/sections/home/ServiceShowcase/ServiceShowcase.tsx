import { useId, useRef, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { Section, type Tone } from '@/components/layout/Section'
import { ServiceMedia } from '@/components/media/ServiceMedia'
import { Button } from '@/components/ui/Button'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { Flip, gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, stagger } from '@/lib/motion-tokens'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'
import styles from './ServiceShowcase.module.css'

export interface ShowcaseService {
  id: string
  name: string
  line: string
  summary: string
  /** Key offerings or plans with their price labels. */
  items: { name: string; price: string }[]
  cta: CtaLink
  capabilities: readonly string[]
  media: ServiceMediaItem
}

export interface ServiceShowcaseLabels {
  /** Heading above the items list. */
  examples: string
  /** Prefix for a thumbnail's accessible name ("Show Build"). */
  select: string
  pause: string
  play: string
}

export interface ServiceShowcaseProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  services: ShowcaseService[]
  labels: ServiceShowcaseLabels
  tone?: Tone
}

const STAGE_SIZES = '(min-width: 1024px) 28rem, 100vw'
const THUMB_SIZES = '(min-width: 1024px) 6rem, 25vw'

/**
 * One service on the stage, the rest in a thumbnail rail. Choosing a thumbnail swaps it with
 * the stage image (Flip), and the centre copy changes to that service.
 */
export function ServiceShowcase({
  index,
  eyebrow,
  title,
  intro,
  services,
  labels,
  tone = 'dark',
}: ServiceShowcaseProps) {
  const headingId = useId()
  const root = useRef<HTMLDivElement>(null)
  const animation = useRef<gsap.core.Timeline | null>(null)
  // slots[i] is where service i sits: 0 is the stage, 1…n-1 are rail positions.
  const [slots, setSlots] = useState(() => services.map((_, i) => i))
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()
  const active = Math.max(slots.indexOf(0), 0)
  const current = services[active]

  const { contextSafe } = useGSAP(
    () => {
      const settle = () => animation.current?.progress(1)
      window.addEventListener('resize', settle)
      return () => window.removeEventListener('resize', settle)
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (reducedMotion) animation.current?.progress(1)
    },
    { dependencies: [reducedMotion], scope: root },
  )

  const select = (next: number) => {
    contextSafe(() => {
      const grid = root.current
      const service = services[next]
      if (!grid || !service || !current || next === active) return
      animation.current?.progress(1)
      const cards = grid.querySelectorAll('[data-showcase-card]')
      const state = reducedMotion ? null : Flip.getState(cards)
      // A true swap: the stage image takes the slot the chosen thumbnail left.
      const swapped = slots.map((slot, i) =>
        i === next ? 0 : i === active ? (slots[next] ?? slot) : slot,
      )
      flushSync(() => {
        setSlots(swapped)
        setPaused(false)
      })
      if (!state) return
      const timeline = gsap.timeline()
      animation.current = timeline
      // The outgoing card's label would otherwise be scaled up with it on the way to the rail.
      timeline.fromTo(
        grid.querySelectorAll(`[data-showcase-card="${current.id}"] [data-card-label]`),
        { opacity: 0 },
        { opacity: 1, duration: duration.micro, ease: ease.out, clearProps: 'opacity' },
        duration.base,
      )
      timeline.add(
        Flip.from(state, {
          targets: cards,
          duration: duration.base,
          ease: ease.inOut,
          scale: true,
          prune: true,
        }),
        0,
      )
      timeline.fromTo(
        grid.querySelectorAll(`[data-showcase-copy="${service.id}"] [data-copy-line]`),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: duration.fast,
          stagger: stagger.tight,
          ease: ease.out,
          clearProps: 'opacity,transform',
        },
        duration.micro,
      )
    })()
  }

  if (!current) return null

  return (
    <Section tone={tone} grid="edges" aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader id={headingId} index={index} eyebrow={eyebrow} title={title} intro={intro} />
        <div
          ref={root}
          className={cn(styles.showcase, 'mt-16 lg:mt-24')}
          style={{ '--rail': Math.max(services.length - 1, 1) } as CSSProperties}
        >
          {/* Matches the pause button's height so the row doesn't grow when a video is chosen. */}
          <p
            className={cn(styles.counter, 'font-mono text-micro leading-11 text-muted')}
            aria-hidden="true"
          >
            <span className="text-accent">{pad2(active + 1)}</span> / {pad2(services.length)}
          </p>
          <p className="visually-hidden" aria-live="polite">
            {current.name}
          </p>

          {services.map((service, i) => {
            const slot = slots[i] ?? i
            const isActive = slot === 0
            return (
              <button
                key={service.id}
                type="button"
                data-showcase-card={service.id}
                data-active={isActive}
                className={styles.card}
                style={{ '--slot': slot, '--row': slot + 1 } as CSSProperties}
                aria-pressed={isActive}
                aria-controls={`${headingId}-${service.id}`}
                aria-label={`${labels.select} ${service.name}`}
                onClick={() => select(i)}
              >
                <span className={styles.frame}>
                  <ServiceMedia
                    item={service.media}
                    active={isActive}
                    paused={paused}
                    sizes={isActive ? STAGE_SIZES : THUMB_SIZES}
                  />
                </span>
                <span data-card-label="" className={styles.label} aria-hidden="true">
                  {service.name}
                </span>
              </button>
            )
          })}

          {current.media.video && !reducedMotion && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className={cn(
                styles.pause,
                'min-h-11 px-2 font-mono text-micro text-muted uppercase hover:text-accent',
              )}
            >
              {paused ? labels.play : labels.pause}
            </button>
          )}

          <div className={styles.copy}>
            {services.map((service, i) => {
              const isActive = i === active
              return (
                <div
                  key={service.id}
                  id={`${headingId}-${service.id}`}
                  data-showcase-copy={service.id}
                  data-active={isActive}
                  className={styles.panel}
                  aria-hidden={!isActive}
                  inert={!isActive}
                >
                  <h3 data-copy-line="" className="text-heading-xl">
                    {service.name}
                  </h3>
                  <p data-copy-line="" className="mt-3 text-small text-muted">
                    {service.line}
                  </p>
                  <p data-copy-line="" className="mt-6 max-w-[46ch] text-muted">
                    {service.summary}
                  </p>
                  {service.capabilities.length > 0 && (
                    <p data-copy-line="" className="mt-4 text-small">
                      {service.capabilities.join(' / ')}
                    </p>
                  )}
                  {service.items.length > 0 && (
                    <div data-copy-line="" className="mt-6">
                      <p className="mb-2 eyebrow text-muted">{labels.examples}</p>
                      <ul className="divide-y divide-(--tone-border) border-y border-tone">
                        {service.items.map((item) => (
                          <li
                            key={item.name}
                            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2 text-small"
                          >
                            <span>{item.name}</span>
                            <span className="shrink-0 numeric text-muted">{item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div data-copy-line="" className="mt-6">
                    <Button
                      to={service.cta.to}
                      size="sm"
                      withArrow
                      analytics={{
                        event: 'Start project click',
                        props: { location: `home-stage:${service.id}` },
                      }}
                    >
                      {service.cta.label}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}
