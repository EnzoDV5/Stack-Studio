/**
 * Pure maths for the Home process timeline (ProcessLine): a playhead sweeps across the
 * week columns with scroll, each bar draws as the playhead crosses it, and the readout shows
 * the steps running in the current column.
 */

export interface Span {
  /** 1-based, inclusive column indexes. */
  from: number
  to: number
}

/** The 0-based column the playhead is in at `progress` (0–1). */
export function columnAt(progress: number, count: number): number {
  if (count <= 0) return 0
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)))
}

/** Indexes of the steps whose span covers the 0-based `column`, in step order. */
export function stepsAt(spans: Span[], column: number): number[] {
  const at = column + 1
  return spans.flatMap((span, index) => (span.from <= at && at <= span.to ? [index] : []))
}

/**
 * Where a bar's draw sits on a 0–1 timeline so it grows exactly under the playhead:
 * it starts when the playhead enters its first column and ends as it leaves the last.
 */
export function barTiming(span: Span, count: number): { position: number; duration: number } {
  const from = Math.max(1, Math.min(count, span.from))
  const to = Math.max(from, Math.min(count, span.to))
  return { position: (from - 1) / count, duration: (to - from + 1) / count }
}

/** Where a step is relative to the playhead column: drives dimming and the bar colour. */
export function stepState(span: Span, column: number): 'upcoming' | 'active' | 'done' {
  const at = column + 1
  if (at < span.from) return 'upcoming'
  return at > span.to ? 'done' : 'active'
}
