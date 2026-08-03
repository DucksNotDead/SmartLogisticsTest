import { expect, test } from 'vitest'

import { getAuction, listAuctions } from '@/entities/auction'
import { ApiError, isProblemDetail } from '@/shared/api'

/** Matches seed in `shared/api/mocks/store`. */
const SEED_AUCTION_UUID = '550e8400-e29b-41d4-a716-446655440000'
const SEED_TOTAL = 25

test('listAuctions 200 returns data/meta from seed', async () => {
  const response = await listAuctions({ page: 1, per_page: 20 })

  expect(response.data).toHaveLength(20)
  expect(response.data?.[0]?.main?.order_uid).toBe(SEED_AUCTION_UUID)
  expect(response.meta).toMatchObject({
    current_page: 1,
    per_page: 20,
    total: SEED_TOTAL,
    last_page: 2,
  })
})

test('listAuctions page 2 returns remaining items', async () => {
  const response = await listAuctions({ page: 2, per_page: 20 })

  expect(response.data).toHaveLength(SEED_TOTAL - 20)
  expect(response.meta).toMatchObject({
    current_page: 2,
    per_page: 20,
    total: SEED_TOTAL,
    last_page: 2,
  })
})

test('getAuction 200 returns detail', async () => {
  const detail = await getAuction(SEED_AUCTION_UUID)

  expect(detail.main.order_uid).toBe(SEED_AUCTION_UUID)
  expect(detail.trading.can_set_bet).toBe(true)
  expect(detail.trading.status_mobile).toBe('NotParticipating')
  expect(detail.trading.price?.current).toBe(100_000)
  expect(detail.contacts.length).toBeGreaterThanOrEqual(1)
  expect(detail.routes.length).toBeGreaterThanOrEqual(2)
})

test('getAuction seed includes visibility flag fixtures', async () => {
  const list = await listAuctions({ page: 1, per_page: 20 })
  const items = list.data ?? []

  const byUuid = async (index: number) => {
    const uuid = items[index]?.main?.order_uid
    expect(uuid).toBeTruthy()
    return getAuction(uuid!)
  }

  const hidePoints = await byUuid(1)
  expect(hidePoints.trading.hide_points_address_and_contacts).toBe(true)
  expect(items[1]?.trading?.hide_points_address_and_contacts).toBe(true)

  const noCargoPrice = await byUuid(2)
  expect(noCargoPrice.trading.no_view_cargo_price).toBe(true)

  const hideBets = await byUuid(3)
  expect(hideBets.trading.hide_bets_history).toBe(true)
  expect(hideBets.hide_bets_history).toBe(true)

  const cannotBet = await byUuid(4)
  expect(cannotBet.trading.can_set_bet).toBe(false)
  expect(items[4]?.trading?.can_set_bet).toBe(false)

  const hidePlaces = await byUuid(7)
  expect(hidePlaces.trading.hide_places).toBe(true)
})

test('getAuction 200 for non-first seed item', async () => {
  const list = await listAuctions({ page: 1, per_page: 20 })
  const uuid = list.data?.[5]?.main?.order_uid
  expect(uuid).toBeTruthy()

  const detail = await getAuction(uuid!)
  expect(detail.main.order_uid).toBe(uuid)
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
