import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Heading, type HeadingSize } from '@/components/ui/Heading'
import { cn } from '@/lib/cn'

/**
 * - `stacked`: eyebrow and big title on the left, intro and aside bottom-aligned on the right.
 * - `split`: title on the left, intro top-aligned in the right-hand column.
 * - `minimal`: a small eyebrow and a one-line title (no intro).
 * - `inline`: eyebrow, title and aside on one row above a hairline.
 *
 * Neighbouring sections never use the same variant (docs/motion-map.md).
 */
export type SectionHeaderVariant = 'stacked' | 'split' | 'minimal' | 'inline'

export interface SectionHeaderProps {
  eyebrow: string
  title: string
  intro?: string
  index?: number
  /** id for the heading, so the section can be aria-labelledby it. */
  id?: string
  titleAs?: 'h1' | 'h2' | 'h3'
  variant?: SectionHeaderVariant
  /** Visual size. Defaults to display-lg (stacked, split, inline) or heading-xl (minimal). */
  size?: HeadingSize
  /** Right-hand slot (e.g. a "View all" link). */
  aside?: ReactNode
  className?: string
}

/**
 * The section opener. Headings are static: the section's content carries its motion
 * (only the Home hero, the closing CTA and inner page titles line-reveal).
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  index,
  id,
  titleAs = 'h2',
  variant = 'stacked',
  size,
  aside,
  className,
}: SectionHeaderProps) {
  const heading = (maxWidth: string) => (
    <Heading
      as={titleAs}
      id={id}
      size={size ?? (variant === 'minimal' ? 'heading-xl' : 'display-lg')}
      className={maxWidth}
    >
      {title}
    </Heading>
  )

  switch (variant) {
    case 'split':
      return (
        <div className={cn('grid gap-6 lg:grid-cols-12 lg:items-start', className)}>
          <div className="lg:col-span-6">
            <Eyebrow label={eyebrow} index={index} className="mb-6" />
            {heading('max-w-[14ch]')}
          </div>
          {(intro || aside) && (
            <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8 lg:items-start lg:pt-10">
              {intro && <p className="max-w-[46ch] text-body-lg text-muted">{intro}</p>}
              {aside}
            </div>
          )}
        </div>
      )

    case 'minimal':
      return (
        <div
          className={cn(
            'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
            className,
          )}
        >
          <div>
            <Eyebrow label={eyebrow} index={index} className="mb-3" />
            {heading('max-w-[32ch]')}
          </div>
          {aside}
        </div>
      )

    case 'inline':
      return (
        <div
          className={cn(
            'flex flex-col gap-4 border-b border-tone pb-6 lg:flex-row lg:items-end lg:gap-10',
            className,
          )}
        >
          <Eyebrow label={eyebrow} index={index} className="shrink-0 lg:w-48 lg:pb-3" />
          <div className="min-w-0 flex-1">{heading('max-w-[20ch]')}</div>
          {aside && <div className="shrink-0 lg:pb-3">{aside}</div>}
        </div>
      )

    default:
      return (
        <div className={cn('grid gap-8 lg:grid-cols-12 lg:items-end', className)}>
          <div className="lg:col-span-8">
            <Eyebrow label={eyebrow} index={index} className="mb-6" />
            {heading('max-w-[18ch]')}
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
}
