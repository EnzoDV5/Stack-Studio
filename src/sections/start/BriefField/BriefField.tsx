import type { HTMLInputAutoCompleteAttribute } from 'react'
import { cn } from '@/lib/cn'

export interface BriefFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  autoComplete?: HTMLInputAutoCompleteAttribute
  required?: boolean
  multiline?: boolean
  maxLength?: number
  error?: string
}

const inputClass =
  'mt-2 block w-full rounded-md border bg-ink-800 px-4 py-3.5 text-body text-paper placeholder:text-grey-400 transition-colors duration-(--duration-micro) focus-visible:border-orange'

/** Labelled text input/textarea with an inline, announced error. */
export function BriefField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  required = false,
  multiline = false,
  maxLength,
  error,
}: BriefFieldProps) {
  const errorId = `${id}-error`
  const shared = {
    id,
    name: id,
    value,
    placeholder,
    autoComplete,
    required,
    maxLength,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: cn(inputClass, error ? 'border-error' : 'border-tone'),
  }

  return (
    <div>
      <label htmlFor={id} className="text-small font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...shared}
          type={type}
          inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className="mt-2 text-small text-error">
          {error}
        </p>
      )}
    </div>
  )
}
