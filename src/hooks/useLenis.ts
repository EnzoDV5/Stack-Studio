import { getLenis, lockScroll, scrollToElement, scrollToTop, unlockScroll } from '@/lib/lenis'

const controls = {
  /** The live instance, or null with reduced motion (native scroll). Call inside handlers, not render. */
  get: getLenis,
  scrollToTop,
  scrollTo: scrollToElement,
  lock: lockScroll,
  unlock: unlockScroll,
} as const

/**
 * Imperative scroll controls. Stable across renders, and safe with or without Lenis
 * (they fall back to native scroll).
 */
export function useLenis(): typeof controls {
  return controls
}
