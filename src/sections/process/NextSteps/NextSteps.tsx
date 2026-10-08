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

interface StepText {
  title: string
  /** How long it takes, e.g. "Within one business day". */
  when: string
  body: string
}

export interface NextStepsProps {
  eyebrow: string
  title: string
  intro: string
  /** 01: the brief, with a real rough estimate. */
  brief: StepText & {
    heading: string
    question: string
    options: string[]
    estimateLabel: string
    /** e.g. "R 18 000 – R 24 500". */
    estimate: string
    send: string
  }
  /** 02: our reply, as an email. */
  reply: StepText & {
    from: string
    /** The studio's address, e.g. "hello@…". */
    email: string
    subject: string
    time: string
    message: string
    /** Suggested meeting times. */
    slots: string[]
  }
  /** 03: the meeting, in person or online. */
  meeting: StepText & {
    day: string
    date: string
    event: string
    details: string
    modes: string[]
    /** A line under the options, e.g. what comes with the invite. */
    note: string
    accepted: string
  }
  /** 04: the fixed quote. */
  quote: StepText & {
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

/** The studio's avatar in the mock interfaces: the S of Stack on orange. */
const Avatar = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'grid size-8 shrink-0 place-items-center rounded-pill bg-orange text-small font-bold text-ink',
      className,
    )}
  >
    S
  </span>
)

/**
 * What happens once someone gets in touch, shown rather than told: four cards side by side, each
 * with the step above a small version of what the visitor sees (the brief with a real estimate,
 * our email reply, the meeting invite, the fixed quote). The interfaces are illustrative and
 * decorative; each card's title, timing and line carry the meaning for screen readers.
 * Signature motion (desktop, scrubbed): the cards start as a loose pile in the middle and deal
 * out into their row as the section scrolls in. Phones and reduced motion: the cards, in order,
 * still.
 */
