import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronRightIcon } from 'lucide-react'

import {
  getGetAuctionQueryOptions,
  type AuctionListItem as AuctionListItemDto,
} from '@/entities/auction'
import { cn } from '@/shared/lib'

const AUC_TYPE_LABEL: Record<string, string> = {
  Request: 'Заявочный',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
  Unknown: 'Неизвестно',
}

const STATUS_LABEL: Record<string, string> = {
  Planning: 'Планирование',
  Auction: 'Торги',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: 'Неизвестно',
}

const MOBILE_STATUS_LABEL: Record<string, string> = {
  NotParticipating: 'Не участвует',
  Leading: 'Лидирует',
  Losing: 'Перебит',
  Winner: 'Победитель',
  Confirmed: 'Подтверждён',
  OnPending: 'Ожидание',
  Unknown: 'Неизвестно',
}

/** Цветовой акцент бейджа личного статуса торгов — совпадает с семантикой BetCard (accent/destructive). */
const MOBILE_STATUS_TONE: Record<string, string> = {
  Leading: 'border-accent/40 bg-accent/10 text-accent',
  Winner: 'border-accent/40 bg-accent/10 text-accent',
  Confirmed: 'border-accent/40 bg-accent/10 text-accent',
  Losing: 'border-destructive/30 bg-destructive/5 text-destructive',
}

const DEFAULT_STATUS_TONE = 'border-border/70 bg-muted/50 text-muted-foreground'

function formatPrice(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

type AuctionListItemProps = {
  item: AuctionListItemDto
}

export function AuctionListItem({ item }: AuctionListItemProps) {
  const queryClient = useQueryClient()
  const uuid = item.main?.order_uid
  const cargoNum = item.main?.cargo_num ?? 'Без номера'
  const aucType = item.main?.auc_type
  const status = item.trading?.status
  const mobileStatus = item.trading?.status_mobile
  const loadCity = item.route?.load?.city ?? '—'
  const unloadCity = item.route?.unload?.city ?? '—'
  const loadDate = formatDate(item.route?.load?.date ?? item.main?.cargo_date)
  const unloadDate = formatDate(item.route?.unload?.date)
  const cargoName = item.cargo?.name
  const weight = item.cargo?.weight
  const volume = item.cargo?.volume
  const bodyType = item.cargo?.body_type
  const currentPrice = item.trading?.price?.current
  const pricePerKm = item.main?.price_per_km

  const cargoMeta = [
    cargoName,
    weight != null ? `${weight} т` : null,
    volume != null ? `${volume} м³` : null,
    bodyType,
  ]
    .filter((value): value is string => Boolean(value))
    .join(' · ')

  const statusLabel = mobileStatus
    ? (MOBILE_STATUS_LABEL[mobileStatus] ?? mobileStatus)
    : null
  const statusTone = mobileStatus
    ? (MOBILE_STATUS_TONE[mobileStatus] ?? DEFAULT_STATUS_TONE)
    : DEFAULT_STATUS_TONE
  // "Торги" — базовое активное состояние большинства карточек списка, не несёт
  // новой информации, поэтому не занимает место; остальные фазы жизненного
  // цикла аукциона показываем.
  const lifecycleLabel =
    status && status !== 'Auction' ? (STATUS_LABEL[status] ?? status) : null

  const prefetchDetail = () => {
    if (!uuid) return
    void queryClient.prefetchQuery(getGetAuctionQueryOptions(uuid))
  }

  const content = (
    <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-base font-semibold">{cargoNum}</span>
            <span className="shrink-0 text-sm text-muted-foreground">
              {aucType ? (AUC_TYPE_LABEL[aucType] ?? aucType) : '—'}
            </span>
          </div>
          {statusLabel ? (
            <span
              className={cn(
                'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium',
                statusTone,
              )}
            >
              {statusLabel}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 truncate text-sm">
          {loadCity} → {unloadCity}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Погрузка {loadDate} · Выгрузка {unloadDate}
        </p>
        {cargoMeta ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {cargoMeta}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 md:pl-4">
        <div className="text-right">
          <p className="text-base font-semibold tabular-nums">
            {formatPrice(currentPrice)}
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {pricePerKm != null ? `${formatPrice(pricePerKm)} / км` : '—'}
          </p>
          {lifecycleLabel ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {lifecycleLabel}
            </p>
          ) : null}
        </div>
        <ChevronRightIcon
          className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </div>
  )

  if (!uuid) {
    return (
      <div className="min-w-0 rounded-xl border border-border px-4 py-3">
        {content}
      </div>
    )
  }

  return (
    <Link
      to="/auctions/$auctionUuid"
      params={{ auctionUuid: uuid }}
      search={{ tab: 'info' }}
      className={cn(
        'group block min-w-0 rounded-xl border border-border px-4 py-3 transition-colors',
        'hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
      onMouseEnter={prefetchDetail}
      onFocus={prefetchDetail}
    >
      {content}
    </Link>
  )
}
