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
/** Enough for ≥2 pages at default `per_page=20`. */
export const SEED_AUCTION_COUNT = 25

const SEED_AUCTION_ID_BASE = 101
const CURRENT_SUBSCRIBER_ID = 42
const COMPETITOR_SUBSCRIBER_ID = 77
const VAT_DIVISOR = 1.2

const LOAD_CITIES = ['Москва', 'Казань', 'Самара', 'Екатеринбург', 'Новосибирск']
const UNLOAD_CITIES = ['Санкт-Петербург', 'Нижний Новгород', 'Уфа', 'Пермь', 'Омск']
const BODY_TYPES = ['Реф', 'Тент', 'Изотерм']
const AUC_TYPES = [
  AuctionType.Down,
  AuctionType.Up,
  AuctionType.Request,
  AuctionType.FixPrice,
] as const

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

function uuidForIndex(index: number): string {
  const suffix = (0x446655440000 + index).toString(16).padStart(12, '0')
  return `550e8400-e29b-41d4-a716-${suffix}`
}

function createSeedRecord(index: number): AuctionRecord {
  const auctionId = SEED_AUCTION_ID_BASE + index
  const orderUid = uuidForIndex(index)
  const cargoNum = `СЛ-${1001 + index}`
  const start = 120_000 + index * 1_000
  const current = 100_000 + index * 500
  const step = 1_000
  const min = 50_000
  const max = start
  const currentNoVat = priceNoVat(current)
  const loadCity = LOAD_CITIES[index % LOAD_CITIES.length]
  const unloadCity = UNLOAD_CITIES[index % UNLOAD_CITIES.length]
  const bodyType = BODY_TYPES[index % BODY_TYPES.length]
  const aucType = AUC_TYPES[index % AUC_TYPES.length]
  const day = String((index % 28) + 1).padStart(2, '0')
  const cargoDate = `2026-08-${day}`
  const weight = 10 + (index % 12)
  const volume = 20 + (index % 40)
  const pricePerKm = 80 + (index % 40)

  const competitorBet: BetItem = {
    id: 1,
    created_at: '2026-08-01T10:00:00Z',
    auction_id: auctionId,
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
      id: auctionId,
      cargo_num: cargoNum,
      cargo_date: cargoDate,
      auc_type: aucType,
      order_uid: orderUid,
      created_at: '2026-08-01T08:00:00Z',
      priority_sort: index + 1,
      is_assembly: false,
      price_per_km: pricePerKm,
    },
    organizer: {
      subscriber_id: 1,
      organization_name: 'ООО Грузоотправитель',
      organization_inn: '7707654321',
    },
    route: {
      load: {
        city: loadCity,
        address: `ул. Погрузки, ${index + 1}`,
        date: `${cargoDate}T08:00:00Z`,
        city_gc_id: 1000 + index,
      },
      unload: {
        city: unloadCity,
        address: `ул. Выгрузки, ${index + 1}`,
        date: `${cargoDate}T18:00:00Z`,
        city_gc_id: 2000 + index,
      },
    },
    cargo: {
      name: `Груз ${index + 1}`,
      weight,
      volume,
      body_type: bodyType,
      truck_count: 1,
      is_cargo: true,
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
      id: auctionId,
      cargo_num: cargoNum,
      cargo_date: cargoDate,
      order_uid: orderUid,
      auc_type: aucType,
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
      price: String(500_000 + index * 10_000),
      currency: 643,
      is_international: false,
      distance: 450 + index * 10,
      truck_count: 1,
      body_type: bodyType,
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
        price_per_km: pricePerKm,
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
  const auctions = new Map<string, AuctionRecord>()
  for (let index = 0; index < SEED_AUCTION_COUNT; index += 1) {
    const record = createSeedRecord(index)
    const uuid = record.listItem.main?.order_uid
    if (!uuid) continue
    auctions.set(uuid, structuredClone(record))
  }
  return { auctions }
}

let state: StoreState = cloneSeed()

export function resetStore(): void {
  state = cloneSeed()
}

export function listAuctionItems(): AuctionListItem[] {
  return [...state.auctions.values()]
    .map((record) => record.listItem)
    .sort(
      (a, b) => (a.main?.priority_sort ?? 0) - (b.main?.priority_sort ?? 0),
    )
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
  const auctionId = record.detail.main.id

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
    auction_id: auctionId,
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
