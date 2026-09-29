import type { CSSProperties, ReactNode } from 'react'
import { ServiceMedia } from '@/components/media/ServiceMedia'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/ui/Heading'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import type { OfferRow } from '@/lib/offer'
import type { CtaLink } from '@/types'
import type { ServiceMediaItem } from '@/types/service-media'

/**
 * How a stage is laid out, chosen for what it sells so the page doesn't repeat itself:
 * - `feature`: text beside a tall image, then expandable offerings (many offerings).
 * - `cards`: a wide image, then the offerings as cards (a handful of distinct offerings).
 * - `split`: the image in its own column beside a compact priced list (plans).
 * - `tiers`: an opening image, then the offerings side by side as tiers (bundles of hours).
 * - `figures`: text and a smaller image beside the offerings as large figures (hourly rates).
 * Give every stage a different layout.
 */
export type StageLayout = 'feature' | 'cards' | 'split' | 'tiers' | 'figures'

export interface StageBlockProps {
  id: string
  index: number
  name: string
  line: string
  summary: string
  rows: OfferRow[]
  /** Stage-level notes, e.g. "Hosting-only available on request." */
  notes?: string[]
  cta: CtaLink
  labels: { includes: string; examples: string }
  /** The stage's image (and loop, for Run and Partner). Loops only play while on screen. */
  media?: ServiceMediaItem
  layout?: StageLayout
}

/** One stage: number, name and line, summary, the stage image, its offerings and a pre-filled CTA. */
export function StageBlock({
  id,
  index,
  name,
  line,
  summary,
  rows,
  notes = [],
  cta,
  labels,
  media,
  layout = 'feature',
}: StageBlockProps) {
  const headingId = `${id}-heading`

  const intro = (
    <div>
      <p className="mb-5 eyebrow text-accent">{pad2(index)}</p>
      <Heading id={headingId} size="display-lg" compile>
        {name}
      </Heading>
      <p className="mt-3 text-heading-lg text-muted">{line}</p>
      <p className="mt-6 max-w-[56ch] text-body-lg">{summary}</p>
    </div>
  )

  const image = (className: string, sizes: string) =>
    media && (
      <div className={cn('relative overflow-hidden rounded-lg bg-tone-surface', className)}>
        <ServiceMedia item={media} active paused={false} sizes={sizes} />
      </div>
    )

  const bullets = (items: string[]) => (
    <ul className="space-y-2 text-small">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
          {item}
        </li>
      ))}
    </ul>
  )

  const tags = (items: string[]) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </div>
  )

  const offerings: Record<StageLayout, () => ReactNode> = {
    feature: () => (
      <Accordion
        headingLevel="h3"
        titleClassName="text-heading-lg"
        items={rows.map((row) => ({
          id: row.id,
          title: row.name,
          meta: row.price,
          content: (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="numeric text-heading-md sm:hidden">{row.price}</p>
                <p className="mt-2 text-body-lg sm:mt-0">{row.summary}</p>
                {row.notes.length > 0 && (
                  <ul className="mt-4 space-y-1 text-small text-muted">
                    {row.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                )}
                {row.examples.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-3 eyebrow text-muted">{labels.examples}</p>
                    {tags(row.examples)}
                  </div>
                )}
              </div>
              {row.includes.length > 0 && (
                <div>
                  <p className="mb-3 eyebrow text-muted">{labels.includes}</p>
                  {bullets(row.includes)}
                </div>
              )}
            </div>
          ),
        }))}
      />
    ),

    cards: () => (
      <ul className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-5 rounded-lg border border-tone bg-tone-surface p-6 md:p-7"
          >
            <div>
              <h3 className="text-heading-lg">{row.name}</h3>
              <p className="mt-2 numeric text-small text-accent">{row.price}</p>
            </div>
            <p className="text-muted">{row.summary}</p>
            {row.includes.length > 0 && bullets(row.includes.slice(0, 4))}
            {row.examples.length > 0 && tags(row.examples.slice(0, 5))}
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
            <p className="numeric text-small sm:row-span-2 sm:pt-1 sm:text-right">{row.price}</p>
            <p className="text-small text-muted">
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
          <li key={row.id} className="py-7">
            <h3 className="eyebrow text-muted">{row.name}</h3>
            <p className="mt-3 numeric text-heading-xl">{row.price}</p>
            <p className="mt-3 text-small text-muted">{row.summary}</p>
            {row.examples.length > 0 && (
              <div className="mt-4">{tags(row.examples.slice(0, 4))}</div>
            )}
          </li>
        ))}
      </ul>
    ),

    tiers: () => (
      <ol
        className="grid gap-px overflow-hidden rounded-lg border border-tone bg-(--tone-border) md:grid-cols-(--tiers)"
        style={{ '--tiers': `repeat(${rows.length}, minmax(0, 1fr))` } as CSSProperties}
      >
        {rows.map((row) => (
          <li key={row.id} className="flex flex-col gap-5 bg-(--tone-bg) p-6 md:p-7">
            <h3 className="text-heading-lg">{row.name}</h3>
            <p className="numeric text-heading-lg">{row.price}</p>
            {row.notes.length > 0 && <p className="eyebrow text-muted">{row.notes.join(' ')}</p>}
            <p className="text-small text-muted">{row.summary}</p>
            {row.includes.length > 0 && bullets(row.includes.slice(0, 5))}
          </li>
        ))}
      </ol>
    ),
  }

  const footer = (
    <>
      {notes.length > 0 && (
        <div className="mt-6 space-y-1 text-small text-muted">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}
      <Button
        to={cta.to}
        withArrow
        className="mt-10"
        analytics={{ event: 'Start project click', props: { location: `services-stage:${id}` } }}
      >
        {cta.label}
      </Button>
    </>
  )

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="border-t border-tone pt-12 pb-20 first:border-t-0 first:pt-0"
    >
      {layout === 'feature' && (
        <>
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            {intro}
            {image('aspect-4/5', '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw')}
          </div>
          <div className="mt-12">{offerings.feature()}</div>
        </>
      )}

      {layout === 'cards' && (
        <>
          {intro}
          {image('mt-10 aspect-video sm:aspect-[21/9]', '(min-width: 1024px) 60vw, 100vw')}
          <div className="mt-10">{offerings.cards()}</div>
        </>
      )}

      {layout === 'split' && (
        <div className="grid gap-10 md:grid-cols-5">
          {image(
            'aspect-video md:sticky md:top-[calc(var(--spacing-header)+2rem)] md:col-span-2 md:aspect-3/4 md:self-start',
            '(min-width: 1024px) 25vw, (min-width: 768px) 40vw, 100vw',
          )}
          <div className="md:col-span-3">
            {intro}
            <div className="mt-10">{offerings.split()}</div>
          </div>
        </div>
      )}

      {layout === 'figures' && (
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            {intro}
            {image(
              'mt-10 aspect-4/3 md:w-4/5',
              '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw',
            )}
          </div>
          <div className="md:col-span-5">{offerings.figures()}</div>
        </div>
      )}

      {layout === 'tiers' && (
        <>
          {image('mb-10 aspect-video sm:aspect-[3/1]', '(min-width: 1024px) 60vw, 100vw')}
          {intro}
          <div className="mt-10">{offerings.tiers()}</div>
        </>
      )}

      {footer}
    </section>
  )
}
