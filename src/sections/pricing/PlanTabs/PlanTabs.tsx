import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import { Section, type Tone } from '@/components/layout/Section'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { Flip, gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, stagger } from '@/lib/motion-tokens'
import { PlanCard, type PlanCardProps } from '@/sections/pricing/PlanCard'
import { SectionHeader } from '@/sections/shared/SectionHeader'

export interface PlanTab {
  id: string
  name: string
  description: string
  /** e.g. "Limited to 3 partner clients at a time." */
  note?: string
  plans: (Omit<PlanCardProps, 'recommendedLabel'> & { id: string })[]
}

export interface PlanTabsProps {
  eyebrow: string
  title: string
  tabsLabel: string
  tabs: PlanTab[]
  recommendedLabel: string
  /** Under the panels, e.g. minimum term and "Hosting-only available on request". */
  footnotes: string[]
  tone?: Tone
}

/**
 * Care / Managed / Partner plan families as accessible tabs (arrow keys move between tabs).
 * Signature motion: switching tabs Flips each card from the slot it replaces, then its
 * content fades in. No scroll animation. Instant with reduced motion.
 */
export function PlanTabs({
  eyebrow,
  title,
  tabsLabel,
  tabs,
  recommendedLabel,
  footnotes,
  tone = 'paper',
}: PlanTabsProps) {
  const baseId = useId()
  const [active, setActive] = useState(tabs[0]?.id ?? '')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { contextSafe } = useGSAP({ scope: rootRef })

  const select = (id: string) => {
    const root = rootRef.current
    if (id === active || !root) return
    const state = reducedMotion ? null : Flip.getState(root.querySelectorAll('[data-flip-id]'))
    flushSync(() => setActive(id))
    if (!state) return
    contextSafe(() => {
      const cards = root.querySelectorAll<HTMLElement>(`[data-plan-panel="${id}"] [data-flip-id]`)
      Flip.from(state, {
        targets: cards,
        duration: duration.fast,
        ease: ease.out,
        scale: true,
        onEnter: (entering) =>
          gsap.fromTo(entering, { opacity: 0 }, { opacity: 1, duration: duration.fast }),
      })
      gsap.fromTo(
        Array.from(cards, (card) => Array.from(card.children)).flat(),
        { opacity: 0 },
        {
          opacity: 1,
          duration: duration.fast,
          delay: duration.fast * 0.5,
          stagger: stagger.tight,
          ease: ease.out,
        },
      )
    })()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const i = tabs.findIndex((t) => t.id === active)
    const move = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    const jump = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null
    if (!move && jump === null) return
    event.preventDefault()
    const next = jump ?? (i + move + tabs.length) % tabs.length
    const tab = tabs[next]
    if (!tab) return
    select(tab.id)
    tabRefs.current[next]?.focus()
  }

  return (
    <Section tone={tone} spacing="none" className="pt-section pb-8 md:pb-10">
      <div ref={rootRef} className="container-site">
        <SectionHeader variant="inline" eyebrow={eyebrow} title={title} />
        <div
          role="tablist"
          aria-label={tabsLabel}
          className="mt-12 no-scrollbar flex gap-2 overflow-x-auto"
        >
          {tabs.map((tab, i) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(tab.id)}
                onKeyDown={onKeyDown}
                className={cn(
                  'h-11 shrink-0 rounded-pill border px-5 text-small font-semibold transition-colors',
                  selected
                    ? 'border-transparent bg-(--tone-fg) text-(--tone-bg)'
                    : 'border-tone text-muted hover:text-(--tone-fg)',
                )}
              >
                {tab.name}
              </button>
            )
          })}
        </div>

        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={tab.id !== active}
            data-plan-panel={tab.id}
            className="mt-10"
          >
            <p className="max-w-[56ch] text-body-lg text-muted">{tab.description}</p>
            <ul
              className={cn(
                'mt-8 grid gap-4 md:grid-cols-2',
                tab.plans.length > 2 && 'lg:grid-cols-3',
              )}
            >
              {tab.plans.map(({ id, ...plan }, i) => (
                <PlanCard
                  key={id}
                  {...plan}
                  recommendedLabel={recommendedLabel}
                  flipId={`slot-${i}`}
                />
              ))}
            </ul>
            {tab.note && <p className="mt-6 text-small font-semibold text-accent">{tab.note}</p>}
          </div>
        ))}

        <div className="mt-8 space-y-1 text-small text-muted">
          {footnotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>
    </Section>
  )
}
