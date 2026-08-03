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
}

export function BetsTab({
  auctionUuid,
  hideBetsHistory,
  hidePlaces,
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

  if (hideBetsHistory) {
    return <BetsHidden />
  }

  if (query.isPending) {
    return <BetsTabSkeleton />
  }

  if (query.isError) {
    return (
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
    )
  }

  const list = mapBetList(query.data ?? { bets: [] })

  if (list.bets.length === 0) {
    return <BetsEmpty />
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-x-hidden" data-bets-state="success">
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
        {list.bets.map((bet) => (
          <li key={bet.id ?? `${bet.carrierName}-${bet.createdAt}`} className="min-w-0">
            <BetCard bet={bet} hidePlaces={hidePlaces} />
          </li>
        ))}
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
