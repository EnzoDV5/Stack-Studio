import type { ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { MaskedHeading } from '@/components/motion/MaskedHeading'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { SectionIntro } from '@/types'

export interface PageTitleProps {
  content: SectionIntro
  tone?: Tone
  children?: ReactNode
}

/**
 * Compact page heading; the dark inset reserves space for the fixed navigation. Solid, so it
 * keeps its own tone over the inset while the rest of the page tone flows. The h1 compiles
 * from code as soon as the preloader or page wipe lifts, like every section title.
 */
export function PageTitle({ content, tone = 'paper', children }: PageTitleProps) {
  return (
    <div className="bg-ink pt-(--spacing-header)">
      <Section as="header" tone={tone} solid spacing="none" className="py-8 md:pt-12">
        <div className="container-site">
          <Eyebrow label={content.eyebrow} className="mb-4" />
          <MaskedHeading
            as="h1"
            trigger="intro"
            text={content.title}
            className="max-w-[32ch] font-display text-heading-xl"
          />
          {content.intro && (
            <p className="mt-4 max-w-[65ch] text-body text-muted">{content.intro}</p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </Section>
    </div>
  )
}
