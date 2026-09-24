import {
  startTransition,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, type Location } from 'react-router'
import { useIntro } from '@/app/providers/IntroProvider'
import { Logo } from '@/components/ui/Logo'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { scrollToTop } from '@/lib/lenis'
import { ease, pageTransition } from '@/lib/motion-tokens'

export interface PageTransitionProps {
  /** Render the routes for the location that should be on screen. */
  children: (location: Location) => ReactNode
  /** Fetch a route's chunk while the panels cover the screen. */
  preload?: (pathname: string) => Promise<unknown>
  label: string
}

// Inline transform (not Tailwind translate-*) so GSAP owns a single transform.
const offscreen = { transform: 'translateY(100%)' } as const

function withTimeout(promise: Promise<unknown>, ms: number) {
  return Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))])
}

function focusMain() {
  document.getElementById('main')?.focus({ preventScroll: true })
}

function panels(root: HTMLElement) {
  return {
    orange: root.querySelector<HTMLElement>('[data-panel="orange"]'),
    ink: root.querySelector<HTMLElement>('[data-panel="ink"]'),
  }
}

/**
 * Orange/black panel wipe between routes. The old page stays on screen until the panels
 * cover it, then the new route swaps in, scroll resets and the panels exit upward.
 * Changes to the search or hash only (e.g. work filters) swap instantly. With reduced
 * motion there is no wipe: just the swap and the scroll reset.
 */
export function PageTransition({ children, preload, label }: PageTransitionProps) {
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const { setTransitioning } = useIntro()
  const [displayLocation, setDisplayLocation] = useState(location)
  const latest = useRef(location)
  const busy = useRef(false)
  const shownPath = useRef(location.pathname)
  const rootRef = useRef<HTMLDivElement>(null)

  const samePage = location.pathname === displayLocation.pathname
  const renderLocation = reducedMotion || samePage ? location : displayLocation

  useEffect(() => {
    latest.current = location
  }, [location])

  const cover = useEffectEvent((pathname: string) => {
    const root = rootRef.current
    if (!root) return
    const { orange, ink } = panels(root)
    busy.current = true
    setTransitioning(true)

    const tl = gsap
      .timeline()
      .fromTo(orange, { yPercent: 100 }, { yPercent: 0, duration: pageTransition.cover, ease: ease.inOut })
      .fromTo(
        ink,
        { yPercent: 100 },
        { yPercent: 0, duration: pageTransition.cover, ease: ease.inOut },
        pageTransition.offset,
      )

    const chunk = preload ? withTimeout(preload(pathname), pageTransition.maxWaitMs) : null
    void Promise.all([tl.then(), chunk]).then(() => {
      // Keep the old page until the new chunk renders (no Suspense flash).
      startTransition(() => setDisplayLocation(latest.current))
    })
  })

  const reveal = useEffectEvent((pathname: string) => {
    const root = rootRef.current
    if (!root) return
    const { orange, ink } = panels(root)
    setTransitioning(false)

    gsap
      .timeline({
        onComplete: () => {
          busy.current = false
          // Another navigation happened mid-transition: go again.
          if (latest.current.pathname !== pathname) cover(latest.current.pathname)
        },
      })
      .to(ink, { yPercent: -100, duration: pageTransition.reveal, ease: ease.inOut })
      .to(
        orange,
        { yPercent: -100, duration: pageTransition.reveal, ease: ease.inOut },
        pageTransition.offset,
      )
  })

  // Start the wipe when the pathname changes.
  useEffect(() => {
    if (reducedMotion || samePage || busy.current) return
    cover(location.pathname)
  }, [location.pathname, samePage, reducedMotion])

  // New page is on screen (still covered): reset scroll, re-measure triggers, reveal.
  useLayoutEffect(() => {
    const path = displayLocation.pathname
    if (reducedMotion || shownPath.current === path) return
    shownPath.current = path
    scrollToTop()
    ScrollTrigger.refresh()
    focusMain()
    reveal(path)
  }, [displayLocation.pathname, reducedMotion])

  // Reduced motion: no wipe; the swap is immediate, so just reset scroll and focus.
  useLayoutEffect(() => {
    if (!reducedMotion || shownPath.current === location.pathname) return
    shownPath.current = location.pathname
    scrollToTop()
    focusMain()
  }, [reducedMotion, location.pathname])

  useEffect(() => {
    const root = rootRef.current
    return () => {
      if (root) gsap.killTweensOf(root.children)
    }
  }, [])

  return (
    <>
      {children(renderLocation)}
      <div
        ref={rootRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-(--z-transition) overflow-hidden"
      >
        <div data-panel="orange" className="absolute inset-0 bg-orange" style={offscreen} />
        <div
          data-panel="ink"
          className="absolute inset-0 flex items-center justify-center bg-ink text-[clamp(1.5rem,4vw,2.5rem)] text-paper"
          style={offscreen}
        >
          <Logo title="" />
          <span className="visually-hidden">{label}</span>
        </div>
      </div>
    </>
  )
}
