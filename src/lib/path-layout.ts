/**
 * Layout for PathChooser's horizontal accordion. Every panel is absolutely positioned and
 * as wide as the open panel; opening one moves the panels after it (translateX) and
 * uncovers it (clip-path), so the animation never touches width or flex.
 */

export interface PanelPlacement {
  /** translateX from the container's left edge, px. */
  x: number
  /** clip-path inset from the right, px: how much of the panel is hidden. */
  clipRight: number
}

export interface AccordionLayout {
  /** Width of the open panel (and of every panel box), px. */
  expanded: number
  panels: PanelPlacement[]
}

export function accordionLayout(
  count: number,
  active: number,
  width: number,
  collapsed: number,
): AccordionLayout {
  const expanded = Math.max(collapsed, width - Math.max(0, count - 1) * collapsed)
  const panels = Array.from({ length: count }, (_, i) => ({
    x: i * collapsed + (i > active ? expanded - collapsed : 0),
    clipRight: i === active ? 0 : expanded - collapsed,
  }))
  return { expanded, panels }
}

/** Arrow-key navigation across panels, wrapping at both ends. */
export function nextIndex(key: string, current: number, count: number): number | null {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % count
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + count) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}
