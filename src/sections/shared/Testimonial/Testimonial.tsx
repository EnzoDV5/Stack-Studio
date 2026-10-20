import { Section, type Tone } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { QuoteCredit } from '@/sections/shared/QuoteCredit'
import type { Testimonial as TestimonialData } from '@/types'

export interface TestimonialProps {
  testimonial: TestimonialData
  eyebrow?: string
  tone?: Tone
}

/** One big client quote. Static: on inner pages only the page title may reveal. */
export function Testimonial({ testimonial, eyebrow, tone = 'paper' }: TestimonialProps) {
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
    </Section>
  )
}
