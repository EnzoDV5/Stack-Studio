import { useId, useRef, type ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { formatCountable, parseCountable } from '@/lib/count-up'
import { pad2 } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, stepsStory as motion } from '@/lib/motion-tokens'
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

const icon = (paths: ReactNode) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths}
  </svg>
)

/** What flies from one card to the next: the brief, the invite, the quote. */
const tokenIcons = [
  icon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>,
  ),
  icon(
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>,
  ),
  icon(
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>,
  ),
]

/** The quote's sparks fan out above the Accept button (degrees from straight up). */
const sparkAngles = [-64, -40, -18, 0, 18, 40, 64]

/** Where `el` sits inside `root`, ignoring transforms (so cards still on their way in measure true). */
function layoutPoint(el: HTMLElement | null | undefined, root: HTMLElement, ax = 0.5, ay = 0.5) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el ?? null
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x: x + (el?.offsetWidth ?? 0) * ax, y: y + (el?.offsetHeight ?? 0) * ay }
}

/**
 * What happens once someone gets in touch, shown rather than told: four cards side by side, each
 * with the step above a small version of what the visitor sees (the brief with a real estimate,
 * our email reply, the meeting invite, the fixed quote). The interfaces are illustrative and
 * decorative; each card's title, timing and line carry the meaning for screen readers.
 * Signature motion: once a row of cards is well on screen it plays out as a story (stepsStory).
 * Each card pops up and lights up in turn; the visitor's cursor picks an option and sends the
 * brief, picks a time, picks how to meet and accepts the quote, while our side happens on its own
 * (the reply types, the invite arrives, the quote fills and counts up); a token flies from each
 * card to the next. The markup is the finished story, so with reduced motion (or no JS) the
 * cards simply show it.
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
  const storyRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const list = storyRef.current
      if (!list || reducedMotion) return
      const total = list.querySelector<HTMLElement>('[data-total]')
      const totalParts = parseCountable(quote.total)

      // Rebuilt whenever the grid changes shape: one row of four (xl), two by two, or a column.
      const mm = gsap.matchMedia()
      mm.add(
        {
          column: '(max-width: 47.99rem)',
          grid: '(min-width: 48rem) and (max-width: 79.99rem)',
          row: '(min-width: 80rem)',
        },
        () => {
          const cards = gsap.utils.toArray<HTMLElement>('[data-card]', list)
          const tokens = gsap.utils.toArray<HTMLElement>('[data-token]', list)
          const find = (card: HTMLElement | undefined, selector: string) =>
            card?.querySelector<HTMLElement>(selector) ?? null
          const findAll = (card: HTMLElement | undefined, selector: string) =>
            card ? gsap.utils.toArray<HTMLElement>(selector, card) : []

          /** The card pops up and lights up. */
          const pop = (
            tl: gsap.core.Timeline,
            card: HTMLElement | undefined,
            at?: gsap.Position,
          ) => {
            if (!card) return
            tl.fromTo(
              card,
              { opacity: 0, y: motion.rise, scale: motion.scale },
              { opacity: 1, y: 0, scale: 1, duration: duration.fast, ease: ease.out },
              at,
            )
            tl.fromTo(
              find(card, '[data-ring]'),
              { opacity: 0 },
              { opacity: 1, duration: duration.fast, ease: ease.out },
              '<0.15',
            )
            // The cursor waits low in the card until there's something to pick.
            const cursor = find(card, '[data-cursor]')
            if (cursor)
              tl.fromTo(
                cursor,
                {
                  opacity: 0,
                  x: () => layoutPoint(find(card, '[data-ui]'), card, 0.75, 0.9).x,
                  y: () => layoutPoint(find(card, '[data-ui]'), card, 0.75, 0.9).y,
                },
                { opacity: 1, duration: duration.micro, immediateRender: false },
                '<0.2',
              )
          }

          /**
           * The visitor's cursor glides to `target` and clicks it; a ripple spreads from it. Returns
           * the moment the press lets go, so what the click causes follows it straight away rather
           * than waiting for the ripple to fade.
           */
          let clicks = 0
          const click = (
            tl: gsap.core.Timeline,
            card: HTMLElement | undefined,
            target: HTMLElement | null,
            at: gsap.Position = `+=${motion.beat}`,
          ) => {
            const cursor = find(card, '[data-cursor]')
            const ripple = find(card, '[data-ripple]')
            const pressed = `click-${clicks++}`
            if (!card || !cursor || !target) return `+=${motion.beat}`
            const spot = () => layoutPoint(target, card, 0.7, 0.55)
            tl.to(
              cursor,
              {
                x: () => spot().x,
                y: () => spot().y,
                duration: motion.cursorMove,
                ease: motion.cursorEase,
              },
              at,
            )
            const press = {
              scale: motion.press,
              duration: motion.pressTime,
              yoyo: true,
              repeat: 1,
              ease: ease.outQuart,
            }
            tl.to(cursor, press)
            tl.to(target, { ...press, scale: 0.97 }, '<')
            tl.addLabel(pressed, '>')
            if (ripple)
              tl.fromTo(
                ripple,
                { x: () => spot().x, y: () => spot().y, scale: 0, opacity: 0.7 },
                {
                  scale: 1,
                  opacity: 0,
                  duration: motion.ripple,
                  ease: ease.out,
                  immediateRender: false,
                },
                `${pressed}-=${motion.pressTime * 2}`,
              )
            return pressed
          }

          /** The card's light goes out (and its cursor with it) as the next one takes over. */
          const settle = (
            tl: gsap.core.Timeline,
            card: HTMLElement | undefined,
            at?: gsap.Position,
          ) => {
            if (!card) return
            tl.to(find(card, '[data-cursor]'), { opacity: 0, duration: duration.micro }, at)
            tl.to(find(card, '[data-ring]'), { opacity: 0, duration: duration.fast }, '<')
          }

          /** A token flies in an arc from `from` to the top of `to`'s interface. */
          const fly = (
            tl: gsap.core.Timeline,
            token: HTMLElement | undefined,
            from: HTMLElement | null,
            to: HTMLElement | null,
          ) => {
            if (!token || !from || !to) return
            const start = () => layoutPoint(from, list)
            const end = () => layoutPoint(to, list, 0.5, 0.12)
            tl.fromTo(
              token,
              { x: () => start().x, y: () => start().y, scale: 0.3, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: duration.micro,
                ease: ease.out,
                immediateRender: false,
              },
            )
            tl.to(token, { x: () => end().x, duration: motion.fly, ease: 'power1.inOut' }, '<')
            tl.to(
              token,
              {
                y: () => Math.min(start().y, end().y) - motion.arc,
                duration: motion.fly / 2,
                ease: 'power2.out',
              },
              '<',
            )
            tl.to(token, { y: () => end().y, duration: motion.fly / 2, ease: 'power2.in' }, '>')
            tl.to(token, { scale: 0.4, opacity: 0, duration: duration.micro })
          }

          // 01: the visitor picks what they're building, sees the estimate and sends the brief.
          const briefStory = (
            tl: gsap.core.Timeline,
            card: HTMLElement | undefined,
            at?: gsap.Position,
          ) => {
            const dots = findAll(card, '[data-dot]')
            pop(tl, card, at)
            const fill = (dot: HTMLElement | undefined, at: gsap.Position) => {
              if (dot)
                tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.3, ease: ease.outQuart }, at)
            }
            fill(dots[0], '<0.3')
            const option = click(tl, card, find(card, '[data-option]'), '-=0.3')
            tl.fromTo(
              find(card, '[data-picked]'),
              { opacity: 0 },
              { opacity: 1, duration: duration.micro },
              option,
            )
            fill(dots[1], '<')
            tl.fromTo(
              find(card, '[data-estimate]'),
              { clipPath: 'inset(0% 100% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: motion.ui, ease: ease.out },
              `>${motion.beat}`,
            )
            fill(dots[2], '<0.3')
            click(tl, card, find(card, '[data-send]'))
          }

          // 02: our reply arrives and types itself, and the visitor picks a time.
          const replyStory = (
            tl: gsap.core.Timeline,
            card: HTMLElement | undefined,
            at?: gsap.Position,
          ) => {
            const typing = find(card, '[data-typing]')
            pop(tl, card, at)
            tl.fromTo(
              find(card, '[data-mail]'),
              { opacity: 0, y: -16 },
              { opacity: 1, y: 0, duration: motion.ui, ease: ease.out },
              '<0.2',
            )
            tl.fromTo(typing, { opacity: 0 }, { opacity: 1, duration: duration.micro })
            tl.fromTo(
              findAll(card, '[data-typing] i'),
              { y: 0 },
              {
                y: -4,
                duration: motion.typingBob,
                ease: 'sine.inOut',
                // Each dot bobs on its own, a beat after the one before (a repeat on the
                // whole group would wait for the stagger every time round).
                stagger: { each: 0.1, yoyo: true, repeat: motion.typingBobs * 2 - 1 },
              },
            )
            tl.to(typing, { opacity: 0, duration: duration.micro })
            tl.fromTo(
              findAll(card, '[data-message]'),
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: motion.ui, ease: ease.out, stagger: 0.12 },
              '<',
            )
            tl.fromTo(
              findAll(card, '[data-slot]'),
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.4, ease: ease.outQuart, stagger: 0.1 },
              '-=0.2',
            )
            const slot = click(tl, card, find(card, '[data-slot]'))
            tl.fromTo(
              find(card, '[data-picked]'),
              { opacity: 0 },
              { opacity: 1, duration: duration.micro },
              slot,
            )
          }

          // 03: the invite lands, the visitor picks how to meet, and both are in.
          const meetingStory = (
            tl: gsap.core.Timeline,
            card: HTMLElement | undefined,
            at?: gsap.Position,
          ) => {
            pop(tl, card, at)
            tl.fromTo(
              find(card, '[data-date]'),
              { rotationX: -90, opacity: 0, transformPerspective: 400, transformOrigin: '50% 0%' },
              { rotationX: 0, opacity: 1, duration: motion.ui, ease: ease.out },
              '<0.2',
            )
            tl.fromTo(
              findAll(card, '[data-event]'),
              { opacity: 0, x: -10 },
              { opacity: 1, x: 0, duration: motion.ui, ease: ease.out, stagger: 0.1 },
              '<0.2',
            )
            const mode = click(tl, card, find(card, '[data-mode]'))
            tl.fromTo(
              find(card, '[data-picked]'),
              { opacity: 0 },
              { opacity: 1, duration: duration.micro },
              mode,
            )
            tl.fromTo(
              find(card, '[data-note]'),
              { opacity: 0 },
              { opacity: 1, duration: motion.ui },
              '>',
            )
            tl.fromTo(
              findAll(card, '[data-person]'),
              { scale: 0 },
              { scale: 1, duration: 0.4, ease: ease.outQuart, stagger: 0.12 },
              `>${motion.beat}`,
            )
            tl.fromTo(
              find(card, '[data-accepted]'),
              { clipPath: 'inset(0% 100% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: motion.ui, ease: ease.out },
            )
          }

          // 04: the quote fills in, the total counts up, and the visitor accepts it.
          const quoteStory = (
            tl: gsap.core.Timeline,
            card: HTMLElement | undefined,
            at?: gsap.Position,
          ) => {
            pop(tl, card, at)
            tl.fromTo(
              findAll(card, '[data-line]'),
              { opacity: 0, x: -12 },
              { opacity: 1, x: 0, duration: motion.ui, ease: ease.out, stagger: 0.1 },
              '<0.3',
            )
            if (total && totalParts) {
              const count = { n: 0 }
              tl.fromTo(
                count,
                { n: 0 },
                {
                  n: totalParts.value,
                  duration: motion.countUp,
                  ease: ease.outQuart,
                  onStart: () => {
                    total.textContent = formatCountable(totalParts, 0)
                  },
                  onUpdate: () => {
                    total.textContent = formatCountable(totalParts, Math.round(count.n / 100) * 100)
                  },
                  onComplete: () => {
                    total.textContent = quote.total
                  },
                },
                '-=0.2',
              )
            }
            tl.fromTo(
              findAll(card, '[data-include]'),
              { opacity: 0, x: -8 },
              { opacity: 1, x: 0, duration: motion.ui, ease: ease.out, stagger: 0.1 },
              '-=0.4',
            )
            click(tl, card, find(card, '[data-accept]'))
            tl.fromTo(
              findAll(card, '[data-spark]'),
              { y: -4, scaleY: 0, opacity: 1 },
              {
                y: -26,
                scaleY: 1,
                opacity: 0,
                duration: motion.ui,
                ease: ease.out,
                stagger: 0.02,
              },
              '<0.1',
            )
          }

          const stories = [briefStory, replyStory, meetingStory, quoteStory]
          // What each card hands on (its last click) and where the next card receives it.
          const handOff = (card: HTMLElement | undefined) =>
            find(card, '[data-send]') ?? find(card, '[data-slot]') ?? find(card, '[data-accepted]')

          // Cards sharing a row play one after another; each row starts once it's on screen.
          const rows: HTMLElement[][] = []
          for (const card of cards) {
            const row = rows.find((r) => r[0]?.offsetTop === card.offsetTop)
            if (row) row.push(card)
            else rows.push([card])
          }
          rows.forEach((row) => {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: row[0], start: motion.start, once: true },
            })
            row.forEach((card, i) => {
              const index = cards.indexOf(card)
              const previous = row[i - 1]
              if (previous) {
                fly(tl, tokens[index - 1], handOff(previous), find(card, '[data-ui]'))
                settle(tl, previous, '<')
              }
              // The next card pops up while the token is on its way down, so it's there to catch it.
              stories[index]?.(
                tl,
                card,
                previous ? `-=${duration.micro + motion.fly / 2}` : undefined,
              )
            })
            settle(tl, row[row.length - 1], `+=${motion.hold}`)
          })
        },
      )

      return () => {
        mm.revert()
        if (total) total.textContent = quote.total
      }
    },
    { scope: storyRef, dependencies: [reducedMotion, quote.total], revertOnUpdate: true },
  )

  // Each card spans two rows of the list's subgrid (the step, then its interface), so the
  // interfaces line up across the row even when titles wrap differently.
  const card = (index: number, step: StepText, ui: ReactNode) => (
    <li
      data-card=""
      className="relative grid grid-cols-1 gap-5 rounded-lg border border-tone bg-tone-surface p-5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)] md:row-span-2 md:grid-rows-subgrid"
    >
      {/* Lights up while this step plays. */}
      <span
        data-ring=""
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-lg border border-orange opacity-0 shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-orange)_14%,transparent),0_30px_80px_-30px_color-mix(in_srgb,var(--color-orange)_45%,transparent)]"
      />
      <div className="flex flex-col">
        <span className="eyebrow text-accent">{pad2(index)}</span>
        <h3 className="mt-3 text-heading-md">{step.title}</h3>
        <p className="mt-2 text-small text-muted">{step.body}</p>
        <Tag className="mt-4 h-auto! min-h-8 max-w-full self-start py-1.5 whitespace-normal!">
          {step.when}
        </Tag>
      </div>
      {/* A small version of what they see at this step (decorative). */}
      <div
        data-ui=""
        aria-hidden="true"
        className="flex flex-col rounded-md border border-tone bg-(--tone-bg) p-4"
      >
        {ui}
      </div>
      {/* The visitor's cursor, and the ripple of its clicks (hidden until the story plays). */}
      <span
        data-ripple=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10 -mt-6 -ml-6 size-12 rounded-pill border-2 border-orange opacity-0"
      />
      <svg
        data-cursor=""
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-0 left-0 z-10 size-6 origin-top-left opacity-0 drop-shadow-[0_4px_8px_rgb(0_0_0/0.5)]"
      >
        <path
          d="M3 2.5 16.5 9l-5.8 1.7-2.6 5.8z"
          className="fill-paper stroke-ink"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
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
        {/* The cards, and the tokens that fly between them (measured against this wrapper). */}
        <div ref={storyRef} className="relative mt-14 md:mt-20">
          <ol className="grid gap-4 md:grid-cols-2 md:gap-x-4 md:gap-y-5 xl:grid-cols-4">
            {card(
              1,
              brief,
              <>
                <div className="flex items-center justify-between">
                  <p className="text-small font-semibold">{brief.heading}</p>
                  <span className="flex gap-1.5">
                    {[0, 1, 2, 3].map((dot) => (
                      <i key={dot} className="relative size-1.5 rounded-pill bg-(--tone-border)">
                        {dot < 3 && (
                          <i data-dot="" className="absolute inset-0 rounded-pill bg-orange" />
                        )}
                      </i>
                    ))}
                  </span>
                </div>
                <p className="mt-3 text-heading-md">{brief.question}</p>
                <div className="mt-3 grid gap-1.5">
                  {brief.options.map((option, i) => (
                    <span
                      key={option}
                      data-option={i === 0 ? '' : undefined}
                      className="relative flex items-center justify-between rounded-pill border border-tone px-3.5 py-1.5 text-small text-muted"
                    >
                      {option}
                      {i === 0 && (
                        <span
                          data-picked=""
                          className="absolute -inset-px flex items-center justify-between overflow-hidden rounded-pill border border-orange bg-(--tone-bg) px-3.5 text-(--tone-fg)"
                        >
                          <span className="absolute inset-0 bg-orange/15" />
                          <span className="relative">{option}</span>
                          <Check className="relative text-accent" />
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <p className="eyebrow text-muted">{brief.estimateLabel}</p>
                  <p data-estimate="" className="mt-1 numeric text-heading-md">
                    {brief.estimate}
                  </p>
                  <span
                    data-send=""
                    className="mt-3 block rounded-pill bg-orange py-2 text-center text-small font-semibold text-ink"
                  >
                    {brief.send}
                  </span>
                </div>
              </>,
            )}

            {card(
              2,
              reply,
              <>
                <div data-mail="" className="flex items-center gap-3">
                  <Avatar />
                  <div className="min-w-0 flex-1">
                    <p className="text-small font-semibold">{reply.from}</p>
                    <p className="truncate text-small text-muted">{reply.email}</p>
                  </div>
                  <span className="self-start text-small text-muted">{reply.time}</span>
                </div>
                <div className="relative mt-4 border-t border-tone pt-4">
                  {/* We're typing… (shown only while the story plays). */}
                  <span
                    data-typing=""
                    className="absolute top-4 left-0 flex gap-1 rounded-pill bg-tone-surface px-3 py-2.5 opacity-0"
                  >
                    {[0, 1, 2].map((dot) => (
                      <i key={dot} className="size-1.5 rounded-pill bg-(--tone-muted)" />
                    ))}
                  </span>
                  <p data-message="" className="text-small font-semibold">
                    {reply.subject}
                  </p>
                  <p data-message="" className="mt-2 text-small text-muted">
                    {reply.message}
                  </p>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                  {reply.slots.map((slot, i) => (
                    <span
                      key={slot}
                      data-slot=""
                      className="relative rounded-pill border border-orange py-1.5 text-center text-small text-accent"
                    >
                      {slot}
                      {i === 0 && (
                        <span
                          data-picked=""
                          className="absolute -inset-px grid place-items-center rounded-pill bg-orange font-semibold text-ink"
                        >
                          {slot}
                        </span>
                      )}
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
                  <div
                    data-date=""
                    className="grid w-14 shrink-0 place-items-center rounded-md border border-tone py-1.5 text-center"
                  >
                    <span className="eyebrow text-accent">{meeting.day}</span>
                    <span className="numeric text-heading-lg">{meeting.date}</span>
                  </div>
                  <div className="min-w-0">
                    <p data-event="" className="text-heading-md">
                      {meeting.event}
                    </p>
                    <p data-event="" className="mt-1 text-small text-muted">
                      {meeting.details}
                    </p>
                  </div>
                </div>
                {/* In person or online: either suits; the visitor picks one. */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {meeting.modes.map((mode, i) => (
                    <span
                      key={mode}
                      data-mode={i === 0 ? '' : undefined}
                      className="relative rounded-md border border-tone py-2 text-center text-small"
                    >
                      {mode}
                      {i === 0 && (
                        <span
                          data-picked=""
                          className="absolute -inset-px grid place-items-center overflow-hidden rounded-md border border-orange bg-(--tone-bg)"
                        >
                          <span className="absolute inset-0 bg-orange/15" />
                          <span className="relative font-semibold">{mode}</span>
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <p data-note="" className="mt-3 text-small text-muted">
                  {meeting.note}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex -space-x-2">
                    <span
                      data-person=""
                      className="grid size-8 place-items-center rounded-pill border-2 border-(--tone-bg) bg-(--tone-fg) text-small font-bold text-(--tone-bg)"
                    >
                      Y
                    </span>
                    <span data-person="">
                      <Avatar className="border-2 border-(--tone-bg)" />
                    </span>
                  </div>
                  <span
                    data-accepted=""
                    className="flex items-center gap-2 text-small font-semibold text-accent"
                  >
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
                    <div
                      key={line.label}
                      data-line=""
                      className="flex justify-between gap-3 py-1.5"
                    >
                      <dt className="text-muted">{line.label}</dt>
                      <dd>{line.value}</dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-3 pt-2">
                    <dt className="text-muted">{quote.totalLabel}</dt>
                    <dd data-total="" className="numeric text-heading-md">
                      {quote.total}
                    </dd>
                  </div>
                </dl>
                <ul className="mt-3 grid gap-1 text-small text-muted">
                  {quote.includes.map((item) => (
                    <li key={item} data-include="" className="flex items-center gap-2">
                      <Check className="size-3.5 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span
                  data-accept=""
                  className="relative mt-auto block rounded-pill bg-orange py-2 text-center text-small font-semibold text-ink"
                >
                  {quote.accept}
                  {/* A burst of sparks when it's accepted (hidden until the story plays). */}
                  {sparkAngles.map((angle) => (
                    <span
                      key={angle}
                      className="absolute bottom-full left-1/2 origin-bottom"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <span
                        data-spark=""
                        className="-ml-px block h-2.5 w-0.5 origin-bottom rounded-pill bg-orange opacity-0"
                      />
                    </span>
                  ))}
                </span>
              </>,
            )}
          </ol>
          {/* The tokens that fly from card to card: the brief, the invite, the quote. */}
          {tokenIcons.map((svg, i) => (
            <span
              key={i}
              data-token=""
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 z-20 -mt-4.5 -ml-4.5 grid size-9 place-items-center rounded-pill bg-orange text-ink opacity-0 shadow-[0_8px_24px_-6px_color-mix(in_srgb,var(--color-orange)_70%,transparent)]"
            >
              {svg}
            </span>
          ))}
        </div>

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
