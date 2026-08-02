import type { AuctionListRequest } from '@/entities/auction'

import type { AuctionListSearch } from './search'

function assignIfDefined<K extends keyof AuctionListRequest>(
  target: AuctionListRequest,
  key: K,
  value: AuctionListRequest[K] | undefined,
): void {
  if (value !== undefined) {
    target[key] = value
  }
}

export function toListRequest(search: AuctionListSearch): AuctionListRequest {
  const request: AuctionListRequest = {
    page: search.page,
    per_page: search.per_page,
  }

  assignIfDefined(request, 'cargo_num', search.cargo_num)
  assignIfDefined(request, 'status', search.status)
  assignIfDefined(request, 'statuses', search.statuses)
  assignIfDefined(request, 'auc_type', search.auc_type)
  assignIfDefined(request, 'load_city', search.load_city)
  assignIfDefined(request, 'unload_city', search.unload_city)
  assignIfDefined(request, 'load_date_from', search.load_date_from)
  assignIfDefined(request, 'load_date_to', search.load_date_to)
  assignIfDefined(request, 'current_price_from', search.current_price_from)
  assignIfDefined(request, 'current_price_to', search.current_price_to)
  assignIfDefined(request, 'body_types', search.body_types)
  assignIfDefined(request, 'price_per_km_from', search.price_per_km_from)
  assignIfDefined(request, 'price_per_km_to', search.price_per_km_to)
  assignIfDefined(request, 'stop_time_from', search.stop_time_from)
  assignIfDefined(request, 'stop_time_to', search.stop_time_to)

  if (search.is_available === true) {
    request.is_available = true
  }
  if (search.is_bidder === true) {
    request.is_bidder = true
  }

  if (search.sort_field) {
    request.sort = {
      [search.sort_field]: search.sort_dir ?? 'asc',
    }
  }

  return request
}
