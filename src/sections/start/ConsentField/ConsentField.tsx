import { Link } from 'react-router'
import { cn } from '@/lib/cn'

export interface ConsentFieldProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  linkLabel: string
  privacyHref: string
  note: string
  error?: string
}

/** Required POPIA consent checkbox with a short privacy note and a link to /privacy. */
export function ConsentField({
  id,
  checked,
  onChange,
  label,
  linkLabel,
  privacyHref,
  note,
  error,
}: ConsentFieldProps) {
  const errorId = `${id}-error`
  const noteId = `${id}-note`
  return (
    <div className={cn('rounded-md border p-5', error ? 'border-error' : 'border-tone')}>
      <div className="flex items-start gap-4">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          required
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(noteId, error && errorId) || undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-orange"
        />
        <label htmlFor={id} className="text-small">
          {label}{' '}
          <Link
            to={privacyHref}
            target="_blank"
            className="underline underline-offset-4 hover:text-orange"
          >
            {linkLabel}
          </Link>
          .
        </label>
      </div>
      <p id={noteId} className="mt-3 pl-9 text-small text-muted">
        {note}
      </p>
      {error && (
        <p id={errorId} className="mt-3 pl-9 text-small text-error">
          {error}
        </p>
      )}
    </div>
  )
}
