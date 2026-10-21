import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router'
import { GridOverlay } from '@/components/layout/GridOverlay'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { TextLink } from '@/components/ui/TextLink'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { gsap } from '@/lib/gsap'
import { lockScroll, unlockScroll } from '@/lib/lenis'
import { duration, ease, stagger } from '@/lib/motion-tokens'
import type { CtaLink, NavItem, SocialLink } from '@/types'
import styles from './MobileMenu.module.css'

export interface MobileMenuProps {
  open: boolean
  onClose: () => void
  items: NavItem[]
  sections: Record<string, NavItem[]>
  cta: CtaLink
  label: string
  closeLabel: string
  email: string
  socials: SocialLink[]
}

/**
 * Full-screen menu on a native <dialog>, which handles the focus trap, Escape and inert
 * background. Items rise in on a stagger; the whole panel wipes up on close.
 */
export function MobileMenu({
  open,
  onClose,
  items,
  sections,
  cta,
  label,
  closeLabel,
  email,
  socials,
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      lockScroll()
      if (reducedMotion) return
      const tl = gsap.timeline()
      tl.fromTo(
        dialog,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: duration.fast, ease: ease.inOut },
      ).from(
        dialog.querySelectorAll('[data-menu-item]'),
        { yPercent: 110, opacity: 0, duration: duration.base, stagger: stagger.base },
        '-=0.25',
      )
      return () => {
        tl.progress(1)
      }
    }

    if (!open && dialog.open) {
      const finish = () => {
        dialog.close()
        unlockScroll()
      }
      if (reducedMotion) {
        finish()
        return
      }
      const tween = gsap.to(dialog, {
        clipPath: 'inset(0 0 100% 0)',
        duration: duration.fast,
        ease: ease.inOut,
        onComplete: finish,
      })
      return () => {
        tween.progress(1)
      }
    }
  }, [open, reducedMotion])

  // Close if the viewport grows past the breakpoint where the header shows the full nav (lg).
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 64rem)')
    const onChange = () => {
      if (mql.matches && open) {
        setExpanded(null)
        onClose()
      }
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [open, onClose])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        setExpanded(null)
        onClose()
      }}
    >
      <div className="relative flex min-h-full flex-col">
        <GridOverlay fade="radial" />
        <div className="relative container-site flex h-(--spacing-header) items-center justify-between">
          <Logo variant="wordmark" title="" className="text-[1.55rem] sm:text-[1.7rem]" />
          <button
            type="button"
            onClick={() => {
              setExpanded(null)
              onClose()
            }}
            className="-mr-2 inline-flex h-11 items-center px-2 font-mono text-eyebrow tracking-[0.16em] uppercase"
          >
            {closeLabel}
          </button>
        </div>

        <nav aria-label={label} className="relative container-site mt-8 flex-1 short:mt-2">
          <ul className="short:grid short:grid-cols-2 short:gap-x-10">
            {items.map((item, i) => (
              <li key={item.to} className="overflow-hidden">
                <div className={styles.navRow}>
                  <NavLink
                    to={item.to}
                    onClick={() => {
                      setExpanded(null)
                      onClose()
                    }}
                    data-menu-item=""
                    className={({ isActive }) => cn(styles.link, isActive && styles.active)}
                  >
                    <span className={cn(styles.label, 'text-display-lg short:text-heading-xl')}>
                      {item.label}
                    </span>
                    <span className={styles.index}>{pad2(i + 1)}</span>
                  </NavLink>
                  {sections[item.to] ? (
                    <button
                      type="button"
                      className={styles.submenuToggle}
                      aria-label={`Explore ${item.label} sections`}
                      aria-expanded={expanded === item.to}
                      onClick={() =>
                        setExpanded((current) => (current === item.to ? null : item.to))
                      }
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m4 6 4 4 4-4" />
                      </svg>
                    </button>
                  ) : (
                    // Keeps every row's number in the same column.
                    <span aria-hidden="true" className={styles.toggleSpace} />
                  )}
                </div>
                {/* Always rendered so it can slide open and shut (grid rows 0fr → 1fr); inert
                    while shut, so its links are out of the tab order. */}
                {sections[item.to] && (
                  <div
                    className={cn(styles.submenuWrap, expanded === item.to && styles.submenuOpen)}
                    inert={expanded !== item.to}
                  >
                    <div className={styles.submenuClip}>
                      <ul className={styles.submenu} aria-label={`${item.label} sections`}>
                        {sections[item.to]?.map((section) => (
                          <li key={section.to}>
                            <NavLink
                              to={section.to}
                              onClick={() => {
                                setExpanded(null)
                                onClose()
                              }}
                            >
                              {section.label}
                              <span aria-hidden="true">↗</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative container-site flex flex-col gap-8 pt-10 pb-10 short:gap-5 short:py-6">
          <div data-menu-item="">
            <Button
              to={cta.to}
              size="lg"
              fullWidth
              withArrow
              onClick={() => {
                setExpanded(null)
                onClose()
              }}
              analytics={{ event: 'Start project click', props: { location: 'mobile-menu' } }}
            >
              {cta.label}
            </Button>
          </div>
          <div
            className="flex flex-wrap gap-x-6 gap-y-3 text-small text-grey-300"
            data-menu-item=""
          >
            <TextLink href={`mailto:${email}`}>{email}</TextLink>
            {socials.map((social) => (
              <TextLink key={social.id} href={social.href} variant="quiet">
                {social.label}
              </TextLink>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  )
}
