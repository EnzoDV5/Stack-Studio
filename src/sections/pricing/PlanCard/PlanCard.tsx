import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'

export interface PlanCardProps {
  name: string
  tagline: string
  price: string
  /** e.g. "2 hours included each month". */
  hours?: string
  includes: string[]
  highlighted?: boolean
  recommendedLabel: string
  cta: { label: string; to: string; location: string }
  /** Slot id so PlanTabs can Flip a card into the one it replaces. */
  flipId?: string
}

/** One monthly plan: name, price, hours, what's included and a pre-filled CTA. */
export function PlanCard({
  name,
  tagline,
  price,
  hours,
  includes,
  highlighted,
  recommendedLabel,
  cta,
  flipId,
}: PlanCardProps) {
  return (
    <li
      data-flip-id={flipId}
      className={cn(
        'relative flex flex-col rounded-lg border p-7 md:p-8',
        highlighted ? 'border-orange bg-tone-surface' : 'border-tone',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="min-w-0 text-heading-lg">{name}</h3>
        {highlighted && (
          <Tag variant="accent" className="shrink-0">
            {recommendedLabel}
          </Tag>
        )}
      </div>
      <p className="mt-1 text-small text-muted">{tagline}</p>
      <p className="mt-8 numeric text-heading-xl">{price}</p>
      {hours && <p className="mt-3 eyebrow text-muted">{hours}</p>}
      <ul className="mt-6 flex-1 space-y-2 border-t border-tone pt-6 text-small">
        {includes.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-marker" />
            {item}
          </li>
        ))}
      </ul>
      <Button
        to={cta.to}
        variant={highlighted ? 'primary' : 'secondary'}
        size="sm"
        withArrow
        className="mt-8 self-start"
        aria-label={`${cta.label} ${name}`}
        analytics={{ event: 'Start project click', props: { location: cta.location } }}
      >
        {cta.label}
      </Button>
    </li>
  )
}
