import { useMediaQuery } from './useMediaQuery'

export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

/**
 * True on touch / coarse-pointer devices. Magnetic and hover-video effects only run
 * when this is false. Defaults to true (touch) until measured, so nothing desktop-only
 * flashes on phones.
 */
export function useIsTouch(): boolean {
  return !useMediaQuery(FINE_POINTER_QUERY, false)
}
