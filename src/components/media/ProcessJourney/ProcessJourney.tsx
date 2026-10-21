import { useRef } from 'react'
import { useIntro } from '@/app/providers/IntroProvider'
import {
  addPieceEnter,
  flattenPieces,
  pieceLoops,
  ScenePiece,
} from '@/components/media/IllustrationScene'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { sceneLayout } from '@/lib/illustration-scene'
import { duration, ease, processJourney as motion } from '@/lib/motion-tokens'
import type { IllustrationJourneyAsset } from '@/types'

export interface ProcessJourneyProps {
  scene: IllustrationJourneyAsset
  /** One title per step, in order; each sits under its stage. */
  steps: string[]
  /** The `sizes` for the image (every piece uses it, so they all fetch the same file). */
  sizes: string
  className?: string
}

const number = (i: number) => String(i + 1).padStart(2, '0')

/**
 * The process as one illustrated path, with a rail of numbered steps under it (its labels size
 * to the strip: numbers only when narrow). Once it's in
 * view (after the preloader or page wipe) the steps play one after another: the path draws to
 * each stage, the stage does its own move (the brief pops out and writes itself, the wireframe
 * sketches, the cursor clicks, the code types, the rocket launches, the gear spins up), and
 * the rail's fill reaches its label, which lights up. Then the idle loops run while it's on
 * screen. With reduced motion it's the plain image and the labels.
 */
export function ProcessJourney({ scene, steps, sizes, className }: ProcessJourneyProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const played = useRef(false)
  const reducedMotion = useReducedMotion()
  const { ready } = useIntro()
  const animated = !reducedMotion && scene.pieces.length > 0
  const layout = sceneLayout(scene.pieces)
  const { image, stops } = scene

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || !animated) return
      const pieces = flattenPieces(layout.pieces)
      const fill = root.querySelector<HTMLElement>('[data-rail-fill]')
      const labels = gsap.utils.toArray<HTMLElement>('[data-stop-label]', root)
      const dots = gsap.utils.toArray<HTMLElement>('[data-stop-dot]', root)

      // Idle loops run once every step has played, and only while it's on screen.
      let assembled = false
      let onScreen = false
      const syncLoops = () =>
        loops.forEach((loop) => (assembled && onScreen ? loop.play() : loop.pause()))

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: duration.base, ease: ease.out },
        onComplete: () => {
          assembled = true
          syncLoops()
        },
      })
      stops.forEach((stop, step) => {
        const at = motion.lead + step * motion.step
        if (fill)
          tl.fromTo(
            fill,
            { scaleX: step === 0 ? 0 : (stops[step - 1] ?? 0) / 100 },
            { scaleX: stop / 100, duration: motion.rail, immediateRender: step === 0 },
            at,
          )
        pieces
          .filter(({ piece }) => piece.step === step)
          .forEach((piece, i) => addPieceEnter(tl, root, piece, at + i * motion.piece))
        const lights = at + motion.rail * 0.6
        const dot = dots[step]
        const label = labels[step]
        if (dot)
          tl.fromTo(
            dot,
            { scale: 0 },
            { scale: 1, duration: duration.fast, ease: ease.outQuart },
            lights,
          )
        if (label)
          tl.fromTo(label, { opacity: motion.dim }, { opacity: 1, duration: duration.fast }, lights)
      })
      const loops = pieceLoops(root, pieces)

      // Rebuilt after it has played (e.g. a wipe came and went): show it finished.
      if (played.current) tl.progress(1)
      // Starts on the next frame, so a remount straight after (React's dev double effects) cancels
      // it rather than finding it already played and skipping to the end.
      let frame = 0
      const play = () => {
        if (played.current || frame) return
        frame = requestAnimationFrame(() => {
          played.current = true
          tl.play()
        })
      }
      const enter = ready
        ? ScrollTrigger.create({ trigger: root, start: motion.start, once: true, onEnter: play })
        : undefined
      // Mounted already past the start (a reload mid-page): play now.
      if (enter && enter.scroll() >= enter.start) play()
      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          onScreen = self.isActive
          syncLoops()
        },
      })
      return () => cancelAnimationFrame(frame)
    },
    { scope: rootRef, dependencies: [animated, ready, scene], revertOnUpdate: true },
  )

  return (
    <div ref={rootRef} className={cn('@container relative', className)}>
      <div className="relative">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={image.alt}
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

      {/* The rail: a hairline with a fill that travels from step to step. */}
      <div className="relative mt-3 border-t border-tone">
        <span
          data-rail-fill
          aria-hidden="true"
          className="absolute -top-px left-0 h-px w-full origin-left bg-orange"
          style={{ transform: `scaleX(${(stops[stops.length - 1] ?? 100) / 100})` }}
        />
        <ol className="relative h-12 sm:h-14">
          {steps.map((title, i) => (
            <li
              key={title}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${stops[i] ?? 0}%` }}
            >
              <span
                data-stop-dot
                aria-hidden="true"
                className="-mt-0.75 size-1.5 rounded-pill bg-orange"
              />
              <span data-stop-label className="mt-2.5 flex flex-col items-center gap-1">
                <span className="eyebrow text-accent">{number(i)}</span>
                <span className="hidden text-[0.6875rem] font-medium whitespace-nowrap @min-[26rem]:block @min-[44rem]:text-small">
                  {title}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
