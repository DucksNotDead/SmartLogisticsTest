import { z } from 'zod'

import { AuctionType, TradingStatus } from '@/entities/auction'

export const DEFAULT_PAGE = 1
export const DEFAULT_PER_PAGE = 20
export const PER_PAGE_OPTIONS = [5, 10, 15, 20] as const

export type PerPageOption = (typeof PER_PAGE_OPTIONS)[number]

export const SORT_FIELDS = ['stop_time', 'price_per_km', 'current_price'] as const
export type SortField = (typeof SORT_FIELDS)[number]

export const SORT_DIRS = ['asc', 'desc'] as const
export type SortDir = (typeof SORT_DIRS)[number]

export const TRADING_STATUS_VALUES = Object.values(TradingStatus)
/** Request filter enum: without `Unknown` (OpenAPI list filter). */
export const AUC_TYPE_VALUES = [
  AuctionType.Request,
  AuctionType.Up,
  AuctionType.Down,
  AuctionType.FixPrice,
] as const
export const AUCTION_STATUS_IDS = [1, 2, 3, 4, 5, 6, 7] as const

const ISO_DATE_TIME_OFFSET =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)$/

const perPageSchema = z.coerce
  .number()
  .int()
  .refine(
    (value): value is PerPageOption =>
      (PER_PAGE_OPTIONS as readonly number[]).includes(value),
  )
  .catch(DEFAULT_PER_PAGE)

function toArrayInput(value: unknown): unknown[] | undefined {
  if (value == null || value === '') return undefined
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    if (trimmed.startsWith('[')) {
      try {
        const parsed: unknown = JSON.parse(trimmed)
        return Array.isArray(parsed) ? parsed : undefined
      } catch {
        return undefined
      }
    }
    return trimmed.includes(',')
      ? trimmed.split(',').map((part) => part.trim())
      : [trimmed]
  }
  return [value]
}

function stringEnumArraySchema<T extends string>(allowed: readonly T[]) {
  const allowedSet = new Set<string>(allowed)
  const itemSchema = z.enum(allowed as [T, ...T[]])

  return z
    .preprocess((value) => {
      const raw = toArrayInput(value)
      if (!raw) return undefined
      const filtered = raw
        .map((item) => (typeof item === 'string' ? item : String(item)))
        .filter((item) => allowedSet.has(item))
      return filtered.length > 0 ? filtered : undefined
    }, z.array(itemSchema).optional())
    .catch(undefined)
}

function numberIdArraySchema(allowed: readonly number[]) {
  const allowedSet = new Set(allowed)

  return z
    .preprocess((value) => {
      const raw = toArrayInput(value)
      if (!raw) return undefined
      const filtered = raw
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && allowedSet.has(item))
      return filtered.length > 0 ? filtered : undefined
    }, z.array(z.number().int()).optional())
    .catch(undefined)
}

function stringArraySchema() {
  return z
    .preprocess((value) => {
      const raw = toArrayInput(value)
      if (!raw) return undefined
      const filtered = raw
        .map((item) => String(item).trim())
        .filter((item) => item.length > 0)
      return filtered.length > 0 ? filtered : undefined
    }, z.array(z.string().min(1)).optional())
    .catch(undefined)
}

const optionalTrimmedStringSchema = z
  .preprocess((value) => {
    if (value == null || value === '') return undefined
    const text = String(value).trim()
    return text.length > 0 ? text : undefined
  }, z.string().min(1).optional())
  .catch(undefined)

const optionalIsoDateTimeSchema = z
  .preprocess((value) => {
    if (value == null || value === '') return undefined
    return typeof value === 'string' ? value : String(value)
  }, z.string().regex(ISO_DATE_TIME_OFFSET).optional())
  .catch(undefined)

const optionalNumberSchema = z
  .preprocess((value) => {
    if (value == null || value === '') return undefined
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : undefined
    }
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return undefined
      const parsed = Number(trimmed)
      return Number.isFinite(parsed) ? parsed : undefined
    }
    return undefined
  }, z.number().finite().optional())
  .catch(undefined)

const optionalBooleanSchema = z
  .preprocess((value) => {
    if (value == null || value === '') return undefined
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return true
    }
    if (value === false || value === 'false' || value === 0 || value === '0') {
      return false
    }
    return undefined
  }, z.boolean().optional())
  .catch(undefined)

export const auctionListSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(DEFAULT_PAGE),
  per_page: perPageSchema,

  cargo_num: optionalTrimmedStringSchema,
  status: stringEnumArraySchema(TRADING_STATUS_VALUES),
  statuses: numberIdArraySchema(AUCTION_STATUS_IDS),
  auc_type: stringEnumArraySchema(AUC_TYPE_VALUES),
  load_city: optionalTrimmedStringSchema,
  unload_city: optionalTrimmedStringSchema,
  load_date_from: optionalIsoDateTimeSchema,
  load_date_to: optionalIsoDateTimeSchema,
  is_available: optionalBooleanSchema,
  is_bidder: optionalBooleanSchema,
  current_price_from: optionalNumberSchema,
  current_price_to: optionalNumberSchema,

  body_types: stringArraySchema(),
  price_per_km_from: optionalNumberSchema,
  price_per_km_to: optionalNumberSchema,
  stop_time_from: optionalIsoDateTimeSchema,
  stop_time_to: optionalIsoDateTimeSchema,
  sort_field: z.enum(SORT_FIELDS).optional().catch(undefined),
  sort_dir: z.enum(SORT_DIRS).optional().catch(undefined),
})

export type AuctionListSearch = z.infer<typeof auctionListSearchSchema>

export function parseAuctionListSearch(
  search: Record<string, unknown>,
): AuctionListSearch {
  return auctionListSearchSchema.parse(search)
}

export function createDefaultAuctionListSearch(
  overrides?: Partial<Pick<AuctionListSearch, 'page' | 'per_page'>>,
): AuctionListSearch {
  return auctionListSearchSchema.parse({
    page: overrides?.page ?? DEFAULT_PAGE,
    per_page: overrides?.per_page ?? DEFAULT_PER_PAGE,
  })
}

export function hasActiveFilters(search: AuctionListSearch): boolean {
  return (
    search.cargo_num != null ||
    (search.status?.length ?? 0) > 0 ||
    (search.statuses?.length ?? 0) > 0 ||
    (search.auc_type?.length ?? 0) > 0 ||
    search.load_city != null ||
    search.unload_city != null ||
    search.load_date_from != null ||
    search.load_date_to != null ||
    search.is_available === true ||
    search.is_bidder === true ||
    search.current_price_from != null ||
    search.current_price_to != null ||
    (search.body_types?.length ?? 0) > 0 ||
    search.price_per_km_from != null ||
    search.price_per_km_to != null ||
    search.stop_time_from != null ||
    search.stop_time_to != null ||
    search.sort_field != null
  )
}
