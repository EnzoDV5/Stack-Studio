import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { buildsUsing } from '@/lib/stack'
import type { StackBuild, Technology, TechnologyLayer } from '@/types/technology'
import styles from './StackDiagram.module.css'

export interface StackDetailLabels {
  layersLabel: string
  buildsLabel: string
  closeLabel: string
  countLabel: (shown: number, total: number) => string
  layerCount: (count: number) => string
}

export interface StackDetailProps {
  /** The tool being hovered, focused or tapped; without one the panel sums up the build. */
  technology?: Technology
  /** True when the tool was tapped (on small screens the panel then offers a close button). */
  pinned: boolean
  build: StackBuild
  builds: readonly StackBuild[]
  layers: readonly TechnologyLayer[]
  /** Tools used per layer for the build, in layer order. */
  meter: { id: string; label: string; used: number; total: number }[]
  total: number
  labels: StackDetailLabels
  onSelectBuild: (id: string) => void
  onClose: () => void
  className?: string
}

/**
 * The stack diagram's side panel (a bar pinned to the bottom of the screen on small screens,
 * shown once a tool is tapped). It sums up the chosen build with a layer meter, or describes the
 * tool in focus: what it's for, the layers it touches and the builds that use it (each one
 * switches the diagram to that build).
 */
export function StackDetail({
  technology,
  pinned,
  build,
  builds,
  layers,
  meter,
  total,
  labels,
  onSelectBuild,
  onClose,
  className,
}: StackDetailProps) {
  const used = meter.reduce((n, layer) => n + layer.used, 0)
  const liveLayers = meter.filter((layer) => layer.used > 0).length
  const most = Math.max(1, ...meter.map((layer) => layer.total))
  const layerLabel = (id: string) => layers.find((layer) => layer.id === id)?.label ?? id

  return (
    <aside className={cn(styles.panel, !technology && 'max-lg:hidden', className)}>
      <div aria-live="polite">
        {technology ? (
          <div key={technology.id} className={styles.panelIn}>
            <div className="flex items-start justify-between gap-4">
              <span className={styles.panelMark}>
                {technology.logo ? (
                  <span
                    aria-hidden="true"
                    className={styles.logo}
                    style={{ maskImage: `url("${technology.logo}")` } as CSSProperties}
                  />
                ) : (
                  <span aria-hidden="true" className={styles.monogram}>
                    {technology.name}
                  </span>
                )}
              </span>
              {pinned && (
                <button
                  type="button"
                  className={cn(styles.close, 'lg:hidden')}
                  aria-label={labels.closeLabel}
                  onClick={onClose}
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4">
                    <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              )}
            </div>
            <h3 className="mt-5 text-heading-lg">{technology.name}</h3>
            <p className="mt-2 text-muted">{technology.description}</p>
            <dl className="mt-6 grid gap-5 max-lg:hidden">
              <div>
                <dt className="eyebrow text-muted">{labels.layersLabel}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {technology.categories.map((category) => (
                    <span key={category} className={styles.chip}>
                      {layerLabel(category)}
                    </span>
                  ))}
                </dd>
              </div>
              {buildsUsing(builds, technology.id).length > 0 && (
                <div>
                  <dt className="eyebrow text-muted">{labels.buildsLabel}</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {buildsUsing(builds, technology.id).map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        className={cn(styles.chip, styles.chipButton)}
                        aria-pressed={b.id === build.id}
                        onClick={() => onSelectBuild(b.id)}
                      >
                        {b.label}
                      </button>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          <div key={build.id} className={styles.panelIn}>
            <p className="eyebrow text-accent">{build.label}</p>
            <p className="mt-4 text-heading-lg">{build.summary}</p>
            <p className="mt-4 numeric text-small text-muted">
              {labels.countLabel(used, total)} · {labels.layerCount(liveLayers)}
            </p>
            <ol className={styles.meter} aria-hidden="true">
              {meter.map((layer) => (
                <li key={layer.id} className={styles.meterColumn} title={layer.label}>
                  <span className={styles.meterTrack}>
                    <span
                      className={styles.meterBar}
                      style={{ '--fill': layer.used / most } as CSSProperties}
                    />
                  </span>
                  <span className={styles.meterLabel}>{layer.label.slice(0, 2)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </aside>
  )
}
