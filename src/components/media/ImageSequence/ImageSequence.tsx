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
      const images: HTMLImageElement[] = []
      const state = { frame: 0 }
      let shown = -1
      let alive = true

      /** The nearest loaded frame at or before `index`, else after it. */
      const nearest = (index: number) => {
        for (let i = index; i >= 0; i--) if (loaded[i]) return i
        for (let i = index + 1; i < count; i++) if (loaded[i]) return i
        return -1
      }

      // Draws the scroll position between two frames: a cross-fade of the frame before and the
      // frame after, so the turn glides instead of stepping. Additive ('lighter') drawing of
      // the two weighted frames is an exact blend, transparent edges included. While frames
      // are still loading it falls back to the nearest one that has.
      const draw = () => {
        const position = Math.min(Math.max(state.frame, 0), count - 1)
        if (Math.abs(position - shown) < 0.02) return
        const before = Math.floor(position)
        const after = Math.min(before + 1, count - 1)
        const mix = position - before
        const a = images[before]
        const b = images[after]
        context.clearRect(0, 0, canvas.width, canvas.height)
        if (a && b && loaded[before] && loaded[after] && mix > 0.01) {
          context.globalCompositeOperation = 'lighter'
          context.globalAlpha = 1 - mix
          context.drawImage(a, 0, 0, canvas.width, canvas.height)
          context.globalAlpha = mix
          context.drawImage(b, 0, 0, canvas.width, canvas.height)
          context.globalAlpha = 1
          context.globalCompositeOperation = 'source-over'
        } else {
          const index = nearest(Math.round(position))
          const image = images[index]
          if (!image) return
          context.drawImage(image, 0, 0, canvas.width, canvas.height)
        }
        shown = position
        setReady(true)
      }

      // Coarse to fine: every 8th frame first (a rough turn is ready almost at once), then
      // every 4th, every 2nd and the rest.
      const order: number[] = []
      for (const step of [8, 4, 2, 1]) {
        for (let i = 0; i < count; i += step) if (!order.includes(i)) order.push(i)
      }
      if (!order.includes(count - 1)) order.splice(1, 0, count - 1)
      for (const index of order) {
        const image = new window.Image()
        image.decoding = 'async'
        image.src = rendition.frames[index] ?? ''
        images[index] = image
        image
          .decode()
          .then(() => {
            if (!alive) return
            loaded[index] = true
            shown = -1
            draw()
          })
          .catch(() => undefined)
      }

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