export function NextSteps({
  eyebrow,
  title,
  intro,
  brief,
  reply,
  meeting,
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
        // Each card's distance from the middle of the list, measured in its dealt-out place
        // (recomputed on every refresh, so a resize keeps the pile centred).
        const offset = (i: number, axis: 'x' | 'y') => {
          const card = cards[i]
          if (!card) return 0
          const grid = list.getBoundingClientRect()
          const box = card.getBoundingClientRect()
          return axis === 'x'
            ? grid.left + grid.width / 2 - (box.left + box.width / 2)
            : grid.top + grid.height / 2 - (box.top + box.height / 2)
        }
        const pile = (i: number) => stepsDeal.pile[i % stepsDeal.pile.length]
        gsap.from(cards, {
          x: (i: number) => offset(i, 'x'),
          y: (i: number) => offset(i, 'y') + (pile(i)?.y ?? 0),
          rotation: (i: number) => pile(i)?.rotation ?? 0,
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

  // Each card spans two rows of the list's subgrid (the step, then its interface), so the
  // interfaces line up across the row even when titles wrap differently.
  const card = (index: number, step: StepText, ui: ReactNode) => (
    <li
      data-card=""
      className="grid gap-5 rounded-lg border border-tone bg-tone-surface p-5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)] md:row-span-2 md:grid-rows-subgrid"
    >
      <div className="flex flex-col">
        <span className="eyebrow text-accent">{pad2(index)}</span>
        <h3 className="mt-3 text-heading-md">{step.title}</h3>
        <p className="mt-2 text-small text-muted">{step.body}</p>
        <Tag className="mt-4 self-start">{step.when}</Tag>
      </div>
      {/* A small version of what they see at this step (decorative). */}
      <div
        aria-hidden="true"
        className="flex flex-col rounded-md border border-tone bg-(--tone-bg) p-4"
      >
        {ui}
      </div>
    </li>
  )

  return (
    <Section id="next-steps" tone={tone} aria-labelledby={headingId} className="overflow-hidden">
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />

        {/* Side by side: one row of four from xl, two by two on smaller desktops and tablets. */}
        <ol
          ref={listRef}
          className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-x-4 md:gap-y-5 xl:grid-cols-4"
        >
          {card(
            1,
            brief,
            <>
              <div className="flex items-center justify-between">
                <p className="text-small font-semibold">{brief.heading}</p>
                <span className="flex gap-1.5">
                  {[0, 1, 2, 3].map((dot) => (
                    <i
                      key={dot}
                      className={cn(
                        'size-1.5 rounded-pill',
                        dot < 3 ? 'bg-orange' : 'bg-(--tone-border)',
                      )}
                    />
                  ))}
                </span>
              </div>
              <p className="mt-3 text-heading-md">{brief.question}</p>
              <div className="mt-3 grid gap-1.5">
                {brief.options.map((option, i) => (
                  <span
                    key={option}
                    className={cn(
                      'flex items-center justify-between rounded-pill border px-3.5 py-1.5 text-small',
                      i === 0 ? 'border-orange bg-orange/15' : 'border-tone text-muted',
                    )}
                  >
                    {option}
                    {i === 0 && <Check className="text-accent" />}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <p className="eyebrow text-muted">{brief.estimateLabel}</p>
                <p className="mt-1 numeric text-heading-md">{brief.estimate}</p>
                <span className="mt-3 block rounded-pill bg-orange py-2 text-center text-small font-semibold text-ink">
                  {brief.send}
                </span>
              </div>
            </>,
          )}

          {card(
            2,
            reply,
            <>
              <div className="flex items-center gap-3">
                <Avatar />
                <div className="min-w-0 flex-1">
                  <p className="text-small font-semibold">{reply.from}</p>
                  <p className="truncate text-small text-muted">{reply.email}</p>
                </div>
                <span className="self-start text-small text-muted">{reply.time}</span>
              </div>
              <p className="mt-4 border-t border-tone pt-4 text-small font-semibold">
                {reply.subject}
              </p>
              <p className="mt-2 text-small text-muted">{reply.message}</p>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                {reply.slots.map((slot) => (
                  <span
                    key={slot}
                    className="rounded-pill border border-orange py-1.5 text-center text-small text-accent"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </>,
          )}

          {card(
            3,
            meeting,
            <>
              <div className="flex items-center gap-3">
                <div className="grid w-14 shrink-0 place-items-center rounded-md border border-tone py-1.5 text-center">
                  <span className="eyebrow text-accent">{meeting.day}</span>
                  <span className="numeric text-heading-lg">{meeting.date}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-heading-md">{meeting.event}</p>
                  <p className="mt-1 text-small text-muted">{meeting.details}</p>
                </div>
              </div>
              {/* In person or online: either suits, so both show as options. */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {meeting.modes.map((mode) => (
                  <span
                    key={mode}
                    className="rounded-md border border-tone py-2 text-center text-small"
                  >
                    {mode}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-small text-muted">{meeting.note}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <div className="flex -space-x-2">
                  <span className="grid size-8 place-items-center rounded-pill border-2 border-(--tone-bg) bg-(--tone-fg) text-small font-bold text-(--tone-bg)">
                    Y
                  </span>
                  <Avatar className="border-2 border-(--tone-bg)" />
                </div>
                <span className="flex items-center gap-2 text-small font-semibold text-accent">
                  <Check />
                  {meeting.accepted}
                </span>
              </div>
            </>,
          )}

          {card(
            4,
            quote,
            <>
              <p className="text-small font-semibold">{quote.document}</p>
              <dl className="mt-1 divide-y divide-(--tone-border) text-small">
                {quote.lines.map((line) => (
                  <div key={line.label} className="flex justify-between gap-3 py-1.5">
                    <dt className="text-muted">{line.label}</dt>
                    <dd>{line.value}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-3 pt-2">
                  <dt className="text-muted">{quote.totalLabel}</dt>
                  <dd className="numeric text-heading-md">{quote.total}</dd>
                </div>
              </dl>
              <ul className="mt-3 grid gap-1 text-small text-muted">
                {quote.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-3.5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <span className="mt-auto block rounded-pill bg-orange py-2 text-center text-small font-semibold text-ink">
                {quote.accept}
              </span>
            </>,
          )}
        </ol>

        <Button
          to={cta.to}
          withArrow
          className="mt-12"
          analytics={{ event: 'Start project click', props: { location: 'process-next-steps' } }}
        >
          {cta.label}
        </Button>
      </div>
    </Section>
  )
}
