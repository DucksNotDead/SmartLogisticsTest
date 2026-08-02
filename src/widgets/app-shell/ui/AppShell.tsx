import type { ReactNode } from 'react'

import { Footer } from './Footer'
import { Header } from './Header'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-svh flex-col overflow-x-hidden bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
