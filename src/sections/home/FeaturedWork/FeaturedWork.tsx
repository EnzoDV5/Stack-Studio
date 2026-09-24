import { useId } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { ProjectCard } from '@/sections/shared/ProjectCard'
import { SectionHeader } from '@/sections/shared/SectionHeader'
import type { CtaLink, Project } from '@/types'

export interface FeaturedWorkProps {
  index?: number
  eyebrow: string
  title: string
  intro: string
  cta: CtaLink
  projects: Project[]
  cardCta: string
  cursorLabel: string
  sampleLabel: string
  tone?: Tone
}

/** Editorial offset layout: two big case studies, masks opening on scroll, previews on hover. */
export function FeaturedWork({
  index,
  eyebrow,
  title,
  intro,
  cta,
  projects,
  cardCta,
  cursorLabel,
  sampleLabel,
  tone = 'paper',
}: FeaturedWorkProps) {
  const headingId = useId()
  return (
    <Section tone={tone} aria-labelledby={headingId}>
      <div className="container-site">
        <SectionHeader
          id={headingId}
          index={index}
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          aside={
            <Button to={cta.to} variant="secondary" size="sm" withArrow>
              {cta.label}
            </Button>
          }
        />

        <div className="mt-16 grid gap-20 lg:mt-24 lg:grid-cols-12 lg:gap-x-10">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              variant="feature"
              ctaLabel={cardCta}
              cursorLabel={cursorLabel}
              sampleLabel={sampleLabel}
              className={cn(
                i % 2 === 0 ? 'lg:col-span-7' : 'lg:col-span-5 lg:col-start-8 lg:mt-56',
              )}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
