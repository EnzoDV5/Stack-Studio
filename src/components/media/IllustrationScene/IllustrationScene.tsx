import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { sceneLayout, type PieceLayout } from '@/lib/illustration-scene'
import { ease, illustrationScene as motion } from '@/lib/motion-tokens'
import type { IllustrationSceneAsset } from '@/types'
import { ScenePiece } from './ScenePiece'

export interface IllustrationSceneProps {
  scene: IllustrationSceneAsset
  /** The `sizes` for the image (every piece uses it, so they all fetch the same file). */
  sizes: string
  className?: string
}

const flatten = (layouts: PieceLayout[]): PieceLayout[] =>
  layouts.flatMap((layout) => [layout, ...flatten(layout.children)])

/**
 * A flat illustration that comes apart: its pieces (clip-path cut-outs of the same image) fly,
 * pop, grow and draw into place as it scrolls into view (scrubbed), then idle while it's on
 * screen: cards float, an icon spins, a plant sways, dots pulse. With reduced motion it's the
 * plain image.
 */
export function IllustrationScene({ scene, sizes, className }: IllustrationSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
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
      const shift = () => root.offsetWidth * motion.shift

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: ease.out },
        scrollTrigger: {
          trigger: root,
          start: motion.start,
          end: motion.end,
          scrub: motion.scrub,
          invalidateOnRefresh: true,
        },
      })
      tl.from('[data-scene-base]', { opacity: 0, duration: 1.2, ease: ease.outQuart }, 0)

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

      // Idle loops run only while the scene is on screen.
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
      ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: ({ isActive }) =>
          loops.forEach((loop) => (isActive ? loop.play() : loop.pause())),
      })
    },
    { scope: rootRef, dependencies: [animated, scene], revertOnUpdate: true },
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
