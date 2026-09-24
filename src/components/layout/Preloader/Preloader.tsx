import { useRef, useState } from 'react'
import { rememberPreloaderSeen, useIntro } from '@/app/providers/IntroProvider'
import { GridOverlay } from '@/components/layout/GridOverlay'
import { Logo } from '@/components/ui/Logo'
import { gsap, useGSAP } from '@/lib/gsap'
import { lockScroll, unlockScroll } from '@/lib/lenis'
import { duration, ease, preloader } from '@/lib/motion-tokens'

export interface PreloaderProps {
  label: string
}

/**
 * First-visit intro, under 1.5s: the mark draws in, a counter runs to 100, then the panel
 * wipes up to reveal the hero. Once per session and never with reduced motion (see
 * shouldShowPreloader). The hero starts its reveal as the wipe begins.
 */
export function Preloader({ label }: PreloaderProps) {
  const { preloaderDone, markPreloaderDone } = useIntro()
  const [gone, setGone] = useState(preloaderDone)
  const rootRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (gone) return
      lockScroll()
      const counter = { value: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          rememberPreloaderSeen()
          unlockScroll()
          setGone(true)
        },
      })

      tl.from('[data-preloader-mark]', {
        yPercent: 100,
        duration: duration.fast,
        ease: ease.out,
      })
        .to(
          counter,
          {
            value: 100,
            duration: preloader.count,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.value))
            },
          },
          0,
        )
        .to('[data-preloader-bar]', { scaleX: 1, duration: preloader.count, ease: 'power2.inOut' }, 0)
        .add(() => markPreloaderDone())
        .to(rootRef.current, {
          yPercent: -100,
          duration: preloader.exit,
          ease: ease.inOut,
        })
    },
    { scope: rootRef },
  )

  if (gone) return null

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label={label}
      className="tone-dark fixed inset-0 z-(--z-preloader) flex flex-col justify-between"
    >
      <GridOverlay fade="radial" />
      <div className="relative flex flex-1 items-center justify-center">
        <div className="overflow-hidden">
          <div data-preloader-mark="" className="text-[clamp(2rem,6vw,4rem)]">
            <Logo title="" />
          </div>
        </div>
      </div>
      <div className="container-site relative flex items-end justify-between pb-8">
        <span className="eyebrow text-muted">{label}</span>
        <span className="numeric font-mono text-heading-lg" aria-hidden="true">
          <span ref={countRef}>0</span>
        </span>
      </div>
      <div
        data-preloader-bar=""
        className="relative h-0.75 origin-left bg-orange"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />
    </div>
  )
}
