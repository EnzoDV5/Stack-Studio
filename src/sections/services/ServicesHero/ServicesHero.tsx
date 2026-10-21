import type { MouseEvent } from 'react'
import { Section } from '@/components/layout/Section'
import { MaskedHeading } from '@/components/motion/MaskedHeading'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { scrollToElement } from '@/lib/lenis'
import type { SectionNavigatorItem } from '@/sections/shared/SectionNavigator'
import type { ImageAsset } from '@/types'
import styles from './ServicesHero.module.css'

export interface ServicesHeroItem extends SectionNavigatorItem {
  /** A decorative icon for the section (the label names it). */
  icon?: ImageAsset
}

/** A direct route to each Services section. */
export function ServicesHero({
  content,
  items,
}: {
  content: { eyebrow: string; title: string }
  items: ServicesHeroItem[]
}) {
  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    scrollToElement(target)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="bg-ink pt-(--spacing-header)">
      <Section as="header" tone="dark" solid spacing="none" className={styles.section}>
        <div className="container-site">
          <Eyebrow label={content.eyebrow} className={styles.eyebrow} />
          <MaskedHeading
            as="h1"
            trigger="intro"
            text={content.title}
            className="mb-6 max-w-[32ch] font-display text-heading-xl md:mb-10"
          />
          <nav aria-label="Jump to a Services section">
            <ol className={styles.grid}>
              {items.map((item) => (
                <li key={item.id} className={styles.cell}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => jump(event, item.id)}
                    className={styles.link}
                  >
                    {item.icon && (
                      <img
                        src={item.icon.src}
                        srcSet={item.icon.srcSet}
                        sizes="(min-width: 640px) 4.5rem, 2.75rem"
                        width={item.icon.width}
                        height={item.icon.height}
                        alt=""
                        decoding="async"
                        className={styles.icon}
                      />
                    )}
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.arrow} aria-hidden="true">
                      ↘
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </Section>
    </div>
  )
}
