/**
 * Geometry for the WorkReel's opening move: the first panel's media starts covering the
 * whole section (full-bleed) and scrubs down into its framed card. Only transform and
 * clip-path change, so the card keeps its real layout size the whole time.
 */

export interface Box {
  /** Position relative to the section, px. */
  x: number
  y: number
  width: number
  height: number
}

export interface CoverTransform {
  scale: number
  /** Translation with transform-origin at the card's top-left, px. */
  x: number
  y: number
  /** clip-path insets in the card's own (unscaled) pixels. */
  inset: { top: number; right: number; bottom: number; left: number }
}

/**
 * The transform that makes `card` exactly cover a `width` × `height` area at the section's
 * origin: scale it up until it covers, clip the overflow symmetrically, then move the
 * visible part to 0,0.
 */
export function coverFrom(card: Box, area: { width: number; height: number }): CoverTransform {
  if (card.width <= 0 || card.height <= 0) {
    return { scale: 1, x: 0, y: 0, inset: { top: 0, right: 0, bottom: 0, left: 0 } }
  }
  const scale = Math.max(area.width / card.width, area.height / card.height)
  const insetX = (card.width - area.width / scale) / 2
  const insetY = (card.height - area.height / scale) / 2
  return {
    scale,
    x: -card.x - scale * insetX,
    y: -card.y - scale * insetY,
    inset: { top: insetY, right: insetX, bottom: insetY, left: insetX },
  }
}

export function insetPath(inset: CoverTransform['inset'], radius: number): `inset(${string})` {
  const px = (n: number) => `${Math.round(n * 100) / 100}px`
  return `inset(${px(inset.top)} ${px(inset.right)} ${px(inset.bottom)} ${px(inset.left)} round ${px(radius)})`
}

/** Pinned scroll distance: proportional to the number of panels after the first. */
export function pinDistance(panels: number, viewportHeight: number, perPanel: number): number {
  return Math.max(0, panels - 1) * perPanel * viewportHeight
}

/**
 * Where the page must be scrolled for `offset` px of horizontal travel, so a focused panel
 * can be brought into view while the gallery is pinned.
 */
export function scrollForOffset(
  offset: number,
  travel: number,
  start: number,
  distance: number,
): number {
  if (travel <= 0) return start
  const progress = Math.min(1, Math.max(0, offset / travel))
  return start + progress * distance
}
