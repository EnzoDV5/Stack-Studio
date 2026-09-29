import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { ImageSequence } from '@/components/media/ImageSequence'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import type { ImageSequenceAsset } from '@/types'
import styles from './CasePhone.module.css'

export interface CasePhoneProps {
  eyebrow: string
  title: string
  intro: string
  /** The phone turn, with the project's mobile site on screen. */
  phone: ImageSequenceAsset
  tone?: Tone
}

/**
 * The project on a phone, late in the case study (the laptop in CaseDevice shows it on
 * desktop). Signature motion (scrubbed, not pinned): as the phone scrolls up through the
 * view it turns from its back, through its side, to face the visitor with the site on
 * screen, like a product turn on Apple's pages. Reduced motion: the finished pose, still.
 */
export function CasePhone({ eyebrow, title, intro, phone, tone = 'dark' }: CasePhoneProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId} className="overflow-hidden">
      <div className="container-site grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Eyebrow label={eyebrow} className="mb-6" />
          <Heading id={headingId} size="display-lg" compile className="max-w-[12ch]">
            {title}
          </Heading>
          <p className="mt-8 max-w-[42ch] text-body-lg text-muted">{intro}</p>
        </div>
        <div className={styles.stage}>
          <ImageSequence
            sequence={phone}
            sizes="(min-width: 768px) 34rem, 80vw"
            className="relative mx-auto w-full max-w-[34rem]"
          />
        </div>
      </div>
    </Section>
  )
}
