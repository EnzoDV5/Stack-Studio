import { useState } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { pad2 } from '@/lib/format'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

interface CareOption {
  label: string
  short: string
  body: string
  detailLink: CtaLink
}

export interface CareOptionsProps {
  id: string
  title: string
  eyebrow: string
  intro: string
  comparison: CareOption[]
  cta: CtaLink
  tone?: Tone
}

/** Lets visitors explore the three levels before their detailed plan cards. */
export function CareOptions({
  id,
  title,
  eyebrow,
  intro,
  comparison,
  cta,
  tone = 'dark',
}: CareOptionsProps) {
  const headingId = `${id}-heading`
  const [activeIndex, setActiveIndex] = useState(0)
  const selected = comparison[activeIndex]

  return (
    <Section id={id} tone={tone} spacing="none" className="py-section" aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="split"
          eyebrow={eyebrow}
          title={title}
          intro={intro}
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div role="group" aria-label={eyebrow} className="border-t border-tone lg:col-span-5">
            {comparison.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={`group grid w-full cursor-pointer grid-cols-[2.5rem_1fr_1.5rem] items-start gap-3 border-b border-tone px-3 py-6 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange md:px-5 md:py-8 ${
                  index === activeIndex ? 'bg-ink-800' : 'hover:bg-ink-800/60'
                }`}
              >
                <span className="numeric text-small text-accent">{pad2(index + 1)}</span>
                <span>
                  <span className="block text-heading-md">{item.label}</span>
                  <span className="mt-2 block text-small text-muted">{item.short}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`text-heading-md transition-transform duration-300 ${index === activeIndex ? 'translate-x-1 text-accent' : 'text-muted group-hover:translate-x-1'}`}
                >
                  ↗
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="relative isolate flex min-h-[24rem] flex-col overflow-hidden rounded-lg border border-tone bg-ink-800 p-7 sm:p-10 lg:col-span-7 lg:min-h-[30rem]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -bottom-16 -z-10 numeric text-[clamp(12rem,30vw,28rem)] leading-none text-paper/5"
              >
                {pad2(activeIndex + 1)}
              </span>
              <div className="flex items-center justify-between gap-5 border-b border-tone pb-5 eyebrow text-muted">
                <span>{selected.short}</span>
                <span>
                  {pad2(activeIndex + 1)} / {pad2(comparison.length)}
                </span>
              </div>
              <div className="my-auto py-10">
                <p className="mb-5 eyebrow text-accent">{eyebrow}</p>
                <h3 className="max-w-[12ch] text-display-lg">{selected.label}</h3>
                <p className="mt-6 max-w-[38ch] text-body-lg text-muted">{selected.body}</p>
              </div>
              <Button
                to={selected.detailLink.to}
                variant="secondary"
                withArrow
                className="self-start"
              >
                {selected.detailLink.label}
              </Button>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-end">
          <Button to={cta.to} variant="ghost" withArrow>
            {cta.label}
          </Button>
        </div>
      </div>
    </Section>
  )
}
