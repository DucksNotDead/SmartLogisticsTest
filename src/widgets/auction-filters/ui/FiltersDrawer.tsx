import { useState } from 'react'

import { cn, useMediaQuery } from '@/shared/lib'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'

import { cloneFiltersDraft, type FiltersDraft } from '../model/draft'
import { useFiltersUiStore } from '../model/filters-ui-store'
import { FiltersForm } from './FiltersForm'

type FiltersDrawerProps = {
  applied: FiltersDraft
  onSave: (draft: FiltersDraft) => void
}

function normalizeDraft(draft: FiltersDraft): FiltersDraft {
  const next = cloneFiltersDraft(draft)
  const cargoNum = next.cargo_num?.trim()
  next.cargo_num = cargoNum ? cargoNum : undefined
  return next
}

export function FiltersDrawer({ applied, onSave }: FiltersDrawerProps) {
  const open = useFiltersUiStore((state) => state.open)
  const setOpen = useFiltersUiStore((state) => state.setOpen)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [draft, setDraft] = useState<FiltersDraft>(() =>
    cloneFiltersDraft(applied),
  )
  const [wasOpen, setWasOpen] = useState(open)

  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setDraft(cloneFiltersDraft(applied))
    }
  }

  const handleSave = () => {
    onSave(normalizeDraft(draft))
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={isDesktop ? 'right' : 'bottom'}
        className={cn(
          'gap-0 p-0',
          isDesktop ? 'w-full sm:max-w-md' : 'max-h-[85vh]',
        )}
      >
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle>Фильтры</SheetTitle>
          <SheetDescription>
            Изменения применятся к списку после сохранения
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <FiltersForm draft={draft} onChange={setDraft} />
        </div>

        <SheetFooter className="sticky bottom-0 z-10 flex-row border-t border-border bg-popover">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 flex-1 rounded-xl"
            onClick={() => setOpen(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            size="lg"
            className="h-12 flex-1 rounded-xl"
            onClick={handleSave}
          >
            Сохранить
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
