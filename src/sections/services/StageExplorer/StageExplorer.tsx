import { Section, type Tone } from '@/components/layout/Section'
import { StageBlock, type StageBlockProps } from '@/sections/services/StageBlock'
import { StageNav } from '@/sections/services/StageNav'

export type StageExplorerStage = Omit<StageBlockProps, 'id' | 'labels'> & { id: string }

export interface StageExplorerProps {
  stages: StageExplorerStage[]
  navLabel: string
  labels: StageBlockProps['labels']
  tone?: Tone
}

const PREFIX = 'stage-'

/** The five stages: sticky progress on the left, one expandable block per stage on the right. */
export function StageExplorer({ stages, navLabel, labels, tone = 'paper' }: StageExplorerProps) {
  return (
    <Section tone={tone} className="pt-8">
      <div className="container-site grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
            <StageNav
              label={navLabel}
              idPrefix={PREFIX}
              items={stages.map((s) => ({ id: s.id, index: s.index, name: s.name }))}
            />
          </div>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          {stages.map((stage) => (
            <StageBlock key={stage.id} {...stage} id={`${PREFIX}${stage.id}`} labels={labels} />
          ))}
        </div>
      </div>
    </Section>
  )
}
