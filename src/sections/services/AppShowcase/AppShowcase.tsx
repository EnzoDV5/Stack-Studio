import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { ImageSequence } from '@/components/media/ImageSequence'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import type { OfferRow } from '@/lib/offer'
import { OfferAccordion } from '@/sections/services/OfferAccordion'
import type { CtaLink, ImageSequenceAsset } from '@/types'
import styles from './AppShowcase.module.css'

export interface AppShowcaseProps {
  id?: string
  eyebrow: string
  /** Number shown in the eyebrow (the group's place on the page). */
  index?: number
  title: string
  intro: string
  /** The app and software offerings, as dropdowns. */
  rows: OfferRow[]
  includesLabel: string
  cta: CtaLink
  /** The phone turn, with an app on screen. */
  phone: ImageSequenceAsset
  tone?: Tone
}

/**
 * Apps and software: the Build offerings beyond websites, as dropdowns beside the phone.
 * Signature motion (scrubbed, not pinned): as the phone
 * scrolls up through the view it turns from its back to face the visitor with an app on
 * screen. Reduced motion: the finished pose, still.
 */
export function AppShowcase({
  id,
  eyebrow,
  index,
  title,
  intro,
  rows,
  includesLabel,
  cta,
  phone,
  tone = 'dark',
}: AppShowcaseProps) {
  const headingId = useId()
  return (
    <Section id={id} tone={tone} aria-labelledby={headingId} className="overflow-hidden">
      <div className="container-site grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Eyebrow index={index} label={eyebrow} className="mb-6" />
          <Heading id={headingId} size="display-lg" compile className="max-w-[12ch]">
            {title}
          </Heading>
          <p className="mt-6 max-w-[40ch] text-body-lg text-muted">{intro}</p>
          <OfferAccordion rows={rows} includesLabel={includesLabel} size="md" className="mt-10" />
          <Button
            to={cta.to}
            withArrow
            className="mt-10"
            analytics={{ event: 'Start project click', props: { location: 'services-apps' } }}
          >
            {cta.label}
          </Button>
        </div>
        <div className={styles.stage}>
          <ImageSequence
            sequence={phone}
            sizes="(min-width: 768px) 34rem, 80vw"
            className="relative mx-auto w-full max-w-136"
          />
        </div>
      </div>
    </Section>
  )
}
