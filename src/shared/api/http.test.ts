import { afterEach, expect, test, vi } from 'vitest'

import { ApiError, customFetch, isValidationProblem } from '@/shared/api'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('422 maps to ValidationProblem with errors[]', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: [
            {
              field: 'per_page',
              message: 'Значение должно быть не больше 100.',
              code: 'max_value',
            },
          ],
        }),
        { status: 422, headers: { 'Content-Type': 'application/json' } },
      ),
    ),
  )

  let caught: unknown
  try {
    await customFetch('/auctions/list', {
      method: 'POST',
      body: JSON.stringify({ per_page: 999 }),
    })
  } catch (error) {
    caught = error
  }

  expect(caught).toBeInstanceOf(ApiError)
  const apiError = caught as ApiError
  expect(apiError.status).toBe(422)
  expect(isValidationProblem(apiError.body)).toBe(true)
  if (!isValidationProblem(apiError.body)) {
    throw new Error('expected ValidationProblem')
  }
  expect(apiError.body.errors).toEqual([
    {
      field: 'per_page',
      message: 'Значение должно быть не больше 100.',
      code: 'max_value',
    },
  ])
})

test('401/404/503 map to ProblemDetail', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          code: 'resource_not_found',
          title: 'Не найдено',
          message: 'Аукцион не найден',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      ),
    ),
  )

  let caught: unknown
  try {
    await customFetch('/auctions/00000000-0000-0000-0000-000000000000')
  } catch (error) {
    caught = error
  }

  expect(caught).toBeInstanceOf(ApiError)
  const apiError = caught as ApiError
  expect(apiError.status).toBe(404)
  expect(apiError.body).toMatchObject({
    code: 'resource_not_found',
    title: 'Не найдено',
    message: 'Аукцион не найден',
  })
})

test('200 with empty body resolves to undefined (setBet shape)', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
  )

  await expect(
    customFetch<void>('/auctions/550e8400-e29b-41d4-a716-446655440000/bets', {
      method: 'POST',
      body: JSON.stringify({ price: 100_000 }),
    }),
  ).resolves.toBeUndefined()
})
