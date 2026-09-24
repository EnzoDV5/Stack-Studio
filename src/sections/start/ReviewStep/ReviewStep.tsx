import { BriefReview, type BriefReviewRow } from '@/sections/start/BriefReview'

export interface ReviewStepProps {
  /** One row per answered visible step; `stepIndex` is unused here, `stepId` drives editing. */
  rows: (Omit<BriefReviewRow, 'stepIndex'> & { stepId: string })[]
  editLabel: string
  onEdit: (stepId: string) => void
}

/** Every answer on the chosen path, each with an Edit link back to its step. */
export function ReviewStep({ rows, editLabel, onEdit }: ReviewStepProps) {
  return (
    <BriefReview
      rows={rows.map((row, i) => ({ label: row.label, value: row.value, stepIndex: i }))}
      editLabel={editLabel}
      onEdit={(i) => {
        const row = rows[i]
        if (row) onEdit(row.stepId)
      }}
    />
  )
}
