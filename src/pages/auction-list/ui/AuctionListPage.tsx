import { useSearch } from '@tanstack/react-router'

import { useListAuctions } from '@/entities/auction'

import { useCompactHeaderTitle } from '../lib/use-compact-header-title'
import { useExpandPaginationOnListEnd } from '../lib/use-expand-pagination-on-list-end'
import { AuctionListEmpty } from './AuctionListEmpty'
import { AuctionListError } from './AuctionListError'
import { AuctionListItem } from './AuctionListItem'
import { AuctionListPagination } from './AuctionListPagination'
import { AuctionListSkeleton } from './AuctionListSkeleton'

export function AuctionListPage() {
  const { page, per_page } = useSearch({ from: '/auctions' })
  const listQuery = useListAuctions({ page, per_page })
  const headingRef = useCompactHeaderTitle('Аукционы')

  const items = listQuery.data?.data ?? []
  const meta = listQuery.data?.meta
  const lastPage = meta?.last_page ?? 1
  const total = meta?.total ?? 0
  const showPagination = listQuery.isSuccess
  const showList = listQuery.isSuccess && items.length > 0
  const { listEndSentinelRef, expanded, setExpanded } =
    useExpandPaginationOnListEnd(showList)

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 pb-2">
      <header className="flex flex-col gap-1">
        <h1
          ref={headingRef}
          className="text-2xl font-semibold tracking-tight"
        >
          Аукционы
        </h1>
        <p className="text-sm text-muted-foreground">
          Список грузовых аукционов
        </p>
      </header>

      {listQuery.isPending ? <AuctionListSkeleton /> : null}

      {listQuery.isError ? (
        <AuctionListError onRetry={() => void listQuery.refetch()} />
      ) : null}

      {listQuery.isSuccess && items.length === 0 ? <AuctionListEmpty /> : null}

      {showList ? (
        <ul className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.main?.order_uid ?? `item-${index}`} className="min-w-0">
              <AuctionListItem item={item} />
            </li>
          ))}
        </ul>
      ) : null}

      {showList ? (
        <div
          ref={listEndSentinelRef}
          data-list-end
          className="h-px w-full shrink-0"
          aria-hidden
        />
      ) : null}

      {showPagination ? (
        <AuctionListPagination
          page={page}
          perPage={per_page}
          lastPage={lastPage}
          total={total}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />
      ) : null}
    </div>
  )
}
