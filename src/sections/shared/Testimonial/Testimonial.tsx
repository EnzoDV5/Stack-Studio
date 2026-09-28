import { Section, type Tone } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { Testimonial as TestimonialData } from '@/types'

export interface TestimonialProps {
  testimonial: TestimonialData
  eyebrow?: string
  tone?: Tone
}

/** One big client quote. Static: on inner pages only the page title may reveal. */
export function Testimonial({ testimonial, eyebrow, tone = 'paper' }: TestimonialProps) {
  const initials = testimonial.company
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

  return (
    <Section tone={tone}>
      <figure className="container-site grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-2">
          {eyebrow && <Eyebrow label={eyebrow} />}
          <span
            aria-hidden="true"
            className="mt-6 block font-display text-[6rem] leading-none text-accent"
          >
            “
          </span>
        </div>
        <blockquote className="lg:col-span-9">
          <p className="font-display text-heading-xl lg:text-[clamp(2rem,1rem+2.6vw,3.75rem)]">
            {testimonial.quote}
          </p>
        </blockquote>
        <figcaption className="flex items-center gap-4 lg:col-span-9 lg:col-start-3">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-pill bg-ink font-mono text-small text-paper"
          >
            {initials}
          </span>
          <span>
            <span className="block font-semibold">{testimonial.name}</span>
            <span className="block text-small text-muted">
              {testimonial.role}, {testimonial.company}
            </span>
          </span>
        </figcaption>
      </figure>
    </Section>
  )
}
