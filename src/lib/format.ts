const zar = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
})

/** "R 11 111". */
export function formatPrice(amount: number): string {
  return zar.format(Math.round(amount))
}

/** "R 11 000 – R 14 000" (rounded to a friendly step). */
export function formatPriceRange(low: number, high: number, step = 500): string {
  const round = (n: number) => Math.round(n / step) * step
  const a = round(low)
  const b = round(high)
  return a === b ? formatPrice(a) : `${formatPrice(a)} – ${formatPrice(b)}`
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}
