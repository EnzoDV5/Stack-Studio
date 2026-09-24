import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn'
import styles from './TextLink.module.css'

export interface TextLinkProps {
  /** Internal route. */
  to?: string
  /** External URL, mailto: or tel:. Opens in a new tab when it starts with http. */
  href?: string
  children: ReactNode
  /** 'underline' = underline shown and animates out on hover; 'quiet' = draws in on hover. */
  variant?: 'underline' | 'quiet'
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
  'aria-label'?: string
}

export function TextLink({
  to,
  href,
  children,
  variant = 'underline',
  className,
  onClick,
  'aria-label': ariaLabel,
}: TextLinkProps) {
  const classes = cn(styles.link, variant === 'quiet' && styles.quiet, className)

  if (to !== undefined) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  const external = href?.startsWith('http') ?? false
  return (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && (
        <svg
          className={styles.external}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M3.5 8.5 8.5 3.5M4 3.5h4.5V8" />
        </svg>
      )}
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
    </a>
  )
}
