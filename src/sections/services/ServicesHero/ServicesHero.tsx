import { Section } from '@/components/layout/Section'
import { MaskedHeading } from '@/components/motion/MaskedHeading'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { PageHeroContent } from '@/types'

/** A clearer opening for Services, with the question as the main visual. */
export function ServicesHero({ content }: { content: PageHeroContent }) {
  return (
    <div className="bg-ink pt-(--spacing-header)">
      <Section as="header" tone="paper" solid spacing="none" className="py-8 md:pt-12 md:pb-10">
        <div className="container-site grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] lg:items-end lg:gap-14">
          <div>
            <Eyebrow label={content.eyebrow} className="mb-4" />
            <MaskedHeading
              as="h1"
              trigger="intro"
              text={content.title}
              className="max-w-[32ch] font-display text-heading-xl"
            />
          </div>
          {content.intro && (
            <p className="border-l-2 border-orange pl-5 text-body text-muted lg:mb-1">
              {content.intro}
            </p>
          )}
        </div>
      </Section>
    </div>
  )
}
