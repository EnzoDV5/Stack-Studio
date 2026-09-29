import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { ImageSequence } from '@/components/media/ImageSequence'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading } from '@/components/ui/Heading'
import { Tag } from '@/components/ui/Tag'
import type { CtaLink, ImageSequenceAsset } from '@/types'
import styles from './AppShowcase.module.css'

export interface AppShowcaseProps {
  eyebrow: string
  title: string
  intro: string
  /** The kinds of apps, shown as tags (e.g. "Client portals"). */
  kinds: string[]
  cta: CtaLink
  /** The phone turn, with an app on screen. */
  phone: ImageSequenceAsset
  tone?: Tone
}

/**
 * Apps and software, beyond websites. Signature motion (scrubbed, not pinned: ProcessPinned
 * follows): as the phone scrolls up through the view it turns from its back, through its
 * side, to face the visitor with an app on screen, like a product turn on Apple's pages.
 * Reduced motion: the finished pose, still.
 */
export function AppShowcase({
  eyebrow,
  title,
  intro,
  kinds,
  cta,
  phone,
  tone = 'dark',
}: AppShowcaseProps) {
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
          <ul className="mt-8 flex flex-wrap gap-2">
            {kinds.map((kind) => (
              <li key={kind}>
                <Tag>{kind}</Tag>
              </li>
            ))}
          </ul>
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
