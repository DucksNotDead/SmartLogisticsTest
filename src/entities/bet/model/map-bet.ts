import type { BetItem, BetListResponse } from '../api/bets'

export type NullablePrice = number | null

export type BetViewModel = {
  id: number | null
  createdAt: string | null
  priceWithVat: NullablePrice
  priceNoVat: NullablePrice
  carrierName: string | null
  organizationInn: string | null
  place: number | null
  isWin: boolean
  isRejected: boolean
  /** null when cancel reason is empty / absent */
  cancelReason: string | null
  contactName: string | null
  contactPhone: string | null
  isCounter: boolean
}

export type BetListViewModel = {
  bets: BetViewModel[]
  participantsCount: number
}

function nullableNumber(value: number | null | undefined): NullablePrice {
  return value ?? null
}

function nullableString(value: string | null | undefined): string | null {
  if (value == null || value === '') return null
  return value
}

function resolvePrice(
  root: number | null | undefined,
  fromInfo: number | null | undefined,
): NullablePrice {
  if (root != null) return root
  return nullableNumber(fromInfo)
}

function resolveCarrierName(item: BetItem): string | null {
  const orgName = nullableString(item.organization_name)
  if (orgName) return orgName
  return nullableString(item.contact_name)
}

function participantKey(item: BetItem): string | null {
  if (item.organization_id != null) return `org:${item.organization_id}`
  if (item.subscriber_id != null) return `sub:${item.subscriber_id}`
  return null
}

/**
 * Maps OpenAPI `BetItem` → bet ViewModel.
 * Prices fall back to `price_info` when root fields are absent.
 */
export function mapBetItem(item: BetItem): BetViewModel {
  return {
    id: item.id ?? null,
    createdAt: nullableString(item.created_at),
    priceWithVat: resolvePrice(
      item.price_with_vat,
      item.price_info?.price_with_vat,
    ),
    priceNoVat: resolvePrice(item.price_no_vat, item.price_info?.price_no_vat),
    carrierName: resolveCarrierName(item),
    organizationInn: nullableString(item.organization_inn),
    place: nullableNumber(item.place),
    isWin: Boolean(item.is_win),
    isRejected: Boolean(item.is_rejected),
    cancelReason: nullableString(item.cancel_reason),
    contactName: nullableString(item.contact_name),
    contactPhone: nullableString(item.contact_phone),
    isCounter: Boolean(item.is_counter),
  }
}

/**
 * Maps `BetListResponse` → list VM with derived participants count
 * (unique `organization_id`, fallback `subscriber_id`).
 */
export function mapBetList(response: BetListResponse): BetListViewModel {
  const bets = (response.bets ?? []).map(mapBetItem)
  const keys = new Set<string>()
  for (const item of response.bets ?? []) {
    const key = participantKey(item)
    if (key) keys.add(key)
  }
  return {
    bets,
    participantsCount: keys.size,
  }
}
