/**
 * Quote-builder state (used with useReducer in <BriefFlow>). Pure. Validation and step
 * visibility are computed in the component (lib/brief-schema, lib/brief-steps) and the
 * resulting target step is passed in `goTo`.
 */
import { briefDefaults } from '@/data/brief'
import type { BriefAction, BriefAnswers, BriefState } from '@/types'

export const emptyAnswers: BriefAnswers = {
  path: null,
  buildType: null,
  pages: briefDefaults.pages,
  addOns: [],
  languages: briefDefaults.languages,
  carePlan: briefDefaults.carePlan,
  audience: null,
  needs: [],
  timeline: null,
  budget: null,
  existingType: null,
  access: null,
  situation: [],
  urgency: null,
  runType: null,
  builtBy: null,
  changeFrequency: null,
  workKinds: [],
  hours: null,
  description: '',
  contact: { name: '', email: '', phone: '', company: '', message: '' },
  consent: false,
}

export function initBriefState(answers: BriefAnswers, stepId: string): BriefState {
  return { stepId, direction: 1, answers, errors: {}, status: 'editing', visited: [stepId] }
}

function clearError(errors: BriefState['errors'], key: string) {
  if (!(key in errors)) return errors
  return Object.fromEntries(Object.entries(errors).filter(([k]) => k !== key))
}

export function briefReducer(state: BriefState, action: BriefAction): BriefState {
  const set = (patch: Partial<BriefAnswers>, errorKey: string): BriefState => ({
    ...state,
    answers: { ...state.answers, ...patch },
    errors: clearError(state.errors, errorKey),
  })

  switch (action.type) {
    case 'choose':
      return set({ [action.field]: action.value }, action.field)
    case 'toggle': {
      const list = state.answers[action.field]
      const next = list.includes(action.value)
        ? list.filter((v) => v !== action.value)
        : [...list, action.value]
      return set({ [action.field]: next }, action.field)
    }
    case 'count':
      return set({ [action.field]: action.value }, action.field)
    case 'text':
      return set({ [action.field]: action.value }, action.field)
    case 'contact':
      return {
        ...set(
          { contact: { ...state.answers.contact, [action.field]: action.value } },
          `contact.${action.field}`,
        ),
      }
    case 'consent':
      return set({ consent: action.value }, 'consent')
    case 'errors':
      return { ...state, errors: action.errors }
    case 'goTo':
      return {
        ...state,
        stepId: action.stepId,
        direction: action.direction,
        errors: {},
        visited: state.visited.includes(action.stepId)
          ? state.visited
          : [...state.visited, action.stepId],
      }
    case 'submit':
      return { ...state, status: 'submitting' }
    case 'success':
      return { ...state, status: 'success' }
    case 'failure':
      return { ...state, status: 'error' }
  }
}
