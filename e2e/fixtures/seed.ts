/** Mirrors `SEED_AUCTION_UUID` / `uuidForIndex` in `src/shared/api/mocks/store.ts`. */

export const SEED_AUCTION_UUID = '550e8400-e29b-41d4-a716-446655440000'

/** Index 4 → `SEED_FLAG_CANNOT_SET_BET`. */
export const CANNOT_SET_BET_AUCTION_UUID =
  '550e8400-e29b-41d4-a716-446655440004'

export const SEED_CARGO_NUM = 'СЛ-1001'
export const SEED_LOAD_CITY = 'Москва'
export const SEED_UNLOAD_CITY = 'Санкт-Петербург'

export function cargoNumForIndex(index: number): string {
  return `СЛ-${1001 + index}`
}

export function uuidForIndex(index: number): string {
  const suffix = (0x446655440000 + index).toString(16).padStart(12, '0')
  return `550e8400-e29b-41d4-a716-${suffix}`
}
