import { gsap } from '@/lib/gsap'
import type { PieceLayout } from '@/lib/illustration-scene'
import { duration, ease, illustrationScene as motion } from '@/lib/motion-tokens'

/** Every piece, children after their parent. */
export const flattenPieces = (layouts: PieceLayout[]): PieceLayout[] =>
  layouts.flatMap((layout) => [layout, ...flattenPieces(layout.children)])

/** The three layers of each piece (see ScenePiece), looked up by piece id. */
export function pieceLayers(root: HTMLElement) {
  const outer = (id: string) => root.querySelector<HTMLElement>(`[data-piece="${id}"]`)
  const idle = (id: string) => outer(id)?.querySelector<HTMLElement>(':scope > [data-piece-idle]')
  const clip = (id: string) => idle(id)?.querySelector<HTMLElement>(':scope > [data-piece-clip]')
  return { outer, idle, clip }
}

/**
 * Adds one piece's entrance to `tl` at `at` seconds. The timeline's defaults set the duration
 * and ease. Side pieces travel a share of the scene's width, so it reads the same at any size.
 */
export function addPieceEnter(
  tl: gsap.core.Timeline,
  root: HTMLElement,
  { piece, clip: shape, clipFrom }: PieceLayout,
  at: number,
) {
  const { outer, clip } = pieceLayers(root)
  const node = outer(piece.id)
  if (!node) return
  const shift = () => Math.max(root.offsetWidth * motion.shift, motion.minShift)
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
        tl.fromTo(target, { clipPath: clipFrom }, { clipPath: shape, ease: ease.outQuart }, at)
      break
    }
    case 'launch':
      tl.from(
        node,
        { yPercent: motion.launch.from, opacity: 0, duration: duration.slow, ease: ease.out },
        at,
      )
      break
    case 'click': {
      // Flies in from below right, then presses down and lets go.
      tl.from(
        node,
        { x: () => shift(), y: () => shift() * 0.8, rotation: motion.tilt, opacity: 0 },
        at,
      )
      tl.to(
        node,
        {
          scale: motion.click.press,
          duration: motion.click.duration,
          ease: ease.outQuart,
          yoyo: true,
          repeat: 1,
        },
        at + duration.base * motion.click.at,
      )
      break
    }
  }
}

/** The pieces' idle loops, paused: play them once the scene is assembled and on screen. */
export function pieceLoops(root: HTMLElement, pieces: PieceLayout[]): gsap.core.Tween[] {
  const { idle } = pieceLayers(root)
  let pulses = 0
  return pieces.flatMap(({ piece }, i) => {
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
}
