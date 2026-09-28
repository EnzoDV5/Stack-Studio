import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { MediaReveal } from '@/components/media/MediaReveal'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { SectionHeader, type SectionHeaderVariant } from '@/sections/shared/SectionHeader'
import type { ImageAsset, SectionIntro, ValueItem } from '@/types'

export interface ValuesGridProps {
  intro: SectionIntro
  items: ValueItem[]
  index?: number
  /** Opener style; neighbouring sections must differ. */
  headerVariant?: SectionHeaderVariant
  /** Optional wide image between the heading and the list (its mask opens on enter). */
  image?: ImageAsset
  tone?: Tone
}

/**
 * Numbered principles/values grid (used for "How we work" and "Values"). The list is static;
 * an optional image opens with a clip reveal as it enters.
 */
export function ValuesGrid({
  intro,
  items,
  index,
  headerVariant = 'stacked',
  image,
  tone = 'paper',
}: ValuesGridProps) {
  const headingId = useId()
  const cols = items.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  return (
    <Section tone={tone} grid aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant={headerVariant}
          index={index}
          eyebrow={intro.eyebrow}
          title={intro.title}
          intro={intro.intro}
        />
        {image && (
          <MediaReveal className="mt-14 aspect-video rounded-lg bg-tone-surface lg:aspect-[21/9]">
            <Image image={image} sizes="(min-width: 1600px) 1600px, 100vw" />
          </MediaReveal>
        )}
        <ol className={cn('mt-16 grid gap-px border-y border-tone md:grid-cols-2', cols)}>
          {items.map((item, i) => (
            <li
              key={item.id}
              className="border-tone py-10 md:pr-10 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <p className="eyebrow text-accent">{pad2(i + 1)}</p>
              <h3 className="mt-6 text-heading-lg">{item.title}</h3>
              <p className="mt-3 text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
