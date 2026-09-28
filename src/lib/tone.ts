/**
 * Pure helpers behind <ToneController>: parse the tone colours, mix them, and work out which
 * tones the page is between for a given scroll position. No DOM access here.
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

export interface ToneWeight {
  tone: ToneName
  weight: number
}

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

/** Eases a morph in and out, so it never starts or lands abruptly. */
const smoothstep = (t: number) => t * t * (3 - 2 * t)

/**
 * How much of each tone the page shows. Each section's tone fades in while its top travels
 * from `from` (px, a page position) up through a band of `band` px. Boundaries fold into
 * each other continuously, so even a short section whose neighbour arrives early never
 * snaps. Weights sum to 1.
 */
export function toneWeights(stops: readonly ToneStop[], from: number, band: number): ToneWeight[] {
  const [first, ...rest] = stops
  if (!first) return [{ tone: 'dark', weight: 1 }]
  const weights = new Map<ToneName, number>([[first.tone, 1]])
  for (const stop of rest) {
    const progress = band > 0 ? clamp01((from - stop.top) / band) : stop.top <= from ? 1 : 0
    if (progress <= 0) break // stops are sorted by top, so none after this has started
    const p = smoothstep(progress)
    for (const [name, weight] of weights) weights.set(name, weight * (1 - p))
    weights.set(stop.tone, (weights.get(stop.tone) ?? 0) + p)
  }
  return [...weights]
    .map(([name, weight]) => ({ tone: name, weight }))
    .filter((w) => w.weight > 1e-4)
}

/** The tone with the most weight: what the page reads as right now. */
export function dominantTone(weights: readonly ToneWeight[]): ToneName {
  return weights.reduce((best, w) => (w.weight > best.weight ? w : best), {
    tone: 'dark' as ToneName,
    weight: -1,
  }).tone
}

/** A weighted average of colours (the weights sum to 1). */
export function weightedColor(items: readonly { color: Rgba; weight: number }[]): Rgba {
  const out: Rgba = [0, 0, 0, 0]
  for (const { color, weight } of items) {
    for (const i of [0, 1, 2, 3] as const) out[i] += color[i] * weight
  }
  return out
}

/** The tone of the section under a page position, or null in a gap between sections. */
export function toneAt(stops: readonly ToneStop[], y: number): ToneName | null {
  return stops.find((stop) => y >= stop.top && y < stop.bottom)?.tone ?? null
}

/**
 * What the page looks like at `y` while the tone flows: a solid section shows its own tone,
 * a flowing one shows the blended page colour, and a gap between sections (the dark header
 * inset above page titles, the footer) is null.
 */
export function surfaceAt(
  stops: readonly ToneStop[],
  y: number,
  blended: ToneName,
): ToneName | null {
  const stop = stops.find((s) => y >= s.top && y < s.bottom)
  if (!stop) return null
  return stop.solid ? stop.tone : blended
}

/** Paper, white and orange carry dark text, so the header switches to its light style. */
export function isLightTone(tone: ToneName): boolean {
  return tone !== 'dark'
}
