import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { feedbackCopy } from '@/data/feedback'
import { FeedbackContext, type ErrorFeedback } from './FeedbackContext'

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<(ErrorFeedback & { id: number; open: boolean }) | null>(
    null,
  )
  const nextId = useRef(0)

  const showError = useCallback((error: ErrorFeedback) => {
    setMessage({ ...error, id: ++nextId.current, open: true })
  }, [])
  const clearError = useCallback(() => {
    setMessage((current) => (current ? { ...current, open: false } : null))
  }, [])
  const value = useMemo(() => ({ showError, clearError }), [showError, clearError])

  return (
    <FeedbackContext value={value}>
      {children}
      {message && (
        <ErrorToast
          key={message.id}
          open={message.open}
          title={message.title}
          body={message.body}
          label={feedbackCopy.label}
          dismissLabel={feedbackCopy.dismiss}
          onDismiss={clearError}
          onExited={() => {
            // An older toast finishing its exit must not clear a newer failure.
            setMessage((current) => (current?.id === message.id ? null : current))
          }}
        />
      )}
    </FeedbackContext>
  )
}
