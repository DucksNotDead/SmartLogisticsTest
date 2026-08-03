import { Button } from '@/shared/ui/button'

import { useAuctionListPagingActions } from '../lib/use-auction-list-paging-actions'
import type { PerPageOption } from '../model/search'

type AuctionListBottomNavProps = {
  page: number
  perPage: PerPageOption
  lastPage: number
}

/** Mobile-only: simple prev/next buttons right after the last list item. */
export function AuctionListBottomNav({
  page,
  perPage,
  lastPage,
}: AuctionListBottomNavProps) {
  const { goTo } = useAuctionListPagingActions(perPage)

  return (
    <div className="flex items-center gap-2 md:hidden">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11 flex-1 rounded-xl"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        Назад
      </Button>
      <Button
        type="button"
        size="lg"
        className="h-11 flex-1 rounded-xl"
        disabled={page >= lastPage || lastPage <= 1}
        onClick={() => goTo(page + 1)}
      >
        Вперёд
      </Button>
    </div>
  )
}
