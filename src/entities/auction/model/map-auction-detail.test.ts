import { expect, test } from 'vitest'

import {
  AuctionType,
  BidMeasurementType,
  OperationType,
  TradingStatus,
  type AuctionShowResponse,
} from '../api/auctions'
import { mapAuctionDetail } from './map-auction-detail'

function baseDetail(
  overrides: Partial<AuctionShowResponse> = {},
): AuctionShowResponse {
  const base: AuctionShowResponse = {
    main: {
      id: 1,
      cargo_num: 'CARGO-1',
      cargo_date: '2026-08-10',
      order_uid: '550e8400-e29b-41d4-a716-446655440000',
      auc_type: AuctionType.Down,
      created_at: '2026-08-01T08:00:00Z',
    },
    organizer: {
      organization_name: 'ООО Тест',
      organization_inn: '7707000000',
      organization_kpp: '770701001',
      subscriber_code: 'ORG-1',
    },
    contacts: [
      {
        name: 'Иван',
        phone: '+79001112233',
        email: 'ivan@example.com',
      },
    ],
    cargo: {
      price: '500000',
      currency: 643,
      distance: 450,
      truck_count: 1,
      body_type: 'Тент',
      containered: false,
    },
    trading: {
      status_mobile: TradingStatus.NotParticipating,
      bid_measurement_type: BidMeasurementType.PerRoute,
      can_set_bet: true,
      hide_bets_history: false,
      hide_places: false,
      no_view_cargo_price: false,
      hide_points_address_and_contacts: false,
      price: {
        current: 100_000,
        current_no_vat: 83_333,
        available: 95_000,
        available_no_vat: 79_167,
        min: 50_000,
        max: 200_000,
        step: 5_000,
        price_per_km: 222,
      },
      your: {
        bet: false,
        last_bet: null,
        last_bet_with_vat: null,
        win: false,
      },
      settings: {},
    },
    payment: {
      form: 'Безналичный',
      currency_code: '643',
    },
    assembly: {
      num: null,
      date: null,
    },
    routes: [
      {
        row_num: 1,
        op_type: OperationType.Loading,
        location: {
          city_name: 'Москва',
          city_full_name: 'г. Москва',
          loading_address: 'ул. Ленина, 1',
        },
        contact: {
          name: 'Склад',
          phone: '+79005556677',
        },
      },
      {
        row_num: 2,
        op_type: OperationType.Unloading,
        location: {
          city_name: 'Казань',
          city_full_name: 'г. Казань',
          loading_address: 'пр. Победы, 10',
        },
      },
    ],
    admitted_organizations: [],
    hide_bets_history: false,
  }

  return {
    ...base,
    ...overrides,
    trading: {
      ...base.trading,
      ...overrides.trading,
      price:
        overrides.trading && 'price' in overrides.trading
          ? overrides.trading.price
          : base.trading.price,
      your:
        overrides.trading && 'your' in overrides.trading
          ? overrides.trading.your
          : base.trading.your,
    },
    cargo: {
      ...base.cargo,
      ...overrides.cargo,
    },
    main: {
      ...base.main,
      ...overrides.main,
    },
  }
}

test('mapAuctionDetail maps title and uuid from main', () => {
  const vm = mapAuctionDetail(baseDetail())

  expect(vm.uuid).toBe('550e8400-e29b-41d4-a716-446655440000')
  expect(vm.title).toBe('CARGO-1')
  expect(vm.main.aucType).toBe(AuctionType.Down)
})

test('mapAuctionDetail keeps nullable prices as null without throwing', () => {
  const vm = mapAuctionDetail(
    baseDetail({
      trading: {
        price: {
          current: null,
          current_no_vat: null,
          available: null,
          available_no_vat: null,
          min: null,
          max: null,
          step: null,
          start: null,
          start_no_vat: null,
          min_no_vat: null,
          max_no_vat: null,
          step_no_vat: null,
          price_per_km: 0,
        },
      },
    }),
  )

  expect(vm.trading.prices).toEqual({
    start: null,
    startNoVat: null,
    current: null,
    currentNoVat: null,
    available: null,
    availableNoVat: null,
    min: null,
    minNoVat: null,
    max: null,
    maxNoVat: null,
    step: null,
    stepNoVat: null,
    pricePerKm: 0,
  })
})

test('mapAuctionDetail treats missing price object as all-null prices', () => {
  const vm = mapAuctionDetail(
    baseDetail({
      trading: {
        price: undefined,
      },
    }),
  )

  expect(vm.trading.prices.current).toBeNull()
  expect(vm.trading.prices.available).toBeNull()
  expect(vm.trading.prices.step).toBeNull()
  expect(vm.trading.prices.pricePerKm).toBeNull()
})

test('mapAuctionDetail hides contacts and route addresses when flag set', () => {
  const vm = mapAuctionDetail(
    baseDetail({
      trading: {
        hide_points_address_and_contacts: true,
      },
    }),
  )

  expect(vm.visibility.contacts).toBe(false)
  expect(vm.visibility.pointAddresses).toBe(false)
  expect(vm.contacts).toEqual([])
  expect(vm.routes).toHaveLength(2)
  expect(vm.routes[0]?.address).toBeNull()
  expect(vm.routes[0]?.contact).toBeNull()
  expect(vm.routes[0]?.cityName).toBe('Москва')
  expect(vm.routes[1]?.address).toBeNull()
})

test('mapAuctionDetail keeps contacts and addresses when flag off', () => {
  const vm = mapAuctionDetail(baseDetail())

  expect(vm.visibility.contacts).toBe(true)
  expect(vm.contacts).toHaveLength(1)
  expect(vm.routes[0]?.address).toBe('ул. Ленина, 1')
  expect(vm.routes[0]?.contact?.name).toBe('Склад')
})

test('mapAuctionDetail hides cargo price when no_view_cargo_price', () => {
  const vm = mapAuctionDetail(
    baseDetail({
      trading: {
        no_view_cargo_price: true,
      },
    }),
  )

  expect(vm.visibility.cargoPrice).toBe(false)
  expect(vm.cargo.price).toBeNull()
  expect(vm.cargo.bodyType).toBe('Тент')
})

test('mapAuctionDetail merges hide_bets_history from root and trading', () => {
  const fromRoot = mapAuctionDetail(
    baseDetail({
      hide_bets_history: true,
      trading: { hide_bets_history: false },
    }),
  )
  expect(fromRoot.visibility.betsHistory).toBe(false)

  const fromTrading = mapAuctionDetail(
    baseDetail({
      hide_bets_history: false,
      trading: { hide_bets_history: true },
    }),
  )
  expect(fromTrading.visibility.betsHistory).toBe(false)

  const visible = mapAuctionDetail(baseDetail())
  expect(visible.visibility.betsHistory).toBe(true)
})

test('mapAuctionDetail maps can_set_bet and your bet', () => {
  const vm = mapAuctionDetail(
    baseDetail({
      trading: {
        can_set_bet: false,
        your: {
          bet: true,
          last_bet: 80_000,
          last_bet_with_vat: 96_000,
          win: false,
        },
      },
    }),
  )

  expect(vm.trading.canSetBet).toBe(false)
  expect(vm.trading.your).toEqual({
    bet: true,
    lastBet: 80_000,
    lastBetWithVat: 96_000,
    win: false,
  })
})
