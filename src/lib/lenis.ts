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
    anchors: { offset: -80 },
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

export function scrollToElement(target: HTMLElement | string, offset = -80): void {
  if (instance) {
    instance.scrollTo(target, { offset })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function lockScroll(): void {
  instance?.stop()
  document.documentElement.classList.add('is-locked')
}

export function unlockScroll(): void {
  instance?.start()
  document.documentElement.classList.remove('is-locked')
}
