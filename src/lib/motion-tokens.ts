/**
 * Central motion tokens. Every GSAP tween reads its duration and ease from here.
 * CSS mirrors these as --ease-* and --duration-* in src/styles/tokens.css. Keep both in sync.
 *
 * Language: expo-style ease-outs, 0.6–1.2s. Fast in, long settle. One signature idea per section.
 */

export const duration = {
  /** Hover colour/opacity swaps, cursor scale. */
  micro: 0.25,
  /** Small UI: menu items, accordion, step changes. */
  fast: 0.6,
  /** Default reveal: fade-ups, line reveals. */
  base: 0.9,
  /** Hero statement, media reveals. */
  slow: 1.2,
} as const

export const ease = {
  /** Default. Quick start, long soft settle. */
  out: 'expo.out',
  /** Slightly less dramatic, for small elements. */
  outQuart: 'power4.out',
  /** Panel wipes and pinned scrubs. */
  inOut: 'expo.inOut',
  /** Exits. */
  in: 'expo.in',
  /** Scrubbed scroll animations should feel linear to the scroll. */
  none: 'none',
} as const

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const

/** Travel distances (px) for translate-based reveals. */
export const distance = {
  rise: 48,
  small: 16,
} as const

/** ScrollTrigger start positions. */
export const trigger = {
  start: 'top 85%',
  startLate: 'top 70%',
} as const

export const preloader = {
  /** Total on-screen time stays under 1.5s. */
  count: 0.85,
  exit: 0.55,
  sessionKey: 'stack:intro-seen',
} as const

export const pageTransition = {
  cover: 0.6,
  reveal: 0.7,
  /** Offset between the orange and black panels. */
  offset: 0.08,
  /** Give up waiting for a route chunk after this and reveal anyway (Suspense takes over). */
  maxWaitMs: 2500,
} as const

export const magnetic = {
  strength: 0.35,
  labelStrength: 0.18,
  duration: 0.6,
  ease: 'power3.out',
  release: 'elastic.out(1, 0.45)',
  releaseDuration: 1.1,
} as const

export const cursor = {
  follow: 0.5,
  followEase: 'power3.out',
} as const

export const marquee = {
  /** Seconds per full loop at the default width. CSS reads this as a custom property. */
  loopSeconds: 38,
} as const

export const lenis = {
  lerp: 0.1,
  wheelMultiplier: 1,
} as const

export const parallax = {
  /** Default travel as a percentage of the element height. */
  amount: 12,
} as const
