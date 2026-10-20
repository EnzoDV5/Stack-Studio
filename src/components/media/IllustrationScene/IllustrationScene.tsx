import { useRef } from 'react'
import { useIntro } from '@/app/providers/IntroProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { sceneLayout, type PieceLayout } from '@/lib/illustration-scene'
import { duration, ease, illustrationScene as motion } from '@/lib/motion-tokens'
import type { IllustrationSceneAsset } from '@/types'
import { ScenePiece } from './ScenePiece'

export interface IllustrationSceneProps {
  scene: IllustrationSceneAsset
  /** The `sizes` for the image (every piece uses it, so they all fetch the same file). */
  sizes: string
  /**
   * When it assembles: `center` once it crosses the middle of the screen, `visible` once it's
   * fully in view (e.g. the last card of a sideways reel or carousel, which never crosses
   * the middle on the way in).
   */
  trigger?: 'center' | 'visible'
  /** Seconds to wait once triggered, e.g. to cascade a row of icons. */
  delay?: number
  className?: string
}

const flatten = (layouts: PieceLayout[]): PieceLayout[] =>
  layouts.flatMap((layout) => [layout, ...flatten(layout.children)])

/** Runs `callback` with each change in whether `el` meets the observer's conditions. */
function observe(el: Element, options: IntersectionObserverInit, callback: (hit: boolean) => void) {
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1]
    if (entry) callback(entry.isIntersecting && entry.intersectionRatio >= minRatio(options))
  }, options)
  observer.observe(el)
  return () => observer.disconnect()
}

const minRatio = ({ threshold }: IntersectionObserverInit) =>
  typeof threshold === 'number' ? threshold : 0

/**
 * A flat illustration that comes apart: its pieces (clip-path cut-outs of the same image) sit
 * hidden until it reaches the middle of the screen (or comes fully into view), then fly, pop,
 * grow and draw into place, once. After that they idle while on screen: cards float, an icon
 * spins, a plant sways, dots pulse. IntersectionObserver sees where it really is, so this
 * works inside the sideways reel and the carousel too. With reduced motion it's the plain
 * image.
 */
export function IllustrationScene({
  scene,
  sizes,
  trigger = 'center',
  delay = 0,
  className,
}: IllustrationSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const played = useRef(false)
  const reducedMotion = useReducedMotion()
  // Nothing assembles under the preloader or page wipe.
  const { ready } = useIntro()
  const animated = !reducedMotion && scene.pieces.length > 0
  const layout = sceneLayout(scene.pieces)
  const { image } = scene

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || !animated) return
      const pieces = flatten(layout.pieces)
      const outer = (id: string) => root.querySelector<HTMLElement>(`[data-piece="${id}"]`)
      const idle = (id: string) =>
        outer(id)?.querySelector<HTMLElement>(':scope > [data-piece-idle]')
      const clip = (id: string) =>
        idle(id)?.querySelector<HTMLElement>(':scope > [data-piece-clip]')
      const shift = () => Math.max(root.offsetWidth * motion.shift, motion.minShift)

      // Idle loops run once it's assembled, and only while it's on screen.
      let assembled = false
      let onScreen = false
      const syncLoops = () =>
        loops.forEach((loop) => (assembled && onScreen ? loop.play() : loop.pause()))

      const tl = gsap.timeline({
        paused: true,
        delay,
        defaults: { duration: duration.base, ease: ease.out },
        onComplete: () => {
          assembled = true
          syncLoops()
        },
      })
      pieces.forEach(({ piece, clip: shape, clipFrom }, i) => {
        const node = outer(piece.id)
        if (!node) return
        const at = motion.lead + i * motion.step
        switch (piece.enter) {
          case 'left':
          case 'right': {
            const side = piece.enter === 'left' ? -1 : 1
            tl.from(node, { x: () => side * shift(), rotation: side * motion.tilt, opacity: 0 }, at)
            break
          }
          case 'rise':
            tl.from(node, { y: () => shift() * 0.6, opacity: 0 }, at)
            break
          case 'pop':
            tl.from(node, { scale: 0, opacity: 0 }, at)
            break
          case 'grow':
            tl.from(node, { scaleY: 0.2, rotation: -motion.tilt, opacity: 0 }, at)
            break
          case 'draw': {
            const target = clip(piece.id)
            if (target)
              tl.fromTo(
                target,
                { clipPath: clipFrom },
                { clipPath: shape, ease: ease.outQuart },
                at,
              )
            break
          }
        }
      })

      let pulses = 0
      const loops = pieces.flatMap(({ piece }, i) => {
        const node = idle(piece.id)
        if (!node || !piece.idle) return []
        const loop = { repeat: -1, yoyo: true, ease: motion.loopEase, paused: true }
        switch (piece.idle) {
          case 'float':
            return gsap.to(node, {
              ...loop,
              y: -motion.float.y,
              duration: motion.float.duration + (i % 3) * 0.45,
            })
          case 'spin':
            return gsap.to(node, {
              rotation: 360,
              duration: motion.spin,
              ease: ease.none,
              repeat: -1,
              paused: true,
            })
          case 'sway':
            return gsap.fromTo(
              node,
              { rotation: -motion.sway.angle },
              { ...loop, rotation: motion.sway.angle, duration: motion.sway.duration },
            )
          case 'pulse':
            return gsap.to(node, {
              ...loop,
              scale: motion.pulse.scale,
              duration: motion.pulse.duration,
              delay: pulses++ * motion.pulse.offset,
            })
        }
      })

      // Rebuilt after it has played (e.g. a wipe came and went): show it finished.
      if (played.current) tl.progress(1)
      const stopPlay =
        ready && !played.current
          ? observe(root, motion.trigger[trigger], (hit) => {
              if (!hit) return
              played.current = true
              tl.play()
              stopPlay?.()
            })
          : undefined
      const stopWatch = observe(root, {}, (hit) => {
        onScreen = hit
        syncLoops()
      })
      return () => {
        stopPlay?.()
        stopWatch()
      }
    },
    {
      scope: rootRef,
      dependencies: [animated, delay, ready, scene, trigger],
      revertOnUpdate: true,
    },
  )

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <img
        data-scene-base=""
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
        style={animated ? { clipPath: layout.base } : undefined}
      />
      {animated && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {layout.pieces.map((piece) => (
            <ScenePiece key={piece.piece.id} layout={piece} image={image} sizes={sizes} />
          ))}
        </div>
      )}
    </div>
  )
}
