import { Accordion } from '@/components/ui/Accordion'
import type { OfferRow } from '@/lib/offer'

export interface OfferAccordionProps {
  rows: OfferRow[]
  /** Label above the "includes" list. */
  includesLabel: string
  /** Most "includes" bullets shown per offering, so an open row stays short. */
  maxIncludes?: number
  /** Row title size: 'lg' for a full-width list, 'md' in a narrow column. */
  size?: 'md' | 'lg'
  className?: string
}

/**
 * Offerings as dropdowns: name and price on the row; open one for a line on what it is, its
 * notes and the main things it includes.
 */
export function OfferAccordion({
  rows,
  includesLabel,
  maxIncludes = 4,
  size = 'lg',
  className,
}: OfferAccordionProps) {
  return (
    <Accordion
      headingLevel="h3"
      titleClassName={size === 'lg' ? 'text-heading-lg' : 'text-heading-md'}
      className={className}
      items={rows.map((row) => ({
        id: row.id,
        title: row.name,
        meta: row.price,
        content: (
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div>
              <p className="numeric text-heading-md sm:hidden">{row.price}</p>
              <p className="mt-2 sm:mt-0">{row.summary}</p>
              {row.notes.length > 0 && (
                <ul className="mt-3 space-y-1 text-small text-muted">
                  {row.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              )}
            </div>
            {row.includes.length > 0 && (
              <div>
                <p className="mb-3 eyebrow text-muted">{includesLabel}</p>
                <ul className="space-y-2 text-small">
                  {row.includes.slice(0, maxIncludes).map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ),
      }))}
    />
  )
}
