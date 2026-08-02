import { useId, useRef, useState, type ReactNode } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { getCities } from '@/entities/city'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

import {
  AUC_TYPE_LABELS,
  AUC_TYPE_OPTIONS,
  AUCTION_STATUS_OPTIONS,
  BODY_TYPE_OPTIONS,
  FILTER_PRESETS,
  FILTER_SORT_DIRS,
  FILTER_SORT_FIELDS,
  SORT_FIELD_LABELS,
  TRADING_STATUS_LABELS,
  TRADING_STATUS_OPTIONS,
  clearFilterPreset,
  datetimeLocalToIso,
  isFilterPresetActive,
  isoToDatetimeLocal,
  toggleFilterPreset,
  toggleNumberValue,
  toggleStringValue,
  type FilterPresetId,
  type FilterSortDir,
  type FilterSortField,
  type FiltersDraft,
} from '../model/draft'

type FiltersFormProps = {
  draft: FiltersDraft
  onChange: (draft: FiltersDraft) => void
  className?: string
}

function StaticSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col gap-2', className)}>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {children}
    </section>
  )
}

function FieldSection({
  title,
  children,
  className,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: {
  title: string
  children: ReactNode
  className?: string
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  return (
    <details
      className={cn(
        'group rounded-lg border border-border/70 bg-background/40',
        className,
      )}
      open={open}
      onToggle={(event) => {
        const next = event.currentTarget.open
        if (!isControlled) {
          setUncontrolledOpen(next)
        }
        onOpenChange?.(next)
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-foreground select-none [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-2 border-t border-border/60 px-3 py-3">
        {children}
      </div>
    </details>
  )
}

function CheckboxRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 text-sm hover:bg-muted/60"
    >
      <input
        id={id}
        type="checkbox"
        className="size-4 accent-primary"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}

function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function FiltersForm({ draft, onChange, className }: FiltersFormProps) {
  const bodyTypesRef = useRef<HTMLDivElement>(null)
  const [bodyOpen, setBodyOpen] = useState(
    () => (draft.body_types?.length ?? 0) > 0,
  )
  const cities = getCities()

  const patch = (partial: Partial<FiltersDraft>) => {
    onChange({ ...draft, ...partial })
  }

  const handlePreset = (presetId: FilterPresetId) => {
    if (presetId === 'body') {
      if (isFilterPresetActive(draft, 'body')) {
        onChange(clearFilterPreset(draft, 'body'))
        return
      }
      setBodyOpen(true)
      requestAnimationFrame(() => {
        bodyTypesRef.current?.focus()
        bodyTypesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      })
      return
    }
    onChange(toggleFilterPreset(draft, presetId))
  }

  return (
    <div className={cn('flex min-h-0 flex-col gap-4', className)}>
      <StaticSection title="Пресеты">
        <div className="flex flex-wrap gap-2">
          {FILTER_PRESETS.map((preset) => {
            const active = isFilterPresetActive(draft, preset.id)
            return (
              <Button
                key={preset.id}
                type="button"
                size="sm"
                variant={active ? 'default' : 'secondary'}
                className="rounded-full"
                aria-pressed={active}
                onClick={() => handlePreset(preset.id)}
              >
                {preset.label}
              </Button>
            )
          })}
        </div>
      </StaticSection>

      <StaticSection title="Номер заявки">
        <Input
          value={draft.cargo_num ?? ''}
          placeholder="СЛ-1001"
          onChange={(event) => {
            const value = event.target.value
            patch({ cargo_num: value.length > 0 ? value : undefined })
          }}
        />
      </StaticSection>

      <StaticSection title="Сортировка">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select
            value={draft.sort_field ?? '__none__'}
            onValueChange={(value) =>
              patch({
                sort_field:
                  value === '__none__' ? undefined : (value as FilterSortField),
                sort_dir:
                  value === '__none__'
                    ? undefined
                    : (draft.sort_dir ?? 'asc'),
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Без сортировки" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Без сортировки</SelectItem>
              {FILTER_SORT_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {SORT_FIELD_LABELS[field]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={draft.sort_dir ?? 'asc'}
            disabled={!draft.sort_field}
            onValueChange={(value) =>
              patch({ sort_dir: value as FilterSortDir })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_SORT_DIRS.map((dir) => (
                <SelectItem key={dir} value={dir}>
                  {dir === 'asc' ? 'По возрастанию' : 'По убыванию'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </StaticSection>

      <div className="flex flex-col gap-2">

      <FieldSection
        title="Торговый статус"
        defaultOpen={(draft.status?.length ?? 0) > 0}
      >
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {TRADING_STATUS_OPTIONS.map((status) => (
            <CheckboxRow
              key={status}
              label={TRADING_STATUS_LABELS[status] ?? status}
              checked={draft.status?.includes(status) ?? false}
              onChange={() =>
                patch({ status: toggleStringValue(draft.status, status) })
              }
            />
          ))}
        </div>
      </FieldSection>

      <FieldSection
        title="Статус аукциона"
        defaultOpen={(draft.statuses?.length ?? 0) > 0}
      >
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {AUCTION_STATUS_OPTIONS.map((status) => (
            <CheckboxRow
              key={status.id}
              label={status.label}
              checked={draft.statuses?.includes(status.id) ?? false}
              onChange={() =>
                patch({
                  statuses: toggleNumberValue(draft.statuses, status.id),
                })
              }
            />
          ))}
        </div>
      </FieldSection>

      <FieldSection
        title="Тип аукциона"
        defaultOpen={(draft.auc_type?.length ?? 0) > 0}
      >
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {AUC_TYPE_OPTIONS.map((aucType) => (
            <CheckboxRow
              key={aucType}
              label={AUC_TYPE_LABELS[aucType] ?? aucType}
              checked={draft.auc_type?.includes(aucType) ?? false}
              onChange={() =>
                patch({ auc_type: toggleStringValue(draft.auc_type, aucType) })
              }
            />
          ))}
        </div>
      </FieldSection>

      <FieldSection
        title="Тип кузова"
        open={bodyOpen}
        onOpenChange={setBodyOpen}
      >
        <div
          ref={bodyTypesRef}
          tabIndex={-1}
          className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {BODY_TYPE_OPTIONS.map((bodyType) => (
              <CheckboxRow
                key={bodyType}
                label={bodyType}
                checked={draft.body_types?.includes(bodyType) ?? false}
                onChange={() =>
                  patch({
                    body_types: toggleStringValue(draft.body_types, bodyType),
                  })
                }
              />
            ))}
          </div>
        </div>
      </FieldSection>

      <FieldSection
        title="Города"
        defaultOpen={Boolean(draft.load_city || draft.unload_city)}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Погрузка</span>
            <Select
              value={draft.load_city ?? '__any__'}
              onValueChange={(value) =>
                patch({ load_city: value === '__any__' ? undefined : value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Любой" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Любой</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Выгрузка</span>
            <Select
              value={draft.unload_city ?? '__any__'}
              onValueChange={(value) =>
                patch({ unload_city: value === '__any__' ? undefined : value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Любой" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Любой</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FieldSection>

      <FieldSection
        title="Дата погрузки"
        defaultOpen={Boolean(draft.load_date_from || draft.load_date_to)}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            type="datetime-local"
            value={isoToDatetimeLocal(draft.load_date_from)}
            onChange={(event) =>
              patch({ load_date_from: datetimeLocalToIso(event.target.value) })
            }
          />
          <Input
            type="datetime-local"
            value={isoToDatetimeLocal(draft.load_date_to)}
            onChange={(event) =>
              patch({ load_date_to: datetimeLocalToIso(event.target.value) })
            }
          />
        </div>
      </FieldSection>

      <FieldSection
        title="Окончание торгов"
        defaultOpen={Boolean(draft.stop_time_from || draft.stop_time_to)}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            type="datetime-local"
            value={isoToDatetimeLocal(draft.stop_time_from)}
            onChange={(event) =>
              patch({ stop_time_from: datetimeLocalToIso(event.target.value) })
            }
          />
          <Input
            type="datetime-local"
            value={isoToDatetimeLocal(draft.stop_time_to)}
            onChange={(event) =>
              patch({ stop_time_to: datetimeLocalToIso(event.target.value) })
            }
          />
        </div>
      </FieldSection>

      <FieldSection
        title="Флаги"
        defaultOpen={
          draft.is_available === true || draft.is_bidder === true
        }
      >
        <div className="flex flex-col gap-1">
          <CheckboxRow
            label="Можно ставить ставку"
            checked={draft.is_available === true}
            onChange={(checked) =>
              patch({ is_available: checked ? true : undefined })
            }
          />
          <CheckboxRow
            label="Я участвую"
            checked={draft.is_bidder === true}
            onChange={(checked) =>
              patch({ is_bidder: checked ? true : undefined })
            }
          />
        </div>
      </FieldSection>

      <FieldSection
        title="Текущая цена"
        defaultOpen={
          draft.current_price_from != null || draft.current_price_to != null
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="От"
            value={draft.current_price_from ?? ''}
            onChange={(event) =>
              patch({
                current_price_from: parseOptionalNumber(event.target.value),
              })
            }
          />
          <Input
            type="number"
            inputMode="decimal"
            placeholder="До"
            value={draft.current_price_to ?? ''}
            onChange={(event) =>
              patch({
                current_price_to: parseOptionalNumber(event.target.value),
              })
            }
          />
        </div>
      </FieldSection>

      <FieldSection
        title="Цена за км"
        defaultOpen={
          draft.price_per_km_from != null || draft.price_per_km_to != null
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="От"
            value={draft.price_per_km_from ?? ''}
            onChange={(event) =>
              patch({
                price_per_km_from: parseOptionalNumber(event.target.value),
              })
            }
          />
          <Input
            type="number"
            inputMode="decimal"
            placeholder="До"
            value={draft.price_per_km_to ?? ''}
            onChange={(event) =>
              patch({
                price_per_km_to: parseOptionalNumber(event.target.value),
              })
            }
          />
        </div>
      </FieldSection>
      </div>
    </div>
  )
}
