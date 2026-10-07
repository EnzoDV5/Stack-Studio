import { useId, useRef } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { TextLink } from '@/components/ui/TextLink'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { pad2 } from '@/lib/format'
import { gsap, useGSAP } from '@/lib/gsap'
import { duration, ease, trigger } from '@/lib/motion-tokens'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink } from '@/types'

export interface ProcessSnippetStep {
  title: string
  body: string
  when: string
}

export interface ProcessSnippetProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  countLabel: string
  steps: ProcessSnippetStep[]
  more: CtaLink
  tone?: Tone
}

/** A short, vertical journey; the full timeline and terms live on /process. */
export function ProcessSnippet({
  index,
  eyebrow,
  title,
  intro,
  countLabel,
  steps,
  more,
  tone = 'dark',
}: ProcessSnippetProps) {
  const headingId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const list = listRef.current
      if (!list || reducedMotion) return
      const fill = list.querySelector<HTMLElement>('[data-rail-fill]')
      const markers = gsap.utils.toArray<HTMLElement>('[data-marker]', list)
      if (!fill) return

      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: duration.slow,
          ease: ease.out,
          scrollTrigger: { trigger: list, start: trigger.start, once: true },
          onStart: () => gsap.set(fill, { willChange: 'transform' }),
          onComplete: () => gsap.set(fill, { willChange: 'auto' }),
        },
      )
      markers.forEach((marker) => {
        gsap.fromTo(
          marker,
          { opacity: 0, scale: 0.4 },
          {
            opacity: 1,
            scale: 1,
            duration: duration.fast,
            ease: ease.out,
            scrollTrigger: { trigger: marker.closest('li'), start: trigger.start, once: true },
            onStart: () => gsap.set(marker, { willChange: 'transform, opacity' }),
            onComplete: () => gsap.set(marker, { willChange: 'auto' }),
          },
        )
      })
    },
    { scope: listRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <Section tone={tone} aria-labelledby={headingId} grid="edges">
      <div className="container-site">
        <SectionHeader
          id={headingId}
          variant="minimal"
          index={index}
          eyebrow={eyebrow}
          title={title}
        />

        <div className="mt-12 grid gap-14 border-t border-tone pt-10 lg:mt-16 lg:grid-cols-12 lg:gap-10 lg:pt-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="max-w-[27ch] font-display text-heading-xl">{intro}</p>
              <div className="mt-10 flex items-end gap-4 border-t border-tone pt-7">
                <span
                  aria-hidden="true"
                  className="font-display text-[clamp(5rem,11vw,11rem)] leading-[0.8] font-bold tracking-[-0.08em] text-accent"
                >
                  {pad2(steps.length)}
                </span>
                <span className="pb-1 eyebrow text-muted">{countLabel}</span>
              </div>
              <div className="mt-10">
                <TextLink to={more.to} arrow>
                  {more.label}
                </TextLink>
              </div>
            </div>
          </div>

          <div ref={listRef} className="relative lg:col-span-7 lg:col-start-7">
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-3 w-px bg-(--tone-border)"
            >
              <span data-rail-fill="" className="absolute inset-0 origin-top bg-orange" />
            </span>
            <ol>
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="relative grid gap-5 border-t border-tone py-8 pl-12 first:pt-8 last:border-b sm:grid-cols-[minmax(0,1fr)_8rem] sm:gap-8 lg:py-11"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-9 left-[0.5rem] size-4 border border-(--tone-border) bg-(--tone-bg) lg:top-12"
                  >
                    <span data-marker="" className="absolute inset-[3px] bg-orange" />
                  </span>
                  <div>
                    <span className="eyebrow text-accent">
                      {pad2(i + 1)} / {pad2(steps.length)}
                    </span>
                    <h3 className="mt-4 max-w-[20ch] font-display text-heading-lg">{step.title}</h3>
                    <p className="mt-3 max-w-[48ch] text-muted">{step.body}</p>
                  </div>
                  <span className="self-end eyebrow text-muted sm:text-right">{step.when}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  )
}
