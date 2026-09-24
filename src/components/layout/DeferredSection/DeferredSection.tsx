import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { ScrollTrigger } from '@/lib/gsap'

export interface DeferredSectionProps {
  children: ReactNode
  /** Reserved height before mount, which limits layout shift. Match the section roughly. */
  minHeight?: string
  /** How early to start loading before the section scrolls into view. */
  rootMargin?: string
}

function RefreshOnMount() {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [])
  return null
}

/**
 * Mounts heavy below-the-fold sections (usually React.lazy chunks) only as they approach
 * the viewport, then refreshes ScrollTrigger so later pins and reveals measure correctly.
 */
export function DeferredSection({
  children,
  minHeight = '60vh',
  rootMargin = '800px 0px',
}: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { rootMargin, once: true })
  const placeholder = <div style={{ minHeight }} aria-hidden="true" />

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={placeholder}>
          {children}
          <RefreshOnMount />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  )
}
