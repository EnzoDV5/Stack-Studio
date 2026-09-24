export const BRIEF_STEPS = [
  'type',
  'scope',
  'features',
  'timeline',
  'budget',
  'contact',
  'review',
] as const

export type BriefStepId = (typeof BRIEF_STEPS)[number]

export interface BriefContact {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

export interface BriefAnswers {
  projectType: string | null
  scope: string | null
  features: string[]
  /** MonthlyPlan id, or null for "no plan". */
  monthlyPlan: string | null
  timeline: string | null
  budget: string | null
  contact: BriefContact
  consent: boolean
}

export type BriefStatus = 'editing' | 'submitting' | 'success' | 'error'

/** Field path → message, e.g. { 'contact.email': 'Enter a valid email' }. */
export type BriefErrors = Partial<Record<string, string>>

export interface BriefState {
  stepIndex: number
  /** +1 forward, -1 back: drives the step transition direction. */
  direction: 1 | -1
  answers: BriefAnswers
  errors: BriefErrors
  status: BriefStatus
  /** Furthest step reached (steps up to here can be jumped to from review). */
  furthest: number
}

export type BriefAction =
  | {
      type: 'select'
      field: 'projectType' | 'scope' | 'timeline' | 'budget' | 'monthlyPlan'
      value: string | null
    }
  | { type: 'toggleFeature'; id: string }
  | { type: 'contact'; field: keyof BriefContact; value: string }
  | { type: 'consent'; value: boolean }
  | { type: 'errors'; errors: BriefErrors }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goTo'; stepIndex: number }
  | { type: 'submit' }
  | { type: 'success' }
  | { type: 'failure' }
  | { type: 'reset'; answers: BriefAnswers; stepIndex?: number }
