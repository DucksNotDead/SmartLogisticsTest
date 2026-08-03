export type SuggestPricesInput = {
  available?: number | null
  current?: number | null
  step?: number | null
  min?: number | null
  max?: number | null
  /** Max suggestions (default 6). */
  count?: number
}

function isPresent(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value)
}

/**
 * Suggested bid prices for the picker: start from `available` (or
 * `current - step`), then descend by `step` within min/max.
 */
export function suggestPrices(input: SuggestPricesInput): number[] {
  const count = input.count ?? 6
  if (count <= 0) return []

  const step = isPresent(input.step) && input.step > 0 ? input.step : null
  if (step == null) {
    if (isPresent(input.available) && input.available > 0) {
      return [input.available]
    }
    return []
  }

  let start: number | null = null
  if (isPresent(input.available) && input.available > 0) {
    start = input.available
  } else if (isPresent(input.current)) {
    start = input.current - step
  }

  if (start == null || !Number.isFinite(start)) return []

  const min = isPresent(input.min) ? input.min : null
  const max = isPresent(input.max) ? input.max : null

  const result: number[] = []
  let price = start

  for (let i = 0; i < count * 3 && result.length < count; i += 1) {
    if (price <= 0) break
    if (min != null && price < min) break
    if (max != null && price > max) {
      price -= step
      continue
    }
    result.push(price)
    price -= step
  }

  return result
}
