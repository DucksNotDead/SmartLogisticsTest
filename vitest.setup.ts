import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'

import { server } from '@/shared/api/mocks/server'
import { resetStore } from '@/shared/api/mocks/store'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

beforeEach(() => {
  resetStore()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
