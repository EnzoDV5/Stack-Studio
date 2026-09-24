/**
 * Deep links into the quote builder, e.g. /start?path=build&type=ecommerce or
 * /start?plan=care-business. Pure: turns URL params into answers.
 */
import type { BriefAnswers, BriefPathId, Offering, Plan } from '@/types'

const PATHS: BriefPathId[] = ['build', 'existing', 'run', 'develop', 'unsure']

/** Plan id → the Run/Develop answers that lead the estimator back to that plan. */
const PLAN_ANSWERS: Record<string, Partial<BriefAnswers>> = {
  'care-essential': { path: 'run', runType: 'website', changeFrequency: 'rarely' },
  'care-business': { path: 'run', runType: 'website', changeFrequency: 'monthly' },
  'care-pro': { path: 'run', runType: 'website', changeFrequency: 'weekly' },
  'managed-app': { path: 'run', runType: 'app', changeFrequency: 'monthly' },
  'managed-system': { path: 'run', runType: 'app', changeFrequency: 'weekly' },
  'partner-10': { path: 'develop', hours: '10' },
  'partner-20': { path: 'develop', hours: '20' },
  'partner-40': { path: 'develop', hours: '40' },
}

export interface Prefill {
  answers: Partial<BriefAnswers>
  /** Name of what was pre-selected, for the "We've pre-selected…" notice. */
  name?: string
}

export function prefillFromParams(
  params: URLSearchParams,
  data: { offerings: Offering[]; plans: Plan[] },
): Prefill {
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

  const planId = params.get('plan')
  const plan = data.plans.find((p) => p.id === planId && p.visibility !== 'hidden')
  const planAnswers = planId ? PLAN_ANSWERS[planId] : undefined
  if (plan && planAnswers) return { answers: planAnswers, name: plan.name }

  const path = params.get('path')
  if (PATHS.includes(path as BriefPathId)) return { answers: { path: path as BriefPathId } }

  return { answers: {} }
}
