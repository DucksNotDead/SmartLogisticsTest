import { expect, test } from '@playwright/test'

import {
  CANNOT_SET_BET_AUCTION_UUID,
  SEED_AUCTION_UUID,
} from './fixtures/seed'
import {
  betPriceInput,
  fillBetPrice,
  gotoAuctionDetail,
  openSetBet,
  setBetCta,
  stubSetBetValidationError,
  submitBet,
  suggestionsTrigger,
  waitForDetailReady,
} from './helpers/set-bet'

/** Seed index 0: current=100000, step=1000, available=99000. */
const VALID_PRICE = '99000'
const VALID_PRICE_LABEL = /99[\s\u00a0]?000/

test.describe('set-bet', () => {
  test('success: CTA → sheet → bets + highlight', async ({ page }) => {
    await gotoAuctionDetail(page, SEED_AUCTION_UUID)
    await waitForDetailReady(page)

    await openSetBet(page)
    await fillBetPrice(page, VALID_PRICE)
    await submitBet(page)

    await expect(page.locator('[data-set-bet-success]')).toBeVisible({
      timeout: 20_000,
    })
    await expect(page.getByText('Ставка принята').first()).toBeVisible()

    await expect(page.getByRole('tab', { name: 'Ставки' })).toHaveAttribute(
      'data-state',
      'active',
      { timeout: 15_000 },
    )
    await expect(page).toHaveURL(/tab=bets/)

    await expect(page.locator('[data-bet-highlighted]')).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.locator('[data-bet-highlighted]')).toContainText(
      VALID_PRICE_LABEL,
    )
  })

  test('can_set_bet=false → нет CTA «Установить ставку»', async ({
    page,
  }) => {
    await gotoAuctionDetail(page, CANNOT_SET_BET_AUCTION_UUID)
    await waitForDetailReady(page)

    await expect(setBetCta(page)).toHaveCount(0)
    await expect(
      page.getByRole('button', { name: 'Ставка недоступна' }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Сделать ставку' })).toHaveCount(
      0,
    )
  })

  test('realtime invalid: текст ошибки, без shake', async ({ page }) => {
    await gotoAuctionDetail(page, SEED_AUCTION_UUID)
    await waitForDetailReady(page)
    await openSetBet(page)

    await fillBetPrice(page, '0')

    await expect(page.getByRole('alert')).toContainText(/больше 0/i)
    await expect(betPriceInput(page)).not.toHaveClass(/field-shake/)
  })

  test('422: shake + сообщение + error toast', async ({ page }) => {
    await gotoAuctionDetail(page, SEED_AUCTION_UUID)
    await waitForDetailReady(page)
    await stubSetBetValidationError(page, 'Сервер отклонил цену')
    await openSetBet(page)

    await fillBetPrice(page, VALID_PRICE)
    await submitBet(page)

    await expect(page.getByRole('alert')).toContainText('Сервер отклонил цену', {
      timeout: 20_000,
    })
    await expect(betPriceInput(page)).toHaveClass(/field-shake/)
    await expect(page.getByText('Сервер отклонил цену').first()).toBeVisible()
  })

  test('пикер предложений → успешный submit', async ({ page }) => {
    await gotoAuctionDetail(page, SEED_AUCTION_UUID)
    await waitForDetailReady(page)
    await openSetBet(page)

    await fillBetPrice(page, '')
    await suggestionsTrigger(page).click()
    await page.getByRole('option').first().click()

    await expect(betPriceInput(page)).not.toHaveValue('')
    await submitBet(page)

    await expect(page.locator('[data-set-bet-success]')).toBeVisible({
      timeout: 20_000,
    })
    await expect(page.getByRole('tab', { name: 'Ставки' })).toHaveAttribute(
      'data-state',
      'active',
      { timeout: 15_000 },
    )
    await expect(page.locator('[data-bet-highlighted]')).toBeVisible({
      timeout: 15_000,
    })
  })
})
