import type { HTMLInputAutoCompleteAttribute } from 'react'
import { BriefField } from '@/sections/start/BriefField'
import { ConsentField } from '@/sections/start/ConsentField'
import type { BriefContact, BriefErrors } from '@/types'

interface FieldCopy {
  label: string
  placeholder: string
  autoComplete: string
}

export interface ContactStepProps {
  idPrefix: string
  contact: BriefContact
  consent: boolean
  errors: BriefErrors
  onContact: (field: keyof BriefContact, value: string) => void
  onConsent: (value: boolean) => void
  fields: Record<keyof BriefContact, FieldCopy>
  consentCopy: { label: string; linkLabel: string; note: string }
  privacyHref: string
}

const TYPES: Partial<Record<keyof BriefContact, 'email' | 'tel'>> = { email: 'email', phone: 'tel' }

/** Contact details plus the required POPIA consent. */
export function ContactStep({
  idPrefix,
  contact,
  consent,
  errors,
  onContact,
  onConsent,
  fields,
  consentCopy,
  privacyHref,
}: ContactStepProps) {
  const field = (name: keyof BriefContact, multiline = false) => (
    <BriefField
      id={`${idPrefix}-${name}`}
      label={fields[name].label}
      placeholder={fields[name].placeholder}
      autoComplete={fields[name].autoComplete as HTMLInputAutoCompleteAttribute}
      type={TYPES[name] ?? 'text'}
      multiline={multiline}
      required={name === 'name' || name === 'email'}
      value={contact[name]}
      onChange={(value) => onContact(name, value)}
      error={errors[`contact.${name}`]}
    />
  )

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {field('name')}
      {field('email')}
      {field('phone')}
      {field('company')}
      <div className="sm:col-span-2">{field('message', true)}</div>
      <div className="sm:col-span-2">
        <ConsentField
          id={`${idPrefix}-consent`}
          checked={consent}
          onChange={onConsent}
          label={consentCopy.label}
          linkLabel={consentCopy.linkLabel}
          privacyHref={privacyHref}
          note={consentCopy.note}
          error={errors.consent}
        />
      </div>
    </div>
  )
}
