/**
 * Guided-brief state machine (used with useReducer in <BriefFlow>). Pure: validation
 * happens in the component before `next` is dispatched.
 */
import { BRIEF_STEPS, type BriefAction, type BriefAnswers, type BriefState } from '@/types'

const LAST = BRIEF_STEPS.length - 1

export const emptyAnswers: BriefAnswers = {
  projectType: null,
  scope: null,
  features: [],
  monthlyPlan: null,
  timeline: null,
  budget: null,
  contact: { name: '', email: '', phone: '', company: '', message: '' },
  consent: false,
}

export function initBriefState(answers: BriefAnswers, stepIndex = 0): BriefState {
  return { stepIndex, direction: 1, answers, errors: {}, status: 'editing', furthest: stepIndex }
}

function clearError(errors: BriefState['errors'], key: string) {
  if (!(key in errors)) return errors
  return Object.fromEntries(Object.entries(errors).filter(([k]) => k !== key))
}

export function briefReducer(state: BriefState, action: BriefAction): BriefState {
  switch (action.type) {
    case 'select':
      return {
        ...state,
        answers: { ...state.answers, [action.field]: action.value },
        errors: clearError(state.errors, action.field),
      }
    case 'toggleFeature': {
      const has = state.answers.features.includes(action.id)
      const features = has
        ? state.answers.features.filter((f) => f !== action.id)
        : [...state.answers.features, action.id]
      return { ...state, answers: { ...state.answers, features } }
    }
    case 'contact':
      return {
        ...state,
        answers: {
          ...state.answers,
          contact: { ...state.answers.contact, [action.field]: action.value },
        },
        errors: clearError(state.errors, `contact.${action.field}`),
      }
    case 'consent':
      return {
        ...state,
        answers: { ...state.answers, consent: action.value },
        errors: clearError(state.errors, 'consent'),
      }
    case 'errors':
      return { ...state, errors: action.errors }
    case 'next': {
      const stepIndex = Math.min(state.stepIndex + 1, LAST)
      return {
        ...state,
        stepIndex,
        direction: 1,
        errors: {},
        furthest: Math.max(state.furthest, stepIndex),
      }
    }
    case 'back':
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0), direction: -1, errors: {} }
    case 'goTo':
      if (action.stepIndex > state.furthest) return state
      return {
        ...state,
        stepIndex: action.stepIndex,
        direction: action.stepIndex < state.stepIndex ? -1 : 1,
        errors: {},
      }
    case 'submit':
      return { ...state, status: 'submitting' }
    case 'success':
      return { ...state, status: 'success' }
    case 'failure':
      return { ...state, status: 'error' }
    case 'reset':
      return initBriefState(action.answers, action.stepIndex)
  }
}
