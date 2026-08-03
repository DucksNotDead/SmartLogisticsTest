import { expect, test } from 'vitest'

import {
  DEFAULT_DETAIL_TAB,
  parseAuctionDetailSearch,
} from './search'

test('parseAuctionDetailSearch accepts info and bets', () => {
  expect(parseAuctionDetailSearch({ tab: 'info' }).tab).toBe('info')
  expect(parseAuctionDetailSearch({ tab: 'bets' }).tab).toBe('bets')
})

test('parseAuctionDetailSearch falls back on missing/invalid tab', () => {
  expect(parseAuctionDetailSearch({}).tab).toBe(DEFAULT_DETAIL_TAB)
  expect(parseAuctionDetailSearch({ tab: 'chat' }).tab).toBe(DEFAULT_DETAIL_TAB)
  expect(parseAuctionDetailSearch({ tab: 1 }).tab).toBe(DEFAULT_DETAIL_TAB)
})
