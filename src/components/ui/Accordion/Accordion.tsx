import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import styles from './Accordion.module.css'

export interface AccordionItem {
  id: string
  title: ReactNode
  content: ReactNode
  /** Called when this row opens, for sections with media tied to the open item. */
  onOpen?: () => void
  /** Right-aligned meta next to the title, e.g. a price or duration. */
  meta?: ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  /** Allow several panels open at once. */
  multiple?: boolean
  defaultOpen?: string[]
  /** Show "01", "02"… before each title. */
  numbered?: boolean
  /** Heading level wrapping each trigger (for a correct outline). */
  headingLevel?: 'h2' | 'h3' | 'h4'
  titleClassName?: string
  className?: string
}

/** Accessible disclosure list (button + region), animated with CSS grid rows. */
export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  numbered = false,
  headingLevel: H = 'h3',
  titleClassName = 'text-heading-lg',
  className,
}: AccordionProps) {
  const baseId = useId()
  const [open, setOpen] = useState<string[]>(defaultOpen)

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : multiple ? [...current, id] : [id],
    )

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isOpen = open.includes(item.id)
        const triggerId = `${baseId}-t-${item.id}`
        const panelId = `${baseId}-p-${item.id}`
        return (
          <div key={item.id} className={cn(styles.item, isOpen && styles.open)}>
            <H className="m-0">
              <button
                id={triggerId}
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  if (!isOpen) item.onOpen?.()
                  toggle(item.id)
                }}
              >
                {numbered && (
                  <span className="w-8 shrink-0 eyebrow text-accent">{pad2(i + 1)}</span>
                )}
                <span className={cn(titleClassName, 'flex-1')}>{item.title}</span>
                {item.meta && (
                  <span className="hidden text-small text-muted sm:block">{item.meta}</span>
                )}
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </H>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={styles.panel}
              inert={!isOpen}
            >
              <div className={styles.panelInner}>
                <div className={cn('pb-8', numbered && 'sm:pl-14')}>{item.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
