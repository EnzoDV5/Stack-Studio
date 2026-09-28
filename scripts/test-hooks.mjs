/**
 * Module resolve hook for `npm test` (node:test, no extra dependencies). Node runs the
 * TypeScript sources directly (type stripping), but it doesn't know the `@/` alias or
 * extensionless imports that Vite resolves. This maps them the same way Vite does.
 */
import { existsSync, statSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const src = fileURLToPath(new URL('../src/', import.meta.url))
const candidates = ['', '.ts', '.tsx', '/index.ts']

function resolveFile(base) {
  for (const suffix of candidates) {
    const file = base + suffix
    if (existsSync(file) && statSync(file).isFile()) return file
  }
  return null
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const file = resolveFile(src + specifier.slice(2))
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true }
  }
  if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
    const base = fileURLToPath(new URL(specifier, context.parentURL))
    const file = resolveFile(base)
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}
