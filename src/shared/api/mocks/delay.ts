import { delay } from 'msw'

/** Browser: keep list pending ~2s so skeleton is visible. Vitest: no delay. */
export const LIST_DELAY_MS = 1000

export async function delayListResponse(): Promise<void> {
  if (LIST_DELAY_MS <= 0) return
  await delay(LIST_DELAY_MS)
}
