/**
 * Quote-builder types. Steps are configuration (src/data/brief.ts); the flow renders
 * whichever steps' `showIf` conditions pass for the current answers.
 */

export type BriefPathId = 'build' | 'existing' | 'run' | 'develop' | 'unsure'

export interface BriefContact {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

export interface BriefAnswers {
  path: BriefPathId | null
  // A. Build
  buildType: string | null
  pages: number
  addOns: string[]
  languages: number
  /** Plan id, or 'none'. */
  carePlan: string | null
  audience: string | null
  needs: string[]
  timeline: string | null
  budget: string | null
  // B. Existing
  existingType: string | null
  access: string | null
  situation: string[]
  urgency: string | null
  // C. Run
  runType: string | null
  builtBy: string | null
  changeFrequency: string | null
  // D. Develop
  workKinds: string[]
  hours: string | null
  customHours: number
  // E. Unsure
  description: string
  // All paths
  contact: BriefContact
  consent: boolean
}

export type ChoiceField =
  | 'path'
  | 'buildType'
  | 'carePlan'
  | 'audience'
  | 'timeline'
  | 'budget'
  | 'existingType'
  | 'access'
  | 'urgency'
  | 'runType'
  | 'builtBy'
  | 'changeFrequency'
  | 'hours'
export type MultiField = 'addOns' | 'needs' | 'situation' | 'workKinds'
export type CountField = 'pages' | 'languages' | 'customHours'
export type TextField = 'description'

export interface BriefOption {
  value: string
  label: string
  description?: string
  /** Right-aligned detail (e.g. a price). Filled in when options are resolved. */
  meta?: string
}

/** Options resolved from other data files at runtime (offerings, add-ons, plans…). */
export type OptionSource =
  'buildOfferings' | 'websiteAddOns' | 'carePlans' | 'timelines' | 'budgets'

/** Derived values conditions can test, besides plain answer fields. */
export type ConditionField = ChoiceField | 'buildCategory'

/** A step shows when ALL of its conditions hold. */
export interface ShowIf {
  field: ConditionField
  in: string[]
}

interface StepBase {
  id: string
  /** Short name for progress and review rows. */
  label: string
  title: string
  hint: string
  showIf?: ShowIf[]
}

export type BriefStepConfig =
  | (StepBase & {
      kind: 'single'
      field: ChoiceField
      options?: BriefOption[]
      source?: OptionSource
      /** Extra option appended after sourced ones (e.g. "No plan for now"). */
      extraOption?: BriefOption
    })
  | (StepBase & {
      kind: 'multi'
      field: MultiField
      options?: BriefOption[]
      source?: OptionSource
      /** Minimum selections (0 = optional). */
      min: number
    })
  | (StepBase & {
      kind: 'count'
      field: CountField
      min: number
      max: number
      unit: { one: string; other: string }
    })
  | (StepBase & { kind: 'text'; field: TextField; minLength: number; placeholder: string })
  | (StepBase & { kind: 'contact' })
  | (StepBase & { kind: 'review' })

export type BriefStepKind = BriefStepConfig['kind']

export type BriefStatus = 'editing' | 'submitting' | 'success' | 'error'

/** Field path → message, e.g. { 'contact.email': 'Enter a valid email' }. */
export type BriefErrors = Partial<Record<string, string>>

export interface BriefState {
  stepId: string
  /** +1 forward, -1 back: drives the step transition direction. */
  direction: 1 | -1
  answers: BriefAnswers
  errors: BriefErrors
  status: BriefStatus
  /** Steps reached so far (review can jump back to these). */
  visited: string[]
}

export type BriefAction =
  | { type: 'choose'; field: ChoiceField; value: string | null }
  | { type: 'toggle'; field: MultiField; value: string }
  | { type: 'count'; field: CountField; value: number }
  | { type: 'text'; field: TextField; value: string }
  | { type: 'contact'; field: keyof BriefContact; value: string }
  | { type: 'consent'; value: boolean }
  | { type: 'errors'; errors: BriefErrors }
  | { type: 'goTo'; stepId: string; direction: 1 | -1 }
  | { type: 'submit' }
  | { type: 'success' }
  | { type: 'failure' }

/**
 * A ready-made starting quote: a set of brief answers with a name. The Pricing page shows
 * its indicative range (computed by lib/estimate, never typed in), and /start?quote=<id>
 * pre-fills the quote builder with it so the visitor can adjust from there.
 */
export interface QuotePreset {
  id: string
  name: string
  /** Who it suits, in one line. */
  for: string
  /** What the quote covers, in plain words. */
  includes: string[]
  answers: Partial<BriefAnswers>
}
