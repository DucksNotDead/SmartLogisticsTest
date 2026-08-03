import type { BetViewModel } from '@/entities/bet'
import { cn } from '@/shared/lib'

import { formatDateTime, formatPrice } from '../lib/format'

type BetCardProps = {
  bet: BetViewModel
  hidePlaces: boolean
}

export function BetCard({ bet, hidePlaces }: BetCardProps) {
  const showPlace = !hidePlaces && bet.place != null

  return (
    <article
      className={cn(
        'min-w-0 overflow-hidden rounded-xl border border-border px-4 py-4',
        bet.isWin && 'border-accent/40 bg-accent/5',
        bet.isRejected && 'border-destructive/30 bg-destructive/5',
      )}
      data-bet-id={bet.id ?? undefined}
      data-is-win={bet.isWin || undefined}
      data-is-rejected={bet.isRejected || undefined}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Ставка с НДС
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums md:text-3xl">
            {formatPrice(bet.priceWithVat)}
          </p>
          {bet.priceNoVat != null ? (
            <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
              без НДС {formatPrice(bet.priceNoVat)}
            </p>
          ) : null}
        </div>

        {showPlace ? (
          <p
            className="shrink-0 rounded-lg bg-secondary px-2.5 py-1.5 text-center"
            data-place={bet.place}
          >
            <span className="block text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Место
            </span>
            <span className="block text-xl font-semibold tabular-nums leading-none">
              {bet.place}
            </span>
          </p>
        ) : null}
      </div>

      {(bet.isWin || bet.isRejected) && (
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2 text-sm font-medium">
          {bet.isWin ? (
            <span className="text-accent" data-status="win">
              Победитель
            </span>
          ) : null}
          {bet.isRejected ? (
            <span className="text-destructive" data-status="rejected">
              Отменена
            </span>
          ) : null}
        </div>
      )}

      {bet.isRejected && bet.cancelReason ? (
        <p
          className="mt-1 text-sm text-destructive/90"
          data-cancel-reason={bet.cancelReason}
        >
          {bet.cancelReason}
        </p>
      ) : null}

      <div className="mt-3 min-w-0 border-t border-border/70 pt-3">
        <p className="truncate text-sm font-medium" data-carrier>
          {bet.carrierName ?? 'Перевозчик не указан'}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatDateTime(bet.createdAt)}
        </p>
      </div>
    </article>
  )
}
