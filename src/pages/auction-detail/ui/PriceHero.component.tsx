import type { AuctionDetailViewModel, NullablePrice } from '@/entities/auction'
import { Button } from '@/shared/ui/button'

import { formatPrice } from '../lib/format'
import { labelOf, MOBILE_STATUS_LABEL, STATUS_LABEL } from '../lib/labels'

type PriceHeroProps = {
  detail: AuctionDetailViewModel
}

function PriceWithNoVat({
  value,
  noVat,
  className,
}: {
  value: NullablePrice
  noVat: NullablePrice
  className?: string
}) {
  return (
    <div className={className}>
      <p className="font-medium text-foreground tabular-nums">
        {formatPrice(value)}
      </p>
      {noVat != null ? (
        <p className="mt-0.5 font-normal text-muted-foreground tabular-nums">
          без НДС {formatPrice(noVat)}
        </p>
      ) : null}
    </div>
  )
}

export function PriceHero({ detail }: PriceHeroProps) {
  const { prices, your, canSetBet, status, statusMobile } = detail.trading

  return (
    <section
      className="min-w-0 rounded-xl border border-border bg-secondary/40 px-4 py-5 md:px-6 md:py-6"
      data-can_set_bet={canSetBet}
      aria-label="Цены и статус торгов"
    >
      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Текущая цена
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
            {formatPrice(prices.current)}
          </p>
          {prices.currentNoVat != null ? (
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              без НДС {formatPrice(prices.currentNoVat)}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 md:text-right">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Доступная ставка
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-accent md:text-2xl">
            {formatPrice(prices.available)}
          </p>
          {prices.availableNoVat != null ? (
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              без НДС {formatPrice(prices.availableNoVat)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">Статус: </span>
          <span className="font-medium">
            {labelOf(STATUS_LABEL, status)}
          </span>
        </p>
        <p>
          <span className="text-muted-foreground">Ваш статус: </span>
          <span className="font-medium">
            {labelOf(MOBILE_STATUS_LABEL, statusMobile)}
          </span>
        </p>
      </div>

      <div className="mt-4 flex min-w-0 flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm">
          <p className="text-muted-foreground">Ваша ставка</p>
          {your.bet ? (
            <p className="mt-0.5 font-medium tabular-nums">
              {formatPrice(your.lastBetWithVat ?? your.lastBet)}
              {your.win ? (
                <span className="ml-2 text-accent">Победа</span>
              ) : null}
            </p>
          ) : (
            <p className="mt-0.5 font-medium">Нет ставки</p>
          )}
        </div>

        {canSetBet ? (
          <p className="text-sm font-medium text-foreground">
            Можно сделать ставку
          </p>
        ) : (
          <Button type="button" disabled variant="secondary">
            Ставка недоступна
          </Button>
        )}
      </div>

      <dl className="mt-4 grid min-w-0 grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-4">
        <div>
          <dt>Мин.</dt>
          <dd className="mt-0.5">
            <PriceWithNoVat value={prices.min} noVat={prices.minNoVat} />
          </dd>
        </div>
        <div>
          <dt>Макс.</dt>
          <dd className="mt-0.5">
            <PriceWithNoVat value={prices.max} noVat={prices.maxNoVat} />
          </dd>
        </div>
        <div>
          <dt>Шаг</dt>
          <dd className="mt-0.5">
            <PriceWithNoVat value={prices.step} noVat={prices.stepNoVat} />
          </dd>
        </div>
        <div>
          <dt>₽/км</dt>
          <dd className="mt-0.5 font-medium text-foreground tabular-nums">
            {formatPrice(prices.pricePerKm)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
