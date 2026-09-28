import { useRef } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Image } from '@/components/media/Image'
import { Video } from '@/components/media/Video'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, heroScale } from '@/lib/motion-tokens'
import type { MediaSlot } from '@/types'

export interface CaseHeroMediaProps {
  media: MediaSlot
  tone?: Tone
}

/**
 * The project's lead media, full width under the case study meta. Signature motion: it
 * settles from a slight zoom (1.1) to 1 as it scrolls through (scrubbed). Static with
 * reduced motion.
 */
export function CaseHeroMedia({ media, tone = 'dark' }: CaseHeroMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const frame = frameRef.current
      const inner = innerRef.current
      if (reducedMotion || !frame || !inner) return
      gsap.fromTo(
        inner,
        { scale: heroScale.from },
        {
          scale: 1,
          ease: ease.none,
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom 35%',
            scrub: true,
            onToggle: ({ isActive }) =>
              gsap.set(inner, { willChange: isActive ? 'transform' : 'auto' }),
          },
        },
      )
    },
    { scope: frameRef, dependencies: [reducedMotion], revertOnUpdate: true },
  )

  return (
    <Section tone={tone} spacing="none">
      <div className="container-site">
        <div
          ref={frameRef}
          className="relative aspect-video max-h-[80svh] w-full overflow-hidden rounded-lg bg-ink-700"
        >
          <div ref={innerRef} className="size-full">
            <Image image={media.image} priority sizes="(min-width: 1600px) 1600px, 100vw" />
            {media.video && (
              <Video
                video={media.video}
                fallback="none"
                className="pointer-events-none absolute! inset-0 bg-transparent!"
              />
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
