/**
 * Deep links into the quote builder, e.g. /start?type=ecommerce, /start?kind=app,
 * /start?plan=care-essential or /start?quote=launch (a ready-made starting quote). Pure: turns
 * URL params into answers.
 */
import type { BriefAnswers, BriefPathId, BuildKind, Offering, Plan, QuotePreset } from '@/types'
import { briefOfferings } from './brief-steps'

const PATHS: BriefPathId[] = ['build', 'existing', 'run', 'develop', 'unsure']
const KINDS: BuildKind[] = ['website', 'app', 'software']

/** Plan id → the Run answers that lead the estimator back to that plan. */
const PLAN_ANSWERS: Record<string, Partial<BriefAnswers>> = {
  'care-essential': { path: 'run', runType: 'website' },
  'managed-app': { path: 'run', runType: 'app' },
}
const LEGACY_PLAN: Record<string, string> = {
  'care-business': 'care-essential',
  'care-pro': 'care-essential',
  'managed-system': 'managed-app',
}
/** Old fixed Partner packages: they open the Partner enquiry like the Partner card. */
const LEGACY_PARTNER = ['partner-10', 'partner-20', 'partner-40']

export interface Prefill {
  answers: Partial<BriefAnswers>
  /** Name of what was pre-selected, for the "We've pre-selected…" notice. */
  name?: string
  /** A complete package can skip the already-filled questions and collect contact details. */
  stepId?: string
}

export function prefillFromParams(
  params: URLSearchParams,
  data: { offerings: Offering[]; plans: Plan[]; quotes?: QuotePreset[] },
): Prefill {
  const quote = data.quotes?.find((q) => q.id === params.get('quote'))
  if (quote) return { answers: quote.answers, name: quote.name, stepId: 'contact' }

  const offering = briefOfferings(data.offerings).find((o) => o.id === params.get('type'))
  if (offering) {
    return {
      answers: {
        path: 'build',
        buildKind: offering.briefKind ?? null,
        buildType: offering.id,
        ...(offering.includedPages ? { pages: offering.includedPages } : {}),
      },
      name: offering.name,
    }
  }

  // Services' website, app and software groups: skip "what are we building?".
  const kind = params.get('kind')
  if (KINDS.includes(kind as BuildKind)) {
    return { answers: { path: 'build', buildKind: kind as BuildKind } }
  }

  // Partner card, Partner stage and old links (?partner=discuss|custom, ?plan=partner-…).
  const requestedPlanId = params.get('plan')
  if (params.has('partner') || (requestedPlanId && LEGACY_PARTNER.includes(requestedPlanId)))
    return { answers: { path: 'develop' }, name: 'a Partner enquiry' }

  const planId = requestedPlanId ? (LEGACY_PLAN[requestedPlanId] ?? requestedPlanId) : null
  const plan = data.plans.find((p) => p.id === planId && p.visibility !== 'hidden')
  const planAnswers = planId ? PLAN_ANSWERS[planId] : undefined
  if (plan && planAnswers) return { answers: planAnswers, name: plan.name }

  const path = params.get('path')
  if (PATHS.includes(path as BriefPathId)) return { answers: { path: path as BriefPathId } }

  return { answers: {} }
}
