import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Accordion } from '@/components/ui/Accordion'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import type { Faq, SectionIntro } from '@/types'

export interface FaqSectionProps {
  intro: SectionIntro
  faqs: Faq[]
  index?: number
  tone?: Tone
}

/** Sticky heading on the left, accordion of questions on the right. */
export function FaqSection({ intro, faqs, index, tone = 'paper' }: FaqSectionProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
            <Eyebrow label={intro.eyebrow} index={index} className="mb-6" />
            <Heading id={headingId} size="heading-xl" compile>
              {intro.title}
            </Heading>
            {intro.intro && <p className="mt-5 text-muted">{intro.intro}</p>}
          </div>
        </div>
        <Accordion
          className="lg:col-span-7 lg:col-start-6"
          headingLevel="h3"
          titleClassName="text-heading-md"
          items={faqs.map((faq) => ({
            id: faq.id,
            title: faq.question,
            content: <p className="max-w-[60ch] text-muted">{faq.answer}</p>,
          }))}
        />
      </div>
    </Section>
  )
}
