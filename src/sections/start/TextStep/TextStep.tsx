import { BriefField } from '@/sections/start/BriefField'

export interface TextStepProps {
  id: string
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  error?: string
}

/** Free-text answer (what we'd look after, the Partner idea, or the "Not sure" path). */
export function TextStep({ id, label, value, placeholder, onChange, error }: TextStepProps) {
  return (
    <BriefField
      id={id}
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      multiline
      required
      error={error}
    />
  )
}
