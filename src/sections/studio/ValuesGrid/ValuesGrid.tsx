import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { IllustrationScene } from '@/components/media/IllustrationScene'
import { Image } from '@/components/media/Image'
import { MediaReveal } from '@/components/media/MediaReveal'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import {
  SectionHeader,
  type SectionHeaderProps,
  type SectionHeaderVariant,
} from '@/sections/shared/SectionHeader'
import type { ImageAsset, SectionIntro, ValueItem } from '@/types'

export interface ValuesGridProps {
  /** The small eyebrow label is optional. */
  intro: Omit<SectionIntro, 'eyebrow'> & { eyebrow?: string }
  items: ValueItem[]
  index?: number
  /** Opener style; neighbouring sections must differ. */
  headerVariant?: SectionHeaderVariant
  /** Title size, e.g. to keep a `minimal` opener at display size. */
  titleSize?: SectionHeaderProps['size']
  /** Optional wide image between the heading and the list (its mask opens on enter). */
  image?: ImageAsset
  tone?: Tone
}

/**
 * Principles/values grid (used for "How we work" and "Values"). An optional image opens with a
 * clip reveal as it enters. Items are numbered, or lead with their icon in a small tile instead:
 * the icon assembles (IllustrationScene) as the list reaches the middle of the screen, one after
 * another, and the tile lifts and tilts on hover.
 */
export function ValuesGrid({
  intro,
  items,
  index,
  headerVariant = 'stacked',
  titleSize,
  image,
  tone = 'paper',
}: ValuesGridProps) {
  const headingId = useId()
  const cols = items.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  // With icons the list sits right under the title, so it has no rule above it.
  const hasIcons = items.some((item) => item.icon)
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
          size={titleSize}
        />
        {image && (
          <MediaReveal className="mt-14 aspect-video rounded-lg bg-tone-surface lg:aspect-[21/9]">
            <Image image={image} sizes="(min-width: 1700px) 1600px, 94vw" />
          </MediaReveal>
        )}
        <ol
          className={cn(
            'grid gap-px border-tone md:grid-cols-2',
            hasIcons ? 'mt-4 border-b' : 'mt-10 border-y',
            cols,
          )}
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className="group border-tone py-10 md:pr-10 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              {item.icon ? (
                // The art sits inset in its square, so the scene is larger than the tile and
                // centred on it: the drawing fills the tile whatever its padding.
                <div className="relative size-20 rounded-lg border border-tone bg-tone-surface transition-transform duration-(--duration-fast) ease-(--ease-out-expo) group-hover:-translate-y-1 group-hover:-rotate-3 motion-reduce:transition-none">
                  <div className="absolute top-1/2 left-1/2 size-28 -translate-1/2">
                    <IllustrationScene scene={item.icon} sizes="7rem" delay={i * 0.15} />
                  </div>
                </div>
              ) : (
                <p className="eyebrow text-accent">{pad2(i + 1)}</p>
              )}
              <h3 className="mt-6 text-heading-lg">{item.title}</h3>
              <p className="mt-3 text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
