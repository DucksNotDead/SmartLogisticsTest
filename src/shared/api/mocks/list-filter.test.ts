import { describe, expect, it } from 'vitest'

import type { AuctionListItem } from '@/shared/api/generated/schemas/auctionListItem'
import { AuctionListItemTradingStatus } from '@/shared/api/generated/schemas/auctionListItemTradingStatus'
import { AuctionListItemTradingStatusMobile } from '@/shared/api/generated/schemas/auctionListItemTradingStatusMobile'
import { AuctionType } from '@/shared/api/generated/schemas/auctionType'

import { filterListItems, sortListItems } from './list-filter'

function item(partial: {
  cargo_num: string
  auc_type: (typeof AuctionType)[keyof typeof AuctionType]
  load_city: string
  unload_city: string
  body_type: string
  price_per_km: number
  status: (typeof AuctionListItemTradingStatus)[keyof typeof AuctionListItemTradingStatus]
  status_mobile: (typeof AuctionListItemTradingStatusMobile)[keyof typeof AuctionListItemTradingStatusMobile]
  is_available: boolean
  is_bidder: boolean
  current: number
  load_date: string
  stop_time: string
}): AuctionListItem {
  return {
    main: {
      cargo_num: partial.cargo_num,
      auc_type: partial.auc_type,
      price_per_km: partial.price_per_km,
    },
    route: {
      load: {
        city: partial.load_city,
        date: partial.load_date,
      },
      unload: {
        city: partial.unload_city,
      },
    },
    cargo: {
      body_type: partial.body_type,
    },
    trading: {
      status: partial.status,
      status_mobile: partial.status_mobile,
      is_available: partial.is_available,
      is_bidder: partial.is_bidder,
      stop_time: partial.stop_time,
      price: {
        current: partial.current,
      },
    },
  }
}

const fixtures: AuctionListItem[] = [
  item({
    cargo_num: 'СЛ-1001',
    auc_type: AuctionType.Down,
    load_city: 'Москва',
    unload_city: 'Пермь',
    body_type: 'Тент',
    price_per_km: 80,
    status: AuctionListItemTradingStatus.Auction,
    status_mobile: AuctionListItemTradingStatusMobile.NotParticipating,
    is_available: true,
    is_bidder: false,
    current: 100_000,
    load_date: '2026-08-01T08:00:00Z',
    stop_time: '2026-08-03T12:00:00Z',
  }),
  item({
    cargo_num: 'СЛ-1002',
    auc_type: AuctionType.Up,
    load_city: 'Казань',
    unload_city: 'Уфа',
    body_type: 'Реф',
    price_per_km: 120,
    status: AuctionListItemTradingStatus.Planning,
    status_mobile: AuctionListItemTradingStatusMobile.Leading,
    is_available: true,
    is_bidder: true,
    current: 110_000,
    load_date: '2026-08-05T08:00:00Z',
    stop_time: '2026-08-03T18:00:00Z',
  }),
  item({
    cargo_num: 'СЛ-1003',
    auc_type: AuctionType.Request,
    load_city: 'Москва',
    unload_city: 'Омск',
    body_type: 'Тент',
    price_per_km: 95,
    status: AuctionListItemTradingStatus.Finished,
    status_mobile: AuctionListItemTradingStatusMobile.Losing,
    is_available: false,
    is_bidder: true,
    current: 90_000,
    load_date: '2026-08-10T08:00:00Z',
    stop_time: '2026-08-04T09:00:00Z',
  }),
]

describe('filterListItems', () => {
  it('filters by cargo_num substring and load_city', () => {
    const result = filterListItems(fixtures, {
      cargo_num: '1001',
      load_city: 'Москва',
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.main?.cargo_num).toBe('СЛ-1001')
  })

  it('keeps status (trading) distinct from statuses (auction)', () => {
    const byTrading = filterListItems(fixtures, {
      status: ['Leading', 'Losing'],
    })
    expect(byTrading.map((row) => row.main?.cargo_num)).toEqual([
      'СЛ-1002',
      'СЛ-1003',
    ])

    const byAuction = filterListItems(fixtures, {
      statuses: [2],
    })
    expect(byAuction).toHaveLength(1)
    expect(byAuction[0]?.trading?.status).toBe('Auction')
  })

  it('filters is_available and price ranges', () => {
    const result = filterListItems(fixtures, {
      is_available: true,
      current_price_from: 100_000,
      price_per_km_to: 100,
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.main?.cargo_num).toBe('СЛ-1001')
  })
})

describe('sortListItems', () => {
  it('sorts by stop_time ascending', () => {
    const result = sortListItems(fixtures, {
      sort: { stop_time: 'asc' },
    })
    expect(result.map((row) => row.main?.cargo_num)).toEqual([
      'СЛ-1001',
      'СЛ-1002',
      'СЛ-1003',
    ])
  })
})
