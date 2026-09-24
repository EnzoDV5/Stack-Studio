import { useRef, type ElementType, type ReactNode } from 'react'
import { useIntro } from '@/app/providers/IntroProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { duration, ease, stagger, trigger as triggerTokens } from '@/lib/motion-tokens'

export interface SplitRevealProps {
  children: ReactNode
  as?: ElementType
  id?: string
  className?: string
  /** 'scroll' plays when it enters the viewport; 'intro' plays once the preloader or page wipe is done. */
  trigger?: 'scroll' | 'intro'
  /** 'lines' for headlines, 'words' for short, punchy statements. */
  type?: 'lines' | 'words'
  delay?: number
}

/**
 * Line-by-line (or word-by-word) masked text reveal using SplitText. Re-splits
 * responsively (autoSplit) and keeps the accessible text intact (SplitText aria: auto).
 * With reduced motion the text is rendered as-is: never split, never hidden.
 */
export function SplitReveal({
  children,
  as: Tag = 'p',
  id,
  className,
  trigger = 'scroll',
  type = 'lines',
  delay = 0,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { ready } = useIntro()

  useGSAP(
    () => {
      const el = ref.current
      if (reducedMotion || !el) return

      // Hold intro text hidden while the preloader or page wipe covers it.
      if (trigger === 'intro' && !ready) {
        gsap.set(el, { autoAlpha: 0 })
        return
      }

      SplitText.create(el, {
        type: type === 'lines' ? 'lines' : 'words,lines',
        mask: type,
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          const targets = type === 'lines' ? self.lines : self.words
          return gsap.from(targets, {
            yPercent: 115,
            duration: duration.slow,
            ease: ease.out,
            stagger: type === 'lines' ? stagger.base : stagger.tight,
            delay,
            scrollTrigger:
              trigger === 'scroll'
                ? { trigger: el, start: triggerTokens.start, once: true }
                : undefined,
          })
        },
      })
    },
    { scope: ref, dependencies: [reducedMotion, ready, trigger, type, delay], revertOnUpdate: true },
  )

  return (
    <Tag ref={ref} id={id} className={cn(className)}>
      {children}
    </Tag>
  )
}
