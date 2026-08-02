import type { AuctionListItem } from '@/shared/api/generated/schemas/auctionListItem'
import type { AuctionListRequest } from '@/shared/api/generated/schemas/auctionListRequest'

/** Auction status id (1–7) → list `trading.status` string. */
const AUCTION_STATUS_BY_ID: Record<number, string> = {
  1: 'Planning',
  2: 'Auction',
  3: 'DeterminateWinner',
  4: 'WaitDeal',
  5: 'InProgress',
  6: 'Finished',
  7: 'Stopped',
}

function parseTime(value: string | null | undefined): number | null {
  if (!value) return null
  const time = Date.parse(value)
  return Number.isFinite(time) ? time : null
}

function includesCaseInsensitive(haystack: string, needle: string): boolean {
  return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase())
}

function matchesFilters(
  item: AuctionListItem,
  request: AuctionListRequest,
): boolean {
  if (request.cargo_num) {
    const cargoNum = item.main?.cargo_num ?? ''
    if (!includesCaseInsensitive(cargoNum, request.cargo_num)) return false
  }

  if (request.status && request.status.length > 0) {
    const statusMobile = item.trading?.status_mobile
    if (
      !statusMobile ||
      !request.status.some((allowed) => allowed === statusMobile)
    ) {
      return false
    }
  }

  if (request.statuses && request.statuses.length > 0) {
    const allowed = new Set(
      request.statuses
        .map((id) => AUCTION_STATUS_BY_ID[id])
        .filter((name): name is string => name != null),
    )
    const status = item.trading?.status
    if (!status || !allowed.has(status)) return false
  }

  if (request.auc_type && request.auc_type.length > 0) {
    const aucType = item.main?.auc_type
    if (
      !aucType ||
      !request.auc_type.some((allowed) => allowed === aucType)
    ) {
      return false
    }
  }

  if (request.load_city) {
    if (item.route?.load?.city !== request.load_city) return false
  }

  if (request.unload_city) {
    if (item.route?.unload?.city !== request.unload_city) return false
  }

  if (request.body_types && request.body_types.length > 0) {
    const bodyType = item.cargo?.body_type
    if (!bodyType || !request.body_types.includes(bodyType)) return false
  }

  if (request.is_available === true && item.trading?.is_available !== true) {
    return false
  }

  if (request.is_bidder === true && item.trading?.is_bidder !== true) {
    return false
  }

  const currentPrice = item.trading?.price?.current
  if (request.current_price_from != null) {
    if (currentPrice == null || currentPrice < request.current_price_from) {
      return false
    }
  }
  if (request.current_price_to != null) {
    if (currentPrice == null || currentPrice > request.current_price_to) {
      return false
    }
  }

  const pricePerKm = item.main?.price_per_km
  if (request.price_per_km_from != null) {
    if (pricePerKm == null || pricePerKm < request.price_per_km_from) {
      return false
    }
  }
  if (request.price_per_km_to != null) {
    if (pricePerKm == null || pricePerKm > request.price_per_km_to) {
      return false
    }
  }

  const loadDate = parseTime(item.route?.load?.date)
  if (request.load_date_from) {
    const from = parseTime(request.load_date_from)
    if (from != null && (loadDate == null || loadDate < from)) return false
  }
  if (request.load_date_to) {
    const to = parseTime(request.load_date_to)
    if (to != null && (loadDate == null || loadDate > to)) return false
  }

  const stopTime = parseTime(item.trading?.stop_time)
  if (request.stop_time_from) {
    const from = parseTime(request.stop_time_from)
    if (from != null && (stopTime == null || stopTime < from)) return false
  }
  if (request.stop_time_to) {
    const to = parseTime(request.stop_time_to)
    if (to != null && (stopTime == null || stopTime > to)) return false
  }

  return true
}

export function filterListItems(
  items: AuctionListItem[],
  request: AuctionListRequest | undefined,
): AuctionListItem[] {
  if (!request) return items
  return items.filter((item) => matchesFilters(item, request))
}

function getSortValue(
  item: AuctionListItem,
  field: string,
): number | null {
  switch (field) {
    case 'stop_time':
      return parseTime(item.trading?.stop_time)
    case 'price_per_km':
      return item.main?.price_per_km ?? null
    case 'current_price':
      return item.trading?.price?.current ?? null
    default:
      return null
  }
}

export function sortListItems(
  items: AuctionListItem[],
  request: AuctionListRequest | undefined,
): AuctionListItem[] {
  const sort = request?.sort
  if (!sort || typeof sort !== 'object') return items

  const entry = Object.entries(sort).find(
    ([, direction]) => direction === 'asc' || direction === 'desc',
  )
  if (!entry) return items

  const [field, direction] = entry
  const multiplier = direction === 'asc' ? 1 : -1

  return [...items].sort((left, right) => {
    const leftValue = getSortValue(left, field)
    const rightValue = getSortValue(right, field)

    if (leftValue == null && rightValue == null) return 0
    if (leftValue == null) return 1
    if (rightValue == null) return -1
    if (leftValue === rightValue) return 0
    return leftValue < rightValue ? -1 * multiplier : 1 * multiplier
  })
}
