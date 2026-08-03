import { useState, type Ref } from 'react'
import { ChevronsUpDownIcon } from 'lucide-react'

import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command'
import { Input } from '@/shared/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover'

import { formatBetPrice } from '../lib/format-price'

type BetPriceFieldProps = {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  name: string
  inputRef?: Ref<HTMLInputElement>
  errorMessage?: string
  suggestions: number[]
  available: number | null | undefined
  step: number | null | undefined
  /** Shake only for server 422 — not realtime Zod. */
  shake?: boolean
  disabled?: boolean
}

export function BetPriceField({
  value,
  onChange,
  onBlur,
  name,
  inputRef,
  errorMessage,
  suggestions,
  available,
  step,
  shake = false,
  disabled = false,
}: BetPriceFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const showError = Boolean(errorMessage)

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-w-0 flex-col gap-1.5">
        <label
          htmlFor="set-bet-price"
          className="text-sm font-medium text-foreground"
        >
          Цена ставки
        </label>
        <div className="flex min-w-0 gap-2">
          <Input
            id="set-bet-price"
            inputMode="decimal"
            autoComplete="off"
            disabled={disabled}
            placeholder="Введите цену"
            aria-invalid={showError || undefined}
            className={cn(
              'h-14 min-w-0 flex-1 rounded-xl px-4 text-2xl font-semibold tabular-nums md:h-16 md:text-3xl',
              shake && 'field-shake',
            )}
            value={value}
            onBlur={onBlur}
            onChange={(event) => {
              onChange(event.target.value)
            }}
            name={name}
            ref={inputRef}
          />
          {suggestions.length > 0 ? (
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  className="h-14 shrink-0 rounded-xl px-3 md:h-16"
                  aria-label="Подсказки по шагу ставки"
                >
                  <ChevronsUpDownIcon className="size-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-0">
                <Command>
                  <CommandInput placeholder="Найти цену…" />
                  <CommandList>
                    <CommandEmpty>Нет предложений</CommandEmpty>
                    <CommandGroup heading="Шаги ставки">
                      {suggestions.map((price) => (
                        <CommandItem
                          key={price}
                          value={String(price)}
                          onSelect={() => {
                            onChange(String(price))
                            setPickerOpen(false)
                          }}
                        >
                          <span className="tabular-nums font-medium">
                            {formatBetPrice(price)}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
      </div>

      <p className="text-sm text-muted-foreground" data-bet-price-hint>
        {available != null ? (
          <>
            Доступно:{' '}
            <span className="font-medium text-foreground tabular-nums">
              {formatBetPrice(available)}
            </span>
          </>
        ) : (
          'Доступная цена не указана'
        )}
        {step != null ? (
          <>
            {' · '}
            Шаг:{' '}
            <span className="font-medium text-foreground tabular-nums">
              {formatBetPrice(step)}
            </span>
          </>
        ) : null}
      </p>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-out',
          showError ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={cn(
              'pt-1 text-sm text-destructive',
              showError &&
                'animate-in fade-in-0 slide-in-from-top-1 duration-200',
            )}
            role={showError ? 'alert' : undefined}
            data-bet-price-error={showError || undefined}
          >
            {errorMessage ?? '\u00a0'}
          </p>
        </div>
      </div>
    </div>
  )
}
