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
  /** A section takes over the page colour when its top crosses this line (0 = top, 1 = bottom). */
  line: 0.5,
  /** Seconds for the colour switch: one short fade, straight from the old tone to the new. */
  switch: 0.45,
  /**
   * Sections shorter than this (viewport heights) never take over the page colour, so a
   * short section can't flicker it. Group neighbouring sections into one tone instead.
   */
  minSection: 0.9,
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

/**
 * ProcessLine (Home): a playhead sweeps the week columns with scroll (scrubbed, no pin) and
 * each step's bar draws under it. The range runs from the board entering to it passing the
 * middle, so the whole plan has played by the time it's centred.
 */
export const processTimeline = {
  start: 'top 72%',
  end: 'bottom 50%',
  /** Smooths the scroll-linked playhead (seconds of catch-up). */
  scrub: 0.6,
} as const

/**
 * MaskedHeading: the title sits as moving code until the heading enters the viewport, then
 * compiles itself once, left to right, on a timer (not tied to the scroll position).
 */
export const maskedHeading = {
  /** Seconds the code keeps running before the first character locks in. */
  lead: 0.18,
  /** Seconds added to the left-to-right lock sweep per character. */
  perCharacter: 0.028,
  /** Shortest and longest sweep, so short titles still read and long ones don't drag. */
  minSweep: 0.45,
  maxSweep: 0.85,
  /** Seconds between code-glyph changes (about 18 a second). */
  tick: 0.055,
  /** Spreads the lock times: early characters lock quickly, the tail settles. */
  ease: 'power1.out',
} as const

/**
 * MacbookScroll (case studies): the laptop starts open, seen from above; then (pinned,
 * scrubbed) the deck folds away, the lid comes upright and it grows; then the site scrolls
 * inside the screen.
 */
export const macbook = {
  /** Pinned scroll for the laptop to come forward, in viewport heights. */
  open: 1,
  /** Then, pinned scroll per screenful of the site scrolling inside the screen. */
  perScreen: 0.5,
  /** Starting angle of the keyboard deck from the lid's plane (90 = folded flat away). */
  deckFrom: 58,
  /** Starting lean of the lid toward the viewer (negative = top comes forward), degrees. */
  leanFrom: -14,
  /** Largest the laptop grows (capped so the screen always fits the viewport). */
  scaleTo: 1.8,
} as const

/**
 * HomeHero: the Stack mark sinks as the page scrolls (scrubbed), slower than the page, so it
 * seems to follow the visitor down and slips off the bottom of the hero, behind the next
 * section.
 */
export const heroMark = {
  /** Travel over the hero's scroll, as a percentage of the mark's own height. */
  travel: 70,
} as const

export const parallax = {
  /** Default travel as a percentage of the element height. */
  amount: 12,
} as const
