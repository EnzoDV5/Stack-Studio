import { cn } from '@/lib/cn'

export interface LogoProps {
  /** 'full' = mark + wordmark, 'mark' = the A-chevron only. */
  variant?: 'full' | 'mark'
  className?: string
  /** Accessible name. Pass '' when the logo sits inside a link that already has a label. */
  title?: string
}

/**
 * PLACEHOLDER: a hand-drawn approximation of the Stack "A" chevron mark with a text
 * wordmark. Replace the <svg> paths with the real logo artwork (or import an SVG from
 * /src/assets) when the brand files are available.
 */
export function Logo({ variant = 'full', className, title = 'Stack Studio' }: LogoProps) {
  const labelled = title !== ''
  return (
    <span
      className={cn('inline-flex items-center gap-2.5 leading-none', className)}
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-[1.35em] w-auto shrink-0"
        shapeRendering="geometricPrecision"
        aria-hidden="true"
      >
        <path d="M50 2 99 98H78L50 42 22 98H1Z" fill="var(--color-orange)" />
        <path d="M50 64 62 98H38Z" fill="var(--color-orange)" />
      </svg>
      {variant === 'full' && (
        <span className="flex items-baseline gap-2" aria-hidden="true">
          <span className="font-display text-[1.15em] font-extrabold tracking-[0.14em] uppercase">
            Stack
          </span>{' '}
          <span className="font-mono text-[0.62em] tracking-[0.2em] uppercase opacity-70">
            Studio
          </span>
        </span>
      )}
    </span>
  )
}
