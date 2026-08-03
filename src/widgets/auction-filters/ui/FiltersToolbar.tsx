import { FilterIcon, RotateCcwIcon } from 'lucide-react'

import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/button'

import { useFiltersUiStore } from '../model/filters-ui-store'

type FiltersToolbarProps = {
  hasActiveFilters: boolean
  onReset: () => void
  className?: string
}

export function FiltersToolbar({
  hasActiveFilters,
  onReset,
  className,
}: FiltersToolbarProps) {
  const openFilters = useFiltersUiStore((state) => state.openFilters)

  return (
    <div className={cn('flex shrink-0 items-center gap-2', className)}>
      <Button
        type="button"
        size="lg"
        className="rounded-full px-5 shadow-md"
        aria-label="Фильтры"
        onClick={openFilters}
      >
        <FilterIcon className="size-5" />
        <span>Фильтры</span>
      </Button>

      {hasActiveFilters ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-full bg-background/90 px-5 shadow-md backdrop-blur-md"
          onClick={onReset}
        >
          <RotateCcwIcon className="size-5" />
          <span>Сбросить</span>
        </Button>
      ) : null}
    </div>
  )
}
