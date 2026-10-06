import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { scrollToElement } from '@/lib/lenis'
import styles from './SectionNavigator.module.css'

export interface SectionNavigatorItem {
  id: string
  label: string
}

export interface SectionNavigatorProps {
  label: string
  items: SectionNavigatorItem[]
}

/** A compact page outline that follows the section currently under the reading line. */
export function SectionNavigator({ label, items }: SectionNavigatorProps) {
  const [active, setActive] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLElement>(null)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const readingLine = window.innerHeight * 0.35
      let current = 0
      const sections = items.map((item) => document.getElementById(item.id))
      sections.forEach((section, index) => {
        if (section && section.getBoundingClientRect().top <= readingLine) current = index
      })
      const thisSection = sections[current]
      const nextSection = sections[current + 1]
      const start = thisSection?.getBoundingClientRect().top ?? readingLine
      const end =
        nextSection?.getBoundingClientRect().top ??
        thisSection?.getBoundingClientRect().bottom ??
        readingLine
      const within =
        end > start ? Math.max(0, Math.min(1, (readingLine - start) / (end - start))) : 0
      const progress = ((current + 0.5 + within) / items.length) * 100
      desktopRef.current?.style.setProperty('--progress', `${progress}%`)
      const surface = document
        .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
        ?.closest<HTMLElement>('[data-tone]')?.dataset.tone
      if (desktopRef.current)
        desktopRef.current.dataset.surface = surface === 'dark' ? 'dark' : 'light'
      setActive(current)
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [items])

  useEffect(() => {
    if (!mobileOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setMobileOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      mobileButtonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  const jump = (
    event: MouseEvent<HTMLAnchorElement>,
    item: SectionNavigatorItem,
    index: number,
  ) => {
    const section = document.getElementById(item.id)
    if (!section) return
    event.preventDefault()
    setActive(index)
    setMobileOpen(false)
    scrollToElement(section)
    history.replaceState(null, '', `#${item.id}`)
  }

  const links = items.map((item, index) => (
    <li key={item.id}>
      <a
        href={`#${item.id}`}
        onClick={(event) => jump(event, item, index)}
        aria-label={`Go to ${item.label}`}
        aria-current={index === active ? 'location' : undefined}
        className={styles.link}
        data-state={index === active ? 'active' : index < active ? 'passed' : undefined}
      >
        <span className={styles.mark} aria-hidden="true" />
        <span className={styles.linkLabel}>{item.label}</span>
      </a>
    </li>
  ))

  return (
    <div ref={rootRef} className={styles.root}>
      <nav
        ref={desktopRef}
        aria-label={label}
        className={styles.desktop}
        style={{ '--section-count': items.length } as CSSProperties}
      >
        <div className={styles.current} aria-hidden="true">
          <span key={items[active]?.id} className={styles.currentName}>
            {items[active]?.label}
          </span>
        </div>
        <p className={styles.count} aria-hidden="true">
          {String(active + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
        </p>
        <div className={styles.trackArea}>
          <ol>{links}</ol>
          <span className={styles.progressHead} aria-hidden="true" />
        </div>
      </nav>

      <button
        ref={mobileButtonRef}
        type="button"
        className={styles.mobileButton}
        aria-expanded={mobileOpen}
        aria-controls={menuId}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span>{items[active]?.label ?? label}</span>
        <span className={styles.mobileCount}>
          {String(active + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
        </span>
      </button>
      {mobileOpen && (
        <nav id={menuId} aria-label={label} className={styles.mobileMenu}>
          <ol>{links}</ol>
        </nav>
      )}
    </div>
  )
}
