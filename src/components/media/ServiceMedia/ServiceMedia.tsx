import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { pickVideoSource } from '@/lib/video-source'
import type { ServiceMediaItem } from '@/types/service-media'

export interface ServiceMediaProps {
  item: ServiceMediaItem
  active: boolean
  paused: boolean
  sizes: string
}

/**
 * Only the visible, active card requests or plays video, and it requests the smallest encode
 * that is sharp at the size the card is shown (measured when it starts). Posters always
 * remain available.
 */
export function ServiceMedia({ item, active, paused, sizes }: ServiceMediaProps) {
  const root = useRef<HTMLSpanElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const visible = useInView(root, { threshold: 0.2 })
  const reducedMotion = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const load = active && visible && !reducedMotion
  const shouldPlay = load && !paused

  // Attach the source only while needed. Removing it releases the decoder and resets playback.
  useEffect(() => {
    const element = video.current
    const box = root.current
    if (!element || !box || !item.video) return
    if (load) {
      const src = pickVideoSource(
        item.video,
        { width: box.clientWidth, height: box.clientHeight },
        window.devicePixelRatio,
      )
      if (element.getAttribute('src') !== src) element.src = src
    } else if (element.hasAttribute('src')) {
      element.removeAttribute('src')
      element.load()
    }
  }, [load, item.video])

  useEffect(() => {
    const element = video.current
    if (!element) return
    const sync = () => {
      if (shouldPlay && !document.hidden) {
        void element.play().catch(() => {
          /* The image remains visible if autoplay fails. */
        })
      } else {
        element.pause()
        if (!active && element.readyState > 0) element.currentTime = 0
      }
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => {
      document.removeEventListener('visibilitychange', sync)
      element.pause()
    }
  }, [active, shouldPlay])

  return (
    <span ref={root} className="absolute inset-0 block overflow-hidden bg-ink-700">
      <img
        src={item.image.src}
        srcSet={item.image.srcSet}
        sizes={sizes}
        width={item.image.width}
        height={item.image.height}
        alt={item.image.alt}
        loading="lazy"
        decoding="async"
        className="size-full! object-cover"
      />
      {item.video && (
        <video
          ref={video}
          // No poster: the <img> underneath already shows it, and a poster attribute downloads
          // straight away, ignoring the image's lazy loading.
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          width={item.video.width}
          height={item.video.height}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setPlaying(false)}
          className={cn(
            'absolute inset-0 size-full! object-cover',
            !(playing && shouldPlay) && 'opacity-0',
          )}
        />
      )}
    </span>
  )
}
