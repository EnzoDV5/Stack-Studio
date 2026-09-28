import { useEffect } from 'react'
import { watchLayoutChanges } from '@/lib/scroll-refresh'

/** Keep pins and scrubs aligned while fonts and media load. Call once, in the app shell. */
export function useScrollRefresh(): void {
  useEffect(() => watchLayoutChanges(), [])
}
