import type { ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { SectionIntro } from '@/types'

export interface PageTitleProps {
  content: SectionIntro
  tone?: Tone
  children?: ReactNode
  /**
   * Line-reveal the h1 once the page wipe lifts. Inner pages may reveal their title and
   * nothing else (docs/motion-map.md); off by default.
   */
  reveal?: boolean
}

/**
 * Compact page heading; the dark inset reserves space for the fixed navigation. Solid, so it
 * keeps its own tone over the inset while the rest of the page tone flows.
 */
export function PageTitle({ content, tone = 'paper', children, reveal = false }: PageTitleProps) {
  const titleClass = 'max-w-[32ch] font-display text-heading-xl text-balance'
  return (
    <div className="bg-ink pt-(--spacing-header)">
      <Section as="header" tone={tone} solid spacing="none" className="py-8 md:pt-12">
        <div className="container-site">
          <Eyebrow label={content.eyebrow} className="mb-4" />
          {reveal ? (
            <SplitReveal as="h1" trigger="intro" className={titleClass}>
              {content.title}
            </SplitReveal>
          ) : (
            <h1 className={titleClass}>{content.title}</h1>
          )}
          {content.intro && (
            <p className="mt-4 max-w-[65ch] text-body text-muted">{content.intro}</p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </Section>
    </div>
  )
}
