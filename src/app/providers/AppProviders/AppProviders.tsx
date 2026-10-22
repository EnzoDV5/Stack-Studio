import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { FeedbackProvider } from '../FeedbackProvider'
import { IntroProvider } from '../IntroProvider'
import { LenisProvider } from '../LenisProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <LenisProvider>
        <IntroProvider>
          <FeedbackProvider>{children}</FeedbackProvider>
        </IntroProvider>
      </LenisProvider>
    </BrowserRouter>
  )
}
