import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import type { ImageAsset } from '@/types'

export interface ClientLogoProps {
  /** A logo drawn for dark backgrounds, with a transparent background. */
  logo: ImageAsset
  className?: string
}

/**
 * A client's logo, straight on the page (no plate or background). Sized by optical weight
 * rather than one fixed height: wide wordmarks come out shorter and square marks taller, so
 * every logo carries about the same presence (height = --logo-size ÷ √aspect).
 */
export function ClientLogo({ logo, className }: ClientLogoProps) {
  const aspect = logo.width / logo.height
  return (
    <img
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={logo.alt}
      decoding="async"
      style={{ '--logo-aspect': Math.sqrt(aspect).toFixed(3) } as CSSProperties}
      className={cn(
        'h-[calc(var(--logo-size)/var(--logo-aspect))] w-auto max-w-full [--logo-size:5.5rem] md:[--logo-size:7.5rem]',
        className,
      )}
    />
  )
}
