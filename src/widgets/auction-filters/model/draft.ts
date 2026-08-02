import { AuctionType, TradingStatus } from '@/entities/auction'

export const BODY_TYPE_OPTIONS = ['Реф', 'Тент', 'Изотерм'] as const

export const FILTER_SORT_FIELDS = [
  'stop_time',
  'price_per_km',
  'current_price',
] as const
export type FilterSortField = (typeof FILTER_SORT_FIELDS)[number]

export const FILTER_SORT_DIRS = ['asc', 'desc'] as const
export type FilterSortDir = (typeof FILTER_SORT_DIRS)[number]

export const TRADING_STATUS_OPTIONS = [
  TradingStatus.NotParticipating,
  TradingStatus.Leading,
  TradingStatus.Losing,
  TradingStatus.Winner,
  TradingStatus.Confirmed,
  TradingStatus.OnPending,
  TradingStatus.ChoosingWinner,
  TradingStatus.Accepted,
] as const

export const AUC_TYPE_OPTIONS = [
  AuctionType.Request,
  AuctionType.Up,
  AuctionType.Down,
  AuctionType.FixPrice,
] as const

export const AUCTION_STATUS_OPTIONS = [
  { id: 1, label: 'Планирование' },
  { id: 2, label: 'Торги' },
  { id: 3, label: 'Определение победителя' },
  { id: 4, label: 'Ожидание сделки' },
  { id: 5, label: 'В работе' },
  { id: 6, label: 'Завершён' },
  { id: 7, label: 'Остановлен' },
] as const

export const TRADING_STATUS_LABELS: Record<string, string> = {
  NotParticipating: 'Не участвует',
  Leading: 'Лидирует',
  Losing: 'Перебит',
  Winner: 'Победитель',
  Confirmed: 'Подтверждён',
  OnPending: 'На проверке',
  ChoosingWinner: 'Выбор победителя',
  Accepted: 'Принят',
  Unknown: 'Неизвестно',
}

export const AUC_TYPE_LABELS: Record<string, string> = {
  Request: 'Заявочный',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
}

export const SORT_FIELD_LABELS: Record<FilterSortField, string> = {
  stop_time: 'Окончание торгов',
  price_per_km: 'Цена за км',
  current_price: 'Текущая цена',
}

export type FiltersDraft = {
  cargo_num?: string
  status?: string[]
  statuses?: number[]
  auc_type?: string[]
  load_city?: string
  unload_city?: string
  load_date_from?: string
  load_date_to?: string
  is_available?: boolean
  is_bidder?: boolean
  current_price_from?: number
  current_price_to?: number
  body_types?: string[]
  price_per_km_from?: number
  price_per_km_to?: number
  stop_time_from?: string
  stop_time_to?: string
  sort_field?: FilterSortField
  sort_dir?: FilterSortDir
}

export type FilterPresetId =
  | 'available'
  | 'my-active'
  | 'closing-soon'
  | 'body'

export const FILTER_PRESETS: {
  id: FilterPresetId
  label: string
}[] = [
  { id: 'available', label: 'Можно ставить' },
  { id: 'my-active', label: 'Мои активные' },
  { id: 'closing-soon', label: 'Скоро закроются' },
  { id: 'body', label: 'Под мой кузов' },
]

function pad2(value: number): string {
  return String(Math.trunc(Math.abs(value))).padStart(2, '0')
}

export function formatIsoOffset(date: Date): string {
  const offsetMin = -date.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMin)
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`
}

export function isoToDatetimeLocal(iso?: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

export function datetimeLocalToIso(value: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return formatIsoOffset(date)
}

export function cloneFiltersDraft(draft: FiltersDraft): FiltersDraft {
  return {
    ...draft,
    status: draft.status ? [...draft.status] : undefined,
    statuses: draft.statuses ? [...draft.statuses] : undefined,
    auc_type: draft.auc_type ? [...draft.auc_type] : undefined,
    body_types: draft.body_types ? [...draft.body_types] : undefined,
  }
}

export function toggleStringValue(
  values: string[] | undefined,
  value: string,
): string[] | undefined {
  const current = values ?? []
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]
  return next.length > 0 ? next : undefined
}

export function toggleNumberValue(
  values: number[] | undefined,
  value: number,
): number[] | undefined {
  const current = values ?? []
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]
  return next.length > 0 ? next : undefined
}

const MY_ACTIVE_STATUSES = [
  TradingStatus.Leading,
  TradingStatus.Losing,
] as const

function hasAllStatuses(
  values: string[] | undefined,
  required: readonly string[],
): boolean {
  if (!values || values.length < required.length) return false
  return required.every((status) => values.includes(status))
}

function removeStatuses(
  values: string[] | undefined,
  remove: readonly string[],
): string[] | undefined {
  if (!values) return undefined
  const next = values.filter((status) => !remove.includes(status))
  return next.length > 0 ? next : undefined
}

export function isFilterPresetActive(
  draft: FiltersDraft,
  presetId: FilterPresetId,
): boolean {
  switch (presetId) {
    case 'available':
      return draft.is_available === true
    case 'my-active':
      return (
        draft.is_bidder === true &&
        hasAllStatuses(draft.status, MY_ACTIVE_STATUSES)
      )
    case 'closing-soon':
      return (
        draft.sort_field === 'stop_time' &&
        draft.sort_dir === 'asc' &&
        Boolean(draft.stop_time_from) &&
        Boolean(draft.stop_time_to)
      )
    case 'body':
      return (draft.body_types?.length ?? 0) > 0
  }
}

export function applyFilterPreset(
  draft: FiltersDraft,
  presetId: Exclude<FilterPresetId, 'body'>,
): FiltersDraft {
  switch (presetId) {
    case 'available':
      return { ...draft, is_available: true }
    case 'my-active':
      return {
        ...draft,
        is_bidder: true,
        status: [...MY_ACTIVE_STATUSES],
      }
    case 'closing-soon': {
      const from = new Date()
      const to = new Date(from.getTime() + 24 * 60 * 60 * 1000)
      return {
        ...draft,
        stop_time_from: formatIsoOffset(from),
        stop_time_to: formatIsoOffset(to),
        sort_field: 'stop_time',
        sort_dir: 'asc',
      }
    }
  }
}

export function clearFilterPreset(
  draft: FiltersDraft,
  presetId: FilterPresetId,
): FiltersDraft {
  switch (presetId) {
    case 'available':
      return { ...draft, is_available: undefined }
    case 'my-active':
      return {
        ...draft,
        is_bidder: undefined,
        status: removeStatuses(draft.status, MY_ACTIVE_STATUSES),
      }
    case 'closing-soon':
      return {
        ...draft,
        stop_time_from: undefined,
        stop_time_to: undefined,
        sort_field: undefined,
        sort_dir: undefined,
      }
    case 'body':
      return { ...draft, body_types: undefined }
  }
}

export function toggleFilterPreset(
  draft: FiltersDraft,
  presetId: Exclude<FilterPresetId, 'body'>,
): FiltersDraft {
  return isFilterPresetActive(draft, presetId)
    ? clearFilterPreset(draft, presetId)
    : applyFilterPreset(draft, presetId)
}
