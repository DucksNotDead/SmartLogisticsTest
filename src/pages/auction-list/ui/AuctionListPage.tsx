import { useNavigate, useSearch } from '@tanstack/react-router'

import { useListAuctions } from '@/entities/auction'
import {
  FiltersDrawer,
  FiltersToolbar,
  useFiltersUiStore,
  type FiltersDraft,
} from '@/widgets/auction-filters'

import { useCompactHeaderTitle } from '../lib/use-compact-header-title'
import { useLockScrollWhile } from '../lib/use-lock-scroll-while'
import {
  createDefaultAuctionListSearch,
  hasActiveFilters,
  parseAuctionListSearch,
  type AuctionListSearch,
} from '../model/search'
import { toListRequest } from '@/pages/auction-list'
import { AuctionListBottomNav } from './AuctionListBottomNav'
import { AuctionListEmpty } from './AuctionListEmpty'
import { AuctionListError } from './AuctionListError'
import { AuctionListItem } from './AuctionListItem'
import { AuctionListPagination } from './AuctionListPagination'
import { AuctionListSkeleton } from './AuctionListSkeleton'

function toFiltersDraft(search: AuctionListSearch): FiltersDraft {
  return {
    cargo_num: search.cargo_num,
    status: search.status,
    statuses: search.statuses,
    auc_type: search.auc_type,
    load_city: search.load_city,
    unload_city: search.unload_city,
    load_date_from: search.load_date_from,
    load_date_to: search.load_date_to,
    is_available: search.is_available,
    is_bidder: search.is_bidder,
    current_price_from: search.current_price_from,
    current_price_to: search.current_price_to,
    body_types: search.body_types,
    price_per_km_from: search.price_per_km_from,
    price_per_km_to: search.price_per_km_to,
    stop_time_from: search.stop_time_from,
    stop_time_to: search.stop_time_to,
    sort_field: search.sort_field,
    sort_dir: search.sort_dir,
  }
}

export function AuctionListPage() {
  const search = useSearch({ from: '/auctions' })
  const navigate = useNavigate({ from: '/auctions' })
  const closeFilters = useFiltersUiStore((state) => state.closeFilters)
  const { page, per_page } = search
  const listQuery = useListAuctions(toListRequest(search))
  const headingRef = useCompactHeaderTitle('Аукционы')
  useLockScrollWhile(listQuery.isPending)
  const filtersActive = hasActiveFilters(search)
  const appliedFilters = toFiltersDraft(search)

  const items = listQuery.data?.data ?? []
  const meta = listQuery.data?.meta
  const lastPage = meta?.last_page ?? 1
  const total = meta?.total ?? 0
  const showPagination = listQuery.isSuccess
  const showList = listQuery.isSuccess && items.length > 0

  const handleResetFilters = () => {
    void navigate({
      search: createDefaultAuctionListSearch({ per_page }),
    })
    closeFilters()
  }

  const handleSaveFilters = (draft: FiltersDraft) => {
    void navigate({
      search: parseAuctionListSearch({
        ...draft,
        page: 1,
        per_page,
      }),
    })
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 pb-2">
      <header className="min-w-0">
        <div className="flex min-w-0 flex-col gap-1">
          <h1
            ref={headingRef}
            className="text-2xl font-semibold tracking-tight"
          >
            Аукционы
          </h1>
          <p className="text-sm text-muted-foreground">
            Список грузовых аукционов
          </p>
        </div>
      </header>

      <FiltersDrawer applied={appliedFilters} onSave={handleSaveFilters} />

      {listQuery.isPending ? <AuctionListSkeleton /> : null}

      {listQuery.isError ? (
        <AuctionListError onRetry={() => void listQuery.refetch()} />
      ) : null}

      {listQuery.isSuccess && items.length === 0 ? (
        <AuctionListEmpty />
      ) : null}

      {showList ? (
        <ul className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
          {items.map((item, index) => (
            <li
              key={item.main?.order_uid ?? `item-${index}`}
              className="min-w-0"
            >
              <AuctionListItem item={item} />
            </li>
          ))}
        </ul>
      ) : null}

      {showList ? (
        <AuctionListBottomNav
          page={page}
          perPage={per_page}
          lastPage={lastPage}
        />
      ) : null}

      {showPagination ? (
        <AuctionListPagination
          page={page}
          perPage={per_page}
          lastPage={lastPage}
          total={total}
          filtersSlot={
            <FiltersToolbar
              hasActiveFilters={filtersActive}
              onReset={handleResetFilters}
            />
          }
          desktopFiltersSlot={
            <FiltersToolbar
              hasActiveFilters={filtersActive}
              onReset={handleResetFilters}
            />
          }
        />
      ) : (
        <div className="sticky bottom-0 z-10 -mx-4 flex px-5 py-3 md:-mx-6 md:px-6">
          <FiltersToolbar
            hasActiveFilters={filtersActive}
            onReset={handleResetFilters}
          />
        </div>
      )}
    </div>
  )
}
