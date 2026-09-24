// Fonts: self-hosted via @fontsource. To swap a family, change these imports and the
// --font-* tokens in src/styles/tokens.css.
import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource/jetbrains-mono/500.css'
import 'lenis/dist/lenis.css'
import '@/styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { AppProviders } from '@/app/providers/AppProviders'

// index.html carries static meta for crawlers that don't run JS. React 19 renders per-page
// tags from here on, so remove the static ones to avoid duplicates.
document.head.querySelectorAll('[data-static-meta]').forEach((el) => el.remove())

// Always start new pages at the top. PageTransition handles resets on navigation.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
