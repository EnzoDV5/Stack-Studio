import { useEffect, useState, type RefObject } from 'react'

interface UseInViewOptions {
  rootMargin?: string
  threshold?: number | number[]
  /** Stop observing after the first intersection. */
  once?: boolean
}

/** IntersectionObserver as a boolean. Used for video playback and deferred sections. */
export function useInView(
  ref: RefObject<Element | null>,
  { rootMargin = '0px', threshold = 0, once = false }: UseInViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) observer.disconnect()
      },
      { rootMargin, threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold, once])

  return inView
}
