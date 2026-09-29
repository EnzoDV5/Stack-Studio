import { cn } from '@/lib/cn'
import type { ClientLogo } from '@/types'

export interface LogoPlateProps {
  logo: ClientLogo
  className?: string
}

/**
 * A client's logo on the surface its artwork is drawn for (white type on ink, dark or
 * full-colour artwork on white), so every logo reads whatever the section tone. The logo is
 * contained within a fixed plate, whatever its proportions.
 */
export function LogoPlate({ logo, className }: LogoPlateProps) {
  const { image, surface } = logo
  return (
    <div
      className={cn(
        'flex h-28 w-52 items-center justify-center rounded-lg p-4 md:h-36 md:w-64 md:p-5',
        surface === 'dark' ? 'border border-white/10 bg-ink-700' : 'bg-white',
        className,
      )}
    >
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        decoding="async"
        className="max-h-full w-auto max-w-full object-contain"
      />
    </div>
  )
}
