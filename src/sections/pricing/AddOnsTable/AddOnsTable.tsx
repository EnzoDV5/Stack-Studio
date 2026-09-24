import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { formatPrice } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { AddOn, SectionIntro } from '@/types'

export interface AddOnsTableProps {
  intro: SectionIntro
  addOns: AddOn[]
  labels: { once: string; monthly: string; name: string; price: string }
  tone?: Tone
}

/** Add-ons as a real, accessible table. */
export function AddOnsTable({ intro, addOns, labels, tone = 'paper' }: AddOnsTableProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          eyebrow={intro.eyebrow}
          title={intro.title}
          intro={intro.intro}
          size="heading-xl"
        />
        <table className="mt-12 w-full border-collapse text-left">
          <thead className="visually-hidden">
            <tr>
              <th scope="col">{labels.name}</th>
              <th scope="col">{labels.price}</th>
            </tr>
          </thead>
          <tbody>
            {addOns.map((addOn) => (
              <tr key={addOn.id} className="border-t border-tone last:border-b">
                <th scope="row" className="py-6 pr-6 align-top font-normal">
                  <span className="block text-heading-md">{addOn.name}</span>
                  <span className="mt-1 block text-small text-muted">{addOn.description}</span>
                </th>
                <td className="py-6 text-right align-top numeric whitespace-nowrap">
                  <span className="text-heading-md">{formatPrice(addOn.price)}</span>{' '}
                  <span className="text-small text-muted">
                    {addOn.billing === 'monthly' ? labels.monthly : labels.once}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
