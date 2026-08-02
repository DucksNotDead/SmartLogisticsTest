import { expect, test } from 'vitest'

import { getAuction, listAuctions } from '@/entities/auction'
import { ApiError, isProblemDetail } from '@/shared/api'

/** Matches seed in `shared/api/mocks/store`. */
const SEED_AUCTION_UUID = '550e8400-e29b-41d4-a716-446655440000'

test('listAuctions 200 returns data/meta from seed', async () => {
  const response = await listAuctions({ page: 1, per_page: 20 })

  expect(response.data).toHaveLength(1)
  expect(response.data?.[0]?.main?.order_uid).toBe(SEED_AUCTION_UUID)
  expect(response.meta).toMatchObject({
    current_page: 1,
    per_page: 20,
    total: 1,
  })
})

test('getAuction 200 returns detail', async () => {
  const detail = await getAuction(SEED_AUCTION_UUID)

  expect(detail.main.order_uid).toBe(SEED_AUCTION_UUID)
  expect(detail.trading.can_set_bet).toBe(true)
  expect(detail.trading.status_mobile).toBe('NotParticipating')
  expect(detail.trading.price?.current).toBe(100_000)
})

test('getAuction 404 for unknown uuid', async () => {
  const unknownUuid = '00000000-0000-4000-8000-000000000099'

  let caught: unknown
  try {
    await getAuction(unknownUuid)
  } catch (error) {
    caught = error
  }

  expect(caught).toBeInstanceOf(ApiError)
  const apiError = caught as ApiError
  expect(apiError.status).toBe(404)
  expect(isProblemDetail(apiError.body)).toBe(true)
  if (isProblemDetail(apiError.body)) {
    expect(apiError.body.code).toBe('resource_not_found')
  }
})
