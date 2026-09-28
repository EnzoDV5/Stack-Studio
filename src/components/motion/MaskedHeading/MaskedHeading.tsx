import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, maskedHeading } from '@/lib/motion-tokens'
import styles from './MaskedHeading.module.css'

export interface MaskedHeadingProps {
  /** Plain text compiled from code characters into the readable title. */
  text: string
  /** Decorative code used to seed the same-length scrambling title. */
  codeLines: string[]
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  id?: string
  className?: string
}

/**
 * A heading that begins as same-size code characters and resolves left-to-right into its
 * readable title. Every character keeps the final glyph's width, so the heading never shifts
 * or changes length while it compiles. No images, video or canvas are involved.
 */
export function MaskedHeading({
  text,
  codeLines,
  as: Tag = 'h2',
  id,
  className,
}: MaskedHeadingProps) {
  const rootRef = useRef<HTMLHeadingElement>(null)
  const codeRefs = useRef<(HTMLSpanElement | null)[]>([])
  const resolvedRefs = useRef<(HTMLSpanElement | null)[]>([])
  const reducedMotion = useReducedMotion()
  const words = text.split(/\s+/).filter(Boolean)
  const characterCount = words.reduce((total, word) => total + Array.from(word).length, 0)
  const codeCharacters = Array.from(codeLines.join('').replace(/\s+/g, '') || '<>{}[]/01')
  const codeKey = codeCharacters.join('')

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || reducedMotion) return

      const code = codeRefs.current.slice(0, characterCount).filter(Boolean) as HTMLSpanElement[]
      const resolved = resolvedRefs.current
        .slice(0, characterCount)
        .filter(Boolean) as HTMLSpanElement[]
      if (!code.length || !resolved.length) return

      const state = { progress: 0 }
      const draw = () => {
        const phase = Math.floor(state.progress * maskedHeading.scrambleSteps)

        code.forEach((element, index) => {
          const start =
            characterCount <= 1
              ? 0
              : (index / (characterCount - 1)) * (1 - maskedHeading.characterReveal)
          const reveal = gsap.utils.clamp(
            0,
            1,
            (state.progress - start) / maskedHeading.characterReveal,
          )
          element.textContent =
            codeCharacters[(index * 7 + phase * 5) % codeCharacters.length] ?? '/'
          element.style.opacity = String(1 - reveal)
          const resolvedElement = resolved[index]
          if (resolvedElement) resolvedElement.style.opacity = String(reveal)
        })
      }

      draw()
      const compile = gsap.to(state, {
        progress: 1,
        ease: ease.none,
        onUpdate: draw,
        scrollTrigger: {
          trigger: root,
          start: 'top 92%',
          end: 'top 12%',
          scrub: maskedHeading.scrub,
          invalidateOnRefresh: true,
        },
      })
      return () => compile.kill()
    },
    {
      scope: rootRef,
      dependencies: [characterCount, codeKey, reducedMotion, text],
      revertOnUpdate: true,
    },
  )

  let characterIndex = 0

  return (
    <Tag ref={rootRef} id={id} aria-label={text} className={cn(styles.root, className)}>
      {reducedMotion ? (
        text
      ) : (
        <span className={styles.visual} aria-hidden="true">
          {words.map((word, wordIndex) => (
            <span key={`${word}-${wordIndex}`} className={styles.word}>
              {Array.from(word).map((character) => {
                const index = characterIndex++
                return (
                  <span key={`${character}-${index}`} className={styles.character}>
                    <span className={styles.sizer}>{character}</span>
                    <span
                      ref={(element) => {
                        codeRefs.current[index] = element
                      }}
                      className={styles.codeCharacter}
                    >
                      {codeCharacters[(index * 7) % codeCharacters.length]}
                    </span>
                    <span
                      ref={(element) => {
                        resolvedRefs.current[index] = element
                      }}
                      className={styles.resolvedCharacter}
                    >
                      {character}
                    </span>
                  </span>
                )
              })}
            </span>
          ))}
        </span>
      )}
    </Tag>
  )
}
