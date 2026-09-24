import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface ContainerProps {
  as?: ElementType
  /** 'site' = full max width (1600px), 'narrow' = long-form reading width. */
  size?: 'site' | 'narrow'
  className?: string
  children: ReactNode
}

export function Container({ as: Tag = 'div', size = 'site', className, children }: ContainerProps) {
  return (
    <Tag className={cn('container-site', size === 'narrow' && 'max-w-[56rem]', className)}>
      {children}
    </Tag>
  )
}
