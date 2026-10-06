/**
 * Deep links into the quote builder, e.g. /start?path=build&type=ecommerce,
 * /start?plan=care-essential or /start?quote=launch (a ready-made starting quote). Pure: turns
 * URL params into answers.
 */
import type { BriefAnswers, BriefPathId, Offering, Plan, QuotePreset } from '@/types'

const PATHS: BriefPathId[] = ['build', 'existing', 'run', 'develop', 'unsure']

/** Plan id → the Run/Develop answers that lead the estimator back to that plan. */
const PLAN_ANSWERS: Record<string, Partial<BriefAnswers>> = {
  'care-essential': { path: 'run', runType: 'website' },
  'managed-app': { path: 'run', runType: 'app' },
}
const LEGACY_PLAN: Record<string, string> = {
  'care-business': 'care-essential',
  'care-pro': 'care-essential',
  'managed-system': 'managed-app',
}

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

  const type = params.get('type')
  const offering = data.offerings.find(
    (o) => o.id === type && o.briefCategory && o.visibility !== 'hidden',
  )
  if (offering) {
    return {
      answers: {
        path: 'build',
        buildType: offering.id,
        ...(offering.includedPages ? { pages: offering.includedPages } : {}),
      },
      name: offering.name,
    }
  }

  const partner = params.get('partner')
  if (partner === 'custom')
    return {
      answers: { path: 'develop', hours: 'custom' },
      name: 'Partner hours',
      stepId: 'customHours',
    }
  if (partner === 'discuss')
    return {
      answers: { path: 'develop', hours: 'discuss' },
      name: 'a Partner discussion',
      stepId: 'contact',
    }

  const requestedPlanId = params.get('plan')
  // Old Partner package links now open the same discussion as the new Partner sections.
  if (requestedPlanId && ['partner-10', 'partner-20', 'partner-40'].includes(requestedPlanId))
    return {
      answers: { path: 'develop', hours: 'discuss' },
      name: 'a Partner discussion',
      stepId: 'contact',
    }
  const planId = requestedPlanId ? (LEGACY_PLAN[requestedPlanId] ?? requestedPlanId) : null
  const plan = data.plans.find((p) => p.id === planId && p.visibility !== 'hidden')
  const planAnswers = planId ? PLAN_ANSWERS[planId] : undefined
  if (plan && planAnswers)
    return {
      answers: planAnswers,
      name: plan.name,
      ...(plan.family === 'partner' ? { stepId: 'contact' } : {}),
    }

  const path = params.get('path')
  if (PATHS.includes(path as BriefPathId)) return { answers: { path: path as BriefPathId } }

  return { answers: {} }
}
