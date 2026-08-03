import { expect, test } from 'vitest'

import type { BetItem, BetListResponse } from '../api/bets'
import { mapBetItem, mapBetList } from './map-bet'

function baseBet(overrides: Partial<BetItem> = {}): BetItem {
  return {
    id: 1,
    created_at: '2026-08-01T10:00:00Z',
    auction_id: 100,
    subscriber_id: 13,
    contact_name: 'Иванов Иван',
    contact_phone: '+79001234567',
    price_with_vat: 30_000,
    price_no_vat: 25_000,
    organization_id: 14,
    organization_inn: '9616244307',
    organization_name: 'ООО Перевозчик',
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: 1,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    ...overrides,
  }
}

test('mapBetItem maps win / rejected / cancel reason', () => {
  const win = mapBetItem(baseBet({ is_win: true, place: 1 }))
  expect(win.isWin).toBe(true)
  expect(win.isRejected).toBe(false)
  expect(win.cancelReason).toBeNull()

  const rejected = mapBetItem(
    baseBet({
      is_rejected: true,
      is_win: false,
      place: null,
      cancel_reason: 'Отзыв перевозчика',
    }),
  )
  expect(rejected.isRejected).toBe(true)
  expect(rejected.cancelReason).toBe('Отзыв перевозчика')
  expect(rejected.place).toBeNull()
})

test('mapBetItem treats empty cancel_reason as null', () => {
  expect(mapBetItem(baseBet({ cancel_reason: '' })).cancelReason).toBeNull()
  expect(mapBetItem(baseBet({ cancel_reason: undefined })).cancelReason).toBeNull()
})

test('mapBetItem falls back prices to price_info', () => {
  const mapped = mapBetItem(
    baseBet({
      price_with_vat: undefined,
      price_no_vat: undefined,
      price_info: {
        price_with_vat: 40_000,
        price_no_vat: 33_333,
      },
    }),
  )
  expect(mapped.priceWithVat).toBe(40_000)
  expect(mapped.priceNoVat).toBe(33_333)
})

test('mapBetItem prefers root prices over price_info', () => {
  const mapped = mapBetItem(
    baseBet({
      price_with_vat: 30_000,
      price_no_vat: 25_000,
      price_info: {
        price_with_vat: 99_999,
        price_no_vat: 88_888,
      },
    }),
  )
  expect(mapped.priceWithVat).toBe(30_000)
  expect(mapped.priceNoVat).toBe(25_000)
})

test('mapBetItem falls back carrier to contact when org name empty', () => {
  const mapped = mapBetItem(
    baseBet({
      organization_name: '',
      contact_name: 'Петров Пётр',
    }),
  )
  expect(mapped.carrierName).toBe('Петров Пётр')
})

test('mapBetList derives unique participants by organization_id', () => {
  const response: BetListResponse = {
    bets: [
      baseBet({ id: 1, organization_id: 10, subscriber_id: 1 }),
      baseBet({ id: 2, organization_id: 10, subscriber_id: 1, place: 2 }),
      baseBet({ id: 3, organization_id: 20, subscriber_id: 2, place: 3 }),
    ],
  }
  const list = mapBetList(response)
  expect(list.bets).toHaveLength(3)
  expect(list.participantsCount).toBe(2)
})

test('mapBetList falls back participant key to subscriber_id', () => {
  const response: BetListResponse = {
    bets: [
      baseBet({
        id: 1,
        organization_id: undefined,
        subscriber_id: 7,
        organization_name: '',
      }),
      baseBet({
        id: 2,
        organization_id: undefined,
        subscriber_id: 7,
        place: 2,
      }),
      baseBet({
        id: 3,
        organization_id: undefined,
        subscriber_id: 9,
        place: 3,
      }),
    ],
  }
  expect(mapBetList(response).participantsCount).toBe(2)
})

test('mapBetList empty bets → zero participants', () => {
  expect(mapBetList({ bets: [] })).toEqual({
    bets: [],
    participantsCount: 0,
  })
})
