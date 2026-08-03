import { z } from 'zod'

export type BetPriceBounds = {
  min?: number | null
  max?: number | null
  step?: number | null
  /** Current price; used for step grid and «ниже текущей» (down-auction). */
  current?: number | null
}

function isPresent(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value)
}

function alignsWithStep(price: number, current: number, step: number): boolean {
  if (step <= 0) return true
  const delta = current - price
  const remainder = Math.abs(delta % step)
  return remainder < 1e-9 || Math.abs(remainder - step) < 1e-9
}

/** Parse form price string (spaces / comma allowed). */
export function parseBetPriceInput(raw: string): number | null {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.')
  if (!normalized) return null
  const value = Number(normalized)
  return Number.isFinite(value) ? value : null
}

/**
 * Dynamic Zod schema for set-bet price (string input for RHF).
 * Nullable bounds are omitted (rule not applied).
 */
export function createBetPriceSchema(bounds: BetPriceBounds = {}) {
  const { min, max, step, current } = bounds

  return z.object({
    price: z
      .string({ error: 'Укажите цену ставки' })
      .trim()
      .min(1, { error: 'Укажите цену ставки' })
      .superRefine((raw, ctx) => {
        const price = parseBetPriceInput(raw)
        if (price == null) {
          ctx.addIssue({
            code: 'custom',
            message: 'Укажите корректную цену',
          })
          return
        }
        if (price <= 0) {
          ctx.addIssue({
            code: 'custom',
            message: 'Цена должна быть больше 0',
          })
          return
        }
        if (isPresent(min) && price < min) {
          ctx.addIssue({
            code: 'custom',
            message: `Цена не может быть меньше минимума (${min})`,
          })
        }
        if (isPresent(max) && price > max) {
          ctx.addIssue({
            code: 'custom',
            message: `Цена не может быть больше максимума (${max})`,
          })
        }
        if (isPresent(current) && price >= current) {
          ctx.addIssue({
            code: 'custom',
            message: `Цена должна быть меньше текущей (${current})`,
          })
        }
        if (
          isPresent(step) &&
          isPresent(current) &&
          step > 0 &&
          !alignsWithStep(price, current, step)
        ) {
          ctx.addIssue({
            code: 'custom',
            message: `Цена должна отличаться от текущей кратно шагу (${step})`,
          })
        }
      }),
  })
}

/** Default schema without auction bounds (price > 0 only). */
export const betPriceSchema = createBetPriceSchema()

export type BetPriceFormValues = z.infer<typeof betPriceSchema>
