import { describe, expect, it } from 'vitest'

import {
  createDefaultAuctionListSearch,
  hasActiveFilters,
  parseAuctionListSearch,
} from './search'
import { toListRequest } from './to-list-request'

describe('parseAuctionListSearch', () => {
  it('keeps pagination defaults and omits empty filters', () => {
    const search = parseAuctionListSearch({})
    expect(search.page).toBe(1)
    expect(search.per_page).toBe(20)
    expect(search.cargo_num).toBeUndefined()
    expect(hasActiveFilters(search)).toBe(false)
  })

  it('falls back on broken filter values without failing the route', () => {
    const search = parseAuctionListSearch({
      page: '0',
      per_page: '999',
      status: ['Nope'],
      statuses: [99, 'x'],
      auc_type: 'Broken',
      is_available: 'maybe',
      sort_field: 'distance',
      load_date_from: 'not-a-date',
      current_price_from: 'abc',
    })

    expect(search.page).toBe(1)
    expect(search.per_page).toBe(20)
    expect(search.status).toBeUndefined()
    expect(search.statuses).toBeUndefined()
    expect(search.auc_type).toBeUndefined()
    expect(search.is_available).toBeUndefined()
    expect(search.sort_field).toBeUndefined()
    expect(search.load_date_from).toBeUndefined()
    expect(search.current_price_from).toBeUndefined()
    expect(hasActiveFilters(search)).toBe(false)
  })

  it('parses must/should filter keys from url-like input', () => {
    const search = parseAuctionListSearch({
      cargo_num: ' СЛ-1001 ',
      status: 'Leading,Losing',
      statuses: ['2', 3],
      auc_type: ['Down'],
      load_city: 'Москва',
      unload_city: 'Пермь',
      load_date_from: '2026-08-01T08:00:00Z',
      is_available: 'true',
      is_bidder: true,
      current_price_from: '100000',
      body_types: ['Тент', 'Реф'],
      price_per_km_from: 80,
      stop_time_to: '2026-08-04T12:00:00+03:00',
      sort_field: 'stop_time',
      sort_dir: 'asc',
    })

    expect(search.cargo_num).toBe('СЛ-1001')
    expect(search.status).toEqual(['Leading', 'Losing'])
    expect(search.statuses).toEqual([2, 3])
    expect(search.auc_type).toEqual(['Down'])
    expect(search.is_available).toBe(true)
    expect(search.body_types).toEqual(['Тент', 'Реф'])
    expect(search.sort_field).toBe('stop_time')
    expect(hasActiveFilters(search)).toBe(true)
  })
})

describe('toListRequest', () => {
  it('maps search to AuctionListRequest without empty fields', () => {
    const search = parseAuctionListSearch({
      page: 2,
      per_page: 10,
      cargo_num: 'СЛ-1001',
      status: ['Leading'],
      is_available: true,
      is_bidder: false,
      sort_field: 'price_per_km',
      sort_dir: 'desc',
    })

    expect(toListRequest(search)).toEqual({
      page: 2,
      per_page: 10,
      cargo_num: 'СЛ-1001',
      status: ['Leading'],
      is_available: true,
      sort: { price_per_km: 'desc' },
    })
  })

  it('keeps only pagination for default search', () => {
    expect(toListRequest(createDefaultAuctionListSearch())).toEqual({
      page: 1,
      per_page: 20,
    })
  })
})
