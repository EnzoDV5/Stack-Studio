import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'
import { highlightLine, type CodeTokenKind } from '@/lib/code-highlight'
import { gsap, useGSAP } from '@/lib/gsap'
import { codeEditor as motion, duration, ease } from '@/lib/motion-tokens'
import type { CodeEditorContent } from '@/types'
import styles from './CodeEditor.module.css'

export interface CodeEditorProps {
  content: CodeEditorContent
  className?: string
}

const tokenClass: Record<CodeTokenKind, string> = {
  comment: 'text-grey-500',
  string: 'text-orange-soft',
  number: 'text-orange-soft',
  keyword: 'text-orange',
  function: 'text-white',
  property: 'text-grey-300',
  punctuation: 'text-grey-500',
  plain: 'text-paper',
}

const icon = (paths: ReactNode, className = 'size-[1.125rem]') => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {paths}
  </svg>
)

const activityIcons = [
  icon(
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </>,
  ),
  icon(
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </>,
  ),
  icon(
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="7" r="2" />
      <path d="M6 7v10M18 9c0 5-12 3-12 8" />
    </>,
  ),
  icon(<path d="M8 5v14l11-7z" />),
  icon(
    <>
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="6" height="6" rx="1" transform="rotate(12 17 6)" />
    </>,
  ),
]

const chevron = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

interface EditorLine {
  text: string
  /** Index into the authors, in order of first turn. */
  author: number
  /** Leading spaces, which appear at once rather than being typed. */
  indent: number
}

function editorLines(content: CodeEditorContent) {
  const authors: string[] = []
  const lines: EditorLine[] = content.runs.flatMap((run) => {
    if (!authors.includes(run.author)) authors.push(run.author)
    const author = authors.indexOf(run.author)
    return run.lines.map((text) => ({
      text,
      author,
      indent: text.length - text.trimStart().length,
    }))
  })
  return { authors, lines }
}

/**
 * A VS Code-style editor where the founders write one build together. Once it's well on
 * screen the window opens and boots (its parts settle in), then the code types itself out
 * line by line (seconds, not scroll), the caret's name tag showing whose turn it is, then
 * the build command runs and its results appear. The typing
 * only drives CSS variables (--typed per line clips it, --row and --col place the caret in
 * ch and line-height units), so it holds at any width. It's one image to screen readers.
 * With reduced motion (or no JS) it shows the finished file.
 */
