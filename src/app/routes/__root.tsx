import { Outlet, createRootRoute } from '@tanstack/react-router'

import { AppShell } from '@/widgets/app-shell'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
