import { createContext, useContext } from 'react'

export interface ErrorFeedback {
  title: string
  body: string
  onDismiss?: () => void
}

export interface FeedbackActions {
  showError: (message: ErrorFeedback) => void
  clearError: () => void
}

export const FeedbackContext = createContext<FeedbackActions | null>(null)

export function useFeedback(): FeedbackActions {
  const actions = useContext(FeedbackContext)
  if (!actions) throw new Error('useFeedback must be used inside FeedbackProvider')
  return actions
}
