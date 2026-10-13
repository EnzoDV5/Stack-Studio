/**
 * Stack's offer model (see docs/pricing-model.md). Five stages; every offering and plan has
 * a visibility. Client-facing prices only: no internal cost, margin or contingency data may
 * ever live in these types or in src/data (the bundle is public).
 */

import type { BriefPathId } from './brief'

export type StageId = 'build' | 'takeover' | 'run' | 'grow' | 'partner'

/** Where an offering/plan is rendered. `services` = Services only; `hidden` = never shown. */
export type Visibility = 'pricing' | 'services' | 'hidden'

export interface ServiceStage {
  id: StageId
  /** 1–5, shown as "01". */
  index: number
  name: string
  /** One line, e.g. "We create it." */
  line: string
  summary: string
  /** CTA into the quote builder with this path preselected. */
  cta: { label: string; to: string }
  /** The quote builder path this stage maps to (/start?path=…). */
  briefPath: BriefPathId
}

/**
 * How a Build offering is filed: the brief's "website, app or software?" question and the
 * three Build groups on Services.
 */
export type BuildKind = 'website' | 'app' | 'software'

/** How the estimator treats a Build offering: websites get a range, the rest Discovery. */
export type BuildCategory = 'website' | 'software'

export interface PriceTier {
  label: string
  fromPrice: number
}

export interface Offering {
  id: string
  stage: StageId
  name: string
  summary: string
  /** Starting price in ZAR. */
  fromPrice: number
  /** Working hours used to calculate the public starting estimate. */
  estimatedHours?: number
  /** Pages included in fromPrice (website builds). */
  includedPages?: number
  includes: string[]
  examples?: string[]
  /** Sub-prices, e.g. AI features from R20k. */
  tiers?: PriceTier[]
  notes?: string[]
  /** Must start with Discovery & Scoping. */
  requiresDiscovery?: boolean
  /** Set = selectable as a project type in the quote builder, under this kind. */
  briefKind?: BuildKind
  visibility: Visibility
}

export type PlanFamily = 'care' | 'managed' | 'partner' | 'hosting'

export interface Plan {
  id: string
  family: PlanFamily
  name: string
  tagline: string
  pricePerMonth: number
  /** Show "from" before the price. */
  priceIsFrom?: boolean
  /** Extra text after the price, e.g. "+ infrastructure". */
  priceSuffix?: string
  /** Included / reserved hours per month (0.5 = 30 min). */
  includedHours?: number
  /** Human label for the hours, e.g. "30 min", "20 hours". */
  hoursLabel?: string
  includes: string[]
  excludes?: string[]
  minimumTermMonths: number
  highlighted?: boolean
  visibility: Visibility
}

export interface PlanFamilyInfo {
  id: Exclude<PlanFamily, 'hosting'>
  name: string
  description: string
  /** e.g. "Limited to 3 partner clients at a time." */
  note?: string
}

export interface Rate {
  id: 'feature' | 'care'
  name: string
  pricePerHour: number
  description: string
  examples?: string[]
}

export interface PaymentSchedule {
  id: string
  label: string
  /** Projects this schedule applies to, as words ("Projects under R50,000"). */
  appliesTo: string
  /** Upper bound (exclusive) in ZAR; null = no upper bound. */
  maxProjectValue: number | null
  milestones: { label: string; percent: number }[]
}

export interface PolicyItem {
  id: string
  title: string
  body: string[]
}

export interface Policies {
  paymentSchedules: PaymentSchedule[]
  items: PolicyItem[]
  maintenance: {
    title: string
    intro: string
    included: string[]
    excluded: string[]
    outro: string
  }
  vatNote: string
  hostingOnRequest: string
  minimumTermMonths: number
}

/** Website-build add-on. `count` add-ons are priced per unit through a count step. */
export interface AddOn {
  id: string
  name: string
  description: string
  price: number
  /** "each" = per unit. */
  perUnit: boolean
  /** How the quote builder offers it: toggle (multi-select) or via a count step. */
  briefMode: 'toggle' | 'count'
}

export interface TimelineOption {
  id: string
  label: string
  description: string
  multiplier: number
}
