import { useRef, useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { QuoteCredit } from '@/sections/shared/QuoteCredit'
import type { Testimonial as TestimonialData, TestimonialLabels } from '@/types'

export interface TestimonialProps {
  /** One quote, or several to swipe through (same layout, one at a time). */
  testimonials: TestimonialData[]
  /** Needed for the carousel controls when there is more than one quote. */
  labels?: TestimonialLabels
  eyebrow?: string
  tone?: Tone
}

/**
 * Big client quotes. Static: on inner pages only the page title may reveal. With several
 * quotes they sit side by side in a native scroll-snap track (swipe, trackpad or the arrow
 * buttons), one per view, with a counter.
 */
export function Testimonial({ testimonials, labels, eyebrow, tone = 'dark' }: TestimonialProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [current, setCurrent] = useState(0)
  const reducedMotion = useReducedMotion()
  const carousel = testimonials.length > 1 && labels !== undefined

  const go = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const target = Math.max(0, Math.min(testimonials.length - 1, index))
    track.scrollTo({
      left: target * track.clientWidth,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  const quote = (testimonial: TestimonialData) => (
    <figure className="container-site grid gap-x-10 gap-y-8 lg:grid-cols-12">
      {eyebrow && <Eyebrow label={eyebrow} className="lg:col-span-2" />}
      <blockquote className="relative lg:col-span-9 lg:col-start-3">
        {/* Hangs just left of the first line on large screens, above it on small ones. */}
        <span
          aria-hidden="true"
          className="block h-[0.5em] font-display text-[6rem] leading-none text-accent lg:absolute lg:top-0 lg:right-full lg:mr-5 lg:h-auto lg:text-[5rem]"
        >
          “
        </span>
        <p className="font-display text-heading-xl lg:text-[clamp(2rem,1rem+2.6vw,3.75rem)]">
          {testimonial.quote}
        </p>
      </blockquote>
      <figcaption className="lg:col-span-9 lg:col-start-3">
        <QuoteCredit
          name={testimonial.name}
          role={testimonial.role}
          company={testimonial.company}
          logo={testimonial.logo}
          tone={tone}
        />
      </figcaption>
    </figure>
  )

  const [first] = testimonials
  if (!carousel) return first ? <Section tone={tone}>{quote(first)}</Section> : null

  return (
    <Section tone={tone}>
      <div role="region" aria-roledescription="carousel" aria-label={labels.carousel}>
        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain"
          onScroll={(event) => {
            const track = event.currentTarget
            setCurrent(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)))
          }}
        >
          {testimonials.map((testimonial, i) => (
            <li
              key={testimonial.id}
              role="group"
              aria-roledescription="slide"
              aria-label={labels.slide(i + 1, testimonials.length)}
              className="w-full shrink-0 snap-start"
            >
              {quote(testimonial)}
            </li>
          ))}
        </ul>
        <div className="container-site mt-10 grid gap-x-10 lg:grid-cols-12">
          <div className="flex items-center gap-3 lg:col-span-9 lg:col-start-3">
            {[
              { label: labels.previous, to: current - 1, disabled: current === 0, flip: true },
              {
                label: labels.next,
                to: current + 1,
                disabled: current === testimonials.length - 1,
                flip: false,
              },
            ].map((button) => (
              <button
                key={button.label}
                type="button"
                aria-label={button.label}
                disabled={button.disabled}
                onClick={() => go(button.to)}
                className="grid size-11 place-items-center rounded-pill border border-tone transition-colors duration-(--duration-micro) hover:border-(--tone-fg) disabled:opacity-35 disabled:hover:border-tone"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className={cn('size-4', button.flip && 'rotate-180')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            ))}
            <p className="ml-2 eyebrow numeric text-muted" aria-hidden="true">
              <span className="text-accent">{pad2(current + 1)}</span> / {pad2(testimonials.length)}
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
