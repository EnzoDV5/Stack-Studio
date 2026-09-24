export interface BriefReviewRow {
  label: string
  value: string
  /** Step to jump back to when editing. */
  stepIndex: number
}

export interface BriefReviewProps {
  rows: BriefReviewRow[]
  editLabel: string
  onEdit: (stepIndex: number) => void
}

/** Summary of every answer with an Edit link back to its step. */
export function BriefReview({ rows, editLabel, onEdit }: BriefReviewProps) {
  return (
    <dl className="divide-y divide-(--tone-border) border-y border-tone">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-4 sm:grid-cols-[10rem_1fr_auto]"
        >
          <dt className="self-center eyebrow text-muted">{row.label}</dt>
          <dd className="col-start-1 row-start-2 sm:col-start-2 sm:row-start-1">{row.value}</dd>
          <dd className="col-start-2 row-span-2 row-start-1 self-center sm:col-start-3 sm:row-span-1">
            <button
              type="button"
              onClick={() => onEdit(row.stepIndex)}
              className="text-small text-muted underline underline-offset-4 hover:text-paper"
              aria-label={`${editLabel}: ${row.label}`}
            >
              {editLabel}
            </button>
          </dd>
        </div>
      ))}
    </dl>
  )
}
