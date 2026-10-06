/**
 * Pure helpers that turn offerings, plans and rates into display rows and price labels.
 * Callers pass data and copy in (pages read src/data; sections just render the rows).
 */
import type { CtaLink, Offering, Plan, PlanFamily, Rate, StageId } from '@/types'
import { formatPrice } from './format'

export interface PriceLabels {
  from: string
  perMonth: string
  perHour: string
  /** Label for non-Build `services`-visibility offerings, e.g. "Quoted per project". */
  quoted: string
  /** e.g. (label) => `${label} included each month` */
  hours: (label: string) => string
}

export interface OfferRow {
  id: string
  name: string
  /** Left out where prices aren't shown (Services: every number lives on Pricing). */
  price?: string
  summary: string
  includes: string[]
  examples: string[]
  notes: string[]
  /** Opens the brief pre-filled for this offering (set by the page, e.g. `/start?type=…`). */
  start?: CtaLink
}

export interface OfferData {
  offerings: Offering[]
  plans: Plan[]
  rates: Rate[]
}

export const isVisible = (item: { visibility: string }) => item.visibility !== 'hidden'

export function offeringPrice(offering: Offering, l: PriceLabels): string {
  return offering.visibility === 'services' && offering.stage !== 'build'
    ? l.quoted
    : `${l.from} ${formatPrice(offering.fromPrice)}`
}

export function planPrice(plan: Plan, l: PriceLabels): string {
  const from = plan.priceIsFrom ? `${l.from} ` : ''
  const suffix = plan.priceSuffix ? ` ${plan.priceSuffix}` : ''
  return `${from}${formatPrice(plan.pricePerMonth)}${l.perMonth}${suffix}`
}

export function ratePrice(rate: Rate, l: PriceLabels): string {
  return `${formatPrice(rate.pricePerHour)}${l.perHour}`
}

function offeringRow(o: Offering, l: PriceLabels, prices: boolean): OfferRow {
  const estimateNotes =
    prices && o.stage === 'build' && o.estimatedHours
      ? [
          `Estimated from ${o.estimatedHours} working hours at ${formatPrice(o.fromPrice / o.estimatedHours)}${l.perHour}.`,
        ]
      : []
  const tierNotes = prices
    ? (o.tiers ?? []).map((t) => `${t.label}: ${l.from.toLowerCase()} ${formatPrice(t.fromPrice)}`)
    : []
  return {
    id: o.id,
    name: o.name,
    price: prices ? offeringPrice(o, l) : undefined,
    summary: o.summary,
    includes: o.includes,
    examples: o.examples ?? [],
    notes: [...estimateNotes, ...tierNotes, ...(o.notes ?? [])],
  }
}

function planRow(p: Plan, l: PriceLabels, prices: boolean): OfferRow {
  return {
    id: p.id,
    name: p.name,
    price: prices ? planPrice(p, l) : undefined,
    summary: p.tagline,
    includes: p.includes,
    examples: [],
    notes: p.hoursLabel ? [l.hours(p.hoursLabel)] : [],
  }
}

function rateRow(r: Rate, l: PriceLabels, prices: boolean): OfferRow {
  return {
    id: r.id,
    name: r.name,
    price: prices ? ratePrice(r, l) : undefined,
    summary: r.description,
    includes: [],
    examples: r.examples ?? [],
    notes: [],
  }
}

/**
 * Every visible row for a stage: offerings (Build, Take over), plans (Run, Partner) or rates (Grow).
 * `prices: false` leaves out the price and the notes that only restate it.
 */
export function stageRows(
  stage: StageId,
  data: OfferData,
  l: PriceLabels,
  { pricedOnly = false, prices = true }: { pricedOnly?: boolean; prices?: boolean } = {},
): OfferRow[] {
  const shown = (o: Offering) => isVisible(o) && (!pricedOnly || o.visibility === 'pricing')
  switch (stage) {
    case 'build':
    case 'takeover':
      return data.offerings
        .filter((o) => o.stage === stage && shown(o))
        .map((o) => offeringRow(o, l, prices))
    case 'run':
      return data.plans
        .filter((p) => (p.family === 'care' || p.family === 'managed') && isVisible(p))
        .map((p) => planRow(p, l, prices))
    case 'grow':
      return data.rates.filter((r) => r.id === 'feature').map((r) => rateRow(r, l, prices))
    case 'partner':
      return data.plans
        .filter((p) => p.family === 'partner' && isVisible(p))
        .map((p) => planRow(p, l, prices))
  }
}

/** The cheapest visible monthly price in a plan family, or null when it has no plans. */
export function familyMin(family: PlanFamily, plans: Plan[]): number | null {
  const prices = plans
    .filter((p) => p.family === family && isVisible(p))
    .map((p) => p.pricePerMonth)
  return prices.length ? Math.min(...prices) : null
}

/** "From R 1 250/month" for a plan family: its cheapest visible plan. */
export function familyFrom(family: PlanFamily, plans: Plan[], l: PriceLabels): string {
  const min = familyMin(family, plans)
  return min === null ? '' : `${l.from} ${formatPrice(min)}${l.perMonth}`
}
