import { cn } from '@/lib/cn'

export interface StackMarkProps {
  className?: string
}

const move = 'transition-transform duration-(--duration-fast) ease-out-expo'

/** One isometric layer, `y` from the top edge of its outer ends. */
function layer(y: number) {
  return `M40 ${y}l60 36 60-36v12l-60 36-60-36Z`
}

/**
 * Decorative stack illustration: a code-bracket diamond over three isometric layers that
 * fade with depth, drawn in currentColor. Inside a `group` parent the brackets lift and the
 * layers spread apart on hover or focus (not with reduced motion).
 */
export function StackMark({ className }: StackMarkProps) {
  return (
    <svg
      viewBox="34 26 132 152"
      fill="currentColor"
      overflow="visible"
      aria-hidden="true"
      focusable="false"
      className={cn('h-auto', className)}
    >
      <g
        className={cn(
          move,
          'motion-safe:group-focus-within:-translate-y-1 motion-safe:group-hover:-translate-y-1',
        )}
      >
        <path d="M88 37.2 40 66l48 28.8v-12L60 66l28-16.8Z" />
        <path d="M112 37.2 160 66l-48 28.8v-12L140 66l-28-16.8Z" />
      </g>
      <path
        d={layer(76)}
        className={cn(
          move,
          'motion-safe:group-focus-within:translate-y-0.5 motion-safe:group-hover:translate-y-0.5',
        )}
      />
      <path
        d={layer(98)}
        opacity="0.7"
        className={cn(
          move,
          'motion-safe:group-focus-within:translate-y-1.5 motion-safe:group-hover:translate-y-1.5',
        )}
      />
      <path
        d={layer(120)}
        opacity="0.42"
        className={cn(
          move,
          'motion-safe:group-focus-within:translate-y-2.5 motion-safe:group-hover:translate-y-2.5',
        )}
      />
    </svg>
  )
}
