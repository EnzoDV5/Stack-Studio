export interface ImageAsset {
  src: string
  /** Required. Use '' only for purely decorative images. */
  alt: string
  width: number
  height: number
  srcSet?: string
  sizes?: string
}

/**
 * Pre-rendered frames played back by scroll (ImageSequence), e.g. the case study phone turn.
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
