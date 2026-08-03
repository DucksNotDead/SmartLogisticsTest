import {FilterIcon, FunnelX} from 'lucide-react'

import {cn} from '@/shared/lib'
import {Button} from '@/shared/ui/button'

import {useFiltersUiStore} from '../model/filters-ui-store'

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
        className="h-10 gap-1.5 rounded-full px-4 text-sm shadow-md md:h-12 md:gap-2 md:px-5 md:text-base"
        aria-label="Фильтры"
        onClick={openFilters}
      >
        <FilterIcon className="size-4 md:size-5" />
        <span>Фильтры</span>
      </Button>

      {hasActiveFilters ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-10 gap-1.5 rounded-full bg-background/90 px-4 text-sm shadow-md backdrop-blur-md md:h-12 md:gap-2 md:px-5 md:text-base"
          onClick={onReset}
        >
          <FunnelX className="size-5"/>
        </Button>
      ) : null}
    </div>
  )
}
