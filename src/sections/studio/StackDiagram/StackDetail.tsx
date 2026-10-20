import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { buildsUsing } from '@/lib/stack'
import type { StackBuild, Technology } from '@/types/technology'
import styles from './StackDiagram.module.css'

export interface StackDetailLabels {
  buildsLabel: string
  closeLabel: string
  countLabel: (shown: number, total: number) => string
}

export interface StackDetailProps {
  /** The tool being hovered, focused or tapped; without one the panel sums up the build. */
  technology?: Technology
  /** True when the tool was tapped (on small screens the panel then offers a close button). */
  pinned: boolean
  build: StackBuild
  builds: readonly StackBuild[]
  /** How many tools the build uses, out of `total`. */
  used: number
  total: number
  labels: StackDetailLabels
  onSelectBuild: (id: string) => void
  onClose: () => void
  className?: string
}

/**
 * The stack diagram's side panel (a bar pinned to the bottom of the screen on small screens,
 * shown once a tool is tapped). It sums up the chosen build, or describes the tool in focus:
 * what it's for and the builds that use it (each one switches the diagram to that build).
 */
export function StackDetail({
  technology,
  pinned,
  build,
  builds,
  used,
  total,
  labels,
  onSelectBuild,
  onClose,
  className,
}: StackDetailProps) {
  const usedBy = technology ? buildsUsing(builds, technology.id) : []

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
            {usedBy.length > 0 && (
              <div className="mt-6 max-lg:hidden">
                <p className="eyebrow text-muted">{labels.buildsLabel}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {usedBy.map((b) => (
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
                </div>
              </div>
            )}
          </div>
        ) : (
          <div key={build.id} className={styles.panelIn}>
            <p className="eyebrow text-accent">{build.label}</p>
            <p className="mt-4 text-heading-lg">{build.summary}</p>
            <p className="mt-4 numeric text-small text-muted">{labels.countLabel(used, total)}</p>
          </div>
        )}
      </div>
    </aside>
  )
}
