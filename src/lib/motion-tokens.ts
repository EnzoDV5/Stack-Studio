/**
 * Central motion tokens. Every GSAP tween reads its duration and ease from here.
 * CSS mirrors these as --ease-* and --duration-* in src/styles/tokens.css. Keep both in sync.
 *
 * Language: expo-style ease-outs, 0.6–1.2s. Fast in, long settle. One signature idea per section.
 */

export const duration = {
  /** Hover colour/opacity swaps. */
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
  /**
   * Titles compile the moment they're on screen (a line clear of the bottom edge), so the
   * code is never seen sitting still while the visitor waits for it.
   */
  heading: 'top 90%',
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

/** The cursor bubble over [data-cursor-label]: tracks the pointer with a short settle. */
export const cursor = {
  follow: 0.15,
  followEase: 'power3.out',
} as const

/**
 * The stack diagram's build filter (GSAP Flip): staying layers and tools glide, leaving ones
 * fade and shrink out, returning ones fade in after a beat. A soft in-out ease, so the move
 * starts and lands gently rather than snapping.
 */
export const stackFilter = {
  duration: 0.8,
  ease: 'power3.inOut',
  /** Leaving items fade quicker than the move, so they're gone before others slide over. */
  fade: 0.35,
  enterDelay: 0.25,
  stagger: 0.025,
  scale: 0.85,
} as const

export const marquee = {
  /** Seconds per full loop at the default width. CSS reads this as a custom property. */
  loopSeconds: 38,
  /** Keep the dense technology strip leisurely as its catalogue grows. */
  technologyItemSeconds: 5,
} as const

/**
 * Film grain jitter (GrainOverlay): the layer jumps through these offsets (vw, vh) once per
 * loop, six times a second. They are the positions the old `steps(6)` CSS keyframes landed on.
 */
export const grain = {
  loopSeconds: 1,
  offsets: [
    [0, 0],
    [-5, 3.33],
    [0.67, -4],
    [-2, -5],
    [-3.33, 0.67],
    [2, 2],
  ],
} as const

/**
 * Wheel and trackpad smoothing. Each frame the page covers `lerp` of the way to where the
 * reader scrolled, so a lower value glides further after the wheel stops ("on ice"); below
 * ~0.06 it starts to feel detached from the hand. Touch keeps the device's native momentum.
 */
export const lenis = {
  lerp: 0.065,
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

/** Legacy package showcase, retained for the package section. */
export const packageShowcase = {
  lidFrom: -72,
  start: 'top 75%',
  secondsPerScreen: 8,
  hold: 1.2,
} as const

/**
 * ProcessLine (Home): when the plan enters, the steps slide in and a playhead sweeps the
 * weeks once on its own, drawing each bar under it; then it glides to whichever week is
 * hovered or picked, drawing or retracting the bars as it goes.
 */
export const processTimeline = {
  /** The entrance starts with the plan well on screen. */
  start: 'top 70%',
  /** Seconds for the entrance sweep from the first week to the last. */
  sweep: 3.2,
  /** Delay before the sweep, so the step names have started sliding in. */
  sweepDelay: 0.35,
  /** An even, deliberate sweep (it reads as time passing), easing in and out at the ends. */
  sweepEase: 'sine.inOut',
  /**
   * How fast the playhead follows to a hovered or picked week (per second, exponential): it
   * eases toward its target every frame, so a new target mid-glide never jerks it.
   * 7 covers ~90% of the way in a third of a second, then settles softly.
   */
  follow: 7,
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
  /** How long a chapter takes to turn its readable text back into code. */
  recodeSweep: 0.44,
  /** Briefly hold the code before the next chapter starts decoding. */
  recodeHold: 0.12,
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
  /** On portrait screens the laptop can only be as wide as the phone, so the pin runs shorter. */
  portraitScroll: 0.6,
} as const

/**
 * AppShowcase (Services): the phone turns from its back to face the viewer as it scrolls
 * through the viewport (scrubbed, not pinned). The frames
 * come from scripts/devices.
 */
export const phoneTurn = {
  /** The turn starts as the phone's top comes up past this line… */
  start: 'top 92%',
  /** …and it faces the viewer once its centre reaches the middle of the view. */
  end: 'center 50%',
  /** Seconds the frame takes to catch up with the scroll, so the turn glides. */
  scrub: 1,
  /** Eases in and out, so the spin starts gently and settles as it faces the viewer. */
  ease: 'sine.inOut',
} as const

/**
 * DesktopShowcase (Services): the laptop opens its lid and turns to face the content beside it
 * as it scrolls through the viewport (scrubbed, like the phone turn above it: a deliberate
 * exception to "neighbours never share a trigger", asked for by the studio). Longer than the
 * phone's, since the lid and the turn happen together. The frames come from scripts/devices.
 */
export const laptopTurn = {
  /** Starts as the laptop's top comes up past this line… */
  start: 'top 85%',
  /** …and it's open, facing the content, once its centre is a little above the middle. */
  end: 'center 42%',
  /** Seconds the frame takes to catch up with the scroll, so it glides. */
  scrub: 1,
  /** Eases in and out: the lid lifts gently, swings, then settles. */
  ease: 'sine.inOut',
} as const

/**
 * NextSteps (Process, desktop): the four step cards start as a loose, overlapping pile in the
 * middle and deal out into their row as the section scrolls into view (scrubbed;
 * transforms only). It opens the page, already on screen, so the start is clamped to the top:
 * the pile is whole on arrival and deals out over the first scroll.
 */
export const stepsDeal = {
  start: 'clamp(top 80%)',
  end: 'center 55%',
  scrub: 1,
  /** Where each card sits in the pile: its tilt (degrees) and a little vertical scatter (px). */
  pile: [
    { rotation: -8, y: 36 },
    { rotation: 5, y: -14 },
    { rotation: -3, y: 22 },
    { rotation: 7, y: -24 },
  ],
  /** The pile is a little smaller than the row. */
  scale: 0.9,
} as const

/**
 * HomeHero: the Stack mark sinks as the page scrolls (scrubbed), slower than the page, so it
 * seems to follow the visitor down and slips off the bottom of the hero, behind the next
 * section.
 */
/**
 * IllustrationScene: the pieces assemble once (seconds, not scroll) when the scene reaches
 * the middle of the screen, or comes fully into view, then idle while it's on screen. Idle
 * loops are slow and small on purpose.
 */
export const illustrationScene = {
  /** IntersectionObserver options for each trigger. */
  trigger: {
    /** A thin band across the middle of the viewport. */
    center: { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    visible: { threshold: 0.95 },
  },
  /** When the first piece starts, and the gap to each next one. */
  lead: 0.1,
  step: 0.07,
  /** Side pieces fly in from this share of the scene width (at least minShift px), tilted (degrees). */
  shift: 0.06,
  minShift: 28,
  tilt: 8,
  loopEase: 'sine.inOut',
  float: { y: 6, duration: 3.2 },
  /** Seconds per turn. */
  spin: 9,
  sway: { angle: 2.5, duration: 3.8 },
  pulse: { scale: 1.06, duration: 1.4, offset: 0.35 },
} as const

export const heroMark = {
  /** Travel over the hero's scroll, as a percentage of the mark's own height. */
  travel: 70,
} as const

export const parallax = {
  /** Default travel as a percentage of the element height. */
  amount: 12,
} as const
