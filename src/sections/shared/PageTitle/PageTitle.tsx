import type { ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { SectionIntro } from '@/types'

export interface PageTitleProps {
  content: SectionIntro
  tone?: Tone
  children?: ReactNode
}

/** Compact page heading; the dark inset reserves space for the fixed navigation. */
export function PageTitle({ content, tone = 'paper', children }: PageTitleProps) {
  return (
    <div className="bg-ink pt-(--spacing-header)">
      <Section as="header" tone={tone} spacing="none" className="py-8 md:pt-12">
        <div className="container-site">
          <Eyebrow label={content.eyebrow} className="mb-4" />
          <h1 className="max-w-[32ch] font-display text-heading-xl text-balance">
            {content.title}
          </h1>
          {content.intro && (
            <p className="mt-4 max-w-[65ch] text-body text-muted">{content.intro}</p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </Section>
    </div>
  )
}
