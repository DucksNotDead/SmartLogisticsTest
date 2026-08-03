import type { ReactNode } from 'react'

import { Toaster } from '@/shared/ui/sonner'

import { Footer } from './Footer'
import { Header } from './Header'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background text-foreground">
      <div className="shell-animate-header shrink-0">
        <Header />
      </div>
      <main
        data-app-scroll
        className="shell-animate-body min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
      <div className="shell-animate-body shrink-0">
        <Footer />
      </div>
      <Toaster position="top-center" richColors closeButton />
    </div>
  )
}
