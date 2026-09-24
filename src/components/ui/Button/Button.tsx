import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { trackEvent, type AnalyticsEvent, type AnalyticsProps } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  withArrow?: boolean
  fullWidth?: boolean
  className?: string
  children: ReactNode
  /** Fired on click, e.g. { event: 'Start project click', props: { location: 'hero' } }. */
  analytics?: { event: AnalyticsEvent; props?: AnalyticsProps }
}

type AsLink = BaseProps & Omit<LinkProps, 'className' | 'children'> & { href?: never }
type AsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string
    to?: never
  }
type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: never
    href?: never
  }

export type ButtonProps = AsLink | AsAnchor | AsButton

function Arrow() {
  const path = <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" />
  return (
    <span className={styles.arrow} aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
        {path}
      </svg>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
        {path}
      </svg>
    </span>
  )
}

/**
 * The one button. Renders a router <Link> (to), an <a> (href) or a <button>.
 * Variants adapt to the surrounding section tone via CSS variables.
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    withArrow = false,
    fullWidth = false,
    className,
    children,
    analytics,
    ...rest
  } = props

  const classes = cn(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.full,
    className,
  )

  const inner = (
    <>
      <span className={styles.fill} aria-hidden="true" />
      <span className={styles.label} data-magnetic-label="">
        {children}
      </span>
      {withArrow && <Arrow />}
    </>
  )

  const track = () => {
    if (analytics) trackEvent(analytics.event, analytics.props)
  }

  if (rest.to !== undefined) {
    const { onClick, ...linkProps } = rest as Omit<AsLink, keyof BaseProps>
    return (
      <Link
        {...linkProps}
        className={classes}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          track()
          onClick?.(event)
        }}
      >
        {inner}
      </Link>
    )
  }

  if (rest.href !== undefined) {
    const { onClick, ...anchorProps } = rest as Omit<AsAnchor, keyof BaseProps>
    return (
      <a
        {...anchorProps}
        href={anchorProps.href}
        className={classes}
        onClick={(event) => {
          track()
          onClick?.(event)
        }}
      >
        {inner}
      </a>
    )
  }

  const { onClick, type = 'button', ...buttonProps } = rest as Omit<AsButton, keyof BaseProps>
  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      onClick={(event) => {
        track()
        onClick?.(event)
      }}
    >
      {inner}
    </button>
  )
}
