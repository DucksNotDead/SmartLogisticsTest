import { type ReactNode, useState } from 'react'
import { ChevronUpIcon } from 'lucide-react'

import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'

import { useAuctionListPagingActions } from '../lib/use-auction-list-paging-actions'
import { PER_PAGE_OPTIONS, type PerPageOption } from '../model/search'

type AuctionListPaginationProps = {
  page: number
  perPage: PerPageOption
  lastPage: number
  total: number
  /** Mobile: in one row with pagination summary/controls */
  filtersSlot?: ReactNode
  /** Desktop: after «На странице» control */
  desktopFiltersSlot?: ReactNode
}

function PaginationChip({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-full border border-border/60 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-md',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AuctionListPagination({
  page,
  perPage,
  lastPage,
  total,
  filtersSlot,
  desktopFiltersSlot,
}: AuctionListPaginationProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const { goTo, changePerPage } = useAuctionListPagingActions(perPage)
  const safeLastPage = Math.max(lastPage, 1)

  const handleSheetGoTo = (nextPage: number) => {
    goTo(nextPage)
    setSheetOpen(false)
  }

  const summaryLabel = `Стр. ${page} из ${safeLastPage} · ${perPage} на стр.`

  return (
    <>
      <nav
        className="sticky bottom-0 z-10 -mx-4 mt-2 flex items-center gap-2 px-5 py-3 md:-mx-6 md:px-6"
        aria-label="Пагинация списка аукционов"
      >
        {filtersSlot ? (
          <div className="flex shrink-0 items-center md:hidden">
            {filtersSlot}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 items-center">
          <button
            type="button"
            className="w-full md:hidden"
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            onClick={() => setSheetOpen(true)}
          >
            <PaginationChip className="inline-flex h-10 w-full items-center justify-between gap-2 px-4 py-0 text-left">
              <span className="truncate text-sm text-muted-foreground">
                {summaryLabel}
              </span>
              <ChevronUpIcon className="size-4 shrink-0 text-muted-foreground" />
            </PaginationChip>
          </button>

          <div className="hidden min-w-0 flex-1 flex-wrap items-center justify-between gap-2 md:flex">
            <div className="flex flex-wrap items-center gap-2 px-1">
              <PaginationChip className="flex h-12 items-center py-0">
                <p className="text-base text-muted-foreground">
                  Страница {page} из {safeLastPage} · всего {total}
                </p>
              </PaginationChip>
              <Select
                value={String(perPage)}
                onValueChange={(value) => {
                  changePerPage(Number(value) as PerPageOption)
                }}
              >
                <SelectTrigger
                  aria-labelledby="per-page-label"
                  className="h-12 min-w-36 gap-2 rounded-full border-border/60 bg-background/80 px-5 text-base shadow-sm backdrop-blur-md data-[size=default]:h-12 dark:bg-background/80"
                >
                  <span id="per-page-label" className="text-muted-foreground">
                    На странице
                  </span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="center">
                  {PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {desktopFiltersSlot}
            </div>
            <div className="flex flex-wrap items-center gap-2 px-1">
              <PaginationChip className="flex h-12 items-center p-0">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 rounded-full px-4"
                  disabled={page <= 1}
                  onClick={() => goTo(page - 1)}
                >
                  Назад
                </Button>
              </PaginationChip>
              <PaginationChip className="flex h-12 items-center p-0">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 rounded-full px-4"
                  disabled={page >= lastPage || lastPage <= 1}
                  onClick={() => goTo(page + 1)}
                >
                  Вперёд
                </Button>
              </PaginationChip>
            </div>
          </div>
        </div>
      </nav>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="gap-0 p-0">
          <SheetHeader className="border-b border-border pr-12">
            <SheetTitle>
              Страница {page} из {safeLastPage}
            </SheetTitle>
            <SheetDescription>Всего аукционов: {total}</SheetDescription>
          </SheetHeader>

          <div className="px-4 py-4">
            <Select
              value={String(perPage)}
              onValueChange={(value) => {
                changePerPage(Number(value) as PerPageOption)
              }}
            >
              <SelectTrigger
                aria-labelledby="sheet-per-page-label"
                className="h-12 w-full gap-2 rounded-xl px-4 text-base"
              >
                <span
                  id="sheet-per-page-label"
                  className="text-muted-foreground"
                >
                  На странице
                </span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="center">
                {PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SheetFooter className="flex-row border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 flex-1 rounded-xl"
              disabled={page <= 1}
              onClick={() => handleSheetGoTo(page - 1)}
            >
              Назад
            </Button>
            <Button
              type="button"
              size="lg"
              className="h-12 flex-1 rounded-xl"
              disabled={page >= lastPage || lastPage <= 1}
              onClick={() => handleSheetGoTo(page + 1)}
            >
              Вперёд
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
