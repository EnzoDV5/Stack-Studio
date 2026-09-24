export interface ImageAsset {
  src: string
  /** Required. Use '' only for purely decorative images. */
  alt: string
  width: number
  height: number
  srcSet?: string
  sizes?: string
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
}

/** A media slot that can be an image, a video or both (video with an image poster). */
export interface MediaSlot {
  image: ImageAsset
  video?: VideoAsset
}
