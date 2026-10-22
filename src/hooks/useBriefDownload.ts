import { useCallback } from 'react'
import { useFeedback } from '@/app/providers/FeedbackProvider'
import { feedbackCopy } from '@/data/feedback'
import { downloadBriefPdf } from '@/lib/brief-download'
import type { BriefRecord } from '@/lib/brief-record'

/** All PDF entry points report a failure to the visitor, including automatic downloads. */
export function useBriefDownload() {
  const { showError } = useFeedback()
  return useCallback(
    async (record: BriefRecord) => {
      try {
        await downloadBriefPdf(record)
      } catch (error) {
        showError(feedbackCopy.downloadFailure)
        throw error
      }
    },
    [showError],
  )
}
