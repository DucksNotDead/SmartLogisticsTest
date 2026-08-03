import { expect, test } from '@playwright/test'

import {
  SEED_CARGO_NUM,
  SEED_LOAD_CITY,
  SEED_UNLOAD_CITY,
} from './fixtures/seed'
import {
  cancelFilters,
  checkFilterOption,
  fillCargoNum,
  gotoAuctions,
  openFilterSection,
  openFilters,
  resetFilters,
  resetFiltersButton,
  saveFilters,
  selectLoadCity,
  selectPreset,
  selectUnloadCity,
  waitForAuctionList,
} from './helpers/filters'

function decodedUrl(page: { url(): string }): string {
  return decodeURIComponent(page.url())
}

async function expectCargoLinks(
  page: Parameters<typeof waitForAuctionList>[0],
  cargoNum: string,
): Promise<void> {
  const links = page.getByRole('link').filter({ hasText: 'СЛ-' })
  await expect(links).toHaveCount(1, { timeout: 20_000 })
  await expect(links.first()).toContainText(cargoNum)
}

test.describe('filters', () => {
  test('cargo_num: Save → URL + список', async ({ page }) => {
    await gotoAuctions(page)
    await waitForAuctionList(page)

    await openFilters(page)
    await fillCargoNum(page, SEED_CARGO_NUM)
    await saveFilters(page)

    await expect
      .poll(() => decodedUrl(page))
      .toContain(`cargo_num=${SEED_CARGO_NUM}`)
    await expectCargoLinks(page, SEED_CARGO_NUM)
  })

  test('draft без Save не меняет URL и список', async ({ page }) => {
    await gotoAuctions(page)
    await waitForAuctionList(page)
    const before = decodedUrl(page)
    const beforeCount = await page
      .getByRole('link')
      .filter({ hasText: 'СЛ-' })
      .count()
    expect(beforeCount).toBeGreaterThan(1)

    await openFilters(page)
    await fillCargoNum(page, SEED_CARGO_NUM)
    // Sheet вешает aria-hidden на фон — список в DOM, но не в a11y tree.
    expect(decodedUrl(page)).toBe(before)

    await cancelFilters(page)
    expect(decodedUrl(page)).toBe(before)
    await expect(page.getByRole('link').filter({ hasText: 'СЛ-' })).toHaveCount(
      beforeCount,
    )
  })

  test('Cancel discard draft', async ({ page }) => {
    await gotoAuctions(page)
    await waitForAuctionList(page)
    const before = decodedUrl(page)

    await openFilters(page)
    await fillCargoNum(page, SEED_CARGO_NUM)
    await cancelFilters(page)

    expect(decodedUrl(page)).toBe(before)

    await openFilters(page)
    await expect(page.getByPlaceholder('СЛ-1001')).toHaveValue('')
  })

  test('Reset сбрасывает applied filters', async ({ page }) => {
    await gotoAuctions(page)
    await waitForAuctionList(page)

    await openFilters(page)
    await fillCargoNum(page, SEED_CARGO_NUM)
    await saveFilters(page)
    await expect
      .poll(() => decodedUrl(page))
      .toContain(`cargo_num=${SEED_CARGO_NUM}`)
    await expect(resetFiltersButton(page)).toBeVisible()

    await resetFilters(page)

    await expect
      .poll(() => decodedUrl(page).includes('cargo_num='))
      .toBe(false)
    await expect(resetFiltersButton(page)).toHaveCount(0)
    await waitForAuctionList(page)
    expect(
      await page.getByRole('link').filter({ hasText: 'СЛ-' }).count(),
    ).toBeGreaterThan(1)
  })

  test('пресет «Можно ставить» → Save → is_available в URL', async ({
    page,
  }) => {
    await gotoAuctions(page)
    await waitForAuctionList(page)

    await openFilters(page)
    await selectPreset(page, 'Можно ставить')
    await saveFilters(page)

    await expect
      .poll(() => decodedUrl(page))
      .toMatch(/is_available=true/)
    await waitForAuctionList(page)
  })

  test('города load/unload → Save → URL + сужение списка', async ({
    page,
  }) => {
    await gotoAuctions(page)
    await waitForAuctionList(page)

    await openFilters(page)
    await selectLoadCity(page, SEED_LOAD_CITY)
    await selectUnloadCity(page, SEED_UNLOAD_CITY)
    await saveFilters(page)

    await expect
      .poll(() => decodedUrl(page))
      .toContain(`load_city=${SEED_LOAD_CITY}`)
    await expect
      .poll(() => decodedUrl(page))
      .toContain(`unload_city=${SEED_UNLOAD_CITY}`)

    await waitForAuctionList(page)
    const links = page.getByRole('link').filter({ hasText: 'СЛ-' })
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(20)

    for (let i = 0; i < count; i += 1) {
      await expect(links.nth(i)).toContainText(
        `${SEED_LOAD_CITY} → ${SEED_UNLOAD_CITY}`,
      )
    }
  })

  test('status (торговый) и statuses (аукцион) → Save', async ({ page }) => {
    await gotoAuctions(page)
    await waitForAuctionList(page)

    await openFilters(page)
    await openFilterSection(page, 'Торговый статус')
    await checkFilterOption(page, 'Лидирует')
    await openFilterSection(page, 'Статус аукциона')
    await checkFilterOption(page, 'Торги')
    await saveFilters(page)

    await expect.poll(() => decodedUrl(page)).toMatch(/status/)
    await expect.poll(() => decodedUrl(page)).toMatch(/Leading/)
    await expect.poll(() => decodedUrl(page)).toMatch(/statuses/)
    await expect.poll(() => decodedUrl(page)).toMatch(/2/)

    await waitForAuctionList(page)
  })

  test('битый query → fallback без краша', async ({ page }) => {
    await gotoAuctions(
      page,
      'page=0&per_page=999&status=Nope&statuses=99&is_available=maybe&sort_field=distance',
    )

    await expect(
      page.getByRole('heading', { name: 'Аукционы', level: 1 }),
    ).toBeVisible()
    await waitForAuctionList(page)

    await expect(resetFiltersButton(page)).toHaveCount(0)
    await expect(
      page.getByRole('link').filter({ hasText: 'СЛ-' }),
    ).not.toHaveCount(0)
  })
})
