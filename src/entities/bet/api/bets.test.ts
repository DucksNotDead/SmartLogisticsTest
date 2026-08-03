import { expect, test } from 'vitest'

import { listBets, setBet } from '@/entities/bet'
import { ApiError, customFetch, isValidationProblem } from '@/shared/api'

/** Matches seed in `shared/api/mocks/store`. */
const SEED_AUCTION_UUID = '550e8400-e29b-41d4-a716-446655440000'
const SEED_EMPTY_BETS_UUID = '550e8400-e29b-41d4-a716-446655440005'
const SEED_WINNER_BET_UUID = '550e8400-e29b-41d4-a716-446655440006'

test('listBets 200 returns bets[]', async () => {
  const response = await listBets(SEED_AUCTION_UUID)

  expect(response.bets.length).toBeGreaterThanOrEqual(1)
  expect(response.bets[0]?.price_with_vat).toBe(100_000)
})

test('seed bets: multi places, rejected+reason, empty, win; all filters', async () => {
  const multi = await listBets(SEED_AUCTION_UUID, { all: true })
  expect(multi.bets.length).toBeGreaterThanOrEqual(2)
  expect(multi.bets.filter((bet) => bet.place != null).length).toBeGreaterThanOrEqual(
    2,
  )
  const rejected = multi.bets.find((bet) => bet.is_rejected)
  expect(rejected?.cancel_reason).toBeTruthy()

  const activeOnly = await listBets(SEED_AUCTION_UUID)
  expect(activeOnly.bets.every((bet) => !bet.is_rejected)).toBe(true)
  expect(activeOnly.bets.length).toBeLessThan(multi.bets.length)

  expect((await listBets(SEED_EMPTY_BETS_UUID)).bets).toEqual([])

  const winBets = await listBets(SEED_WINNER_BET_UUID)
  expect(winBets.bets.some((bet) => bet.is_win)).toBe(true)
})

test('setBet 200 mutates price, status_mobile, bets and list item', async () => {
  const price = 99_000

  await expect(setBet(SEED_AUCTION_UUID, { price })).resolves.toBeUndefined()

  const detail = await customFetch<{
    trading: {
      price?: { current?: number | null } | null
      status_mobile?: string | null
      your?: {
        bet?: boolean
        last_bet_with_vat?: number | null
      } | null
    }
  }>(`/auctions/${SEED_AUCTION_UUID}`)

  expect(detail.trading.price?.current).toBe(price)
  expect(detail.trading.status_mobile).toBe('Leading')
  expect(detail.trading.your?.bet).toBe(true)
  expect(detail.trading.your?.last_bet_with_vat).toBe(price)

  const bets = await listBets(SEED_AUCTION_UUID)
  expect(bets.bets[0]?.price_with_vat).toBe(price)
  expect(bets.bets[0]?.place).toBe(1)

  const list = await customFetch<{
    data?: Array<{
      main?: { order_uid?: string | null } | null
      trading?: {
        price?: { current?: number | null } | null
        status_mobile?: string | null
        your?: { bet?: boolean } | null
      } | null
    }>
  }>('/auctions/list', {
    method: 'POST',
    body: JSON.stringify({ page: 1, per_page: 20 }),
  })

  const listItem = list.data?.find(
    (item) => item.main?.order_uid === SEED_AUCTION_UUID,
  )
  expect(listItem?.trading?.price?.current).toBe(price)
  expect(listItem?.trading?.status_mobile).toBe('Leading')
  expect(listItem?.trading?.your?.bet).toBe(true)
})

test('setBet 422 for invalid price', async () => {
  let caught: unknown
  try {
    await setBet(SEED_AUCTION_UUID, { price: 100_000 })
  } catch (error) {
    caught = error
  }

  expect(caught).toBeInstanceOf(ApiError)
  const apiError = caught as ApiError
  expect(apiError.status).toBe(422)
  expect(isValidationProblem(apiError.body)).toBe(true)
  if (isValidationProblem(apiError.body)) {
    expect(apiError.body.errors.length).toBeGreaterThanOrEqual(1)
    expect(apiError.body.errors[0]?.field).toBe('price')
  }
})
