/**
 * Pure helpers behind <ToneController>: parse the tone colours, mix them, and work out which
 * section's tone the page shows for a given scroll position. No DOM access here.
 */

export type ToneName = 'dark' | 'paper' | 'white' | 'orange'

/** [r, g, b, a], channels 0–255 and alpha 0–1. */
export type Rgba = [number, number, number, number]

/** A top-level section as measured on the page (document coordinates, px). */
export interface ToneStop {
  tone: ToneName
  top: number
  bottom: number
  /** Paints its own background (Section `solid`) instead of showing the page colour. */
  solid?: boolean
}

/** The header gains its backdrop once the page has scrolled past this (px). */
export const HEADER_BACKDROP_AT = 12

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

export function isToneName(value: string | undefined): value is ToneName {
  return value === 'dark' || value === 'paper' || value === 'white' || value === 'orange'
}

/**
 * Parses the colour formats the tone tokens use: #rgb, #rrggbb, #rrggbbaa, `transparent`,
 * and rgb()/rgba() in comma or space syntax with an optional `/ alpha`.
 */
export function parseColor(input: string): Rgba | null {
  const value = input.trim().toLowerCase()
  if (value === 'transparent') return [0, 0, 0, 0]

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(value)?.[1]
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex
    const channel = (i: number) => parseInt(full.slice(i, i + 2), 16)
    return [channel(0), channel(2), channel(4), full.length === 8 ? channel(6) / 255 : 1]
  }

  const body = /^rgba?\((.+)\)$/.exec(value)?.[1]
  if (!body) return null
  const parts = body
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map((part) => (part.endsWith('%') ? parseFloat(part) / 100 : parseFloat(part)))
  if (parts.length < 3 || parts.some(Number.isNaN)) return null
  const [r = 0, g = 0, b = 0, a = 1] = parts
  return [r, g, b, a]
}

export function mixColor(a: Rgba, b: Rgba, t: number): Rgba {
  const p = clamp01(t)
  const mix = (i: 0 | 1 | 2 | 3) => a[i] + (b[i] - a[i]) * p
  return [mix(0), mix(1), mix(2), mix(3)]
}

export function toCss([r, g, b, a]: Rgba): string {
  const round = (n: number) => Math.round(n)
  return `rgb(${round(r)} ${round(g)} ${round(b)} / ${Math.round(a * 1000) / 1000})`
}

/**
 * The tone the page shows: the last section whose top has crossed `line` (a page position,
 * usually the middle of the viewport). One tone at a time: the page switches when a section
 * crosses the line instead of blending neighbours while you scroll. Solid sections (which
 * paint themselves) never take over the page colour, and nor does a chapter shorter than
 * `minLength` px, so a short section can't make the page flicker. A chapter is a run of
 * touching, non-solid sections in the same tone, so two short paper sections in a row still
 * turn the page paper.
 */
export function activeTone(stops: readonly ToneStop[], line: number, minLength = 0): ToneName {
  let tone: ToneName = stops[0]?.tone ?? 'dark'
  stops.forEach((stop, i) => {
    if (stop.top > line || i === 0) return // sorted by top
    if (stop.solid || chapterLength(stops, i) < minLength) return
    tone = stop.tone
  })
  return tone
}

/** How long the chapter around `stops[index]` is, in px (see `activeTone`). */
function chapterLength(stops: readonly ToneStop[], index: number): number {
  const stop = stops[index]
  if (!stop) return 0
  const joins = (a: ToneStop | undefined, b: ToneStop | undefined) =>
    !!a && !!b && !a.solid && !b.solid && a.tone === b.tone && Math.abs(b.top - a.bottom) < 2
  let first = index
  let last = index
  while (joins(stops[first - 1], stops[first])) first--
  while (joins(stops[last], stops[last + 1])) last++
  return (stops[last]?.bottom ?? stop.bottom) - (stops[first]?.top ?? stop.top)
}

/**
 * What the page looks like at `y` while the tone flows: a solid section shows its own tone,
 * a flowing one shows the page's current tone, and a gap between sections (the dark header
 * inset above page titles, the footer) is null.
 */
export function surfaceAt(stops: readonly ToneStop[], y: number, page: ToneName): ToneName | null {
  const stop = stops.find((s) => y >= s.top && y < s.bottom)
  if (!stop) return null
  return stop.solid ? stop.tone : page
}

/** Paper, white and orange carry dark text, so the header switches to its light style. */
export function isLightTone(tone: ToneName): boolean {
  return tone !== 'dark'
}
