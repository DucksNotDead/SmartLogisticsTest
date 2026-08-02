import type { AuctionListItem } from '@/shared/api/generated/schemas/auctionListItem'
import type { AuctionShowResponse } from '@/shared/api/generated/schemas/auctionShowResponse'
import type { BetItem } from '@/shared/api/generated/schemas/betItem'
import { AuctionStatus } from '@/shared/api/generated/schemas/auctionStatus'
import { AuctionType } from '@/shared/api/generated/schemas/auctionType'
import { BidMeasurementType } from '@/shared/api/generated/schemas/bidMeasurementType'
import { TradingStatus } from '@/shared/api/generated/schemas/tradingStatus'
import type { ProblemDetail } from '@/shared/api/errors'
import type { ValidationProblem } from '@/shared/api/errors'

export const SEED_AUCTION_UUID = '550e8400-e29b-41d4-a716-446655440000'

const SEED_AUCTION_ID = 101
const CURRENT_SUBSCRIBER_ID = 42
const COMPETITOR_SUBSCRIBER_ID = 77
const VAT_DIVISOR = 1.2

type AuctionRecord = {
  listItem: AuctionListItem
  detail: AuctionShowResponse
  bets: BetItem[]
  nextBetId: number
}

type StoreState = {
  auctions: Map<string, AuctionRecord>
}

export type SetBetResult =
  | { ok: true }
  | { ok: false; status: 404; body: ProblemDetail }
  | { ok: false; status: 422; body: ValidationProblem }

function priceNoVat(priceWithVat: number): number {
  return Math.round(priceWithVat / VAT_DIVISOR)
}

