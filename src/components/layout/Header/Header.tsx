import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { MobileMenu, type MobileMenuProps } from '@/components/layout/MobileMenu'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'
import { HEADER_BACKDROP_AT } from '@/lib/tone'
import type { CtaLink, NavItem } from '@/types'
import styles from './Header.module.css'

export interface HeaderProps {
  nav: NavItem[]
  dropdowns: Record<string, NavItem[]>
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
  const lastY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const dropdownButtons = useRef<Record<string, HTMLButtonElement | null>>({})

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
      if (!headerRef.current?.contains(event.target as Node)) setOpenDropdown(null)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpenDropdown(null)
      dropdownButtons.current[openDropdown]?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openDropdown])

  // The native <dialog> restores focus to the toggle on close.
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          styles.header,
          scrolled && styles.scrolled,
          hidden && !menuOpen && !openDropdown && styles.hidden,
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
                return (
                  <li
                    key={item.to}
                    className={styles.navItem}
                    onMouseEnter={() => {
                      if (sections && window.matchMedia('(hover: hover)').matches)
                        setOpenDropdown(item.to)
                    }}
                    onMouseLeave={() => {
                      if (sections) setOpenDropdown(null)
                    }}
                  >
                    <div className={styles.navGroup}>
                      <NavLink
                        to={item.to}
                        onClick={() => setOpenDropdown(null)}
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
                          onClick={() => setOpenDropdown(item.to)}
                        >
                          <span className={styles.chevron} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    {sections && (
                      <div
                        id={`nav-dropdown-${item.to.slice(1)}`}
                        className={styles.dropdown}
                        hidden={!isOpen}
                      >
                        <div className={styles.dropdownIntro}>
                          <span className={styles.dropdownEyebrow}>Explore</span>
                          <span className={styles.dropdownHeading}>{item.label}</span>
                          <span className={styles.dropdownDescription}>{item.description}</span>
                        </div>
                        <ol className={styles.dropdownLinks}>
                          {sections.map((section, index) => (
                            <li key={section.to}>
                              <Link to={section.to} onClick={() => setOpenDropdown(null)}>
                                <span className={styles.dropdownNumber}>
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <span>{section.label}</span>
                                <span className={styles.dropdownArrow} aria-hidden="true">
                                  ↗
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ol>
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
