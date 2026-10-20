/**
 * Geometry for IllustrationScene: a flat illustration cut into pieces with clip-path polygons.
 * Every piece is its own layer, sized to its outline (not the whole image, so moving pieces
 * stay small on the GPU), holding a copy of the full image shifted so it lines up with the
 * original. All values are percentages, so the scene scales with its container.
 */
import type { IllustrationPiece, IllustrationPoint } from '@/types'

/** A box in percentages of its container (the scene, or the parent piece). */
export interface SceneBox {
  left: number
  top: number
  width: number
  height: number
}

export interface PieceLayout {
  piece: IllustrationPiece
  /** The layer, in percentages of its parent piece's layer (or the scene). */
  box: SceneBox
  /** The full image inside the layer, positioned so it lines up with the scene. */
  image: SceneBox
  /** The layer's clip-path: its shape, less any child pieces. */
  clip: string
  /** The clip squeezed to its left edge, where a `draw` piece starts. */
  clipFrom: string
  /** transform-origin inside the layer. */
  origin: string
  children: PieceLayout[]
}

export interface SceneLayout {
  /** The clip-path for the static image: everything except the pieces. */
  base: string
  pieces: PieceLayout[]
}

const SCENE: SceneBox = { left: 0, top: 0, width: 100, height: 100 }
const FULL: IllustrationPoint[] = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
]

const round = (n: number) => Math.round(n * 1000) / 1000
const point = ([x, y]: IllustrationPoint) => `${round(x)}% ${round(y)}%`

/** The bounding box of a shape. */
export function bounds(shape: readonly IllustrationPoint[]): SceneBox {
  const xs = shape.map(([x]) => x)
  const ys = shape.map(([, y]) => y)
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  return { left, top, width: Math.max(...xs) - left, height: Math.max(...ys) - top }
}

/** Re-expresses a point in a box's own percentages. */
const within =
  (box: SceneBox) =>
  ([x, y]: IllustrationPoint): IllustrationPoint => [
    ((x - box.left) / box.width) * 100,
    ((y - box.top) / box.height) * 100,
  ]

/**
 * A clip-path polygon with holes. The even-odd rule cuts each hole out; zero-width bridges
 * from the first corner join them into the one outline a polygon() needs.
 */
export function clipPolygon(
  outer: readonly IllustrationPoint[],
  holes: readonly (readonly IllustrationPoint[])[] = [],
): string {
  const start = outer[0]
  if (!start || holes.length === 0) return `polygon(${outer.map(point).join(', ')})`
  const path: IllustrationPoint[] = [...outer, start]
  for (const hole of holes) {
    const first = hole[0]
    if (first) path.push(...hole, first, start)
  }
  return `polygon(evenodd, ${path.map(point).join(', ')})`
}

/** Lays out the pieces: each as a layer inside its parent, with its clip and pivot. */
export function sceneLayout(pieces: readonly IllustrationPiece[]): SceneLayout {
  const childrenOf = (id?: string) => pieces.filter((piece) => piece.parent === id)

  const layout = (piece: IllustrationPiece, parent: SceneBox): PieceLayout => {
    const own = bounds(piece.shape)
    const local = within(own)
    const squeeze = ([, y]: IllustrationPoint): IllustrationPoint => [0, y]
    const shape = piece.shape.map(local)
    const holes = childrenOf(piece.id).map((child) => child.shape.map(local))
    return {
      piece,
      box: {
        left: ((own.left - parent.left) / parent.width) * 100,
        top: ((own.top - parent.top) / parent.height) * 100,
        width: (own.width / parent.width) * 100,
        height: (own.height / parent.height) * 100,
      },
      image: {
        left: (-own.left / own.width) * 100,
        top: (-own.top / own.height) * 100,
        width: (100 / own.width) * 100,
        height: (100 / own.height) * 100,
      },
      clip: clipPolygon(shape, holes),
      clipFrom: clipPolygon(
        shape.map(squeeze),
        holes.map((hole) => hole.map(squeeze)),
      ),
      origin: point(piece.origin ? local(piece.origin) : [50, 50]),
      children: childrenOf(piece.id).map((child) => layout(child, own)),
    }
  }

  const top = childrenOf(undefined)
  return {
    base: clipPolygon(
      FULL,
      top.map((piece) => piece.shape),
    ),
    pieces: top.map((piece) => layout(piece, SCENE)),
  }
}
