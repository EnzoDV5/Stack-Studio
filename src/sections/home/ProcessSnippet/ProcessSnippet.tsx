import { useId, useRef } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Tag } from '@/components/ui/Tag'
import { TextLink } from '@/components/ui/TextLink'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { pad2 } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, processRail } from '@/lib/motion-tokens'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface ProcessSnippetStep {
  title: string
  body: string
  /** How long it takes or how often it happens, e.g. "Around six weeks". */
  when: string
}

export interface ProcessSnippetProps {
  index?: number
  eyebrow: string
  title: string
  steps: ProcessSnippetStep[]
  /** "Go deeper" link to the full process. */
  more: CtaLink
  tone?: Tone
}

/**
 * How working with us runs, in four short steps, so Home can summarise it and leave the detail to
 * /process. Signature motion (from md, scrubbed): an orange line fills the rail above the steps
 * as the section scrolls through, lighting each step's marker as it passes. Phones and reduced
 * motion: the rail full and every marker lit.
 */
export function ProcessSnippet({
  index,
  eyebrow,
  title,
  steps,
  more,
  tone = 'paper',
}: ProcessSnippetProps) {
  const headingId = useId()
  const listRef = useRef<HTMLOListElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const list = listRef.current
      if (!list || reducedMotion) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 48rem)', () => {
        const fill = list.querySelector<HTMLElement>('[data-rail-fill]')
        const markers = gsap.utils.toArray<HTMLElement>('[data-marker]', list)
        if (!fill) return
        const tl = gsap.timeline({
          defaults: { ease: ease.none },
          scrollTrigger: {
            trigger: list,
            start: processRail.start,
            end: processRail.end,
            scrub: processRail.scrub,
            onToggle: (self) =>
              gsap.set([fill, ...markers], { willChange: self.isActive ? 'transform' : 'auto' }),
          },
        })
        tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
        // Each marker lights as the line reaches the start of its column.
        markers.forEach((marker, i) => {
          tl.fromTo(
            marker,
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, duration: 0.08 },
            i / markers.length,
          )
        })
      })
      return () => mm.revert()
    },
    { scope: listRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="inline"
          index={index}
          eyebrow={eyebrow}
          title={title}
        />

        <ol ref={listRef} className="relative mt-12 grid gap-10 md:mt-16 md:grid-cols-4 md:gap-8">
          {/* The rail: a hairline with the orange fill over it (decorative). */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 hidden h-px bg-(--tone-border) md:block"
          >
            <span data-rail-fill="" className="absolute inset-0 origin-left bg-orange" />
          </span>
          {steps.map((step, i) => (
            <li key={step.title} className="relative md:pt-10">
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 hidden size-2.5 -translate-y-1/2 border border-(--tone-border) bg-(--tone-bg) md:block"
              >
                <span data-marker="" className="absolute -inset-px bg-orange" />
              </span>
              <span className="eyebrow text-accent">{pad2(i + 1)}</span>
              <h3 className="mt-3 text-heading-md">{step.title}</h3>
              <p className="mt-2 max-w-[32ch] text-small text-muted">{step.body}</p>
              <Tag className="mt-4">{step.when}</Tag>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <TextLink to={more.to} arrow>
            {more.label}
          </TextLink>
        </div>
      </div>
    </Section>
  )
}
