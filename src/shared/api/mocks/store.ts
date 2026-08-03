import type { AuctionListItem } from '@/shared/api/generated/schemas/auctionListItem'
import type { AuctionShowResponse } from '@/shared/api/generated/schemas/auctionShowResponse'
import type { BetItem } from '@/shared/api/generated/schemas/betItem'
import { AuctionListItemTradingStatus } from '@/shared/api/generated/schemas/auctionListItemTradingStatus'
import { AuctionListItemTradingStatusMobile } from '@/shared/api/generated/schemas/auctionListItemTradingStatusMobile'
import { AuctionStatus } from '@/shared/api/generated/schemas/auctionStatus'
import { AuctionType } from '@/shared/api/generated/schemas/auctionType'
import { BidMeasurementType } from '@/shared/api/generated/schemas/bidMeasurementType'
import { OperationType } from '@/shared/api/generated/schemas/operationType'
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

/** Dedicated fixtures (index 0 stays the happy-path / set-bet seed). */
const SEED_FLAG_HIDE_POINTS = 1
const SEED_FLAG_NO_CARGO_PRICE = 2
const SEED_FLAG_HIDE_BETS = 3
const SEED_FLAG_CANNOT_SET_BET = 4
/** Empty bets history (UI empty state). */
const SEED_FLAG_EMPTY_BETS = 5
/** Finished auction with a winning bet (`is_win`). */
const SEED_FLAG_WINNER_BET = 6
/** Detail/bets: hide ranking place (`hide_places`). */
const SEED_FLAG_HIDE_PLACES = 7