function createSeedRecord(): AuctionRecord {
  const start = 120_000
  const current = 100_000
  const step = 1_000
  const min = 50_000
  const max = 120_000
  const currentNoVat = priceNoVat(current)

  const competitorBet: BetItem = {
    id: 1,
    created_at: '2026-08-01T10:00:00Z',
    auction_id: SEED_AUCTION_ID,
    subscriber_id: COMPETITOR_SUBSCRIBER_ID,
    contact_name: 'Конкурент',
    contact_phone: '+70000000001',
    price_with_vat: current,
    price_no_vat: currentNoVat,
    organization_id: 501,
    organization_inn: '7701234567',
    organization_name: 'ООО Конкурент',
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: 1,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
  }

  const listItem: AuctionListItem = {
    main: {
      id: SEED_AUCTION_ID,
      cargo_num: 'СЛ-1001',
      cargo_date: '2026-08-10',
      auc_type: AuctionType.Down,
      order_uid: SEED_AUCTION_UUID,
      created_at: '2026-08-01T08:00:00Z',
      priority_sort: 1,
      is_assembly: false,
      price_per_km: null,
    },
    organizer: {
      subscriber_id: 1,
      organization_name: 'ООО Грузоотправитель',
      organization_inn: '7707654321',
    },
    trading: {
      status: 'Auction',
      status_mobile: 'NotParticipating',
      start_time: '2026-08-01T09:00:00Z',
      stop_time: '2026-08-03T18:00:00Z',
      bid_measurement_type: BidMeasurementType.PerRoute,
      can_set_bet: true,
      allow_counter_bets: false,
      hide_points_address_and_contacts: false,
      is_bidder: false,
      is_available: true,
      is_accredited: true,
      is_favorite: false,
      price: {
        start,
        current,
        current_no_vat: currentNoVat,
      },
      your: {
        bet: false,
        last_bet: null,
      },
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      is_last_bet_with_vat: true,
    },
  }

  const detail: AuctionShowResponse = {
    main: {
      id: SEED_AUCTION_ID,
      cargo_num: 'СЛ-1001',
      cargo_date: '2026-08-10',
      order_uid: SEED_AUCTION_UUID,
      auc_type: AuctionType.Down,
      created_at: '2026-08-01T08:00:00Z',
    },
    organizer: {
      subscriber_id: 1,
      subscriber_code: 'ORG-1',
      infobase_code: 'RU_Cargo_01',
      organization_name: 'ООО Грузоотправитель',
      organization_inn: '7707654321',
      organization_kpp: '770701001',
      organization_id: 10,
    },
    contacts: [],
    cargo: {
      price: '500000',
      currency: 643,
      is_international: false,
      distance: 450,
      truck_count: 1,
      body_type: 'Реф',
      containered: false,
    },
    trading: {
      status: AuctionStatus.Auction,
      status_mobile: TradingStatus.NotParticipating,
      start_time: '2026-08-01T09:00:00Z',
      stop_time: '2026-08-03T18:00:00Z',
      bid_measurement_type: BidMeasurementType.PerRoute,
      can_set_bet: true,
      allow_counter_bets: false,
      hide_bets_history: false,
      hide_places: false,
      no_view_cargo_price: false,
      hide_points_address_and_contacts: false,
      is_bidder: false,
      is_favorite: false,
      is_last_bet_with_vat: true,
      red_bet_with_vat: false,
      red_bet_no_vat: false,
      send_deal_before_load: false,
      chat_id: null,
      price: {
        start,
        start_no_vat: priceNoVat(start),
        current,
        current_no_vat: currentNoVat,
        available: current - step,
        available_no_vat: priceNoVat(current - step),
        min,
        min_no_vat: priceNoVat(min),
        max,
        max_no_vat: priceNoVat(max),
        step,
        step_no_vat: priceNoVat(step),
        price_per_km: 0,
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
      delay: 14,
      delay_type: null,
      condition: null,
      condition_predefined: null,
      prepay: null,
    },
    assembly: {
      num: null,
      date: null,
    },
    routes: [],
    admitted_organizations: [],
    hide_bets_history: false,
  }

  return {
    listItem,
    detail,
    bets: [competitorBet],
    nextBetId: 2,
  }
}

function cloneSeed(): StoreState {
  const record = createSeedRecord()
  return {
    auctions: new Map([[SEED_AUCTION_UUID, structuredClone(record)]]),
  }
}

let state: StoreState = cloneSeed()

export function resetStore(): void {
  state = cloneSeed()
}

export function listAuctionItems(): AuctionListItem[] {
  return [...state.auctions.values()].map((record) => record.listItem)
}

export function getAuctionDetail(
  auctionUuid: string,
): AuctionShowResponse | undefined {
  return state.auctions.get(auctionUuid)?.detail
}

export function getAuctionBets(auctionUuid: string): BetItem[] | undefined {
  const record = state.auctions.get(auctionUuid)
  if (!record) return undefined
  return record.bets
}

function validationProblem(message: string, field = 'price'): ValidationProblem {
  return {
    code: 'validation_failed',
    title: 'Ошибка валидации',
    message,
    errors: [{ field, message, code: 'invalid' }],
  }
}

function notFoundProblem(auctionUuid: string): ProblemDetail {
  return {
    code: 'resource_not_found',
    title: 'Не найдено',
    message: `Аукцион ${auctionUuid} не найден`,
  }
}

/**
 * Down-auction setBet: append bet, update current price / your / status_mobile,
 * sync list item with detail.
 */
export function applySetBet(auctionUuid: string, price: unknown): SetBetResult {
  const record = state.auctions.get(auctionUuid)
  if (!record) {
    return { ok: false, status: 404, body: notFoundProblem(auctionUuid) }
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    return {
      ok: false,
      status: 422,
      body: validationProblem('Цена ставки должна быть числом больше 0.'),
    }
  }

  const trading = record.detail.trading
  const priceBlock = trading.price
  const current = priceBlock?.current ?? null
  const min = priceBlock?.min ?? null
  const max = priceBlock?.max ?? null
  const step = priceBlock?.step ?? null

  if (current !== null && price >= current) {
    return {
      ok: false,
      status: 422,
      body: validationProblem(
        `Цена должна быть меньше текущей (${current}).`,
      ),
    }
  }

  if (min !== null && price < min) {
    return {
      ok: false,
      status: 422,
      body: validationProblem(`Цена не может быть меньше минимума (${min}).`),
    }
  }

  if (max !== null && price > max) {
    return {
      ok: false,
      status: 422,
      body: validationProblem(`Цена не может быть больше максимума (${max}).`),
    }
  }

  if (
    step !== null &&
    current !== null &&
    step > 0 &&
    (current - price) % step !== 0
  ) {
    return {
      ok: false,
      status: 422,
      body: validationProblem(`Цена должна отличаться от текущей кратно шагу (${step}).`),
    }
  }

  const noVat = priceNoVat(price)
  const now = new Date().toISOString()

  for (const bet of record.bets) {
    if (!bet.is_rejected && bet.place != null) {
      bet.place += 1
    }
  }

  const newBet: BetItem = {
    id: record.nextBetId,
    created_at: now,
    auction_id: SEED_AUCTION_ID,
    subscriber_id: CURRENT_SUBSCRIBER_ID,
    contact_name: 'Текущий пользователь',
    contact_phone: '+70000000042',
    price_with_vat: price,
    price_no_vat: noVat,
    organization_id: 42,
    organization_inn: '7700000042',
    organization_name: 'ООО Перевозчик',
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    place: 1,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
  }
  record.nextBetId += 1
  record.bets = [newBet, ...record.bets]

  if (priceBlock) {
    priceBlock.current = price
    priceBlock.current_no_vat = noVat
    if (step !== null) {
      priceBlock.available = price - step
      priceBlock.available_no_vat = priceNoVat(price - step)
    }
  }

  trading.status_mobile = TradingStatus.Leading
  trading.is_bidder = true
  trading.your = {
    bet: true,
    last_bet: noVat,
    last_bet_with_vat: price,
    win: false,
  }

  const listTrading = record.listItem.trading
  if (listTrading) {
    listTrading.status_mobile = 'Leading'
    listTrading.is_bidder = true
    listTrading.price = {
      start: listTrading.price?.start ?? priceBlock?.start ?? price,
      current: price,
      current_no_vat: noVat,
    }
    listTrading.your = {
      bet: true,
      last_bet: price,
    }
  }

  return { ok: true }
}
