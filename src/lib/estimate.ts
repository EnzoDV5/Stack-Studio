/**
 * Pure estimator. No React, no side effects, and only the pricing data model as input.
 * Same input, same output: easy to test and easy to change when pricing changes.
 */
import { pricingData as defaultPricing, type PricingData } from '@/data/pricing'
import type { Billing } from '@/types'

export interface EstimateInput {
  packageId?: string | null
  scopeId?: string | null
  addOnIds?: readonly string[]
  monthlyPlanId?: string | null
  timelineId?: string | null
  budgetId?: string | null
}

export interface EstimateLine {
  id: string
  label: string
  amount: number
  billing: Billing
}

export type BudgetFit = 'unknown' | 'comfortable' | 'within' | 'tight' | 'over'

export interface Estimate {
  /** False until a project type is chosen. */
  ready: boolean
  /** Once-off total before the ± spread. */
  onceTotal: number
  onceLow: number
  onceHigh: number
  monthlyTotal: number
  lines: EstimateLine[]
  weeks: [number, number] | null
  timelineMultiplier: number
  budgetFit: BudgetFit
}

const EMPTY: Estimate = {
  ready: false,
  onceTotal: 0,
  onceLow: 0,
  onceHigh: 0,
  monthlyTotal: 0,
  lines: [],
  weeks: null,
  timelineMultiplier: 1,
  budgetFit: 'unknown',
}

export function estimate(input: EstimateInput, pricing: PricingData = defaultPricing): Estimate {
  const pkg = pricing.packages.find((p) => p.id === input.packageId)
  if (!pkg) return EMPTY

  const lines: EstimateLine[] = [
    { id: pkg.id, label: pkg.name, amount: pkg.fromPrice, billing: 'once' },
  ]

  // Extra pages beyond what the package includes. 'unsure' (0 pages) uses the package default.
  const scope = pricing.scopeOptions.find((s) => s.id === input.scopeId)
  const extraPages = scope && scope.pages > 0 ? Math.max(0, scope.pages - pkg.includedPages) : 0
  if (extraPages > 0) {
    lines.push({
      id: 'extra-pages',
      label: `${extraPages} extra page${extraPages === 1 ? '' : 's'}`,
      amount: extraPages * pkg.extraPagePrice,
      billing: 'once',
    })
  }

  for (const id of input.addOnIds ?? []) {
    const addOn = pricing.addOns.find((a) => a.id === id)
    if (!addOn) continue
    if (addOn.availableFor && !addOn.availableFor.includes(pkg.id)) continue
    lines.push({ id: addOn.id, label: addOn.name, amount: addOn.price, billing: addOn.billing })
  }

  const plan = pricing.monthlyPlans.find((p) => p.id === input.monthlyPlanId)
  if (plan) {
    lines.push({
      id: plan.id,
      label: `${plan.name} plan`,
      amount: plan.pricePerMonth,
      billing: 'monthly',
    })
  }

  const timeline = pricing.timelineOptions.find((t) => t.id === input.timelineId)
  const timelineMultiplier = timeline?.multiplier ?? 1

  const onceSubtotal = sum(lines, 'once')
  const onceTotal = onceSubtotal * timelineMultiplier
  const spread = pricing.settings.estimateSpread
  const onceLow = onceTotal * (1 - spread / 2)
  const onceHigh = onceTotal * (1 + spread)
  const monthlyTotal = sum(lines, 'monthly')

  // Roughly one extra week for every five extra pages.
  const extraWeeks = Math.ceil(extraPages / 5)
  const weeks: [number, number] = [
    pkg.timelineWeeks[0] + extraWeeks,
    pkg.timelineWeeks[1] + extraWeeks,
  ]

  return {
    ready: true,
    onceTotal,
    onceLow,
    onceHigh,
    monthlyTotal,
    lines,
    weeks,
    timelineMultiplier,
    budgetFit: budgetFit(input.budgetId, onceLow, onceHigh, pricing),
  }
}

function sum(lines: EstimateLine[], billing: Billing) {
  return lines.filter((l) => l.billing === billing).reduce((total, l) => total + l.amount, 0)
}

function budgetFit(
  budgetId: string | null | undefined,
  low: number,
  high: number,
  pricing: PricingData,
): BudgetFit {
  const range = pricing.budgetRanges.find((b) => b.id === budgetId)
  if (!range) return 'unknown'
  if (range.max === null) return range.min >= high ? 'comfortable' : 'within'
  if (range.min >= high) return 'comfortable'
  if (high <= range.max) return 'within'
  if (low <= range.max) return 'tight'
  return 'over'
}
