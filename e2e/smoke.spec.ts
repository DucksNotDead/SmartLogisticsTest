import { expect, test } from '@playwright/test'

test('список /auctions рендерится', async ({ page }) => {
  await page.goto('/auctions')

  await expect(
    page.getByRole('heading', { name: 'Аукционы', level: 1 }),
  ).toBeVisible()

  await expect(page.getByRole('link').filter({ hasText: 'СЛ-' }).first()).toBeVisible({
    timeout: 20_000,
  })
})
