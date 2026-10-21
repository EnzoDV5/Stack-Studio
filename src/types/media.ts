export interface ImageAsset {
  src: string
  /** Required. Use '' only for purely decorative images. */
  alt: string
  width: number
  height: number
  srcSet?: string
  sizes?: string
}

/** A client logo drawn for each page tone, so it sits straight on either with no plate. */
export interface ClientLogoSet {
  onDark: ImageAsset
  onLight: ImageAsset
}

/** A point on an illustration, as percentages of its width and height. */
export type IllustrationPoint = readonly [x: number, y: number]

/**
 * One piece cut out of a flat illustration (IllustrationScene): a polygon over the same image,
 * so it can move on its own. Pieces never overlap, except a child inside its parent, which is
 * cut out of the parent and moves with it. The image must have a transparent background.
 */
export interface IllustrationPiece {
  id: string
  shape: readonly IllustrationPoint[]
  /** The piece this one sits inside. */
  parent?: string
  /**
   * How it assembles as the scene scrolls into view (`draw` wipes in from the left, `launch`
   * blasts up from below, `click` flies in and presses like a cursor).
   */
  enter: 'left' | 'right' | 'rise' | 'pop' | 'grow' | 'draw' | 'launch' | 'click'
  /** What it does once on screen. */
  idle?: 'float' | 'spin' | 'sway' | 'pulse'
  /** Pivot for pop, grow, spin, sway and pulse. Defaults to the centre of the shape. */
  origin?: IllustrationPoint
  /** In a journey (ProcessJourney), the step (0-based) it plays in. */
  step?: number
}

/** A flat illustration and the pieces it comes apart into. */
export interface IllustrationSceneAsset {
  image: ImageAsset
  pieces: readonly IllustrationPiece[]
}

/** A scene that plays as a row of steps, left to right (ProcessJourney). */
export interface IllustrationJourneyAsset extends IllustrationSceneAsset {
  /** Where each step's stage sits, as % of the width: its label goes under it. */
  stops: readonly number[]
}

/**
 * Pre-rendered frames played back by scroll (ImageSequence), e.g. the Services phone turn.
 * Every rendition has the same frames at a different width; the player picks the sharpest one
 * the slot needs. The last frame doubles as the still (no JS, reduced motion).
 */
export interface ImageSequenceAsset {
  /** Largest rendition's size, for the aspect ratio. */
  width: number
  height: number
  renditions: { width: number; frames: string[] }[]
  /** Describes the finished pose (the last frame). */
  alt: string
}

export interface VideoAsset {
  src: string
  type?: 'video/mp4' | 'video/webm'
  /** Shown before playback and as the fallback when the file is missing. */
  poster?: ImageAsset
  /** Accessible description of what the video shows. */
  label: string
  width: number
  height: number
  /**
   * Smaller encodes of the same clip. The player picks the smallest one that is still sharp
   * at the size it's shown (lib/video-source.ts), so small slots never fetch the full file.
   */
  renditions?: { src: string; width: number }[]
}

/** A media slot that can be an image, a video or both (video with an image poster). */
export interface MediaSlot {
  image: ImageAsset
  video?: VideoAsset
}
