/**
 * Pure estimator for the quote builder: no React, no side effects, no copy. Same answers,
 * same result. Rules: docs/pricing-model.md → "Estimator rules".
 * Only public, client-facing prices are used. There is no internal cost or margin logic here
 * and there must never be (the bundle is public).
 */
import { addOns as defaultAddOns } from '@/data/addons'
import { budgetRanges, timelineOptions } from '@/data/brief'
import { plans as defaultPlans } from '@/data/plans'
import { rates as defaultRates } from '@/data/rates'
import { offerings as defaultOfferings } from '@/data/services'
import type {
  AddOn,
  BriefAnswers,
  BudgetRange,
  Offering,
  Plan,
  Rate,
  TimelineOption,
} from '@/types'

export interface EstimateData {
  offerings: Offering[]
  plans: Plan[]
  addOns: AddOn[]
  rates: Rate[]
  timelines: TimelineOption[]
  budgets: BudgetRange[]
}

export const defaultEstimateData: EstimateData = {
  offerings: defaultOfferings,
  plans: defaultPlans,
  addOns: defaultAddOns,
  rates: defaultRates,
  timelines: timelineOptions,
  budgets: budgetRanges,
}

/** Website builds at or above this (rounded low) must start with Discovery. */
export const DISCOVERY_THRESHOLD = 120_000
/** high = low × this. */
export const RANGE_SPREAD = 1.35
export const ROUND_TO = 1_000

export type BudgetFit = 'unknown' | 'comfortable' | 'within' | 'tight' | 'over'

export interface EstimateLine {
  id: string
  /** Label from data (offering/add-on name); count lines use `count` with a copy template. */
  label: string
  amount: number
  count?: number
  kind: 'base' | 'pages' | 'languages' | 'addon'
}

export type EstimateResult =
  | { kind: 'none' }
  | {
      kind: 'range'
      offering: Offering
      low: number
      high: number
      lines: EstimateLine[]
      timelineMultiplier: number
      budgetFit: BudgetFit
      /** Chosen Care plan (shown as a separate monthly line), or null. */
      carePlan: Plan | null
      /** Cheapest visible Care plan, for the "Most clients add…" nudge. */
      careFrom: number
    }
  | {
      kind: 'discovery'
      offering: Offering
      discovery: Offering
      /** True when discovery is mandatory (requiresDiscovery or ≥ threshold). */
      required: boolean
    }
  | {
      kind: 'audit'
      audit: Offering
      /** Website audits are a fixed price; app audits are "from". */
      auditIsFrom: boolean
      takeover: Offering
      /** Website audit fee is credited against a takeover within 30 days. */
      credit: boolean
      emergencyRate: Rate | null
    }
  | {
      kind: 'plan'
      /** First is the recommendation; any others are alternatives. */
      plans: Plan[]
      /** Ad-hoc hourly option, listed first when present. */
      hourlyRate: Rate | null
      needsAudit: boolean
      limited: boolean
    }
  | { kind: 'consult'; topic?: 'partner' }

export type EstimateKind = EstimateResult['kind']

export const roundTo = (n: number, step = ROUND_TO) => Math.round(n / step) * step

export function estimate(
  answers: Partial<BriefAnswers>,
  data: EstimateData = defaultEstimateData,
): EstimateResult {
  switch (answers.path) {
    case 'build':
      return estimateBuild(answers, data)
    case 'existing':
      return estimateExisting(answers, data)
    case 'run':
      return estimateRun(answers, data)
    case 'develop':
      return estimateDevelop(answers, data)
    case 'unsure':
      return { kind: 'consult' }
    default:
      return { kind: 'none' }
  }
}

/* ---------- A. Build ---------- */

function estimateBuild(answers: Partial<BriefAnswers>, data: EstimateData): EstimateResult {
  const offering = data.offerings.find((o) => o.id === answers.buildType)
  if (!offering) return { kind: 'none' }
  const discovery = find(data.offerings, 'discovery')

  if (offering.briefCategory !== 'website') {
    return {
      kind: 'discovery',
      offering,
      discovery,
      required: Boolean(offering.requiresDiscovery) || offering.fromPrice >= DISCOVERY_THRESHOLD,
    }
  }

  const lines: EstimateLine[] = [
    { id: offering.id, label: offering.name, amount: offering.fromPrice, kind: 'base' },
  ]

  const extraPage = data.addOns.find((a) => a.id === 'extra-page')
  const extraPages = Math.max(
    0,
    (answers.pages ?? offering.includedPages ?? 0) - (offering.includedPages ?? 0),
  )
  if (extraPage && extraPages > 0) {
    lines.push({
      id: 'extra-pages',
      label: extraPage.name,
      amount: extraPages * extraPage.price,
      count: extraPages,
      kind: 'pages',
    })
  }

  for (const id of answers.addOns ?? []) {
    const addOn = data.addOns.find((a) => a.id === id && a.briefMode === 'toggle')
    if (addOn) lines.push({ id: addOn.id, label: addOn.name, amount: addOn.price, kind: 'addon' })
  }

  const extraLanguage = data.addOns.find((a) => a.id === 'extra-language')
  const extraLanguages = Math.max(0, (answers.languages ?? 1) - 1)
  if (extraLanguage && extraLanguages > 0) {
    lines.push({
      id: 'extra-languages',
      label: extraLanguage.name,
      amount: extraLanguages * extraLanguage.price,
      count: extraLanguages,
      kind: 'languages',
    })
  }

  const timelineMultiplier = data.timelines.find((t) => t.id === answers.timeline)?.multiplier ?? 1
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0) * timelineMultiplier
  const low = roundTo(subtotal)
  const high = roundTo(subtotal * RANGE_SPREAD)

  if (low >= DISCOVERY_THRESHOLD) {
    return { kind: 'discovery', offering, discovery, required: true }
  }

  const carePlans = data.plans.filter((p) => p.family === 'care' && p.visibility !== 'hidden')
  const carePlan =
    answers.carePlan && answers.carePlan !== 'none'
      ? (carePlans.find((p) => p.id === answers.carePlan) ?? null)
      : null

  return {
    kind: 'range',
    offering,
    low,
    high,
    lines,
    timelineMultiplier,
    budgetFit: budgetFit(answers.budget, low, high, data.budgets),
    carePlan,
    careFrom: Math.min(...carePlans.map((p) => p.pricePerMonth)),
  }
}

