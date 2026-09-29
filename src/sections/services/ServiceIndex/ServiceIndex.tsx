import type { MouseEvent } from 'react'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { scrollToElement } from '@/lib/lenis'

export interface ServiceIndexItem {
  /** Same-page anchor, e.g. "#stage-build". */
  to: string
  name: string
  line: string
}

export interface ServiceIndexProps {
  label: string
  items: ServiceIndexItem[]
  className?: string
}

/**
 * "What do you need?": a row of cards at the top of Services that jump to the right group.
 * Not sticky: it's a starting point, not a scroll tracker.
 */
export function ServiceIndex({ label, items, className }: ServiceIndexProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>, to: string) => {
    const el = document.getElementById(to.replace(/^#/, ''))
    if (!el) return
    event.preventDefault()
    scrollToElement(el)
    history.replaceState(null, '', to)
  }

  return (
    <nav aria-label={label} className={className}>
      <p className="mb-5 eyebrow text-muted">{label}</p>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.to}>
            <a
              href={item.to}
              onClick={(event) => onClick(event, item.to)}
              // One compact row on phones (number · text · arrow); a card from sm up, with the
              // number and arrow on top and the text below.
              className={cn(
                'group grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 rounded-lg border border-tone px-4 py-3',
                'sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-y-6 sm:p-5',
                'transition-colors duration-(--duration-micro) hover:border-orange',
              )}
            >
              <span className="eyebrow text-accent sm:col-start-1 sm:row-start-1">
                {pad2(i + 1)}
              </span>
              <span className="sm:col-span-2 sm:row-start-2">
                <span className="block text-heading-md">{item.name}</span>
                <span className="mt-1 block text-small text-muted">{item.line}</span>
              </span>
              <span
                aria-hidden="true"
                className="text-muted sm:col-start-2 sm:row-start-1 sm:justify-self-end"
              >
                ↓
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
