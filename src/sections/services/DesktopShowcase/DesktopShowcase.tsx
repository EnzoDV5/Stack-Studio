import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { ImageSequence } from '@/components/media/ImageSequence'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { laptopOpen } from '@/lib/motion-tokens'
import type { OfferRow } from '@/lib/offer'
import { OfferAccordion } from '@/sections/services/OfferAccordion'
import type { CtaLink, ImageSequenceAsset } from '@/types'
import styles from './DesktopShowcase.module.css'

export interface DesktopShowcaseProps {
  id?: string
  eyebrow: string
  /** Number shown in the eyebrow (the group's place on the page). */
  index?: number
  title: string
  intro: string
  /** The desktop offerings, as dropdowns under the laptop. */
  rows: OfferRow[]
  includesLabel: string
  cta: CtaLink
  /** The laptop opening, with a desktop app on screen. */
  laptop: ImageSequenceAsset
  tone?: Tone
}

/**
 * Desktop software: a centred opener, a large laptop, then the offerings. Signature motion (an
 * enter, played once on a timer; the phone turn before it is the scrub): when the laptop is
 * well on screen, its lid lifts, the display wakes on a desktop app and it turns to face the
 * visitor. Reduced motion: the laptop open, still.
 */
export function DesktopShowcase({
  id,
  eyebrow,
  index,
  title,
  intro,
  rows,
  includesLabel,
  cta,
  laptop,
  tone = 'dark',
}: DesktopShowcaseProps) {
  const headingId = useId()
  return (
    <Section id={id} tone={tone} aria-labelledby={headingId} className="overflow-hidden">
      <div className="container-site">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Eyebrow index={index} label={eyebrow} className="mb-6 justify-center" />
          <Heading id={headingId} size="display-lg" compile>
            {title}
          </Heading>
          <p className="mt-6 max-w-[46ch] text-body-lg text-muted">{intro}</p>
        </div>

        <div className={styles.stage}>
          <ImageSequence
            sequence={laptop}
            play={laptopOpen}
            sizes="(min-width: 1024px) 64rem, 100vw"
            // Wider than the column on phones: the frame's empty sides fall outside it, so the
            // laptop itself fills the width.
            className="relative -mx-[20%] w-[140%] max-w-none md:mx-auto md:w-full md:max-w-5xl"
          />
        </div>

        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
          <OfferAccordion rows={rows} includesLabel={includesLabel} />
          <Button
            to={cta.to}
            withArrow
            className="self-start"
            analytics={{ event: 'Start project click', props: { location: 'services-desktop' } }}
          >
            {cta.label}
          </Button>
        </div>
      </div>
    </Section>
  )
}
