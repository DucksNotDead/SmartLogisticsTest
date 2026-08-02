import { expect, test } from 'vitest'

import { getAuction, listAuctions } from './entities/auction'
import { listBets, setBet } from './entities/bet'

test('smoke', () => {
  expect(true).toBe(true)
})

test('entities public api exposes auction and bet ops', () => {
  expect(typeof listAuctions).toBe('function')
  expect(typeof getAuction).toBe('function')
  expect(typeof listBets).toBe('function')
  expect(typeof setBet).toBe('function')
})
