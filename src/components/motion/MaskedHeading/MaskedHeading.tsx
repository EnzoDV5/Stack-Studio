import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/gsap'
import { ease, maskedHeading, trigger } from '@/lib/motion-tokens'
import styles from './MaskedHeading.module.css'

export interface MaskedHeadingProps {
  /** Plain text compiled from code characters into the readable title. */
  text: string
  /** Decorative code whose characters fill the title before it compiles. */
  codeLines: string[]
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  id?: string
  className?: string
}

/**
 * A heading that waits as running code characters and, once it enters the viewport, compiles
 * itself left to right into its readable title. It plays once, on a timer: scrolling only
 * starts it, never drives it. Every character keeps the final glyph's width, so the heading
 * never shifts or changes length. Without JS or with reduced motion it is plain text.
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
  const codeKey = codeLines.join('').replace(/\s+/g, '') || '<>{}[]/01'

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || reducedMotion) return

      const code = codeRefs.current.slice(0, characterCount)
      const resolved = resolvedRefs.current.slice(0, characterCount)
      if (code.some((el) => !el) || resolved.some((el) => !el)) return
      const codeEls = code as HTMLSpanElement[]
      const resolvedEls = resolved as HTMLSpanElement[]

      const glyphs = Array.from(codeKey)
      const glyph = () => glyphs[Math.floor(Math.random() * glyphs.length)] ?? '/'

      // When each character locks: a left-to-right sweep whose length scales with the title.
      const sweep = gsap.utils.clamp(
        maskedHeading.minSweep,
        maskedHeading.maxSweep,
        characterCount * maskedHeading.perCharacter,
      )
      const spread = gsap.parseEase(maskedHeading.ease)
      const lockAt = codeEls.map(
        (_, index) =>
          maskedHeading.lead +
          sweep * spread(characterCount <= 1 ? 1 : index / (characterCount - 1)),
      )
      const total = maskedHeading.lead + sweep

      // Park: code showing, title hidden. Recorded by the context, so a revert restores the title.
      codeEls.forEach((el) => {
        el.textContent = glyph()
      })
      gsap.set(codeEls, { opacity: 1 })
      gsap.set(resolvedEls, { opacity: 0 })

      // Only characters still running get touched, and only once per tick, so a frame
      // costs a handful of text writes at most, not the whole heading.
      let next = 0
      let lastTick = -1
      const state = { time: 0 }
      const draw = () => {
        while (next < characterCount && state.time >= (lockAt[next] ?? total)) {
          const codeEl = codeEls[next]
          const resolvedEl = resolvedEls[next]
          if (codeEl) codeEl.style.opacity = '0'
          if (resolvedEl) resolvedEl.style.opacity = '1'
          next++
        }
        const tick = Math.floor(state.time / maskedHeading.tick)
        if (tick === lastTick) return
        lastTick = tick
        for (let index = next; index < characterCount; index++) {
          const codeEl = codeEls[index]
          if (codeEl) codeEl.textContent = glyph()
        }
      }

      gsap.to(state, {
        time: total,
        duration: total,
        ease: ease.none,
        onUpdate: draw,
        scrollTrigger: {
          trigger: root,
          // clamp() so a heading near the end of a short page still gets its start.
          start: `clamp(${trigger.start})`,
          once: true,
        },
      })
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
                    <span
                      ref={(element) => {
                        resolvedRefs.current[index] = element
                      }}
                      className={styles.resolvedCharacter}
                    >
                      {character}
                    </span>
                    {/* Filled and shown by the animation only; React never renders text here. */}
                    <span
                      ref={(element) => {
                        codeRefs.current[index] = element
                      }}
                      className={styles.codeCharacter}
                    />
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
