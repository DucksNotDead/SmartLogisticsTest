import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

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

function CargoBadge({ children }: { children: string }) {
  return (
    <span
      data-badge
      className="inline-flex max-w-full truncate rounded-md border border-border/70 bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
    >
      {children}
    </span>
  )
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
  const hasOwnBet = item.trading?.your?.bet === true

  const cargoBadges = [
    cargoName,
    weight != null ? `${weight} т` : null,
    volume != null ? `${volume} м³` : null,
    bodyType,
  ].filter((value): value is string => Boolean(value))

  const prefetchDetail = () => {
    if (!uuid) return
    void queryClient.prefetchQuery(getGetAuctionQueryOptions(uuid))
  }

  const content = (
    <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="truncate text-base font-semibold">{cargoNum}</span>
          <span className="text-sm text-muted-foreground">
            {aucType ? (AUC_TYPE_LABEL[aucType] ?? aucType) : '—'}
          </span>
        </div>
        <p className="mt-1 truncate text-sm">
          {loadCity} → {unloadCity}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Погрузка {loadDate} · Выгрузка {unloadDate}
        </p>
        {cargoBadges.length > 0 ? (
          <div className="mt-2 flex min-w-0 flex-wrap gap-1.5">
            {cargoBadges.map((badge) => (
              <CargoBadge key={badge}>{badge}</CargoBadge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col gap-1 md:items-end">
        <p className="text-base font-semibold tabular-nums">
          {formatPrice(currentPrice)}
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {pricePerKm != null ? `${formatPrice(pricePerKm)} / км` : '₽/км —'}
        </p>
        <p className="text-xs text-muted-foreground">
          {status ? (STATUS_LABEL[status] ?? status) : '—'}
          {' · '}
          {mobileStatus
            ? (MOBILE_STATUS_LABEL[mobileStatus] ?? mobileStatus)
            : '—'}
        </p>
        <p className="text-xs font-medium">
          {hasOwnBet ? 'Моя ставка есть' : 'Моей ставки нет'}
        </p>
        <span className="mt-1 text-sm font-medium text-primary underline-offset-4 group-hover:underline">
          Смотреть
        </span>
      </div>
    </div>
  )

  if (!uuid) {
    return (
      <div className="min-w-0 rounded-lg border border-border px-4 py-3">
        {content}
      </div>
    )
  }

  return (
    <Link
      to="/auctions/$auctionUuid"
      params={{ auctionUuid: uuid }}
      className={cn(
        'group block min-w-0 rounded-lg border border-border px-4 py-3 transition-colors',
        'hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
      onMouseEnter={prefetchDetail}
      onFocus={prefetchDetail}
    >
      {content}
    </Link>
  )
}
