import { delay } from 'msw'

/** Browser: keep mocks pending so skeleton/loading is visible. Vitest: 0. */
export const MOCK_DELAY_MS = 1000

export async function delayMockResponse(): Promise<void> {
  if (import.meta.env.MODE === 'test' || MOCK_DELAY_MS <= 0) return
  await delay(MOCK_DELAY_MS)
}
