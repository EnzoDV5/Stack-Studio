import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { MobileMenu, type MobileMenuProps } from '@/components/layout/MobileMenu'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import type { SectionPreview } from '@/data/navigation'
import { cn } from '@/lib/cn'
import { HEADER_BACKDROP_AT } from '@/lib/tone'
import type { CtaLink, NavItem } from '@/types'
import styles from './Header.module.css'
import { PreviewMedia } from './PreviewMedia'

export interface HeaderProps {
  nav: NavItem[]
  dropdowns: Record<string, NavItem[]>
  previews: Record<string, SectionPreview>
  cta: CtaLink
  homeLabel: string
  menuLabel: string
  menuOpenLabel: string
  menu: Omit<MobileMenuProps, 'open' | 'onClose' | 'items' | 'sections' | 'cta'>
}

const SHOW_AT_TOP = 120
const DELTA = 6

/** Fixed header that hides on scroll down, returns on scroll up and gains a backdrop once scrolled. */
export function Header({
  nav,
  dropdowns,
  previews,
  cta,
  homeLabel,
  menuLabel,
  menuOpenLabel,
  menu,
}: HeaderProps) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [closingDropdown, setClosingDropdown] = useState<string | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [completedDevicePreviews, setCompletedDevicePreviews] = useState<Set<string>>(
    () => new Set(),
  )
  const lastY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const dropdownButtons = useRef<Record<string, HTMLButtonElement | null>>({})
  const lastWheel = useRef(0)
  const previewIndexRef = useRef(0)
  const leaveTimer = useRef<number | null>(null)
  const markDevicePlayed = useCallback((previewKey: string) => {
    setCompletedDevicePreviews((completed) => {
      if (completed.has(previewKey)) return completed
      const next = new Set(completed)
      next.add(previewKey)
      return next
    })
  }, [])

  const selectPreview = useCallback((index: number) => {
    previewIndexRef.current = index
    setPreviewIndex(index)
  }, [])

  const cancelClose = useCallback(() => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current)
    leaveTimer.current = null
  }, [])

  const closeDropdown = useCallback(() => {
    cancelClose()
    if (openDropdown) setClosingDropdown(openDropdown)
    setOpenDropdown(null)
  }, [cancelClose, openDropdown])

  const scheduleClose = useCallback(() => {
    cancelClose()
    leaveTimer.current = window.setTimeout(closeDropdown, 280)
  }, [cancelClose, closeDropdown])

  useEffect(() => {
    if (!closingDropdown) return
    const timer = window.setTimeout(() => setClosingDropdown(null), 340)
    return () => window.clearTimeout(timer)
  }, [closingDropdown])

  useEffect(() => cancelClose, [cancelClose])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      // Read the offset here, where layout is fresh; in the frame callback it would force a
      // style recalc after the frame's animation writes.
      const y = window.scrollY
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const diff = y - lastY.current
        if (Math.abs(diff) > DELTA) {
          setHidden(diff > 0 && y > SHOW_AT_TOP)
          lastY.current = y
        }
        setScrolled(y > HEADER_BACKDROP_AT)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!openDropdown) return
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeDropdown()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeDropdown()
      dropdownButtons.current[openDropdown]?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [closeDropdown, openDropdown])

  useEffect(() => {
    if (!openDropdown) return
    const panel = document.getElementById(`nav-dropdown-${openDropdown.slice(1)}`)
    const sections = dropdowns[openDropdown]
    if (!panel || !sections) return

    const cyclePreview = (event: WheelEvent) => {
      event.preventDefault()
      if (Math.abs(event.deltaY) < 4) return
      const now = performance.now()
      if (now - lastWheel.current < 150) return
      lastWheel.current = now
      const next = Math.max(
        0,
        Math.min(sections.length - 1, previewIndexRef.current + Math.sign(event.deltaY)),
      )
      selectPreview(next)
      panel.querySelectorAll('ol li')[next]?.scrollIntoView({ block: 'nearest' })
    }

    panel.addEventListener('wheel', cyclePreview, { passive: false })
    return () => panel.removeEventListener('wheel', cyclePreview)
  }, [openDropdown, dropdowns, selectPreview])

  // The native <dialog> restores focus to the toggle on close.
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          styles.header,
          scrolled && styles.scrolled,
          hidden && !menuOpen && !openDropdown && !closingDropdown && styles.hidden,
        )}
      >
        <div className="container-site flex h-full items-center justify-between gap-6">
          <Link
            to="/"
            aria-label={homeLabel}
            className="inline-flex items-center text-[1.55rem] sm:text-[1.7rem]"
          >
            <Logo variant="wordmark" title="" />
          </Link>

          <nav aria-label={menuLabel} className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-8">
              {nav.map((item) => {
                const sections = dropdowns[item.to]
                const isOpen = openDropdown === item.to
                const isClosing = closingDropdown === item.to
                const selected = sections?.[Math.min(previewIndex, sections.length - 1)]
                const preview = selected && previews[selected.to]
                return (
                  <li
                    key={item.to}
                    className={cn(styles.navItem, isOpen && styles.navItemOpen)}
                    onMouseEnter={() => {
                      if (sections && window.matchMedia('(hover: hover)').matches) {
                        cancelClose()
                        setClosingDropdown(null)
                        if (openDropdown !== item.to) selectPreview(0)
                        setOpenDropdown(item.to)
                      }
                    }}
                    onMouseLeave={() => {
                      if (sections && isOpen) scheduleClose()
                    }}
                  >
                    <div className={styles.navGroup}>
                      <NavLink
                        to={item.to}
                        onClick={closeDropdown}
                        className={({ isActive }) =>
                          cn(styles.navLink, 'text-small', isActive && styles.active)
                        }
                      >
                        {item.label}
                      </NavLink>
                      {sections && (
                        <button
                          ref={(node) => {
                            dropdownButtons.current[item.to] = node
                          }}
                          type="button"
                          className={styles.dropdownToggle}
                          aria-label={`Explore ${item.label} sections`}
                          aria-expanded={isOpen}
                          aria-controls={`nav-dropdown-${item.to.slice(1)}`}
                          onClick={() => {
                            cancelClose()
                            setClosingDropdown(null)
                            selectPreview(0)
                            setOpenDropdown(item.to)
                          }}
                        >
                          <span className={styles.chevron} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    {sections && (
                      <div
                        id={`nav-dropdown-${item.to.slice(1)}`}
                        className={styles.dropdown}
                        data-lenis-prevent=""
                        data-state={isOpen ? 'open' : 'closing'}
                        hidden={!isOpen && !isClosing}
                        inert={!isOpen}
                        aria-hidden={!isOpen}
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <div className={styles.dropdownLeft}>
                          <div className={styles.dropdownIntro}>
                            <span className={styles.dropdownEyebrow}>Explore</span>
                            <span className={styles.dropdownHeading}>{item.label}</span>
                            <span className={styles.dropdownDescription}>{item.description}</span>
                          </div>
                          <ol className={styles.dropdownLinks}>
                            {sections.map((section, index) => (
                              <li key={section.to}>
                                <Link
                                  to={section.to}
                                  onClick={closeDropdown}
                                  onPointerEnter={() => selectPreview(index)}
                                  onFocus={() => selectPreview(index)}
                                  className={cn(index === previewIndex && styles.previewActive)}
                                >
                                  <span className={styles.dropdownNumber}>
                                    {String(index + 1).padStart(2, '0')}
                                  </span>
                                  <span className={styles.dropdownItemText}>
                                    <strong>{section.label}</strong>
                                  </span>
                                  <span className={styles.dropdownArrow} aria-hidden="true">
                                    ↗
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ol>
                        </div>
                        {(isOpen || isClosing) && selected && preview && (
                          <Link
                            to={selected.to}
                            className={styles.previewPanel}
                            onClick={closeDropdown}
                            aria-label={`View ${selected.label} section`}
                          >
                            <div className={styles.previewCopy}>
                              <span className={styles.previewKicker}>Section preview</span>
                              <strong>{selected.label}</strong>
                              <span>{preview.description}</span>
                              <span className={styles.previewAction}>View section ↗</span>
                            </div>
                            {preview.visual ? (
                              <div className={styles.previewDiagram} aria-hidden="true">
                                <div className={styles.diagramTop}>
                                  <span>STACK STUDIO / {item.label.toUpperCase()}</span>
                                  <span>
                                    {preview.visual === 'payment' ? 'PAYMENT PLAN' : 'PROJECT PLAN'}
                                  </span>
                                </div>
                                <div
                                  className={cn(
                                    styles.diagramSteps,
                                    preview.visual === 'payment' && styles.paymentSteps,
                                  )}
                                >
                                  {preview.steps.map((step, index) => (
                                    <div key={step.label} className={styles.diagramStep}>
                                      <span className={styles.diagramIndex}>
                                        {String(index + 1).padStart(2, '0')}
                                      </span>
                                      <strong>{step.label}</strong>
                                      <span>{step.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className={styles.previewVisual}>
                                <div className={styles.previewChrome} aria-hidden="true">
                                  <span />
                                  <span />
                                  <span />
                                  <i>STACK STUDIO / {item.label.toUpperCase()}</i>
                                </div>
                                <PreviewMedia
                                  key={selected.to}
                                  preview={preview}
                                  active={isOpen}
                                  played={completedDevicePreviews.has(selected.to)}
                                  previewKey={selected.to}
                                  onDeviceComplete={markDevicePlayed}
                                />
                              </div>
                            )}
                          </Link>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              to={cta.to}
              size="sm"
              className="hidden sm:inline-flex"
              analytics={{ event: 'Start project click', props: { location: 'header' } }}
            >
              {cta.label}
            </Button>
            <button
              type="button"
              className="-mr-2 inline-flex h-11 items-center gap-3 px-2 font-mono text-eyebrow tracking-[0.16em] uppercase lg:hidden"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              onClick={() => setMenuOpen(true)}
            >
              {menuOpenLabel}
              <span className={styles.menuIcon} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        {...menu}
        open={menuOpen}
        onClose={closeMenu}
        items={nav}
        sections={dropdowns}
        cta={cta}
      />
    </>
  )
}
