import { useId, useRef, type ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, stepsDeal } from '@/lib/motion-tokens'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

interface StepHead {
  title: string
  /** How long it takes, e.g. "Within one business day". */
  when: string
}

export interface NextStepsProps {
  eyebrow: string
  title: string
  intro: string
  /** 01: the brief, with a real rough estimate. */
  brief: StepHead & {
    heading: string
    question: string
    options: string[]
    estimateLabel: string
    /** e.g. "R 18 000 – R 24 500". */
    estimate: string
  }
  /** 02: the reply. */
  reply: StepHead & { sent: string; from: string; message: string; time: string }
  /** 03: the call invite. */
  call: StepHead & {
    day: string
    date: string
    event: string
    details: string
    people: string[]
    answer: string
    yes: string
    no: string
  }
  /** 04: the quote. */
  quote: StepHead & {
    document: string
    lines: { label: string; value: string }[]
    totalLabel: string
    /** e.g. "R 21 000". */
    total: string
    accept: string
    includes: string[]
  }
  cta: CtaLink
  tone?: Tone
}

const Check = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className={cn('size-4 shrink-0', className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m4 10.5 4 4 8-9" />
  </svg>
)

/**
 * What happens once someone gets in touch, shown rather than told: four cards, each a small
 * version of what the visitor sees at that step (the brief with a real estimate, the reply, the
 * call invite, the fixed quote). The interfaces are illustrative and decorative; each card's
 * title and timing carry the meaning for screen readers. Signature motion (desktop, scrubbed):
 * the cards start as a loose pile and deal out into their row as the section scrolls in.
 * Phones and reduced motion: the cards, in order, still.
 */
export function NextSteps({
  eyebrow,
  title,
  intro,
  brief,
  reply,
  call,
  quote,
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
      const mm = gsap.matchMedia()
      mm.add('(min-width: 64rem)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-card]', list)
        // Each card's distance from the middle of the row, measured in its dealt-out place
        // (recomputed on every refresh, so a resize keeps the pile centred).
        const toCentre = (card: HTMLElement) => {
          const row = list.getBoundingClientRect()
          const box = card.getBoundingClientRect()
          return row.left + row.width / 2 - (box.left + box.width / 2)
        }
        gsap.from(cards, {
          x: (i: number) => {
            const card = cards[i]
            return card ? toCentre(card) : 0
          },
          y: (i: number) => stepsDeal.pile[i % stepsDeal.pile.length]?.y ?? 0,
          rotation: (i: number) => stepsDeal.pile[i % stepsDeal.pile.length]?.rotation ?? 0,
          scale: stepsDeal.scale,
          ease: ease.none,
          scrollTrigger: {
            trigger: list,
            start: stepsDeal.start,
            end: stepsDeal.end,
            scrub: stepsDeal.scrub,
            invalidateOnRefresh: true,
            onToggle: (self) =>
              gsap.set(cards, { willChange: self.isActive ? 'transform' : 'auto' }),
          },
        })
      })
      return () => mm.revert()
    },
    { scope: listRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  const card = (index: number, head: StepHead, ui: ReactNode) => (
    <li
      data-card=""
      className="flex flex-col rounded-lg border border-tone bg-tone-surface p-5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-accent">{pad2(index)}</span>
        <Tag>{head.when}</Tag>
      </div>
      <h3 className="mt-4 text-heading-md">{head.title}</h3>
      {/* A small version of what they see at this step (decorative). */}
      <div
        aria-hidden="true"
        className="mt-5 flex flex-1 flex-col rounded-md border border-tone bg-(--tone-bg) p-4 lg:min-h-72"
      >
        {ui}
      </div>
    </li>
  )

  return (
    <Section tone={tone} aria-labelledby={headingId} className="overflow-hidden">
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />

        <ol ref={listRef} className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {card(
            1,
            brief,
            <>
              <div className="flex items-center justify-between">
                <p className="text-small font-semibold">{brief.heading}</p>
                <span className="flex gap-1">
                  {[0, 1, 2, 3].map((dot) => (
                    <i
                      key={dot}
                      className={cn(
                        'size-1.5 rounded-pill',
                        dot < 2 ? 'bg-orange' : 'bg-(--tone-border)',
                      )}
                    />
                  ))}
                </span>
              </div>
              <p className="mt-4 text-heading-md">{brief.question}</p>
              <div className="mt-4 grid gap-2">
                {brief.options.map((option, i) => (
                  <span
                    key={option}
                    className={cn(
                      'flex items-center justify-between rounded-pill border px-3 py-2 text-small',
                      i === 0 ? 'border-orange bg-orange/15' : 'border-tone text-muted',
                    )}
                  >
                    {option}
                    {i === 0 && <Check className="text-accent" />}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <div className="rounded-md border border-tone p-3">
                  <p className="eyebrow text-muted">{brief.estimateLabel}</p>
                  <p className="mt-1 numeric text-heading-md">{brief.estimate}</p>
                </div>
              </div>
            </>,
          )}

          {card(
            2,
            reply,
            <div className="flex flex-1 flex-col gap-4">
              <span className="flex items-center gap-2 self-end rounded-lg rounded-br-sm bg-orange px-3 py-2 text-small font-semibold text-ink">
                {reply.sent}
                <Check />
              </span>
              <div className="mt-auto">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-pill bg-orange text-micro font-bold text-ink">
                    S
                  </span>
                  <span className="text-small font-semibold">{reply.from}</span>
                </div>
                <p className="mt-2 rounded-lg rounded-tl-sm border border-tone bg-tone-surface p-3 text-small">
                  {reply.message}
                </p>
                <p className="mt-2 text-micro text-muted">{reply.time}</p>
              </div>
            </div>,
          )}

          {card(
            3,
            call,
            <div className="flex flex-1 flex-col">
              <div className="flex gap-4">
                <div className="grid w-14 shrink-0 place-items-center rounded-md border border-tone py-2 text-center">
                  <span className="eyebrow text-accent">{call.day}</span>
                  <span className="numeric text-heading-lg">{call.date}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-heading-md">{call.event}</p>
                  <p className="mt-1 text-small text-muted">{call.details}</p>
                </div>
              </div>
              <div className="mt-5 flex -space-x-2">
                {call.people.map((person, i) => (
                  <span
                    key={person}
                    className={cn(
                      'grid size-9 place-items-center rounded-pill border-2 border-(--tone-bg) text-micro font-bold',
                      i === 0 ? 'bg-paper text-ink' : 'bg-orange text-ink',
                    )}
                  >
                    {person.slice(0, 1)}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-tone pt-4">
                <span className="text-small text-muted">{call.answer}</span>
                <span className="flex gap-2">
                  <span className="rounded-pill bg-orange px-4 py-1.5 text-small font-semibold text-ink">
                    {call.yes}
                  </span>
                  <span className="rounded-pill border border-tone px-4 py-1.5 text-small text-muted">
                    {call.no}
                  </span>
                </span>
              </div>
            </div>,
          )}

          {card(
            4,
            quote,
            <div className="flex flex-1 flex-col">
              <p className="text-small font-semibold">{quote.document}</p>
              <dl className="mt-3 divide-y divide-(--tone-border) text-small">
                {quote.lines.map((line) => (
                  <div key={line.label} className="flex justify-between gap-3 py-2">
                    <dt className="text-muted">{line.label}</dt>
                    <dd>{line.value}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-3 pt-3">
                  <dt className="text-muted">{quote.totalLabel}</dt>
                  <dd className="numeric text-heading-md">{quote.total}</dd>
                </div>
              </dl>
              <ul className="mt-4 grid gap-1.5 text-micro text-muted">
                {quote.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-3.5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <span className="mt-auto block rounded-pill bg-orange py-2.5 text-center text-small font-semibold text-ink">
                {quote.accept}
              </span>
            </div>,
          )}
        </ol>

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
