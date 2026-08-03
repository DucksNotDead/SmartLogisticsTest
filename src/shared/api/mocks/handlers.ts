import { http, HttpResponse } from 'msw'

import type { AuctionListRequest } from '@/shared/api/generated/schemas/auctionListRequest'
import type { SetBetRequest } from '@/shared/api/generated/schemas/setBetRequest'

import { delayMockResponse } from './delay'
import { filterListItems, sortListItems } from './list-filter'
import {
  applySetBet,
  getAuctionBets,
  getAuctionDetail,
  listAuctionItems,
} from './store'

function problemJson(
  status: number,
  body: Record<string, unknown> | { code: string; title: string; message: string },
) {
  return HttpResponse.json(body, {
    status,
    headers: { 'Content-Type': 'application/problem+json' },
  })
}

export const handlers = [
  http.post('*/api/v1/auctions/list', async ({ request }) => {
    let body: AuctionListRequest | undefined
    try {
      const text = await request.text()
      body = text ? (JSON.parse(text) as AuctionListRequest) : undefined
    } catch {
      body = undefined
    }

    const page = body?.page && body.page > 0 ? body.page : 1
    const perPage =
      body?.per_page && body.per_page > 0 ? Math.min(body.per_page, 100) : 20

    const filtered = sortListItems(
      filterListItems(listAuctionItems(), body),
      body,
    )
    const total = filtered.length
    const fromIndex = (page - 1) * perPage
    const data = filtered.slice(fromIndex, fromIndex + perPage)
    const lastPage = Math.max(1, Math.ceil(total / perPage) || 1)

    await delayMockResponse()

    return HttpResponse.json({
      data,
      meta: {
        current_page: page,
        from: total === 0 ? 0 : fromIndex + 1,
        last_page: lastPage,
        per_page: perPage,
        to: fromIndex + data.length,
        total,
      },
    })
  }),

  http.get('*/api/v1/auctions/:auctionUuid', async ({ params }) => {
    const auctionUuid = String(params.auctionUuid)
    const detail = getAuctionDetail(auctionUuid)

    await delayMockResponse()

    if (!detail) {
      return problemJson(404, {
        code: 'resource_not_found',
        title: 'Не найдено',
        message: `Аукцион ${auctionUuid} не найден`,
      })
    }

    return HttpResponse.json(detail)
  }),

  http.get('*/api/v1/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const auctionUuid = String(params.auctionUuid)
    const bets = getAuctionBets(auctionUuid)

    await delayMockResponse()

    if (!bets) {
      return problemJson(404, {
        code: 'resource_not_found',
        title: 'Не найдено',
        message: `Аукцион ${auctionUuid} не найден`,
      })
    }

    const url = new URL(request.url)
    const allParam = url.searchParams.get('all')
    const includeAll = allParam === 'true' || allParam === '1'
    const filtered = includeAll ? bets : bets.filter((bet) => !bet.is_rejected)

    return HttpResponse.json({ bets: filtered })
  }),

  http.post('*/api/v1/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const auctionUuid = String(params.auctionUuid)

    let payload: SetBetRequest
    try {
      payload = (await request.json()) as SetBetRequest
    } catch {
      await delayMockResponse()
      return problemJson(422, {
        code: 'validation_failed',
        title: 'Ошибка валидации',
        message: 'Тело запроса должно быть JSON с полем price.',
        errors: [
          {
            field: 'price',
            message: 'Поле price обязательно.',
            code: 'required',
          },
        ],
      })
    }

    const result = applySetBet(auctionUuid, payload.price)
    await delayMockResponse()
    if (!result.ok) {
      return problemJson(result.status, result.body)
    }

    return new HttpResponse(null, { status: 200 })
  }),
]
