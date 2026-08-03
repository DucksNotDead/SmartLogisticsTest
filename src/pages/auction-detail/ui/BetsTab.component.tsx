import { mapBetList, useListBets } from '@/entities/bet'
import { Button } from '@/shared/ui/button'

import { BetCard } from './BetCard.component'
import { BetsEmpty } from './BetsEmpty.component'
import { BetsHidden } from './BetsHidden.component'
import { BetsTabSkeleton } from './BetsTabSkeleton.component'

type BetsTabProps = {
  auctionUuid: string
  hideBetsHistory: boolean
  hidePlaces: boolean
  canSetBet?: boolean
  onSetBet?: () => void
  /** Disable CTA while detail is loading / refetching. */
  setBetDisabled?: boolean
  highlightPrice?: number | null
}

export function BetsTab({
  auctionUuid,
  hideBetsHistory,
  hidePlaces,
  canSetBet = false,
  onSetBet,
  setBetDisabled = false,
  highlightPrice = null,
}: BetsTabProps) {
  const query = useListBets(
    auctionUuid,
    { all: true },
    {
      query: {
        enabled: !hideBetsHistory,
      },
    },
  )

  const betsLoading = !hideBetsHistory && (query.isPending || query.isFetching)
  const ctaDisabled = setBetDisabled || betsLoading || !onSetBet

  const cta = canSetBet ? (
    <div className="flex justify-end">
      <Button
        type="button"
        size="lg"
        className="rounded-xl font-semibold"
        disabled={ctaDisabled}
        onClick={onSetBet}
        data-set-bet-cta="bets"
      >
        Установить ставку
      </Button>
    </div>
  ) : null

  if (hideBetsHistory) {
    return (
      <div className="flex min-w-0 flex-col gap-4">
        {cta}
        <BetsHidden />
      </div>
    )
  }

  if (query.isPending) {
    return (
      <div className="flex min-w-0 flex-col gap-4">
        {cta}
        <BetsTabSkeleton />
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="flex min-w-0 flex-col gap-4">
        {cta}
        <div
          className="min-w-0 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-8 text-center"
          data-bets-state="error"
          role="alert"
        >
          <p className="text-sm font-medium text-destructive">
            Не удалось загрузить ставки
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Проверьте соединение и попробуйте снова.
          </p>
          <Button
            className="mt-4"
            type="button"
            variant="outline"
            onClick={() => {
              void query.refetch()
            }}
          >
            Повторить
          </Button>
        </div>
      </div>
    )
  }

  const list = mapBetList(query.data ?? { bets: [] })

  if (list.bets.length === 0) {
    return (
      <div className="flex min-w-0 flex-col gap-4">
        {cta}
        <BetsEmpty />
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-x-hidden" data-bets-state="success">
      {cta}
      <p
        className="text-sm text-muted-foreground"
        data-participants={list.participantsCount}
      >
        <span className="font-medium text-foreground tabular-nums">
          {list.participantsCount}
        </span>{' '}
        {participantsLabel(list.participantsCount)}
      </p>

      <ul className="flex min-w-0 list-none flex-col gap-3 p-0" data-bets-list>
        {list.bets.map((bet) => {
          const highlighted =
            highlightPrice != null &&
            bet.priceWithVat != null &&
            bet.priceWithVat === highlightPrice
          return (
            <li
              key={bet.id ?? `${bet.carrierName}-${bet.createdAt}`}
              className="min-w-0"
            >
              <BetCard
                bet={bet}
                hidePlaces={hidePlaces}
                highlighted={highlighted}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function participantsLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'участник'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return 'участника'
  }
  return 'участников'
}
