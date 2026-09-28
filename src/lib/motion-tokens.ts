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
  /** Enter animations wait until the element is well on screen, so they play in full. */
  start: 'top 75%',
  /** For things that should play in the middle of the screen (count-ups, the process line). */
  startLate: 'top 62%',
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
  /** Keep the dense technology strip leisurely as its catalogue grows. */
  technologyItemSeconds: 5,
} as const

export const lenis = {
  lerp: 0.09,
  wheelMultiplier: 1,
} as const

/** ScrollTrigger housekeeping. */
export const scroll = {
  /** Debounce before ScrollTrigger.refresh() once fonts, media or lazy sections settle (ms). */
  refreshDebounceMs: 150,
} as const

/** ToneController: the page colours morph between section tones around the viewport middle. */
export const tone = {
  /**
   * A section's tone starts fading in when its top enters the bottom of the viewport and is
   * complete once the top has travelled this fraction of the viewport (so, 20% from the top).
   */
  band: 0.8,
  /** Seconds the page colours take to catch up with the scroll (bounded ease-out glide). */
  lag: 0.35,
} as const

/** WorkReel: full-bleed media shrinks into a card, then a pinned horizontal gallery (desktop). */
export const reel = {
  /** Pinned scroll for the full-bleed → card shrink, in viewport heights. */
  shrinkScroll: 0.5,
  /** Pinned scroll per panel after the first, in viewport heights. */
  panelScroll: 0.45,
  /** Corner radius the full-bleed media settles into (px, matches --radius-lg). */
  radius: 16,
} as const

/** ProcessLine: steps wait at this opacity until the drawn line reaches them. */
export const drawLine = {
  dim: 0.35,
} as const

/** ClosingCta: the giant type scales in and its tracking tightens as the band scrolls in. */
export const closingType = {
  scaleFrom: 0.8,
  /** Extra letter spacing at the start, in em, removed by the end of the scrub. */
  trackingFrom: 0.06,
} as const

/** Case study hero media settles from this scale to 1 as it scrolls through. */
export const heroScale = {
  from: 1.1,
} as const

export const parallax = {
  /** Default travel as a percentage of the element height. */
  amount: 12,
} as const
