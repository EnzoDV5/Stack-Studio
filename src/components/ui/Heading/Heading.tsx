import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type HeadingSize =
  'display-2xl' | 'display-xl' | 'display-lg' | 'heading-xl' | 'heading-lg' | 'heading-md'

export interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  size?: HeadingSize
  id?: string
  className?: string
  children: ReactNode
}

const sizeClass: Record<HeadingSize, string> = {
  'display-2xl': 'text-display-2xl',
  'display-xl': 'text-display-xl',
  'display-lg': 'text-display-lg',
  'heading-xl': 'text-heading-xl',
  'heading-lg': 'text-heading-lg',
  'heading-md': 'text-heading-md',
}

/**
 * Semantic level (as) and visual size are independent, so the outline stays correct
 * whatever the design needs. Heavy, tightly tracked and balanced.
 */
export function Heading({
  as: Tag = 'h2',
  size = 'display-lg',
  id,
  className,
  children,
}: HeadingProps) {
  return (
    <Tag id={id} className={cn(sizeClass[size], 'font-display', className)}>
      {children}
    </Tag>
  )
}
