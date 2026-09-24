/**
 * zod validation for the quote builder: a schema per step (generated from the step config)
 * and a full-brief schema as a discriminated union on `path`. Messages: data/brief.ts.
 * Uses zod/mini (same package, tree-shakable functional API) to keep the /start chunk small.
 */
import * as z from 'zod/mini'
import { briefCopy } from '@/data/brief'
import type { BriefAnswers, BriefErrors, BriefStepConfig } from '@/types'

const e = briefCopy.errors

const choice = () => z.string({ error: e.choose }).check(z.minLength(1, { error: e.choose }))
const many = (min: number) => z.array(z.string()).check(z.minLength(min, { error: e.chooseMany }))

export const contactSchema = z.object({
  name: z
    .string()
    .check(z.trim(), z.minLength(2, { error: e.name }), z.maxLength(120, { error: e.name })),
  email: z.email({ error: e.email }),
  phone: z.string().check(z.trim(), z.regex(/^$|^[+\d][\d\s()-]{6,19}$/, { error: e.phone })),
  company: z.string().check(z.trim(), z.maxLength(160)),
  message: z.string().check(z.maxLength(2000, { error: e.message })),
})

const finalStep = {
  contact: contactSchema,
  consent: z.literal(true, { error: e.consent }),
}

export function schemaForStep(step: BriefStepConfig): z.ZodMiniType {
  switch (step.kind) {
    case 'single':
      return z.object({ [step.field]: choice() })
    case 'multi':
      return z.object({ [step.field]: many(step.min) })
    case 'count':
      return z.object({
        [step.field]: z
          .number({ error: e.count })
          .check(
            z.int({ error: e.count }),
            z.gte(step.min, { error: e.count }),
            z.lte(step.max, { error: e.count }),
          ),
      })
    case 'text':
      return z.object({
        [step.field]: z
          .string()
          .check(z.trim(), z.minLength(step.minLength, { error: e.description })),
      })
    case 'contact':
      return z.object(finalStep)
    case 'review':
      return z.object({})
  }
}

const count = () => z.number().check(z.int(), z.gte(1))

const buildSchema = z.object({
  path: z.literal('build'),
  buildType: choice(),
  pages: count(),
  addOns: z.array(z.string()),
  languages: count(),
  carePlan: z.nullable(z.string()),
  audience: z.nullable(z.string()),
  needs: z.array(z.string()),
  timeline: choice(),
  budget: choice(),
  ...finalStep,
})

const existingSchema = z.object({
  path: z.literal('existing'),
  existingType: choice(),
  access: choice(),
  situation: many(1),
  urgency: choice(),
  ...finalStep,
})

const runSchema = z.object({
  path: z.literal('run'),
  runType: choice(),
  builtBy: choice(),
  changeFrequency: choice(),
  ...finalStep,
})

const developSchema = z.object({
  path: z.literal('develop'),
  workKinds: many(1),
  hours: choice(),
  ...finalStep,
})

const unsureSchema = z.object({
  path: z.literal('unsure'),
  description: z.string().check(z.trim(), z.minLength(10, { error: e.description })),
  ...finalStep,
})

/** Output keeps only the fields relevant to the chosen path. */
export const briefSchema = z.discriminatedUnion('path', [
  buildSchema,
  existingSchema,
  runSchema,
  developSchema,
  unsureSchema,
])

export type ValidBrief = z.infer<typeof briefSchema>

function toErrors(issues: readonly { path: PropertyKey[]; message: string }[]): BriefErrors {
  const errors: BriefErrors = {}
  for (const issue of issues) {
    const key = issue.path.map(String).join('.')
    errors[key] ??= issue.message
  }
  return errors
}

/** Validates one step. Returns an empty object when valid. */
export function validateStep(step: BriefStepConfig, answers: BriefAnswers): BriefErrors {
  const result = schemaForStep(step).safeParse(answers)
  return result.success ? {} : toErrors(result.error.issues)
}

export function validateBrief(
  answers: BriefAnswers,
): { ok: true; data: ValidBrief } | { ok: false; errors: BriefErrors } {
  const result = briefSchema.safeParse(answers)
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, errors: toErrors(result.error.issues) }
}
