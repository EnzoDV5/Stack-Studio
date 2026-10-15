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
import { scrollToHash, scrollToTop } from '@/lib/lenis'
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
  const { preloaderDone, setTransitioning } = useIntro()
  const [displayLocation, setDisplayLocation] = useState(location)
  const latest = useRef(location)
  const busy = useRef(false)
  const shownPath = useRef(location.pathname)
  // Last location whose #hash we've handled. Starts empty so a direct load of
  // /services#stage-build also lands on its anchor.
  const handledKey = useRef<string | null>(null)
  const initialKey = useRef(location.key)
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
      .fromTo(
        orange,
        { y: 0, yPercent: 100 },
        { yPercent: 0, duration: pageTransition.cover, ease: ease.inOut },
      )
      .fromTo(
        ink,
        { y: 0, yPercent: 100 },
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

  // New page is on screen (still covered): reset scroll (or jump to #hash under the
  // header), re-measure triggers, reveal.
  useLayoutEffect(() => {
    const path = displayLocation.pathname
    if (reducedMotion || shownPath.current === path) return
    shownPath.current = path
    handledKey.current = displayLocation.key
    scrollToTop()
    ScrollTrigger.refresh()
    scrollToHash(displayLocation.hash, true)
    focusMain()
    reveal(path)
  }, [displayLocation.pathname, displayLocation.hash, displayLocation.key, reducedMotion])

  // Reduced motion: no wipe; the swap is immediate, so just reset scroll and focus.
  useLayoutEffect(() => {
    if (!reducedMotion || shownPath.current === location.pathname) return
    shownPath.current = location.pathname
    handledKey.current = location.key
    scrollToTop()
    scrollToHash(location.hash, true)
    focusMain()
  }, [reducedMotion, location.pathname, location.hash, location.key])

  // Same page, new #hash (e.g. /services → /services#stage-run): glide there.
  useEffect(() => {
    if (!samePage || handledKey.current === location.key) return
    handledKey.current = location.key
    if (location.hash) scrollToHash(location.hash)
  }, [samePage, location.key, location.hash])

  // On a direct #hash load the route can still be suspended when the first
  // scroll runs, and the preloader may hold the page at the top. Retry once
  // the intro finishes and again when the lazy route adds its target.
  useEffect(() => {
    if (!preloaderDone || location.key !== initialKey.current || !location.hash) return
    let settleTimer = 0
    const observer = new MutationObserver(() => align())
    const align = () => {
      if (!scrollToHash(location.hash, true)) return
      observer.disconnect()
      // Page sections can move as the lazy route mounts its pinned content.
      // Align once more after layout settles, especially for return visitors
      // who skip the preloader.
      settleTimer = window.setTimeout(() => scrollToHash(location.hash, true), 650)
    }

    if (document.getElementById(decodeURIComponent(location.hash.slice(1)))) align()
    else observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      window.clearTimeout(settleTimer)
    }
  }, [preloaderDone, location.key, location.hash])

  // GSAP would otherwise parse the inline translateY(100%) as a px y and stack yPercent on it.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (root) gsap.set(root.children, { y: 0, yPercent: 100 })
  }, [])

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
