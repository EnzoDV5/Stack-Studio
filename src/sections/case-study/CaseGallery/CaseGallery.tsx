import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { MediaReveal } from '@/components/media/MediaReveal'
import { cn } from '@/lib/cn'
import type { GalleryItem } from '@/types'

export interface CaseGalleryProps {
  label: string
  items: GalleryItem[]
  tone?: Tone
}

/** Full and half-width images; each mask opens as it scrolls in. */
export function CaseGallery({ label, items, tone = 'dark' }: CaseGalleryProps) {
  return (
    <Section tone={tone} aria-label={label}>
      <ul className="container-site grid gap-6 md:grid-cols-2 md:gap-8">
        {items.map((item) => (
          <li key={item.src} className={cn(item.span === 'full' && 'md:col-span-2')}>
            <figure>
              <MediaReveal
                className={cn('bg-ink-700', item.span === 'full' ? 'aspect-video' : 'aspect-4/5')}
              >
                <Image
                  image={item}
                  sizes={item.span === 'full' ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                />
              </MediaReveal>
              {item.caption && (
                <figcaption className="mt-4 eyebrow text-muted">{item.caption}</figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  )
}
