import { useEffect, useRef, useState } from 'react'
import { Image } from '@/components/media/Image'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import type { VideoAsset } from '@/types'
import styles from './Video.module.css'

export interface VideoProps {
  video: VideoAsset
  /**
   * 'inView' plays while visible (IntersectionObserver). 'controlled' plays only when
   * `playing` is true (e.g. hover previews).
   */
  mode?: 'inView' | 'controlled'
  playing?: boolean
  /** Poster is the LCP element (hero). */
  priority?: boolean
  /** 'none' renders no poster/gradient layer, for overlays on top of an existing image. */
  fallback?: 'auto' | 'none'
  sizes?: string
  className?: string
}

/**
 * Background / preview video: muted, inline, looped, preload="none", and it only plays
 * while needed. Until frames are actually playing, it shows the poster, or an animated
 * brand gradient when there is no poster. A missing file (404) or unsupported source
 * therefore degrades gracefully. With reduced motion it never autoplays.
 */
export function Video({
  video,
  mode = 'inView',
  playing = false,
  priority = false,
  fallback = 'auto',
  sizes,
  className,
}: VideoProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const reducedMotion = useReducedMotion()
  const inView = useInView(rootRef, { threshold: 0.15 })

  const shouldPlay = !failed && !reducedMotion && (mode === 'inView' ? inView : playing && inView)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (shouldPlay) {
      el.play().catch(() => {
        // Autoplay blocked or source unusable. Keep showing the fallback.
      })
    } else if (!el.paused) {
      el.pause()
    }
  }, [shouldPlay])

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      {fallback === 'auto' &&
        (video.poster ? (
          <Image image={video.poster} priority={priority} sizes={sizes} className={styles.layer} />
        ) : (
          <div
            className={cn(
              styles.layer,
              styles.gradient,
              // Hold the drift while it can't be seen (off screen, or under a playing video).
              (!inView || isPlaying) && styles.still,
            )}
            aria-hidden="true"
          />
        ))}

      {!failed && (
        <video
          ref={videoRef}
          className={cn(styles.layer, styles.video, isPlaying && styles.playing)}
          src={video.src}
          muted
          playsInline
          loop
          preload="none"
          width={video.width}
          height={video.height}
          aria-label={video.label}
          disablePictureInPicture
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setFailed(true)
            setIsPlaying(false)
          }}
        />
      )}

      {/* Screen readers get the description even when only the fallback shows. */}
      {failed && <span className="visually-hidden">{video.label}</span>}
    </div>
  )
}
