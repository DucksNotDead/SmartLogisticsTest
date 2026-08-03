import { expect, test } from 'vitest'

import { ApiError } from '@/shared/api'

import { getSetBetValidationErrors } from './use-set-bet-mutation'

test('getSetBetValidationErrors maps 422 ValidationProblem.errors[]', () => {
  const error = new ApiError(422, {
    code: 'validation_failed',
    title: 'Ошибка валидации',
    message: 'Запрос содержит некорректные поля.',
    errors: [{ field: 'price', message: 'Цена слишком высокая.' }],
  })

  expect(getSetBetValidationErrors(error)).toEqual([
    { field: 'price', message: 'Цена слишком высокая.' },
  ])
})

test('getSetBetValidationErrors ignores non-422', () => {
  expect(
    getSetBetValidationErrors(
      new ApiError(404, {
        code: 'resource_not_found',
        title: 'Не найдено',
        message: 'Нет',
      }),
    ),
  ).toEqual([])
  expect(getSetBetValidationErrors(new Error('x'))).toEqual([])
})
