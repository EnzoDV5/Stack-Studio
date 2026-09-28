import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { MacbookScroll } from '@/components/media/MacbookScroll'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { ImageAsset } from '@/types'

export interface CaseDeviceProps {
  eyebrow: string
  title: string
  /** A desktop screenshot of the project's site. */
  screen: ImageAsset
  tone?: Tone
}

/**
 * The project's site on a laptop, under the case study meta. Signature motion (the page's
 * one pin, scrubbed): the screen swings up from the lid and grows until the site fills the
 * view. See MacbookScroll.
 */
export function CaseDevice({ eyebrow, title, screen, tone = 'dark' }: CaseDeviceProps) {
  const headingId = useId()
  return (
    <Section tone={tone} spacing="none" aria-labelledby={headingId}>
      <MacbookScroll
        image={screen}
        priority
        className="py-section-sm"
        title={
          <>
            <Eyebrow label={eyebrow} className="mb-4 justify-center" />
            <h2 id={headingId} className="font-display text-heading-xl">
              {title}
            </h2>
          </>
        }
      />
    </Section>
  )
}
