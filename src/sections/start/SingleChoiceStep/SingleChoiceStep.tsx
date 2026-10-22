import { OptionCard } from '@/sections/start/OptionCard'
import type { BriefOption } from '@/types'

export interface SingleChoiceStepProps {
  /** Used for the radio group name and as the focus target id. */
  id: string
  legend: string
  options: BriefOption[]
  value: string | null
  onChange: (value: string) => void
  invalid?: boolean
  describedBy?: string
}

/** One-of-many choice as radio cards. Number keys 1–9 are handled by the flow. */
export function SingleChoiceStep({
  id,
  legend,
  options,
  value,
  onChange,
  invalid,
  describedBy,
}: SingleChoiceStepProps) {
  return (
    <fieldset className="min-w-0" aria-describedby={describedBy}>
      <legend className="visually-hidden">{legend}</legend>
      <div id={id} tabIndex={-1} className="grid grid-cols-1 gap-3 outline-none sm:grid-cols-2">
        {options.map((option, i) => (
          <OptionCard
            key={option.value}
            type="radio"
            name={id}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            label={option.label}
            description={option.description}
            meta={option.meta}
            shortcut={i + 1}
            invalid={invalid}
          />
        ))}
      </div>
    </fieldset>
  )
}
