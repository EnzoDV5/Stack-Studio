/**
 * Pure helpers that turn offerings, plans and rates into display rows and price labels.
 * Callers pass data and copy in (pages read src/data; sections just render the rows).
 */
import type { Offering, Plan, PlanFamily, Rate, StageId } from '@/types'
import { formatPrice } from './format'

export interface PriceLabels {
  from: string
  perMonth: string
  perHour: string
  /** Label for `services`-visibility offerings, e.g. "Quoted per project". */
  quoted: string
  /** e.g. (label) => `${label} included each month` */
  hours: (label: string) => string
}

export interface OfferRow {
  id: string
  name: string
  price: string
  summary: string
  includes: string[]
  examples: string[]
  notes: string[]
}

export interface OfferData {
  offerings: Offering[]
  plans: Plan[]
  rates: Rate[]
}

export const isVisible = (item: { visibility: string }) => item.visibility !== 'hidden'

export function offeringPrice(offering: Offering, l: PriceLabels): string {
  return offering.visibility === 'services'
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

function offeringRow(o: Offering, l: PriceLabels): OfferRow {
  const tierNotes = (o.tiers ?? []).map(
    (t) => `${t.label}: ${l.from.toLowerCase()} ${formatPrice(t.fromPrice)}`,
  )
  return {
    id: o.id,
    name: o.name,
    price: offeringPrice(o, l),
    summary: o.summary,
    includes: o.includes,
    examples: o.examples ?? [],
    notes: [...tierNotes, ...(o.notes ?? [])],
  }
}

function planRow(p: Plan, l: PriceLabels): OfferRow {
  return {
    id: p.id,
    name: p.name,
    price: planPrice(p, l),
    summary: p.tagline,
    includes: p.includes,
    examples: [],
    notes: p.hoursLabel ? [l.hours(p.hoursLabel)] : [],
  }
}

function rateRow(r: Rate, l: PriceLabels): OfferRow {
  return {
    id: r.id,
    name: r.name,
    price: ratePrice(r, l),
    summary: r.description,
    includes: [],
    examples: r.examples ?? [],
    notes: [],
  }
}

/** Every visible row for a stage: offerings (Build, Take over), plans (Run, Partner) or rates (Grow). */
export function stageRows(
  stage: StageId,
  data: OfferData,
  l: PriceLabels,
  { pricedOnly = false }: { pricedOnly?: boolean } = {},
): OfferRow[] {
  const shown = (o: Offering) => isVisible(o) && (!pricedOnly || o.visibility === 'pricing')
  switch (stage) {
    case 'build':
    case 'takeover':
      return data.offerings
        .filter((o) => o.stage === stage && shown(o))
        .map((o) => offeringRow(o, l))
    case 'run':
      return data.plans
        .filter((p) => (p.family === 'care' || p.family === 'managed') && isVisible(p))
        .map((p) => planRow(p, l))
    case 'grow':
      return data.rates.map((r) => rateRow(r, l))
    case 'partner':
      return data.plans
        .filter((p) => p.family === 'partner' && isVisible(p))
        .map((p) => planRow(p, l))
  }
}

/** "From R 1 250/month" for a plan family: its cheapest visible plan. */
export function familyFrom(family: PlanFamily, plans: Plan[], l: PriceLabels): string {
  const prices = plans
    .filter((p) => p.family === family && isVisible(p))
    .map((p) => p.pricePerMonth)
  return prices.length ? `${l.from} ${formatPrice(Math.min(...prices))}${l.perMonth}` : ''
}
