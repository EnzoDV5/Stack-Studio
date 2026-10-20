import type { PieceLayout } from '@/lib/illustration-scene'
import type { ImageAsset } from '@/types'

export interface ScenePieceProps {
  layout: PieceLayout
  image: ImageAsset
  sizes: string
}

const box = ({ left, top, width, height }: PieceLayout['box']) => ({
  left: `${left}%`,
  top: `${top}%`,
  width: `${width}%`,
  height: `${height}%`,
})

/**
 * One piece of an IllustrationScene, three layers deep so the motions never fight: the outer
 * layer takes the scroll assembly, the middle one the idle loop, the inner one the clip (with
 * a copy of the full image lined up behind it). Child pieces ride along inside the middle layer.
 */
export function ScenePiece({ layout, image, sizes }: ScenePieceProps) {
  const { piece, origin, clip, children } = layout
  return (
    <div
      data-piece={piece.id}
      className="absolute"
      style={{ ...box(layout.box), transformOrigin: origin }}
    >
      <div data-piece-idle="" className="absolute inset-0" style={{ transformOrigin: origin }}>
        <div data-piece-clip="" className="absolute inset-0" style={{ clipPath: clip }}>
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={sizes}
            width={image.width}
            height={image.height}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute max-w-none"
            style={box(layout.image)}
          />
        </div>
        {children.map((child) => (
          <ScenePiece key={child.piece.id} layout={child} image={image} sizes={sizes} />
        ))}
      </div>
    </div>
  )
}
