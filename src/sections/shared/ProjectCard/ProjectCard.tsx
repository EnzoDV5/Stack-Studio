import { useState } from 'react'
import { Link } from 'react-router'
import { MediaReveal } from '@/components/media/MediaReveal'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { ProjectMedia } from '@/sections/shared/ProjectMedia'
import type { Project } from '@/types'

export interface ProjectCardProps {
  project: Project
  ctaLabel: string
  cursorLabel: string
  sampleLabel: string
  /** 'feature' = large editorial card (home), 'grid' = work grid tile. */
  variant?: 'feature' | 'grid'
  /** Reveal the media with a mask on scroll. */
  reveal?: boolean
  headingLevel?: 'h2' | 'h3'
  /** Above-the-fold card (LCP): load the image eagerly. */
  priority?: boolean
  className?: string
}

/**
 * Project card: large media with a hover video preview on desktop (plays only while
 * hovered), title, year, summary and service tags. The whole card links to the case study.
 */
export function ProjectCard({
  project,
  ctaLabel,
  cursorLabel,
  sampleLabel,
  variant = 'grid',
  reveal = true,
  headingLevel: H = 'h3',
  priority = false,
  className,
}: ProjectCardProps) {
  const [hovering, setHovering] = useState(false)

  const media = (
    <ProjectMedia
      project={project}
      playing={hovering}
      priority={priority}
      sizes={
        variant === 'feature' ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 768px) 50vw, 100vw'
      }
      imageClassName="group-hover:scale-[1.04]"
    />
  )

  return (
    <article className={className}>
      <Link
        to={`/work/${project.slug}`}
        className="group block"
        data-cursor-label={cursorLabel}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
      >
        <div
          className={cn(
            'overflow-hidden rounded-lg',
            variant === 'feature' ? 'aspect-4/3 lg:aspect-16/11' : 'aspect-4/3',
          )}
        >
          {reveal ? <MediaReveal className="size-full">{media}</MediaReveal> : media}
        </div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <H className={cn(variant === 'feature' ? 'text-heading-xl' : 'text-heading-lg')}>
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-size-[0%_1px] bg-bottom-left bg-no-repeat transition-[background-size] duration-(--duration-fast) ease-out-expo group-hover:bg-size-[100%_1px]">
                {project.name}
              </span>
            </H>
            <p className="mt-2 max-w-[48ch] text-muted">{project.summary}</p>
          </div>
          <span className="shrink-0 pt-2 eyebrow numeric text-muted">{project.year}</span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.isSample && <Tag variant="accent">{sampleLabel}</Tag>}
          {project.services.slice(0, 3).map((service) => (
            <Tag key={service}>{service}</Tag>
          ))}
          <span className="visually-hidden">{ctaLabel}</span>
        </div>
      </Link>
    </article>
  )
}
