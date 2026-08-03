import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test, vi } from 'vitest'

import { getListBetsQueryKey, type BetViewModel } from '@/entities/bet'

import { BetCard } from './BetCard.component'
import { BetsTab } from './BetsTab.component'

const HIDDEN_HISTORY_UUID = '550e8400-e29b-41d4-a716-446655440000'

const sampleBet: BetViewModel = {
  id: 1,
  createdAt: '2026-08-01T10:00:00Z',
  priceWithVat: 100_000,
  priceNoVat: 83_333,
  carrierName: 'ООО Тест',
  organizationInn: '7700000000',
  place: 1,
  isWin: false,
  isRejected: false,
  cancelReason: null,
  contactName: 'Иван',
  contactPhone: '+79001112233',
  isCounter: false,
}

test('hide_bets_history → hidden UI, query disabled / no fetch', async () => {
  const fetchSpy = vi.spyOn(globalThis, 'fetch')

  try {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    const html = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client },
        createElement(BetsTab, {
          auctionUuid: HIDDEN_HISTORY_UUID,
          hideBetsHistory: true,
          hidePlaces: false,
        }),
      ),
    )

    await Promise.resolve()

    expect(html).toContain('data-hide_bets_history="true"')
    expect(html).toContain('data-bets-state="hidden"')
    expect(html).not.toContain('data-bets-list')
    expect(html).not.toContain('data-participants')
    expect(html).not.toContain('data-bets-state="pending"')
    expect(html).not.toContain('data-bets-state="success"')

    const betsFetches = fetchSpy.mock.calls.filter(([input]) =>
      String(input).includes('/bets'),
    )
    expect(betsFetches).toHaveLength(0)

    const query = client.getQueryCache().find({
      queryKey: getListBetsQueryKey(HIDDEN_HISTORY_UUID, { all: true }),
    })
    expect(query).toBeDefined()
    const enabled = (query?.options as { enabled?: boolean }).enabled
    expect(enabled).toBe(false)
    expect(query?.state.fetchStatus).toBe('idle')
    expect(query?.state.dataUpdateCount).toBe(0)
    expect(query?.state.data).toBeUndefined()
  } finally {
    fetchSpy.mockRestore()
  }
})

test('hide_places → place badge not rendered when place exists', () => {
  const visible = renderToStaticMarkup(
    createElement(BetCard, { bet: sampleBet, hidePlaces: false }),
  )
  expect(visible).toContain('data-place="1"')

  const hidden = renderToStaticMarkup(
    createElement(BetCard, { bet: sampleBet, hidePlaces: true }),
  )
  expect(hidden).not.toContain('data-place')
  expect(hidden).toContain('data-carrier')
  expect(hidden).toContain('100')
})
