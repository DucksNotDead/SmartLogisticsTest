import { useEffect, useMemo, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { AuctionDetailPrices } from '@/entities/auction'
import { Button } from '@/shared/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'

import { useSetBetMutation } from '../api/use-set-bet-mutation'
import {
  createBetPriceSchema,
  parseBetPriceInput,
  type BetPriceFormValues,
} from '../model/bet-price.schema'
import { suggestPrices } from '../model/suggest-prices'
import { BetPriceField } from './BetPriceField.component'
import { SetBetSuccess } from './SetBetSuccess.component'

const SUCCESS_CLOSE_MS = 1000

type SetBetSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  auctionUuid: string
  prices: AuctionDetailPrices
  canSetBet: boolean
  /** After success overlay (~1s) and sheet close. */
  onPlaced?: (price: number) => void
}

export function SetBetSheet({
  open,
  onOpenChange,
  auctionUuid,
  prices,
  canSetBet,
  onPlaced,
}: SetBetSheetProps) {
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const schema = useMemo(
    () =>
      createBetPriceSchema({
        min: prices.min,
        max: prices.max,
        step: prices.step,
        current: prices.current,
      }),
    [prices],
  )

  const suggestions = useMemo(
    () =>
      suggestPrices({
        available: prices.available,
        current: prices.current,
        step: prices.step,
        min: prices.min,
        max: prices.max,
      }),
    [prices],
  )

  const defaultPrice =
    prices.available != null ? String(prices.available) : ''

  const form = useForm<BetPriceFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { price: defaultPrice },
  })

  const priceRegister = form.register('price')

  const mutation = useSetBetMutation({
    onSuccess: (variables) => {
      setSuccess(true)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      closeTimerRef.current = setTimeout(() => {
        onOpenChange(false)
        onPlaced?.(variables.data.price)
        setSuccess(false)
        form.reset({ price: defaultPrice })
      }, SUCCESS_CLOSE_MS)
    },
    onError: (_error, _variables, fieldErrors) => {
      if (fieldErrors.length === 0) return
      const priceError =
        fieldErrors.find((item) => item.field === 'price') ?? fieldErrors[0]
      if (priceError) {
        form.setError('price', {
          type: 'server',
          message: priceError.message,
        })
      }
      setShake(true)
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current)
      shakeTimerRef.current = setTimeout(() => {
        setShake(false)
      }, 450)
    },
  })

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current)
    }
  }, [])

  const busy = mutation.isPending || success
  const priceValue = form.watch('price')

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (success) return
        onOpenChange(next)
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={!success}
        className="mx-auto max-h-[90vh] w-full max-w-xl gap-0 overflow-hidden rounded-t-2xl p-0"
      >
        <div className="relative flex min-h-[min(70vh,560px)] flex-col">
          {success ? <SetBetSuccess /> : null}

          <SheetHeader className="border-b border-border px-5 pt-5 pb-4 pr-14 sm:px-6">
            <SheetTitle className="text-xl font-semibold sm:text-2xl">
              Сделать ставку
            </SheetTitle>
            <SheetDescription className="text-base">
              Укажите цену с учётом шага и доступного диапазона.
            </SheetDescription>
          </SheetHeader>

          {canSetBet ? (
            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={form.handleSubmit((values) => {
                const price = parseBetPriceInput(values.price)
                if (price == null) return
                mutation.mutate({
                  auctionUuid,
                  data: { price },
                })
              })}
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                <BetPriceField
                  name={priceRegister.name}
                  inputRef={priceRegister.ref}
                  value={priceValue}
                  onBlur={() => {
                    void priceRegister.onBlur({
                      target: { name: priceRegister.name, value: priceValue },
                      type: 'blur',
                    })
                  }}
                  onChange={(next) => {
                    void form.setValue('price', next, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    })
                  }}
                  errorMessage={form.formState.errors.price?.message}
                  suggestions={suggestions}
                  available={prices.available}
                  step={prices.step}
                  shake={shake}
                  disabled={busy}
                />
              </div>

              <SheetFooter className="border-t border-border bg-popover px-5 py-4 sm:px-6">
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full rounded-xl text-base font-semibold"
                  disabled={busy}
                >
                  {mutation.isPending ? 'Отправка…' : 'Установить ставку'}
                </Button>
              </SheetFooter>
            </form>
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 py-10 text-center text-muted-foreground">
              Ставка сейчас недоступна
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
