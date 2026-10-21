import type { ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { MaskedHeading } from '@/components/motion/MaskedHeading'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'
import type { SectionIntro } from '@/types'

export interface PageTitleProps {
  content: SectionIntro
  tone?: Tone
  children?: ReactNode
  /** Right-hand slot beside the title on large screens, below it on small ones (e.g. a logo). */
  aside?: ReactNode
  /**
   * Where the aside sits on large screens: `edge` at the right edge, level with the bottom of
   * the text (a logo), or `beside` right next to the text, centred on it (an illustration).
   */
  asidePlacement?: 'edge' | 'beside'
}

/**
 * Compact page heading; the dark inset reserves space for the fixed navigation. Solid, so it
 * keeps its own tone over the inset while the rest of the page tone flows. The h1 compiles
 * from code as soon as the preloader or page wipe lifts, like every section title.
 */
export function PageTitle({
  content,
  tone = 'dark',
  children,
  aside,
  asidePlacement = 'edge',
}: PageTitleProps) {
  return (
    <div className="bg-ink pt-(--spacing-header)">
      <Section as="header" tone={tone} solid spacing="none" className="py-8 md:pt-12">
        <div
          className={cn(
            'container-site',
            Boolean(aside) && 'flex flex-col gap-8 lg:flex-row',
            Boolean(aside) &&
              (asidePlacement === 'edge'
                ? 'lg:items-end lg:justify-between lg:gap-12'
                : 'lg:items-center lg:gap-16 xl:gap-24'),
          )}
        >
          <div className="min-w-0">
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
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </Section>
    </div>
  )
}
