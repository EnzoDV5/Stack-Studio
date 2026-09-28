import { Image } from '@/components/media/Image'
import { Video } from '@/components/media/Video'
import { useIsTouch } from '@/hooks/useIsTouch'
import { cn } from '@/lib/cn'
import type { Project } from '@/types'

export interface ProjectMediaProps {
  project: Project
  /** Play the preview loop (hover or focus on the parent link). Desktop pointers only. */
  playing: boolean
  sizes: string
  priority?: boolean
  className?: string
  /** Extra classes for the still image, e.g. a group-hover zoom. */
  imageClassName?: string
}

/**
 * A project's still, with its muted preview loop layered on top. The video only loads and
 * plays while `playing` is true (and it's in view), and never on touch devices, so only
 * hovered previews ever play.
 */
export function ProjectMedia({
  project,
  playing,
  sizes,
  priority = false,
  className,
  imageClassName,
}: ProjectMediaProps) {
  const isTouch = useIsTouch()
  const preview = isTouch ? undefined : project.preview

  return (
    <div className={cn('relative size-full overflow-hidden bg-ink-700', className)}>
      <Image
        image={project.thumbnail}
        priority={priority}
        sizes={sizes}
        className={imageClassName}
      />
      {preview && (
        <Video
          video={preview}
          mode="controlled"
          playing={playing}
          fallback="none"
          className="pointer-events-none absolute inset-0 bg-transparent!"
        />
      )}
    </div>
  )
}
