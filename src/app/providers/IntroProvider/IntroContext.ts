import { createContext, useContext } from 'react'
import { REDUCED_MOTION_QUERY } from '@/hooks/useReducedMotion'
import { preloader } from '@/lib/motion-tokens'

export interface IntroState {
  /** True once the preloader has started exiting and no page wipe is covering the screen. */
  ready: boolean
  preloaderDone: boolean
  markPreloaderDone: () => void
  setTransitioning: (value: boolean) => void
}

export const IntroContext = createContext<IntroState>({
  ready: true,
  preloaderDone: true,
  markPreloaderDone: () => undefined,
  setTransitioning: () => undefined,
})

/** Intro-driven animations (hero line reveals) wait for this before playing. */
export function useIntro(): IntroState {
  return useContext(IntroContext)
}

/** The preloader runs once per session and never with reduced motion. */
export function shouldShowPreloader(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false
  try {
    return window.sessionStorage.getItem(preloader.sessionKey) === null
  } catch {
    return false
  }
}

export function rememberPreloaderSeen(): void {
  try {
    window.sessionStorage.setItem(preloader.sessionKey, '1')
  } catch {
    // Storage unavailable (private mode). The preloader simply shows again next time.
  }
}
