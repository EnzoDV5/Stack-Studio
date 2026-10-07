import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { TextLink } from '@/components/ui/TextLink'
import { pad2 } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface ServicesSnippetItem {
  title: string
  description: string
  examples: string
  link: CtaLink
}

export interface ServicesSnippetProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  items: ServicesSnippetItem[]
  more: CtaLink
  tone?: Tone
}

/** A compact editorial map of the offer after visitors have chosen their need. */
export function ServicesSnippet({
  index,
  eyebrow,
  title,
  intro,
  items,
  more,
  tone = 'paper',
}: ServicesSnippetProps) {
  const headingId = useId()

  return (
    <Section tone={tone} aria-labelledby={headingId} grid="bottom" spacing="sm">
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="stacked"
          index={index}
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />

        <div className="mt-14 grid border-t border-tone lg:mt-20 lg:grid-cols-12">
          <div className="hidden border-r border-tone py-8 lg:col-span-2 lg:block">
            <span className="eyebrow text-muted">01 / {pad2(items.length)}</span>
            <p
              aria-hidden="true"
              className="mt-12 font-display text-[clamp(7rem,15vw,16rem)] leading-none font-bold tracking-[-0.08em] text-accent"
            >
              S.
            </p>
          </div>

          <ol className="lg:col-span-10 lg:pl-10 xl:pl-16">
            {items.map((item, i) => (
              <li key={item.title} className="border-b border-tone">
                <div className="grid gap-4 py-7 sm:grid-cols-[3rem_minmax(0,1fr)] lg:py-9">
                  <span className="pt-2 eyebrow text-accent">{pad2(i + 1)}</span>
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.65fr)] lg:items-end lg:gap-8">
                    <div>
                      <h3 className="max-w-[16ch] font-display text-heading-xl">{item.title}</h3>
                      <p className="mt-3 max-w-[48ch] text-muted">{item.description}</p>
                    </div>
                    <div className="flex flex-col items-start gap-5 lg:pb-1">
                      <p className="max-w-[34ch] text-small text-muted">{item.examples}</p>
                      <TextLink to={item.link.to} arrow className="text-small">
                        {item.link.label}
                      </TextLink>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex justify-end">
          <TextLink to={more.to} arrow>
            {more.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}
