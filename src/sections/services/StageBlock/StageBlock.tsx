import type { ReactNode } from 'react'
import { ServiceMedia } from '@/components/media/ServiceMedia'
import { MediaReveal } from '@/components/media/MediaReveal'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { cn } from '@/lib/cn'
import type { OfferRow } from '@/lib/offer'
import { OfferAccordion } from '@/sections/services/OfferAccordion'
import type { CtaLink, ImageAsset } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'

/**
 * How a group is laid out, chosen for what it sells so the page doesn't repeat itself:
 * - `feature`: the intro beside a wide image, then the offerings as dropdowns.
 * - `cards`: intro and a banner image, then the offerings side by side as cards.
 * - `split`: the image in its own column beside a compact list (plans).
 * - `figures`: the intro and illustration above the improvement details.
 * Give every group a different layout.
 */
export type StageLayout = 'feature' | 'cards' | 'split' | 'figures'

export interface StageBlockProps {
  id: string
  name: string
  /** One short line under the name: the whole pitch (no paragraph). */
  line: string
  rows: OfferRow[]
  /** Group-level notes, e.g. "Hosting-only available on request." */
  notes?: string[]
  cta: CtaLink
  labels: { includes: string }
  /** The group's image (and loop). Loops only play while on screen. */
  media?: ServiceMediaItem
  illustration?: ImageAsset
  layout?: StageLayout
}

/** One group of offerings: number, name and line, its image, the offerings and a pre-filled CTA. */
export function StageBlock({
  id,
  name,
  line,
  rows,
  notes = [],
  cta,
  labels,
  media,
  illustration,
  layout = 'feature',
}: StageBlockProps) {
  const headingId = `${id}-heading`

  const intro = (
    <div>
      <Heading id={headingId} size="display-lg" compile>
        {name}
      </Heading>
      <p
        className={cn(
          'mt-4 text-heading-lg text-muted',
          layout === 'figures' ? 'max-w-[34ch] border-l-2 border-orange pl-5' : 'max-w-[30ch]',
        )}
      >
        {line}
      </p>
    </div>
  )

  const image = (className: string, sizes: string) =>
    media && (
      <MediaReveal className={cn('relative rounded-lg bg-tone-surface', className)}>
        <ServiceMedia item={media} active paused={false} sizes={sizes} />
      </MediaReveal>
    )

  const offerings: Record<StageLayout, () => ReactNode> = {
    feature: () => <OfferAccordion rows={rows} includesLabel={labels.includes} />,

    cards: () => (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((row) => (
          <li key={row.id} className="flex flex-col gap-4 rounded-lg border border-tone p-6">
            <div>
              <h3 className="text-heading-md">{row.name}</h3>
              {row.price && <p className="mt-2 numeric text-small text-accent">{row.price}</p>}
            </div>
            <p className="text-small text-muted">{row.summary}</p>
            {row.notes.length > 0 && (
              <p className="mt-auto text-small text-muted">{row.notes.join(' ')}</p>
            )}
          </li>
        ))}
      </ul>
    ),

    split: () => (
      <ul className="divide-y divide-(--tone-border) border-y border-tone">
        {rows.map((row) => (
          <li key={row.id} className="grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-8">
            <h3 className="text-heading-md">{row.name}</h3>
            {row.price && (
              <p className="numeric text-small sm:row-span-2 sm:pt-1 sm:text-right">{row.price}</p>
            )}
            <p className="text-small text-muted sm:col-start-1">
              {row.summary}
              {row.notes.length > 0 && ` · ${row.notes.join(' · ')}`}
            </p>
          </li>
        ))}
      </ul>
    ),

    figures: () => (
      <ul className="divide-y divide-(--tone-border) border-y border-tone">
        {rows.map((row) => (
          <li key={row.id} className="grid gap-x-12 gap-y-6 py-8 md:grid-cols-12 md:py-10">
            <div className="md:col-span-4">
              <h3 className="text-heading-lg">{row.name}</h3>
              {row.price && <p className="mt-4 numeric text-display-lg text-accent">{row.price}</p>}
            </div>
            <div className="md:col-span-8">
              <p className="max-w-[56ch] text-body-lg text-muted">{row.summary}</p>
              {row.examples.length > 0 && (
                <ul className="mt-8 grid gap-x-8 gap-y-3 border-t border-tone pt-6 text-small sm:grid-cols-2">
                  {row.examples.map((example) => (
                    <li key={example} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
                      {example}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    ),
  }

  const footer = (nested = false) => (
    <>
      {notes.length > 0 && (
        <div
          className={cn(
            'space-y-1 text-muted',
            nested
              ? 'mt-8 max-w-[38ch] border-l-2 border-orange py-1 pl-4 text-small'
              : 'mt-6 text-small',
          )}
        >
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}
      <Button
        to={cta.to}
        withArrow
        className={nested ? 'mt-8' : 'mt-10'}
        analytics={
          cta.to.startsWith('/start')
            ? { event: 'Start project click', props: { location: `services-stage:${id}` } }
            : undefined
        }
      >
        {cta.label}
      </Button>
    </>
  )

  return (
    <section id={id} aria-labelledby={headingId} className="pt-12 pb-16 first:pt-0 md:pb-20">
      {layout === 'feature' && (
        <>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {intro}
            {image('aspect-4/3', '(min-width: 768px) 45vw, 100vw')}
          </div>
          <div className="mt-12">{offerings.feature()}</div>
        </>
      )}

      {layout === 'cards' && (
        <>
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-5">{intro}</div>
            {image('aspect-video md:col-span-7 md:aspect-[21/9]', '(min-width: 768px) 55vw, 100vw')}
          </div>
          <div className="mt-10">{offerings.cards()}</div>
        </>
      )}

      {layout === 'split' && (
        <div className="grid gap-10 md:grid-cols-12">
          {image(
            'aspect-video md:col-span-5 md:aspect-4/5 md:self-start',
            '(min-width: 768px) 40vw, 100vw',
          )}
          <div className="md:col-span-7">
            {intro}
            <div className="mt-10">{offerings.split()}</div>
          </div>
        </div>
      )}

      {layout === 'figures' && (
        <>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              {intro}
              {footer(true)}
            </div>
            {illustration && (
              <MediaReveal className="w-full md:col-span-7">
                <img
                  src={illustration.src}
                  width={illustration.width}
                  height={illustration.height}
                  alt={illustration.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </MediaReveal>
            )}
          </div>
          <div className="mt-12 md:mt-16">{offerings.figures()}</div>
        </>
      )}

      {layout !== 'figures' && footer()}
    </section>
  )
}