export function budgetFit(
  budgetId: string | null | undefined,
  low: number,
  high: number,
  budgets: BudgetRange[],
): BudgetFit {
  const range = budgets.find((b) => b.id === budgetId)
  if (!range || range.min === null) return 'unknown'
  if (range.max === null) return range.min >= high ? 'comfortable' : 'within'
  if (range.min >= high) return 'comfortable'
  if (high <= range.max) return 'within'
  if (low <= range.max) return 'tight'
  return 'over'
}

/* ---------- B. Something exists ---------- */

function estimateExisting(answers: Partial<BriefAnswers>, data: EstimateData): EstimateResult {
  if (!answers.existingType) return { kind: 'none' }
  const isWebsite = answers.existingType === 'website'
  return {
    kind: 'audit',
    audit: find(data.offerings, isWebsite ? 'website-audit' : 'app-audit'),
    auditIsFrom: !isWebsite,
    takeover: find(data.offerings, isWebsite ? 'website-takeover' : 'software-takeover'),
    credit: isWebsite,
    emergencyRate: answers.urgency === 'today' ? findRate(data.rates, 'care') : null,
  }
}

/* ---------- C. Keep it running ---------- */

const RUN_PLAN: Record<'website' | 'app', string> = {
  website: 'care-essential',
  app: 'managed-app',
}

function estimateRun(answers: Partial<BriefAnswers>, data: EstimateData): EstimateResult {
  const type = answers.runType === 'website' || answers.runType === 'app' ? answers.runType : null
  if (!type) return { kind: 'none' }
  return {
    kind: 'plan',
    plans: [findPlan(data.plans, RUN_PLAN[type])],
    hourlyRate: null,
    needsAudit: answers.builtBy === 'other',
    limited: false,
  }
}

/* ---------- D. Ongoing development ---------- */

function estimateDevelop(answers: Partial<BriefAnswers>, data: EstimateData): EstimateResult {
  const partner = (id: string) => findPlan(data.plans, id)
  switch (answers.hours) {
    case 'discuss':
      return { kind: 'consult', topic: 'partner' }
    case 'custom': {
      const hours = answers.customHours
      if (!Number.isInteger(hours) || hours === undefined || hours < 1 || hours > 160)
        return { kind: 'none' }
      const base = partner('partner-10')
      return {
        kind: 'plan',
        plans: [
          {
            ...base,
            id: 'partner-custom',
            name: 'Custom Partner hours',
            includedHours: hours,
            hoursLabel: `${hours} ${hours === 1 ? 'hour' : 'hours'}`,
            pricePerMonth: hours * findRate(data.rates, 'feature').pricePerHour,
            highlighted: false,
          },
        ],
        hourlyRate: null,
        needsAudit: false,
        limited: hours >= 40,
      }
    }
    case 'few':
      return {
        kind: 'plan',
        plans: [partner('partner-10')],
        hourlyRate: findRate(data.rates, 'feature'),
        needsAudit: false,
        limited: false,
      }
    case '10':
      return {
        kind: 'plan',
        plans: [partner('partner-10')],
        hourlyRate: null,
        needsAudit: false,
        limited: false,
      }
    case '20':
      return {
        kind: 'plan',
        plans: [partner('partner-20')],
        hourlyRate: null,
        needsAudit: false,
        limited: false,
      }
    case '40':
      return {
        kind: 'plan',
        plans: [partner('partner-40')],
        hourlyRate: null,
        needsAudit: false,
        limited: true,
      }
    default:
      return { kind: 'none' }
  }
}

/* ---------- helpers ---------- */

function find(list: Offering[], id: string): Offering {
  const item = list.find((o) => o.id === id)
  if (!item) throw new Error(`estimate: missing offering "${id}" in data`)
  return item
}

function findPlan(list: Plan[], id: string): Plan {
  const item = list.find((p) => p.id === id)
  if (!item) throw new Error(`estimate: missing plan "${id}" in data`)
  return item
}

function findRate(list: Rate[], id: Rate['id']): Rate {
  const item = list.find((r) => r.id === id)
  if (!item) throw new Error(`estimate: missing rate "${id}" in data`)
  return item
}