const LOAD_CITIES = ['Москва', 'Казань', 'Самара', 'Екатеринбург', 'Новосибирск']
const UNLOAD_CITIES = ['Санкт-Петербург', 'Нижний Новгород', 'Уфа', 'Пермь', 'Омск']
const BODY_TYPES = ['Реф', 'Тент', 'Изотерм']
const AUC_TYPES = [
  AuctionType.Down,
  AuctionType.Up,
  AuctionType.Request,
  AuctionType.FixPrice,
] as const
const AUCTION_STATUSES = [
  AuctionStatus.Planning,
  AuctionStatus.Auction,
  AuctionStatus.DeterminateWinner,
  AuctionStatus.WaitDeal,
  AuctionStatus.InProgress,
  AuctionStatus.Finished,
  AuctionStatus.Stopped,
] as const
const TRADING_MOBILE_STATUSES = [
  AuctionListItemTradingStatusMobile.NotParticipating,
  AuctionListItemTradingStatusMobile.Leading,
  AuctionListItemTradingStatusMobile.Losing,
  AuctionListItemTradingStatusMobile.Winner,
  AuctionListItemTradingStatusMobile.Confirmed,
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

function createBet(partial: BetItem): BetItem {
  return {
    transporter_comment: null,
    is_rejected: false,
    is_counter: false,
    is_win: false,
    run_number: 0,
    cancel_reason: '',
    ...partial,
  }
}

/**
 * Seed bets by fixture index.
 * Index 0: ≥2 ranked bets + rejected with reason (needs `all=true`).
 * Index 5: empty. Index 6: winner.
 */
function createSeedBets(
  index: number,
  auctionId: number,
  current: number,
  currentNoVat: number,
): { bets: BetItem[]; nextBetId: number } {
  if (index === SEED_FLAG_EMPTY_BETS) {
    return { bets: [], nextBetId: 1 }
  }

  if (index === SEED_FLAG_WINNER_BET) {
    return {
      bets: [
        createBet({
          id: 1,
          created_at: '2026-08-01T12:00:00Z',
          auction_id: auctionId,
          subscriber_id: COMPETITOR_SUBSCRIBER_ID,
          contact_name: 'Победитель',
          contact_phone: '+70000000001',
          price_with_vat: current,
          price_no_vat: currentNoVat,
          organization_id: 501,
          organization_inn: '7701234567',
          organization_name: 'ООО Победитель',
          place: 1,
          is_win: true,
        }),
      ],
      nextBetId: 2,
    }
  }

  const competitorBet = createBet({
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
    place: 1,
  })

  if (index !== 0) {
    return { bets: [competitorBet], nextBetId: 2 }
  }

  const secondPlace = createBet({
    id: 2,
    created_at: '2026-08-01T09:30:00Z',
    auction_id: auctionId,
    subscriber_id: 88,
    contact_name: 'Второй',
    contact_phone: '+70000000002',
    price_with_vat: current + 2_000,
    price_no_vat: priceNoVat(current + 2_000),
    organization_id: 502,
    organization_inn: '7701234568',
    organization_name: 'ООО Второй Перевозчик',
    place: 2,
  })

  const rejectedBet = createBet({
    id: 3,
    created_at: '2026-08-01T09:00:00Z',
    auction_id: auctionId,
    subscriber_id: 99,
    contact_name: 'Отменённый',
    contact_phone: '+70000000003',
    price_with_vat: current + 5_000,
    price_no_vat: priceNoVat(current + 5_000),
    organization_id: 503,
    organization_inn: '7701234569',
    organization_name: 'ООО Отменённый',
    place: null,
    is_rejected: true,
    cancel_reason: 'Отзыв перевозчика',
  })

  return {
    bets: [competitorBet, secondPlace, rejectedBet],
    nextBetId: 4,
  }
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
  const auctionStatus =
    index === 0
      ? AuctionStatus.Auction
      : AUCTION_STATUSES[index % AUCTION_STATUSES.length]
  const statusMobile =
    index === 0
      ? AuctionListItemTradingStatusMobile.NotParticipating
      : TRADING_MOBILE_STATUSES[index % TRADING_MOBILE_STATUSES.length]
  const isBidder =
    statusMobile === AuctionListItemTradingStatusMobile.Leading ||
    statusMobile === AuctionListItemTradingStatusMobile.Losing ||
    statusMobile === AuctionListItemTradingStatusMobile.Winner ||
    statusMobile === AuctionListItemTradingStatusMobile.Confirmed
  const isAvailable =
    index === 0
      ? true
      : auctionStatus === AuctionStatus.Auction ||
        auctionStatus === AuctionStatus.Planning ||
        index % 3 !== 0
  const hidePointsAddressAndContacts = index === SEED_FLAG_HIDE_POINTS
  const noViewCargoPrice = index === SEED_FLAG_NO_CARGO_PRICE
  const hideBetsHistory = index === SEED_FLAG_HIDE_BETS
  const hidePlaces = index === SEED_FLAG_HIDE_PLACES
  const canSetBet =
    index === SEED_FLAG_CANNOT_SET_BET
      ? false
      : isAvailable && auctionStatus === AuctionStatus.Auction
  const day = String((index % 28) + 1).padStart(2, '0')
  const cargoDate = `2026-08-${day}`
  const weight = 10 + (index % 12)
  const volume = 20 + (index % 40)
  const pricePerKm = 80 + (index % 40)
  const stopHour = 8 + (index % 40)
  const stopDay = String(Math.min(28, 1 + Math.floor(index / 2))).padStart(2, '0')
  const stopTime = `2026-08-${stopDay}T${String(stopHour % 24).padStart(2, '0')}:00:00Z`
  const startTime = '2026-08-01T09:00:00Z'
  const loadAddress = `ул. Погрузки, ${index + 1}`
  const unloadAddress = `ул. Выгрузки, ${index + 1}`
  const loadDateTime = `${cargoDate}T08:00:00Z`
  const unloadDateTime = `${cargoDate}T18:00:00Z`
  const detailStatusMobile =
    statusMobile === AuctionListItemTradingStatusMobile.NotParticipating
      ? TradingStatus.NotParticipating
      : statusMobile === AuctionListItemTradingStatusMobile.Leading
        ? TradingStatus.Leading
        : statusMobile === AuctionListItemTradingStatusMobile.Losing
          ? TradingStatus.Losing
          : statusMobile === AuctionListItemTradingStatusMobile.Winner
            ? TradingStatus.Winner
            : statusMobile === AuctionListItemTradingStatusMobile.Confirmed
              ? TradingStatus.Confirmed
              : TradingStatus.Unknown

  const { bets, nextBetId } = createSeedBets(
    index,
    auctionId,
    current,
    currentNoVat,
  )

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
        address: loadAddress,
        date: loadDateTime,
        city_gc_id: 1000 + index,
      },
      unload: {
        city: unloadCity,
        address: unloadAddress,
        date: unloadDateTime,
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
      status: auctionStatus as (typeof AuctionListItemTradingStatus)[keyof typeof AuctionListItemTradingStatus],
      status_mobile: statusMobile,
      start_time: startTime,
      stop_time: stopTime,
      bid_measurement_type: BidMeasurementType.PerRoute,
      can_set_bet: canSetBet,
      allow_counter_bets: false,
      hide_points_address_and_contacts: hidePointsAddressAndContacts,
      is_bidder: isBidder,
      is_available: isAvailable,
      is_accredited: true,
      is_favorite: false,
      price: {
        start,
        current,
        current_no_vat: currentNoVat,
      },
      your: {
        bet: isBidder,
        last_bet: isBidder ? current : null,
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
    contacts: [
      {
        name: 'Менеджер торгов',
        phone: '+79001234567',
        work_phone: '+74951234567',
        email: 'auction@example.com',
        uid: `contact-${index}`,
      },
    ],
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
      status: auctionStatus,
      status_mobile: detailStatusMobile,
      start_time: startTime,
      stop_time: stopTime,
      bid_measurement_type: BidMeasurementType.PerRoute,
      can_set_bet: canSetBet,
      allow_counter_bets: false,
      hide_bets_history: hideBetsHistory,
      hide_places: hidePlaces,
      no_view_cargo_price: noViewCargoPrice,
      hide_points_address_and_contacts: hidePointsAddressAndContacts,
      is_bidder: isBidder,
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
        bet: isBidder,
        last_bet: isBidder ? currentNoVat : null,
        last_bet_with_vat: isBidder ? current : null,
        win: statusMobile === AuctionListItemTradingStatusMobile.Winner,
      },
      settings: {
        prolong_after_bet: 5,
        winner_confirm: 30,
        transmission_time_in: 24,
      },
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
    routes: [
      {
        row_num: 1,
        op_type: OperationType.Loading,
        start_date: loadDateTime,
        end_date: `${cargoDate}T12:00:00Z`,
        comment: null,
        contractor: 'ООО Склад Погрузки',
        contractor_inn: '7701111222',
        location: {
          city_name: loadCity,
          city_full_name: `г. ${loadCity}`,
          city_gc_id: 1000 + index,
          loading_address: loadAddress,
        },
        cargo: {
          name: `Груз ${index + 1}`,
          weight: weight.toFixed(3),
          volume: volume.toFixed(3),
        },
        contact: {
          name: 'Диспетчер погрузки',
          phone: '+79007654321',
        },
      },
      {
        row_num: 2,
        op_type: OperationType.Unloading,
        start_date: unloadDateTime,
        end_date: `${cargoDate}T22:00:00Z`,
        comment: null,
        contractor: 'ООО Склад Выгрузки',
        contractor_inn: '7703333444',
        location: {
          city_name: unloadCity,
          city_full_name: `г. ${unloadCity}`,
          city_gc_id: 2000 + index,
          loading_address: unloadAddress,
        },
        cargo: {
          name: `Груз ${index + 1}`,
          weight: weight.toFixed(3),
          volume: volume.toFixed(3),
        },
        contact: {
          name: 'Диспетчер выгрузки',
          phone: '+79007654322',
        },
      },
    ],
    admitted_organizations: [],
    hide_bets_history: hideBetsHistory,
  }

  if (index === SEED_FLAG_WINNER_BET) {
    detail.trading.status_mobile = TradingStatus.Winner
    detail.trading.your = {
      bet: true,
      last_bet: currentNoVat,
      last_bet_with_vat: current,
      win: true,
    }
    if (listItem.trading) {
      listItem.trading.status_mobile =
        AuctionListItemTradingStatusMobile.Winner
      listItem.trading.is_bidder = true
      listItem.trading.your = { bet: true, last_bet: current }
    }
  }

  return {
    listItem,
    detail,
    bets,
    nextBetId,
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
