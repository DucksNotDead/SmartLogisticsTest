/**
 * Start MSW browser worker in dev. Dynamic import keeps `msw/browser`
 * out of the Node/test bundle path.
 */
export async function startApiMocks(): Promise<void> {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  })
}