export function CodeEditor({ content, className }: CodeEditorProps) {
  const rootRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { authors, lines } = editorLines(content)
  const lastRow = lines.length - 1
  const last = lines[lastRow]
  const lastAuthor = last?.author ?? 0
  const lastColumn = last?.text.length ?? 0
  const { terminal, status } = content
  const promptLength = terminal.prompt.length + 1
  const active = content.tabs[0]

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || reducedMotion) return
      const rows = gsap.utils.toArray<HTMLElement>('[data-code-line]', root)
      const command = root.querySelector<HTMLElement>('[data-command]')
      const output = gsap.utils.toArray<HTMLElement>('[data-output]', root)
      const position = root.querySelector<HTMLElement>('[data-position]')
      const showPosition = (row: number) => {
        const column = Number.parseFloat(String(gsap.getProperty(root, '--col'))) || 0
        if (position) position.textContent = status.position(row + 1, Math.round(column) + 1)
      }
      const setAuthor = (author: number) => {
        root.dataset.author = String(author)
      }

      gsap.set(root, { '--row': 0, '--col': lines[0]?.indent ?? 0 })
      setAuthor(lines[0]?.author ?? 0)
      showPosition(0)

      const setTyping = (typing: boolean) => {
        root.dataset.typing = String(typing)
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: motion.start, once: true },
      })
      const parts = (name: string) => gsap.utils.toArray<HTMLElement>(`[data-boot="${name}"]`, root)
      const settle = { duration: motion.boot, ease: ease.out }
      const group = { ...settle, stagger: motion.bootStagger }

      // The window opens from a line across its middle as it rises into place.
      tl.fromTo(
        root,
        {
          clipPath: `inset(50% 0% 50% 0% round ${motion.radius}px)`,
          y: motion.rise,
          scale: motion.scale,
        },
        {
          clipPath: `inset(0% 0% 0% 0% round ${motion.radius}px)`,
          y: 0,
          scale: 1,
          duration: motion.open,
          ease: ease.out,
          // The clip would cut off the drop shadow once open.
          clearProps: 'clipPath',
        },
      )
      // Then it boots: its parts settle in, a beat apart.
      tl.addLabel('boot', `-=${motion.bootOverlap}`)
      tl.fromTo(
        parts('avatar'),
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, ...group, ease: ease.outQuart },
        'boot',
      )
      tl.fromTo(parts('icon'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, ...group }, 'boot')
      tl.fromTo(parts('file'), { opacity: 0, x: -14 }, { opacity: 1, x: 0, ...group }, 'boot+=0.1')
      tl.fromTo(
        parts('tab'),
        { opacity: 0, yPercent: -100 },
        { opacity: 1, yPercent: 0, ...group, stagger: motion.bootStagger * 2 },
        'boot+=0.1',
      )
      tl.fromTo(parts('panel'), { opacity: 0 }, { opacity: 1, ...settle }, 'boot+=0.2')
      tl.fromTo(
        parts('gutter'),
        { opacity: 0 },
        { opacity: 1, ...group, stagger: motion.bootStagger / 2 },
        'boot+=0.2',
      )
      tl.fromTo(
        parts('status'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ...settle },
        'boot+=0.15',
      )
      tl.fromTo(
        parts('caret'),
        { opacity: 0 },
        { opacity: 1, duration: duration.micro, ease: ease.out },
      )
      tl.call(setTyping, [true], `+=${motion.typeDelay}`)

      let author = lines[0]?.author ?? 0
      lines.forEach((line, row) => {
        const el = rows[row]
        if (!el) return
        if (line.author !== author) {
          author = line.author
          tl.call(setAuthor, [author], `+=${motion.handoff}`)
        }
        tl.set(root, { '--row': row, '--col': line.indent }, `+=${motion.linePause}`)
        tl.call(showPosition, [row])
        const count = line.text.length - line.indent
        if (count === 0) return
        const typing = {
          duration: count * motion.perCharacter,
          ease: `steps(${count})`,
        }
        tl.fromTo(el, { '--typed': line.indent }, { '--typed': line.text.length, ...typing })
        tl.fromTo(
          root,
          { '--col': line.indent },
          {
            '--col': line.text.length,
            ...typing,
            immediateRender: false,
            onUpdate: () => showPosition(row),
          },
          '<',
        )
      })
      // The code is done: the caret blinks again and its name tag fades while the build runs.
      tl.call(setTyping, [false])

      if (command) {
        const count = terminal.command.length
        tl.fromTo(
          command,
          { '--typed': promptLength },
          {
            '--typed': promptLength + count,
            duration: count * motion.perCharacter,
            ease: `steps(${count})`,
          },
          `+=${motion.commandDelay}`,
        )
      }
      tl.fromTo(
        output,
        { opacity: 0 },
        { opacity: 1, duration: duration.fast, ease: ease.out, stagger: motion.outputStagger },
        `+=${motion.outputDelay}`,
      )

      return () => {
        delete root.dataset.typing
        root.dataset.author = String(lastAuthor)
        if (position) position.textContent = status.position(lastRow + 1, lastColumn + 1)
      }
    },
    { scope: rootRef, dependencies: [reducedMotion, content], revertOnUpdate: true },
  )

  return (
    <figure
      ref={rootRef}
      role="img"
      aria-label={content.label}
      data-author={lastAuthor}
      style={{ '--row': lastRow, '--col': lastColumn } as CSSProperties}
      className={cn(
        styles.editor,
        '@container overflow-hidden rounded-lg border border-tone bg-ink-800 font-mono text-grey-400',
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-tone bg-ink px-3.5 py-2 text-[0.6875rem]">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-pill bg-grey-700" />
          <span className="size-2.5 rounded-pill bg-grey-700" />
          <span className="size-2.5 rounded-pill bg-grey-700" />
        </span>
        <span data-boot="panel" className="min-w-0 flex-1 truncate text-center">
          {active} — {content.project}
        </span>
        <span className="flex">
          {authors.map((name) => (
            <span key={name} data-boot="avatar" className={styles.avatar}>
              {name.charAt(0)}
            </span>
          ))}
        </span>
      </div>

      <div className="flex">
        {/* Activity bar */}
        <div className="hidden w-11 shrink-0 flex-col items-center gap-4 border-r border-tone bg-ink py-3.5 @md:flex">
          {activityIcons.map((svg, i) => (
            <span
              key={i}
              data-boot="icon"
              className={cn(
                'relative grid w-full place-items-center',
                i === 0 ? 'text-paper' : 'text-grey-600',
              )}
            >
              {i === 0 && <span className="absolute inset-y-0 left-0 w-0.5 bg-orange" />}
              {svg}
            </span>
          ))}
        </div>

        {/* Explorer */}
        <div className="hidden w-40 shrink-0 border-r border-tone py-3 text-[0.6875rem] @min-[38rem]:block">
          <p
            data-boot="file"
            className="px-4 pb-2.5 text-[0.625rem] tracking-[0.14em] text-grey-500 uppercase"
          >
            {content.explorerTitle}
          </p>
          <p
            data-boot="file"
            className="flex items-center gap-1 px-3 py-1 font-semibold text-paper uppercase"
          >
            {chevron}
            {content.project}
          </p>
          <ul>
            {content.explorer.map((item) => (
              <li
                key={item.name}
                data-boot="file"
                style={{ paddingLeft: `${1.25 + item.depth * 0.875}rem` }}
                className={cn(
                  'flex items-center gap-1.5 py-1 pr-3',
                  item.name === active && 'bg-ink-600 text-paper',
                )}
              >
                {item.folder ? (
                  chevron
                ) : (
                  <span className="w-3 text-[0.5rem] font-bold text-orange">TS</span>
                )}
                <span className="truncate">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Editor */}
        <div className="min-w-0 flex-1">
          <div className="flex border-b border-tone bg-ink text-[0.6875rem]">
            {content.tabs.map((tab) => (
              <span
                key={tab}
                data-boot="tab"
                className={cn(
                  'flex items-center gap-1.5 border-r border-tone px-3.5 py-2',
                  tab === active
                    ? 'bg-ink-800 text-paper shadow-[inset_0_2px_0_var(--color-orange)]'
                    : 'hidden @sm:flex',
                )}
              >
                <span className="text-[0.5rem] font-bold text-orange">TS</span>
                {tab}
              </span>
            ))}
          </div>
          <p data-boot="panel" className="truncate px-4 pt-2 text-[0.625rem] text-grey-500">
            {content.breadcrumb.join('  ›  ')}
          </p>

          <div
            className={cn(
              styles.codeArea,
              'text-[0.625rem] @sm:text-[0.6875rem] @md:text-[0.75rem]',
            )}
          >
            <span className={styles.currentLine} />
            <ol className="shrink-0 pr-3 pl-3 text-right text-grey-600 @md:pr-4 @md:pl-4">
              {lines.map((_, row) => (
                <li key={row} data-boot="gutter" className={styles.row}>
                  {row + 1}
                </li>
              ))}
            </ol>
            <div className="relative min-w-0 flex-1 overflow-x-clip pr-3">
              {lines.map((line, row) => (
                <div key={row} data-code-line className={cn(styles.row, styles.typed)}>
                  {highlightLine(line.text).map((token, i) => (
                    <span key={i} className={tokenClass[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                </div>
              ))}
              <span data-boot="caret" className={styles.caret}>
                <span className={styles.tag}>
                  {authors.map((name, i) => (
                    <span key={name} data-name={i}>
                      {name}
                    </span>
                  ))}
                </span>
              </span>
            </div>
          </div>

          {/* Terminal */}
          <div className="border-t border-tone bg-ink px-4 pt-1.5 pb-2.5 text-[0.625rem] @sm:text-[0.6875rem]">
            <div
              data-boot="panel"
              className="mb-2 flex gap-4 text-[0.625rem] tracking-[0.12em] uppercase"
            >
              {terminal.tabs.map((tab, i) => (
                <span
                  key={tab}
                  className={cn(
                    'py-1',
                    i === 0 ? 'border-b border-orange text-paper' : 'text-grey-600',
                  )}
                >
                  {tab}
                </span>
              ))}
            </div>
            <p data-command className={cn(styles.typed, 'leading-[1.7] whitespace-pre')}>
              <span className="text-orange">{terminal.prompt}</span>{' '}
              <span className="text-paper">{terminal.command}</span>
            </p>
            {terminal.output.map((line) => (
              <p key={line} data-output className="leading-[1.7] whitespace-pre text-grey-300">
                <span className="text-orange">✓</span> {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div
        data-boot="status"
        className="flex items-center gap-4 bg-orange px-3 py-1 text-[0.625rem] text-ink"
      >
        <span className="flex items-center gap-1 font-semibold">
          {icon(
            <>
              <circle cx="6" cy="5" r="2" />
              <circle cx="6" cy="19" r="2" />
              <circle cx="18" cy="7" r="2" />
              <path d="M6 7v10M18 9c0 5-12 3-12 8" />
            </>,
            'size-3',
          )}
          {status.branch}
        </span>
        <span className="hidden truncate @sm:inline">{status.live}</span>
        <span className="ml-auto whitespace-nowrap" data-position>
          {status.position(lastRow + 1, lastColumn + 1)}
        </span>
        {status.items.map((item) => (
          <span key={item} className="hidden @md:inline">
            {item}
          </span>
        ))}
      </div>
    </figure>
  )
}
