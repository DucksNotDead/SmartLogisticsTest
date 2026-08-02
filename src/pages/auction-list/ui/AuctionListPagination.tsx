import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

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
  DEFAULT_PAGE,
  PER_PAGE_OPTIONS,
  type PerPageOption,
} from '../model/search'

type AuctionListPaginationProps = {
  page: number
  perPage: PerPageOption
  lastPage: number
  total: number
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
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
        'rounded-full border border-border/60 bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur-md',
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
  expanded,
  onExpandedChange,
}: AuctionListPaginationProps) {
  const navigate = useNavigate({ from: '/auctions' })
  const safeLastPage = Math.max(lastPage, 1)

  const goTo = (nextPage: number) => {
    void navigate({
      search: (prev) => ({ ...prev, page: nextPage, per_page: perPage }),
    })
  }

  const changePerPage = (nextPerPage: PerPageOption) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        page: DEFAULT_PAGE,
        per_page: nextPerPage,
      }),
    })
  }

  const summaryLabel = `Стр. ${page} из ${safeLastPage} · ${perPage} на стр.`

  return (
    <nav
      className="sticky bottom-0 z-10 -mx-4 mt-2 flex flex-col px-5 py-3 md:-mx-6 md:px-6"
      aria-label="Пагинация списка аукционов"
    >
      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out md:hidden',
          expanded
            ? 'grid-rows-[0fr] -translate-y-1 opacity-0'
            : 'grid-rows-[1fr] translate-y-0 opacity-100',
        )}
      >
        <div className="overflow-hidden">
          <button
            type="button"
            className={cn(
              'w-full pb-0 transition-opacity duration-300',
              expanded && 'pointer-events-none',
            )}
            aria-expanded={expanded}
            aria-controls="auction-list-pagination-controls"
            tabIndex={expanded ? -1 : 0}
            onClick={() => onExpandedChange(true)}
          >
            <PaginationChip className="inline-flex w-full items-center justify-between gap-2 text-left">
              <span className="truncate text-sm text-muted-foreground">
                {summaryLabel}
              </span>
              <ChevronUpIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-300" />
            </PaginationChip>
          </button>
        </div>
      </div>

      <div
        id="auction-list-pagination-controls"
        data-expanded={expanded ? 'true' : 'false'}
        className={cn(
          'grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out md:grid-rows-[1fr] md:translate-y-0 md:opacity-100',
          expanded
            ? 'grid-rows-[1fr] translate-y-0 opacity-100'
            : 'grid-rows-[0fr] translate-y-1 opacity-0 md:translate-y-0 md:opacity-100',
        )}
      >
        <div
          className={cn(
            'overflow-hidden',
            !expanded && 'pointer-events-none md:pointer-events-auto',
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0 md:pt-0">
            <div className="flex flex-wrap items-center gap-2 px-1">
              <PaginationChip>
                <p className="text-sm text-muted-foreground">
                  Страница {page} из {safeLastPage} · всего {total}
                </p>
              </PaginationChip>
              <PaginationChip className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="whitespace-nowrap" id="per-page-label">
                    На странице
                  </span>
                  <Select
                    value={String(perPage)}
                    onValueChange={(value) => {
                      changePerPage(Number(value) as PerPageOption)
                    }}
                  >
                    <SelectTrigger
                      size="sm"
                      aria-labelledby="per-page-label"
                      className="min-w-16 rounded-full bg-background/90"
                    >
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
              </PaginationChip>
            </div>
            <div className="flex flex-wrap items-center gap-2 px-1">
              <PaginationChip className="p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  disabled={page <= 1}
                  onClick={() => goTo(page - 1)}
                >
                  Назад
                </Button>
              </PaginationChip>
              <PaginationChip className="p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  disabled={page >= lastPage || lastPage <= 1}
                  onClick={() => goTo(page + 1)}
                >
                  Вперёд
                </Button>
              </PaginationChip>
              <PaginationChip className="p-1 md:hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  aria-expanded={expanded}
                  aria-controls="auction-list-pagination-controls"
                  onClick={() => onExpandedChange(false)}
                >
                  <ChevronDownIcon className="size-4" />
                  <span>Свернуть</span>
                </Button>
              </PaginationChip>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
