import { useRef, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, phoneTurn } from '@/lib/motion-tokens'
import type { ImageSequenceAsset } from '@/types'

export interface ImageSequenceProps {
  sequence: ImageSequenceAsset
  /** Responsive sizes hint for the still (the last frame). */
  sizes?: string
  /** Scroll positions that start and finish playback (ScrollTrigger syntax). */
  start?: string
  end?: string
  className?: string
}

type Rendition = ImageSequenceAsset['renditions'][number]

/** The smallest rendition that is still sharp at the slot's size, else the largest. */
function pickRendition(renditions: Rendition[], slotWidth: number): Rendition | undefined {
  const needed = slotWidth * Math.min(window.devicePixelRatio || 1, 2)
  const sorted = [...renditions].sort((a, b) => a.width - b.width)
  return sorted.find((r) => r.width >= needed * 0.9) ?? sorted.at(-1)
}

/**
 * Pre-rendered frames played back by scroll, like the product turns on Apple's pages: the
 * frames load as it approaches, then each scroll position draws its frame on a canvas
 * (scrubbed, so it glides rather than steps). Until the first frame is drawn, and with
 * reduced motion or without JS, the last frame is shown as a plain image with the alt text.
 */
export function ImageSequence({
  sequence,
  sizes = '100vw',
  start = phoneTurn.start,
  end = phoneTurn.end,
  className,
}: ImageSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()
  const near = useInView(rootRef, { rootMargin: '100% 0px', once: true })
  const [ready, setReady] = useState(false)
  const playing = near && !reducedMotion

  const stills = sequence.renditions.flatMap((r) => {
    const last = r.frames.at(-1)
    return last ? [{ src: last, width: r.width }] : []
  })
  const largest = [...stills].sort((a, b) => b.width - a.width)[0]

  useGSAP(
    () => {
      const root = rootRef.current
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!playing || !root || !canvas || !context) return
      const rendition = pickRendition(sequence.renditions, root.clientWidth)
      if (!rendition) return

      const count = rendition.frames.length
      canvas.width = rendition.width
      canvas.height = Math.round((rendition.width * sequence.height) / sequence.width)
      const loaded: boolean[] = new Array<boolean>(count).fill(false)
      const state = { frame: 0 }
      let shown = -1
      let alive = true

      // Draws the frame for the scroll position, or the nearest one that has loaded.
      const draw = () => {
        const target = Math.round(state.frame)
        let index = target
        while (index >= 0 && !loaded[index]) index--
        if (index < 0) {
          index = target
          while (index < count && !loaded[index]) index++
        }
        const image = images[index]
        if (!image || !loaded[index] || index === shown) return
        shown = index
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        setReady(true)
      }

      const images = rendition.frames.map((src, index) => {
        const image = new window.Image()
        image.decoding = 'async'
        image.src = src
        image
          .decode()
          .then(() => {
            if (!alive) return
            loaded[index] = true
            draw()
          })
          .catch(() => undefined)
        return image
      })

      gsap.to(state, {
        frame: count - 1,
        ease: ease.none,
        onUpdate: draw,
        scrollTrigger: { trigger: root, start, end, scrub: phoneTurn.scrub },
      })

      return () => {
        alive = false
        // Stops frames still downloading (an empty src would request the page itself).
        for (const image of images) image.removeAttribute('src')
      }
    },
    { scope: rootRef, dependencies: [playing, sequence, start, end], revertOnUpdate: true },
  )

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      style={{ aspectRatio: `${sequence.width} / ${sequence.height}` }}
    >
      {largest && (
        <img
          src={largest.src}
          srcSet={stills.map((s) => `${s.src} ${s.width}w`).join(', ')}
          sizes={sizes}
          width={sequence.width}
          height={sequence.height}
          alt={sequence.alt}
          loading="lazy"
          decoding="async"
          // Kept in the page for its alt text; the canvas covers it once a frame is drawn.
          className={cn('absolute inset-0 size-full', playing && ready && 'opacity-0')}
        />
      )}
      {!reducedMotion && (
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      )}
    </div>
  )
}
