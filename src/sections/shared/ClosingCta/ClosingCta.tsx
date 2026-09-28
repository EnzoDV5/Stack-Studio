import { useRef, type ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { closingType, ease } from '@/lib/motion-tokens'
import type { CtaContent } from '@/types'

export interface ClosingCtaProps {
  content: CtaContent
  /** Analytics location for the CTA click, e.g. 'home-closing'. */
  location: string
  tone?: Tone
  /** Optional secondary action (e.g. WhatsApp). */
  secondary?: ReactNode
}

/**
 * The giant closing CTA band. Orange by default: the one big orange moment per page.
 * Signature motion (scrubbed): as the band scrolls in, the giant type scales from 0.8 to 1
 * and its tracking tightens. Tracking is moved with per-character transforms rather than
 * letter-spacing, so nothing reflows mid-scroll. Static with reduced motion.
 */
export function ClosingCta({ content, location, tone = 'orange', secondary }: ClosingCtaProps) {
  const buttonVariant = tone === 'orange' ? 'inverse' : 'primary'
  const titleRef = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const title = titleRef.current
      if (reducedMotion || !title) return
      SplitText.create(title, {
        type: 'lines,chars',
        aria: 'auto',
        autoSplit: true,
        linesClass: 'split-line',
        onSplit(self) {
          const spread = parseFloat(getComputedStyle(title).fontSize) * closingType.trackingFrom
          const timeline = gsap.timeline({
            defaults: { ease: ease.none },
            scrollTrigger: {
              trigger: title,
              start: 'top bottom',
              end: 'bottom 70%',
              scrub: true,
              onToggle: ({ isActive }) =>
                gsap.set(title, { willChange: isActive ? 'transform' : 'auto' }),
            },
          })
          timeline.fromTo(
            title,
            { scale: closingType.scaleFrom, transformOrigin: '0% 100%' },
            { scale: 1 },
            0,
          )
          for (const line of self.lines) {
            const chars = self.chars.filter((char) => line.contains(char))
            timeline.fromTo(chars, { x: (i: number) => i * spread }, { x: 0 }, 0)
          }
          return timeline
        },
      })
    },
    { scope: titleRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <Section tone={tone} grid="radial" className="overflow-hidden">
      <div className="container-site">
        {content.eyebrow && <Eyebrow label={content.eyebrow} className="mb-10" />}
        <h2 ref={titleRef} className="max-w-[13ch] font-display text-display-2xl">
          {content.title}
        </h2>
        <div className="relative z-10 mt-14 flex flex-col gap-10 border-t border-tone pt-10 md:flex-row md:items-center md:justify-between">
          {content.body && <p className="max-w-[40ch] text-body-lg text-muted">{content.body}</p>}
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              to={content.to}
              variant={buttonVariant}
              size="lg"
              withArrow
              analytics={{ event: 'Start project click', props: { location } }}
            >
              {content.label}
            </MagneticButton>
            {secondary}
          </div>
        </div>
      </div>
    </Section>
  )
}
