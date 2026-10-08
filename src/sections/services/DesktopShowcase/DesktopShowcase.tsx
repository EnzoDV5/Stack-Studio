import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { ImageSequence } from '@/components/media/ImageSequence'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { laptopTurn } from '@/lib/motion-tokens'
import type { OfferRow } from '@/lib/offer'
import { OfferAccordion } from '@/sections/services/OfferAccordion'
import type { CtaLink, ImageSequenceAsset } from '@/types'
import styles from './DesktopShowcase.module.css'

export interface DesktopShowcaseProps {
  id?: string
  /** Optional small label above the title. */
  eyebrow?: string
  /** Number shown in the eyebrow (the group's place on the page). */
  index?: number
  title: string
  intro: string
  /** The desktop offerings, as dropdowns beside the laptop. */
  rows: OfferRow[]
  includesLabel: string
  cta: CtaLink
  /** The laptop opening, with a desktop app on screen. */
  laptop: ImageSequenceAsset
  tone?: Tone
}

/**
 * Desktop software: a large laptop on the left (it runs off the page edge), the copy and
 * offerings on the right: the mirror of the phone section above it. Signature motion
 * (scrubbed): as it scrolls through the view the lid lifts from shut, the display wakes on a
 * desktop app and the laptop turns to face the copy. Reduced motion: the laptop open, still.
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
      <div className="container-site grid items-center gap-10 md:grid-cols-12 md:gap-8">
        <div className={styles.stage}>
          <ImageSequence
            sequence={laptop}
            scroll={laptopTurn}
            sizes="(min-width: 768px) 62vw, 120vw"
            className="relative w-full"
          />
        </div>

        <div className="md:col-span-5 md:col-start-8">
          {eyebrow && <Eyebrow index={index} label={eyebrow} className="mb-6" />}
          <Heading id={headingId} size="display-lg" compile className="max-w-[12ch]">
            {title}
          </Heading>
          <p className="mt-6 max-w-[40ch] text-body-lg text-muted">{intro}</p>
          <OfferAccordion rows={rows} includesLabel={includesLabel} size="md" className="mt-10" />
          <Button
            to={cta.to}
            withArrow
            className="mt-10"
            analytics={{ event: 'Start project click', props: { location: 'services-desktop' } }}
          >
            {cta.label}
          </Button>
        </div>
      </div>
    </Section>
  )
}
