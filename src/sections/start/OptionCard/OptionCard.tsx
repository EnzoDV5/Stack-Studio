import { cn } from '@/lib/cn'
import styles from './OptionCard.module.css'

export interface OptionCardProps {
  type: 'radio' | 'checkbox'
  name: string
  value: string
  checked: boolean
  onChange: () => void
  label: string
  description?: string
  /** Right-aligned detail, e.g. "From R 22 222". */
  meta?: string
  /** Number-key shortcut shown as a keycap (1–9). */
  shortcut?: number
  invalid?: boolean
  describedBy?: string
}

/** A native radio/checkbox styled as a selectable card, fully keyboard-accessible. */
export function OptionCard({
  type,
  name,
  value,
  checked,
  onChange,
  label,
  description,
  meta,
  shortcut,
  invalid = false,
  describedBy,
}: OptionCardProps) {
  return (
    <label className={cn(styles.card, checked && styles.checked, invalid && styles.invalid)}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="visually-hidden"
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
      />
      {shortcut !== undefined && shortcut <= 9 && (
        <span className={styles.key} aria-hidden="true">
          {shortcut}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}</span>
        {description && <span className="mt-1 block text-small text-muted">{description}</span>}
        {meta && <span className="mt-3 block numeric text-small text-accent">{meta}</span>}
      </span>
      <span
        aria-hidden="true"
        className={cn(styles.indicator, type === 'checkbox' && styles.square)}
      />
    </label>
  )
}
