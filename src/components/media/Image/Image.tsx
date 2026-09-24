import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { ImageAsset } from '@/types'
import styles from './Image.module.css'

export interface ImageProps {
  image: ImageAsset
  /** Above-the-fold / LCP image: eager, high fetch priority, no fade. */
  priority?: boolean
  /** Responsive sizes hint. Defaults to full width. */
  sizes?: string
  /** 'cover' fills its box (parent sets the aspect ratio), 'intrinsic' keeps its own ratio. */
  fit?: 'cover' | 'intrinsic'
  className?: string
}

/**
 * <img> with explicit width/height (no layout shift), lazy loading and async decoding by
 * default, and alt text from data. Use `priority` only for hero media.
 */
export function Image({
  image,
  priority = false,
  sizes = '100vw',
  fit = 'cover',
  className,
}: ImageProps) {
  const [loaded, setLoaded] = useState(priority)

  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? (image.sizes ?? sizes) : undefined}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={cn(
        styles.image,
        !loaded && styles.pending,
        fit === 'cover' ? 'size-full object-cover' : 'h-auto w-full',
        className,
      )}
    />
  )
}
