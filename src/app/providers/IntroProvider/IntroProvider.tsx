import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { IntroContext, shouldShowPreloader } from './IntroContext'

export function IntroProvider({ children }: { children: ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(() => !shouldShowPreloader())
  const [transitioning, setTransitioning] = useState(false)

  const markPreloaderDone = useCallback(() => setPreloaderDone(true), [])

  const value = useMemo(
    () => ({
      ready: preloaderDone && !transitioning,
      preloaderDone,
      markPreloaderDone,
      setTransitioning,
    }),
    [preloaderDone, transitioning, markPreloaderDone],
  )

  return <IntroContext value={value}>{children}</IntroContext>
}
