import type { ReactNode } from 'react'
import { Section, type Tone } from '@/components/layout/Section'
import { StageBlock, type StageBlockProps } from '@/sections/services/StageBlock'

export type StageExplorerStage = Omit<StageBlockProps, 'labels'>

export interface StageExplorerProps {
  stages: StageExplorerStage[]
  labels: StageBlockProps['labels']
  /** Above the first group, e.g. the "What do you need?" index. */
  lead?: ReactNode
  tone?: Tone
  className?: string
}

/** A run of offering groups, one after another at full width (no sticky nav). */
export function StageExplorer({
  stages,
  labels,
  lead,
  tone = 'paper',
  className,
}: StageExplorerProps) {
  return (
    <Section tone={tone} className={className}>
      <div className="container-site">
        {lead && <div className="mb-12 md:mb-16">{lead}</div>}
        {stages.map((stage) => (
          <StageBlock key={stage.id} {...stage} labels={labels} />
        ))}
      </div>
    </Section>
  )
}
