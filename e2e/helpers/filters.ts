import type { Locator, Page } from '@playwright/test'

export async function gotoAuctions(page: Page, search = ''): Promise<void> {
  const path = search ? `/auctions?${search}` : '/auctions'
  await page.goto(path)
  await page
    .getByRole('heading', { name: 'Аукционы', level: 1 })
    .waitFor({ state: 'visible' })
}

export async function waitForAuctionList(page: Page): Promise<void> {
  await page
    .getByRole('link')
    .filter({ hasText: 'СЛ-' })
    .first()
    .waitFor({ state: 'visible', timeout: 20_000 })
}

export function filtersButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Фильтры' })
}

export function resetFiltersButton(page: Page): Locator {
  return page.getByRole('button', { name: 'Сбросить' })
}

export async function openFilters(page: Page): Promise<void> {
  await filtersButton(page).click()
  await page.getByRole('heading', { name: 'Фильтры' }).waitFor({ state: 'visible' })
}

export async function saveFilters(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Сохранить' }).click()
}

export async function cancelFilters(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Отмена' }).click()
}

export async function resetFilters(page: Page): Promise<void> {
  await resetFiltersButton(page).click()
}

export async function fillCargoNum(page: Page, value: string): Promise<void> {
  await page.getByPlaceholder('СЛ-1001').fill(value)
}

export async function selectPreset(
  page: Page,
  label: string,
): Promise<void> {
  await page.getByRole('button', { name: label, pressed: false }).click()
}

export async function openFilterSection(
  page: Page,
  title: string,
): Promise<void> {
  const summary = page.locator('summary').filter({ hasText: title })
  const details = summary.locator('xpath=..')
  if ((await details.getAttribute('open')) == null) {
    await summary.click()
  }
}

export async function checkFilterOption(
  page: Page,
  label: string,
): Promise<void> {
  await page.getByLabel(label, { exact: true }).check()
}

export async function selectLoadCity(page: Page, city: string): Promise<void> {
  await openFilterSection(page, 'Города')
  const group = page.locator('details').filter({ hasText: 'Города' })
  await group.getByText('Погрузка').locator('..').getByRole('combobox').click()
  await page.getByRole('option', { name: city, exact: true }).click()
}

export async function selectUnloadCity(
  page: Page,
  city: string,
): Promise<void> {
  await openFilterSection(page, 'Города')
  const group = page.locator('details').filter({ hasText: 'Города' })
  await group.getByText('Выгрузка').locator('..').getByRole('combobox').click()
  await page.getByRole('option', { name: city, exact: true }).click()
}
