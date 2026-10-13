/**
 * Pure step engine for the config-driven quote builder: condition evaluation, visible
 * steps, navigation, option resolution and display values. No React.
 */
import type {
  AddOn,
  BriefAnswers,
  BriefOption,
  BriefStepConfig,
  BuildCategory,
  ConditionField,
  Offering,
  Plan,
  ShowIf,
  TimelineOption,
} from '@/types'
import { formatPrice } from './format'

export interface StepContext {
  offerings: Offering[]
}

export interface OptionData extends StepContext {
  addOns: AddOn[]
  plans: Plan[]
  timelines: TimelineOption[]
  /** Short copy used in option metas, e.g. "/month". */
  labels: { perMonth: string }
}

/** Websites get the website questions; apps and team software share the software ones. */
export function buildCategoryOf(
  answers: Partial<BriefAnswers>,
  ctx: StepContext,
): BuildCategory | null {
  const kind = ctx.offerings.find((o) => o.id === answers.buildType)?.briefKind
  if (!kind) return null
  return kind === 'website' ? 'website' : 'software'
}

/** Build offerings the quote builder offers (all kinds, or one). */
export function briefOfferings(offerings: Offering[], kind?: string | null): Offering[] {
  return offerings.filter(
    (o) => o.briefKind && o.visibility !== 'hidden' && (!kind || o.briefKind === kind),
  )
}

function valueOf(
  field: ConditionField,
  answers: Partial<BriefAnswers>,
  ctx: StepContext,
): string | null {
  if (field === 'buildCategory') return buildCategoryOf(answers, ctx)
  return answers[field] ?? null
}

export function conditionsPass(
  showIf: ShowIf[] | undefined,
  answers: Partial<BriefAnswers>,
  ctx: StepContext,
): boolean {
  if (!showIf?.length) return true
  return showIf.every((c) => {
    const value = valueOf(c.field, answers, ctx)
    return value !== null && c.in.includes(value)
  })
}

export function visibleSteps(
  steps: BriefStepConfig[],
  answers: Partial<BriefAnswers>,
  ctx: StepContext,
): BriefStepConfig[] {
  return steps.filter((s) => conditionsPass(s.showIf, answers, ctx))
}

export function nextStepId(
  steps: BriefStepConfig[],
  currentId: string,
  answers: Partial<BriefAnswers>,
  ctx: StepContext,
): string | null {
  const visible = visibleSteps(steps, answers, ctx)
  const i = visible.findIndex((s) => s.id === currentId)
  return visible[i + 1]?.id ?? null
}

export function prevStepId(
  steps: BriefStepConfig[],
  currentId: string,
  answers: Partial<BriefAnswers>,
  ctx: StepContext,
): string | null {
  const visible = visibleSteps(steps, answers, ctx)
  const i = visible.findIndex((s) => s.id === currentId)
  return i > 0 ? (visible[i - 1]?.id ?? null) : null
}

/**
 * Where to resume (deep links, drafts): the first visible step that still needs input.
 * Single-choice steps count as done once answered; every other kind always gets shown.
 */
export function firstOpenStepId(
  steps: BriefStepConfig[],
  answers: Partial<BriefAnswers>,
  ctx: StepContext,
): string {
  const visible = visibleSteps(steps, answers, ctx)
  const open = visible.find((s) => s.kind !== 'single' || !answers[s.field])
  return (open ?? visible[visible.length - 1] ?? steps[0])?.id ?? 'path'
}

/** Options for a choice step. Project types narrow to the chosen build kind. */
export function resolveOptions(
  step: BriefStepConfig,
  data: OptionData,
  answers: Partial<BriefAnswers>,
): BriefOption[] {
  if (step.kind !== 'single' && step.kind !== 'multi') return []
  const base = step.source ? fromSource(step.source, data, answers) : (step.options ?? [])
  const extra = step.kind === 'single' && step.extraOption ? [step.extraOption] : []
  return [...base, ...extra]
}

function fromSource(
  source: NonNullable<Extract<BriefStepConfig, { kind: 'single' }>['source']>,
  data: OptionData,
  answers: Partial<BriefAnswers>,
): BriefOption[] {
  switch (source) {
    case 'buildOfferings':
      return briefOfferings(data.offerings, answers.buildKind).map((o) => ({
        value: o.id,
        label: o.name,
        description: o.summary,
        meta: `${formatPrice(o.fromPrice)}+`,
      }))
    case 'websiteAddOns':
      return data.addOns
        .filter((a) => a.briefMode === 'toggle')
        .map((a) => ({
          value: a.id,
          label: a.name,
          description: a.description,
          meta: `+ ${formatPrice(a.price)}`,
        }))
    case 'carePlans':
      return data.plans
        .filter((p) => p.family === 'care' && p.visibility !== 'hidden')
        .map((p) => ({
          value: p.id,
          label: p.name,
          description: p.tagline,
          meta: `${formatPrice(p.pricePerMonth)}${data.labels.perMonth}`,
        }))
    case 'timelines':
      return data.timelines.map((t) => ({
        value: t.id,
        label: t.label,
        description: t.description,
      }))
  }
}

/** Human-readable answer for a step (review rows, submission summary). */
export function displayValue(
  step: BriefStepConfig,
  answers: BriefAnswers,
  data: OptionData,
  none: string,
): string {
  switch (step.kind) {
    case 'single': {
      const value = answers[step.field]
      return resolveOptions(step, data, answers).find((o) => o.value === value)?.label ?? none
    }
    case 'multi': {
      const options = resolveOptions(step, data, answers)
      const labels = answers[step.field].map((v) => options.find((o) => o.value === v)?.label ?? v)
      return labels.length ? labels.join(', ') : none
    }
    case 'count': {
      const n = answers[step.field]
      return `${n} ${n === 1 ? step.unit.one : step.unit.other}`
    }
    case 'text':
      return answers[step.field].trim() || none
    case 'contact':
      return [
        answers.contact.name,
        answers.contact.email,
        answers.contact.phone,
        answers.contact.company,
      ]
        .filter(Boolean)
        .join(' · ')
    case 'review':
      return ''
  }
}
