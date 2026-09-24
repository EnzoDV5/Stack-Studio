/**
 * Pricing model. Intentionally flexible: the offer isn't final. Add, remove or reshape
 * packages/plans/add-ons in src/data/pricing.ts without touching components. The estimator
 * (src/lib/estimate.ts) only depends on these types.
 */

export type Billing = 'once' | 'monthly'

export interface ProjectPackage {
  id: string
  name: string
  tagline: string
  bestFor: string
  /** Starting price in ZAR (excl. VAT). */
  fromPrice: number
  /** Pages included in fromPrice. */
  includedPages: number
  /** Price per page beyond includedPages. */
  extraPagePrice: number
  /** Typical build time. */
  timelineWeeks: [min: number, max: number]
  includes: string[]
  highlighted?: boolean
}

export type MonthlyPlanCategory = 'hosting' | 'care' | 'growth'

export interface MonthlyPlan {
  id: string
  name: string
  category: MonthlyPlanCategory
  tagline: string
  pricePerMonth: number
  includes: string[]
  minimumTermMonths?: number
  highlighted?: boolean
}

export interface AddOn {
  id: string
  name: string
  description: string
  price: number
  billing: Billing
  /** Restrict to certain ProjectPackage ids. Omit = available for all. */
  availableFor?: string[]
  /** Offered as a feature choice in the brief. */
  inBrief: boolean
}

/** Brief step 2: how big is it? Pages feed the extra-page calculation. */
export interface ScopeOption {
  id: string
  label: string
  description: string
  pages: number
}

/** Brief step 4: rush fees / flexible discounts. */
export interface TimelineOption {
  id: string
  label: string
  description: string
  multiplier: number
}

/** Brief step 5. max null = open-ended ("R X+"). */
export interface BudgetRange {
  id: string
  label: string
  min: number
  max: number | null
}

export interface PricingSettings {
  currency: 'ZAR'
  /** ± spread applied to the estimate to show a range, e.g. 0.12 = ±12%. */
  estimateSpread: number
  vatNote: string
  disclaimer: string
  /** True while prices are placeholders. Shows a visible notice in the UI. */
  isPlaceholder: boolean
  placeholderNotice: string
}
