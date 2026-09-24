/**
 * zod validation for the guided brief: one schema per step, plus a full-brief schema
 * used before submitting. Messages come from data/brief.ts.
 */
import { z } from 'zod'
import { briefCopy } from '@/data/brief'
import type { BriefAnswers, BriefErrors, BriefStepId } from '@/types'

const e = briefCopy.errors

const choice = (message: string) => z.string({ error: message }).min(1, { error: message })

const contactSchema = z.object({
  name: z.string().trim().min(2, { error: e.name }).max(120, { error: e.name }),
  email: z.email({ error: e.email }),
  phone: z
    .string()
    .trim()
    .regex(/^$|^[+\d][\d\s()-]{6,19}$/, { error: e.phone }),
  company: z.string().trim().max(160),
  message: z.string().max(2000, { error: e.message }),
})

export const stepSchemas = {
  type: z.object({ projectType: choice(e.projectType) }),
  scope: z.object({ scope: choice(e.scope) }),
  features: z.object({ features: z.array(z.string()), monthlyPlan: z.string().nullable() }),
  timeline: z.object({ timeline: choice(e.timeline) }),
  budget: z.object({ budget: choice(e.budget) }),
  contact: z.object({
    contact: contactSchema,
    consent: z.literal(true, { error: e.consent }),
  }),
  review: z.object({}),
} satisfies Record<BriefStepId, z.ZodType>

export const briefSchema = z.object({
  ...stepSchemas.type.shape,
  ...stepSchemas.scope.shape,
  ...stepSchemas.features.shape,
  ...stepSchemas.timeline.shape,
  ...stepSchemas.budget.shape,
  ...stepSchemas.contact.shape,
})

export type ValidBrief = z.infer<typeof briefSchema>

function toErrors(error: z.ZodError): BriefErrors {
  const errors: BriefErrors = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    errors[key] ??= issue.message
  }
  return errors
}

/** Validates one step. Returns an empty object when valid. */
export function validateStep(step: BriefStepId, answers: BriefAnswers): BriefErrors {
  const result = stepSchemas[step].safeParse(answers)
  return result.success ? {} : toErrors(result.error)
}

export function validateBrief(
  answers: BriefAnswers,
): { ok: true; data: ValidBrief } | { ok: false; errors: BriefErrors } {
  const result = briefSchema.safeParse(answers)
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: toErrors(result.error) }
}
