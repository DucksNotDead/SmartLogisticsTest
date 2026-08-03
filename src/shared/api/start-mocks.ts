/**
 * Start MSW browser worker. Dynamic import keeps `msw/browser`
 * out of the Node/test bundle path. Used in both DEV and production
 * (assignment has no real API; demos rely on mocks).
 */
export async function startApiMocks(): Promise<void> {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}
