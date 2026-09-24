import { useEffect, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { startLenis } from '@/lib/lenis'

/**
 * Owns the Lenis lifecycle. With reduced motion there is no Lenis: native scrolling, no
 * smoothing. Components use the useLenis() controls, which work either way.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    return startLenis()
  }, [reducedMotion])

  return children
}
