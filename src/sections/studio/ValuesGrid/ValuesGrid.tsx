import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { pad2 } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { SectionIntro, ValueItem } from '@/types'

export interface ValuesGridProps {
  intro: SectionIntro
  items: ValueItem[]
  index?: number
  tone?: Tone
}

/** Numbered principles/values grid (used for "How we work" and "Values"). */
export function ValuesGrid({ intro, items, index, tone = 'paper' }: ValuesGridProps) {
  const headingId = useId()
  const cols = items.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  return (
    <Section tone={tone} grid aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          index={index}
          eyebrow={intro.eyebrow}
          title={intro.title}
          intro={intro.intro}
        />
        <StaggerGroup
          as="ol"
          className={`mt-16 grid gap-px border-y border-tone md:grid-cols-2 ${cols}`}
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className="border-tone py-10 md:pr-10 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <p className="eyebrow text-accent">{pad2(i + 1)}</p>
              <h3 className="mt-6 text-heading-lg">{item.title}</h3>
              <p className="mt-3 text-muted">{item.body}</p>
            </li>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  )
}
