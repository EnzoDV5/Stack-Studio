import { OptionCard } from '@/sections/start/OptionCard'
import type { BriefOption } from '@/types'

export interface MultiChoiceStepProps {
  id: string
  legend: string
  options: BriefOption[]
  values: string[]
  onToggle: (value: string) => void
  invalid?: boolean
  describedBy?: string
}

/** Many-of-many choice as checkbox cards. Number keys 1–9 toggle (handled by the flow). */
export function MultiChoiceStep({
  id,
  legend,
  options,
  values,
  onToggle,
  invalid,
  describedBy,
}: MultiChoiceStepProps) {
  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="visually-hidden">{legend}</legend>
      <div id={id} tabIndex={-1} className="grid gap-3 outline-none sm:grid-cols-2">
        {options.map((option, i) => (
          <OptionCard
            key={option.value}
            type="checkbox"
            name={id}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={() => onToggle(option.value)}
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
