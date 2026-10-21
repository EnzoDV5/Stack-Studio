import { useRef } from 'react'
import { useIntro } from '@/app/providers/IntroProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { sceneLayout } from '@/lib/illustration-scene'
import { duration, ease, illustrationScene as motion } from '@/lib/motion-tokens'
import type { IllustrationSceneAsset } from '@/types'
import { addPieceEnter, flattenPieces, pieceLoops } from './scene-motion'
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

/** Runs `callback` with each change in whether `el` meets the observer's conditions. */
function observe(
  el: Element,
  options: IntersectionObserverInit,
  callback: (hit: boolean, entry: IntersectionObserverEntry) => void,
) {
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1]
    if (entry) callback(entry.isIntersecting && entry.intersectionRatio >= minRatio(options), entry)
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
      const pieces = flattenPieces(layout.pieces)

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
      pieces.forEach((piece, i) => addPieceEnter(tl, root, piece, motion.lead + i * motion.step))
      const loops = pieceLoops(root, pieces)

      // Rebuilt after it has played (e.g. a wipe came and went): show it finished.
      if (played.current) tl.progress(1)
      const play = () => {
        if (played.current || !ready) return
        played.current = true
        tl.play()
        stopPlay?.()
      }
      const stopPlay =
        ready && !played.current
          ? observe(root, motion.trigger[trigger], (hit) => {
              if (hit) play()
            })
          : undefined
      const stopWatch = observe(root, {}, (hit, entry) => {
        onScreen = hit
        syncLoops()
        // A jump (an anchor, a reload mid-page) can carry a centre-triggered scene past the
        // middle without touching it: if it arrives on screen already above the middle, play.
        if (hit && trigger === 'center' && entry.boundingClientRect.top < window.innerHeight / 2) {
          play()
        }
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
