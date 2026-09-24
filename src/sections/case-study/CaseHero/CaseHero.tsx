import { Section } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { Video } from '@/components/media/Video'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Tag } from '@/components/ui/Tag'
import type { MediaSlot } from '@/types'

export interface CaseHeroProps {
  eyebrow: string
  title: string
  summary: string
  media: MediaSlot
  /** Shown as a notice for clearly-fake sample projects. */
  sampleNotice?: string
}

/** Case study opener: title reveal, one-line summary, then full-bleed hero media (LCP). */
export function CaseHero({ eyebrow, title, summary, media, sampleNotice }: CaseHeroProps) {
  return (
    <Section
      as="header"
      tone="dark"
      spacing="none"
      grid="bottom"
      className="pt-[calc(var(--spacing-header)+clamp(3rem,8vw,7rem))]"
    >
      <div className="container-site pb-14 md:pb-20">
        <Eyebrow label={eyebrow} className="mb-8" />
        <SplitReveal as="h1" trigger="intro" className="max-w-[14ch] font-display text-display-xl">
          {title}
        </SplitReveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <p className="max-w-[48ch] text-body-lg text-muted lg:col-span-6 lg:col-start-7">
            {summary}
          </p>
          {sampleNotice && (
            <div className="lg:col-span-6 lg:col-start-7">
              <Tag variant="accent">{sampleNotice}</Tag>
            </div>
          )}
        </div>
      </div>
      <div className="relative aspect-video max-h-[88svh] w-full overflow-hidden bg-ink-700">
        {media.video ? (
          <Video video={{ ...media.video, poster: media.image }} priority className="size-full" />
        ) : (
          <Image image={media.image} priority />
        )}
      </div>
    </Section>
  )
}
