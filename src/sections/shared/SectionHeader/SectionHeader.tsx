import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading, type HeadingSize } from '@/components/ui/Heading'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { cn } from '@/lib/cn'

export interface SectionHeaderProps {
  eyebrow: string
  title: string
  intro?: string
  index?: number
  /** id for the heading, so the section can be aria-labelledby it. */
  id?: string
  titleAs?: 'h1' | 'h2' | 'h3'
  size?: HeadingSize
  /** Line-reveal the title on scroll. Only when it's the section's one motion idea. */
  reveal?: boolean
  /** Right-hand slot on wide screens (e.g. a "View all" link). */
  aside?: ReactNode
  className?: string
}

/** Eyebrow + headline + intro, the standard section opener. */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  index,
  id,
  titleAs = 'h2',
  size = 'display-lg',
  reveal = false,
  aside,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('grid gap-8 lg:grid-cols-12 lg:items-end', className)}>
      <div className="lg:col-span-8">
        <Eyebrow label={eyebrow} index={index} className="mb-6" />
        <Heading as={titleAs} id={id} size={size} className="max-w-[18ch]">
          {reveal ? (
            <SplitReveal as="span" className="block">
              {title}
            </SplitReveal>
          ) : (
            title
          )}
        </Heading>
      </div>
      {(intro || aside) && (
        <div className="flex flex-col gap-6 lg:col-span-4 lg:items-start">
          {intro && <p className="max-w-[42ch] text-body-lg text-muted">{intro}</p>}
          {aside}
        </div>
      )}
    </div>
  )
}
