import { useEffect, useId, useRef, useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TextLink } from '@/components/ui/TextLink'
import { useInView } from '@/hooks/useInView'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { voicesCarousel } from '@/lib/motion-tokens'
import { QuoteCredit } from '@/sections/shared/QuoteCredit'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { ClientLogoSet, CtaLink, TestimonialLabels } from '@/types'

export interface ClientVoice {
  id: string
  quote: string
  name?: string
  role: string
  company: string
  logo?: ClientLogoSet
  /** The client's case study. */
  link?: CtaLink
}

export interface ClientVoicesProps {
  index?: number
  /** Optional small label above the title. */
  eyebrow?: string
  title: string
  voices: ClientVoice[]
  /** "Go deeper" link after the quotes. */
  more: CtaLink
  /** The phone carousel's accessible names. */
  labels: Pick<TestimonialLabels, 'carousel' | 'slide' | 'pause' | 'play'>
  tone?: Tone
}

/** Below lg the quotes are a carousel. */
const CAROUSEL = '(max-width: 63.99rem)'

/** The quotes in the scroller, and where the scroller has to be for `slide` to sit at its start. */
const slidesIn = (scroller: HTMLElement | null) =>
  Array.from(scroller?.querySelectorAll<HTMLElement>(':scope > ul > li') ?? [])
const startOf = (scroller: HTMLElement, slide: HTMLElement) =>
  slide.offsetLeft - (parseFloat(getComputedStyle(scroller).scrollPaddingLeft) || 0)

/**
 * What clients say, straight after the work they're talking about. Each quote sits with
 * who said it and a link to that project. Signature motion: the quote cards rise in, one
 * after the other, as they enter. From lg they sit side by side; below that they're a swipe
 * carousel that moves on by itself every few seconds while it's on screen (paused while the
 * visitor touches, hovers or focuses it, or with the pause button; never with reduced motion).
 */
export function ClientVoices({
  index,
  eyebrow,
  title,
  voices,
  more,
  labels,
  tone = 'dark',
}: ClientVoicesProps) {
  const headingId = useId()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const carousel = useMediaQuery(CAROUSEL)
  const reducedMotion = useReducedMotion()
  const inView = useInView(scrollerRef, { threshold: 0.5 })
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [held, setHeld] = useState(false)
  const autoplay = carousel && !reducedMotion && voices.length > 1

  const goTo = (i: number) => {
    const scroller = scrollerRef.current
    const slide = slidesIn(scroller)[i]
    if (!scroller || !slide) return
    scroller.scrollTo({
      left: startOf(scroller, slide),
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  // The slide nearest the start of the scroller is the current one.
  const onScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    let nearest = 0
    let best = Infinity
    slidesIn(scroller).forEach((slide, i) => {
      const gap = Math.abs(startOf(scroller, slide) - scroller.scrollLeft)
      if (gap < best) {
        best = gap
        nearest = i
      }
    })
    setActive(nearest)
  }

  // Waits a full interval after every move (its own or a swipe), then moves on, looping.
  useEffect(() => {
    if (!autoplay || paused || held || !inView) return
    const id = window.setTimeout(() => {
      const scroller = scrollerRef.current
      const slides = slidesIn(scroller)
      const next = slides[(active + 1) % slides.length]
      if (scroller && next) scroller.scrollTo({ left: startOf(scroller, next), behavior: 'smooth' })
    }, voicesCarousel.interval * 1000)
    return () => window.clearTimeout(id)
  }, [autoplay, paused, held, inView, active])

  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader id={headingId} index={index} eyebrow={eyebrow} title={title} />

        <div
          ref={scrollerRef}
          role={carousel ? 'region' : undefined}
          aria-roledescription={carousel ? 'carousel' : undefined}
          aria-label={carousel ? labels.carousel : undefined}
          onScroll={carousel ? onScroll : undefined}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setHeld(false)}
          onTouchStart={() => setHeld(true)}
          onTouchEnd={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false)
          }}
          className={cn(
            'relative mt-14 lg:mt-20',
            // Below lg: a full-bleed swipe carousel, one card at a time with the next peeking in.
            '-mx-(--spacing-gutter) no-scrollbar snap-x snap-mandatory scroll-px-(--spacing-gutter) overflow-x-auto overflow-y-hidden',
            'lg:mx-0 lg:overflow-visible',
          )}
        >
          <StaggerGroup
            as="ul"
            className="flex w-max gap-4 px-(--spacing-gutter) lg:grid lg:w-auto lg:grid-cols-3 lg:gap-6 lg:px-0"
          >
            {voices.map((voice, i) => (
              <li
                key={voice.id}
                role={carousel ? 'group' : undefined}
                aria-roledescription={carousel ? 'slide' : undefined}
                aria-label={carousel ? labels.slide(i + 1, voices.length) : undefined}
                className="w-[85vw] max-w-[30rem] shrink-0 snap-start sm:w-[62vw] lg:w-auto lg:max-w-none"
              >
                <figure className="flex h-full flex-col rounded-lg border border-tone p-7 xl:p-8">
                  <span
                    aria-hidden="true"
                    className="font-display text-[4rem] leading-[0.6] text-accent"
                  >
                    “
                  </span>
                  <blockquote className="mt-6 flex-1">
                    <p className="font-display text-heading-md xl:text-heading-lg">{voice.quote}</p>
                  </blockquote>
                  <figcaption className="mt-8 flex flex-col items-start gap-4 border-t border-tone pt-6">
                    {/* One height for every credit, so the dividers line up across the row. */}
                    <div className="flex min-h-16 items-center">
                      <QuoteCredit
                        name={voice.name}
                        role={voice.role}
                        company={voice.company}
                        logo={voice.logo}
                        tone={tone}
                      />
                    </div>
                    {voice.link && (
                      <TextLink to={voice.link.to} arrow className="text-small">
                        {voice.link.label}
                      </TextLink>
                    )}
                  </figcaption>
                </figure>
              </li>
            ))}
          </StaggerGroup>
        </div>

        {/* Below lg: which quote is showing (each dot jumps to its quote), and pause/play. */}
        {carousel && voices.length > 1 && (
          <div className="mt-6 flex items-center gap-3">
            <div className="-ml-3 flex">
              {voices.map((voice, i) => (
                <button
                  key={voice.id}
                  type="button"
                  aria-label={labels.slide(i + 1, voices.length)}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => goTo(i)}
                  className="grid size-8 place-items-center"
                >
                  <span
                    className={cn(
                      'size-2 rounded-pill transition-colors duration-(--duration-fast)',
                      i === active ? 'bg-orange' : 'bg-grey-700',
                    )}
                  />
                </button>
              ))}
            </div>
            {autoplay && (
              <button
                type="button"
                aria-label={paused ? labels.play : labels.pause}
                onClick={() => setPaused((p) => !p)}
                className="ml-auto grid size-9 place-items-center rounded-pill border border-tone text-muted transition-colors hover:text-(--tone-fg)"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="size-3.5"
                  fill="currentColor"
                >
                  {paused ? (
                    <path d="M4.5 2.5v11l9-5.5z" />
                  ) : (
                    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
                  )}
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="mt-12">
          <TextLink to={more.to} arrow>
            {more.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}
