/**
 * A tiny TypeScript-flavoured highlighter for the decorative code editor (Studio). It only has
 * to colour the short snippets in src/data, so it reads one line at a time: comments, strings,
 * numbers, keywords, calls, object keys and member names, punctuation, and the rest.
 */

export type CodeTokenKind =
  'comment' | 'string' | 'number' | 'keyword' | 'function' | 'property' | 'punctuation' | 'plain'

export interface CodeToken {
  kind: CodeTokenKind
  text: string
}

const KEYWORDS = new Set([
  'as',
  'async',
  'await',
  'const',
  'else',
  'export',
  'false',
  'from',
  'function',
  'if',
  'import',
  'let',
  'new',
  'return',
  'true',
])

// Comment | string (may be unclosed) | number | identifier | whitespace | any other character.
const PATTERN = /(\/\/.*)|('[^']*'?|"[^"]*"?)|(\d[\d_.]*)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g

/** The first non-space character from `index` on, or '' at the end of the line. */
function nextChar(line: string, index: number): string {
  return /\S/.exec(line.slice(index))?.[0] ?? ''
}

function identifierKind(line: string, word: string, start: number): CodeTokenKind {
  if (KEYWORDS.has(word)) return 'keyword'
  const after = nextChar(line, start + word.length)
  if (after === '(') return 'function'
  if (after === ':' || line[start - 1] === '.') return 'property'
  return 'plain'
}

/** Splits one line of code into coloured runs. Neighbouring runs of the same kind merge. */
export function highlightLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = []
  const push = (kind: CodeTokenKind, text: string) => {
    const last = tokens[tokens.length - 1]
    if (last && last.kind === kind) last.text += text
    else tokens.push({ kind, text })
  }
  for (const match of line.matchAll(PATTERN)) {
    const [text, comment, string, number, word] = match
    if (comment) push('comment', text)
    else if (string) push('string', text)
    else if (number) push('number', text)
    else if (word) push(identifierKind(line, word, match.index), text)
    else if (/^\s+$/.test(text)) push('plain', text)
    else push('punctuation', text)
  }
  return tokens
}
