import { useEffect, useState, type MouseEvent } from 'react'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { scrollToElement } from '@/lib/lenis'

export interface StageNavItem {
  id: string
  index: number
  name: string
}

export interface StageNavProps {
  items: StageNavItem[]
  label: string
  /** Element ids are `${idPrefix}${item.id}`. */
  idPrefix: string
}

/**
 * Sticky stage progress (Build → Partner). Tracks the stage in view and links to each
 * one. Vertical on desktop, a horizontal scroller on mobile.
 */
export function StageNav({ items, label, idPrefix }: StageNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (top) setActive(top.target.id.slice(idPrefix.length))
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    for (const item of items) {
      const el = document.getElementById(`${idPrefix}${item.id}`)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items, idPrefix])

  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === active),
  )

  const onClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(`${idPrefix}${id}`)
    if (!el) return
    event.preventDefault()
    scrollToElement(el, -110)
    setActive(id)
  }

  return (
    <nav aria-label={label}>
      <ol className="-mx-(--spacing-gutter) no-scrollbar flex gap-2 overflow-x-auto px-(--spacing-gutter) lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
        {items.map((item, i) => {
          const isActive = item.id === active
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${idPrefix}${item.id}`}
                onClick={(e) => onClick(e, item.id)}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-pill border px-4 py-2 transition-colors lg:rounded-none lg:border-0 lg:border-l-2 lg:px-5 lg:py-3',
                  isActive
                    ? 'border-orange text-(--tone-fg)'
                    : 'border-tone text-muted hover:text-(--tone-fg)',
                  i <= activeIndex && 'lg:border-orange',
                )}
              >
                <span className="eyebrow text-accent">{pad2(item.index)}</span>
                <span className={cn('text-small lg:text-heading-md', isActive && 'font-semibold')}>
                  {item.name}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
