/**
 * Pure helpers for <CountUp>: find the number inside a display string ("R 18 000",
 * "+38%", "2.1s") and re-format any value between 0 and it in the same style, keeping the
 * prefix, suffix, group separator and decimal places.
 */

export interface Countable {
  prefix: string
  value: number
  suffix: string
  decimals: number
  /** Thousands separator as written (space, no-break space or comma), or '' for none. */
  group: string
}

// Digits with optional thousands groups (space, no-break space or comma), then an optional
// decimal part. \s covers the no-break spaces Intl uses for en-ZA grouping.
const NUMBER = /(\d{1,3}(?:([\s,])\d{3})+|\d+)(?:\.(\d+))?/

export function parseCountable(text: string): Countable | null {
  const match = NUMBER.exec(text)
  if (!match) return null
  const [whole, integer = '', group = '', fraction = ''] = match
  const value = Number(`${integer.replace(/[^\d]/g, '')}${fraction ? `.${fraction}` : ''}`)
  if (!Number.isFinite(value)) return null
  return {
    prefix: text.slice(0, match.index),
    value,
    suffix: text.slice(match.index + whole.length),
    decimals: fraction.length,
    group,
  }
}

export function formatCountable(parts: Countable, n: number): string {
  const fixed = Math.max(0, n).toFixed(parts.decimals)
  const [integer = '0', fraction] = fixed.split('.')
  const grouped = parts.group ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, parts.group) : integer
  return `${parts.prefix}${grouped}${fraction ? `.${fraction}` : ''}${parts.suffix}`
}
