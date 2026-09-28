import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { lenis as lenisTokens } from './motion-tokens'

/**
 * Single Lenis instance, driven by GSAP's ticker so ScrollTrigger and Lenis share one
 * frame loop. Created by <LenisProvider> only when reduced motion is off. Everything else
 * reads it through the helpers below, which fall back to native scrolling when it's absent.
 */
let instance: Lenis | null = null

export function startLenis(): () => void {
  if (instance) return () => undefined

  const lenis = new Lenis({
    lerp: lenisTokens.lerp,
    wheelMultiplier: lenisTokens.wheelMultiplier,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
    // Anchor clicks land under the fixed header via html scroll-padding-top (see scrollToElement).
    anchors: true,
  })

  const onTick = (time: number) => lenis.raf(time * 1000)
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(onTick)
  gsap.ticker.lagSmoothing(0)
  instance = lenis

  return () => {
    gsap.ticker.remove(onTick)
    lenis.destroy()
    if (instance === lenis) instance = null
  }
}

export function getLenis(): Lenis | null {
  return instance
}

export function scrollToTop(immediate = true): void {
  if (instance) instance.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' })
}

/**
 * Scroll an element to the top of the viewport. The gap for the fixed header comes from CSS:
 * html scroll-padding-top (header + 1rem) plus the target's own scroll-margin-top. Lenis and
 * native scrollIntoView both honour them, so don't pass the header height as `offset`;
 * `offset` only adds to it (with Lenis).
 */
export function scrollToElement(target: HTMLElement | string, offset = 0, immediate = false): void {
  if (instance) {
    instance.scrollTo(target, { offset, immediate, force: immediate })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  el?.scrollIntoView({ behavior: immediate ? 'instant' : 'smooth', block: 'start' })
}

/** Scroll to an absolute page position (used to bring a pinned gallery panel into view). */
export function scrollToY(y: number, immediate = false): void {
  if (instance) instance.scrollTo(y, { immediate, force: immediate })
  else window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' })
}

/** Scroll to the element a URL hash names ("#stage-build"), under the fixed header. */
export function scrollToHash(hash: string, immediate = false): boolean {
  if (hash.length < 2) return false
  const el = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!el) return false
  scrollToElement(el, 0, immediate)
  return true
}

export function lockScroll(): void {
  instance?.stop()
  document.documentElement.classList.add('is-locked')
}

export function unlockScroll(): void {
  instance?.start()
  document.documentElement.classList.remove('is-locked')
}
