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
  cta: CtaLink
  homeLabel: string
  menuLabel: string
  menuOpenLabel: string
  menu: Omit<MobileMenuProps, 'open' | 'onClose' | 'items' | 'cta'>
}

const SHOW_AT_TOP = 120
const DELTA = 6

/** Fixed header that hides on scroll down, returns on scroll up and gains a backdrop once scrolled. */
export function Header({ nav, cta, homeLabel, menuLabel, menuOpenLabel, menu }: HeaderProps) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)

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

  // The native <dialog> restores focus to the toggle on close.
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header
        className={cn(
          styles.header,
          scrolled && styles.scrolled,
          hidden && !menuOpen && styles.hidden,
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
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(styles.navLink, 'text-small', isActive && styles.active)
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
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

      <MobileMenu {...menu} open={menuOpen} onClose={closeMenu} items={nav} cta={cta} />
    </>
  )
}
