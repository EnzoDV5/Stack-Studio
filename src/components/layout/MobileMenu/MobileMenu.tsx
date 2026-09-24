import { useEffect, useRef } from 'react'
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
  cta,
  label,
  closeLabel,
  email,
  socials,
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
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

  // Close if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 48rem)')
    const onChange = () => mql.matches && open && onClose()
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
        onClose()
      }}
    >
      <div className="relative flex min-h-full flex-col">
        <GridOverlay fade="radial" />
        <div className="container-site relative flex h-(--spacing-header) items-center justify-between">
          <Logo title="" />
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex h-11 items-center px-2 font-mono text-eyebrow tracking-[0.16em] uppercase"
          >
            {closeLabel}
          </button>
        </div>

        <nav aria-label={label} className="container-site relative mt-8 flex-1">
          <ul>
            {items.map((item, i) => (
              <li key={item.to} className="overflow-hidden">
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  data-menu-item=""
                  className={({ isActive }) => cn(styles.link, isActive && styles.active)}
                >
                  <span className={cn(styles.label, 'text-display-lg')}>{item.label}</span>
                  <span className={styles.index}>{pad2(i + 1)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container-site relative flex flex-col gap-8 pt-10 pb-10">
          <div data-menu-item="">
            <Button
              to={cta.to}
              size="lg"
              fullWidth
              withArrow
              onClick={onClose}
              analytics={{ event: 'Start project click', props: { location: 'mobile-menu' } }}
            >
              {cta.label}
            </Button>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-small text-grey-300" data-menu-item="">
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
