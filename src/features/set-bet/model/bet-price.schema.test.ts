import { test, expect } from 'vitest'

import {
  createBetPriceSchema,
  betPriceSchema,
  parseBetPriceInput,
} from './bet-price.schema'
import { suggestPrices } from './suggest-prices'

test('betPriceSchema requires price > 0', () => {
  expect(betPriceSchema.safeParse({ price: '100' }).success).toBe(true)
  expect(betPriceSchema.safeParse({ price: '0' }).success).toBe(false)
  expect(betPriceSchema.safeParse({ price: '-1' }).success).toBe(false)
  expect(betPriceSchema.safeParse({ price: '' }).success).toBe(false)
})

test('parseBetPriceInput accepts spaces and comma', () => {
  expect(parseBetPriceInput('15 000')).toBe(15_000)
  expect(parseBetPriceInput('15,5')).toBe(15.5)
  expect(parseBetPriceInput('')).toBeNull()
})

test('nullable bounds are not applied', () => {
  const schema = createBetPriceSchema({
    min: null,
    max: null,
    step: null,
    current: null,
  })
  expect(schema.safeParse({ price: '1' }).success).toBe(true)
  expect(schema.safeParse({ price: '999999' }).success).toBe(true)
})

test('applies min and max when present', () => {
  const schema = createBetPriceSchema({ min: 10_000, max: 20_000 })
  expect(schema.safeParse({ price: '9999' }).success).toBe(false)
  expect(schema.safeParse({ price: '10000' }).success).toBe(true)
  expect(schema.safeParse({ price: '20000' }).success).toBe(true)
  expect(schema.safeParse({ price: '20001' }).success).toBe(false)
})

test('price must be below current when current is set', () => {
  const schema = createBetPriceSchema({ current: 50_000 })
  expect(schema.safeParse({ price: '50000' }).success).toBe(false)
  expect(schema.safeParse({ price: '49999' }).success).toBe(true)
})

test('step aligns to current - n*step when both present', () => {
  const schema = createBetPriceSchema({ current: 50_000, step: 500 })
  expect(schema.safeParse({ price: '49500' }).success).toBe(true)
  expect(schema.safeParse({ price: '49000' }).success).toBe(true)
  expect(schema.safeParse({ price: '49250' }).success).toBe(false)
})

test('step alone without current is ignored', () => {
  const schema = createBetPriceSchema({ step: 500 })
  expect(schema.safeParse({ price: '49250' }).success).toBe(true)
})

test('suggestPrices walks down from available by step', () => {
  expect(
    suggestPrices({
      available: 49_500,
      current: 50_000,
      step: 500,
      min: 40_000,
      count: 3,
    }),
  ).toEqual([49_500, 49_000, 48_500])
})

test('suggestPrices falls back to current - step', () => {
  expect(
    suggestPrices({
      current: 10_000,
      step: 1_000,
      count: 2,
    }),
  ).toEqual([9_000, 8_000])
})

test('suggestPrices returns available only when no step', () => {
  expect(suggestPrices({ available: 12_000 })).toEqual([12_000])
  expect(suggestPrices({})).toEqual([])
})
