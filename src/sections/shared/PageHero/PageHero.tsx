import type { ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { PageHeroContent } from '@/types'

export interface PageHeroProps {
  content: PageHeroContent
  tone?: Tone
  /** Extra content under the intro (filters, meta, buttons). */
  children?: ReactNode
}

/** Inner-page opener: eyebrow, oversized h1 with an intro line reveal, and an intro paragraph. */
export function PageHero({ content, tone = 'dark', children }: PageHeroProps) {
  return (
    <Section
      as="header"
      tone={tone}
      grid="bottom"
      spacing="none"
      className="pt-[calc(var(--spacing-header)+clamp(4rem,10vw,9rem))] pb-section-sm"
    >
      <div className="container-site">
        <Eyebrow label={content.eyebrow} className="mb-8" />
        <SplitReveal as="h1" trigger="intro" className="max-w-[14ch] text-display-xl font-display">
          {content.title}
        </SplitReveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <p className="max-w-[52ch] text-body-lg text-muted lg:col-span-6 lg:col-start-7">
            {content.intro}
          </p>
        </div>
        {children && <div className="mt-12">{children}</div>}
      </div>
    </Section>
  )
}
