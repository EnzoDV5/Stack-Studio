import { cn } from '@/lib/cn'

export interface LogoProps {
  /** 'full' = mark + wordmark, 'wordmark' = STACK STUDIO on one line, 'mark' = A-chevron. */
  variant?: 'full' | 'wordmark' | 'mark'
  className?: string
  /** Accessible name. Pass '' when the logo sits inside a link that already has a label. */
  title?: string
}

/** The supplied Stack Studio mark and wordmark, shared across the site. */
export function Logo({ variant = 'full', className, title = 'Stack Studio' }: LogoProps) {
  const labelled = title !== ''
  return (
    <span
      className={cn('inline-flex items-center gap-[0.25em] leading-none', className)}
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {variant !== 'wordmark' && (
        <img
          src={`${import.meta.env.BASE_URL}StackLogo2.png`}
          alt=""
          width="1254"
          height="1254"
          className={cn('block w-auto shrink-0', variant === 'full' ? 'h-[1.65em]' : 'h-[1.35em]')}
        />
      )}
      {variant !== 'mark' && (
        <span
          className={cn(
            'flex',
            variant === 'wordmark' ? 'items-center gap-[0.3em]' : 'flex-col items-start',
          )}
          aria-hidden="true"
        >
          <img
            src={`${import.meta.env.BASE_URL}StackLogo1.png`}
            alt=""
            width="2172"
            height="724"
            className="block h-[1.75em] w-auto"
          />
          <span
            className={cn(
              'font-mono uppercase opacity-80',
              variant === 'wordmark'
                ? 'text-[0.5em] tracking-[0.2em]'
                : '-mt-[0.45em] ml-[0.12em] text-[0.42em] tracking-[0.32em]',
            )}
          >
            Studio
          </span>
        </span>
      )}
    </span>
  )
}
