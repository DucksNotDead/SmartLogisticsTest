import type { Locator, Page } from '@playwright/test'

export async function gotoAuctionDetail(
  page: Page,
  auctionUuid: string,
): Promise<void> {
  await page.goto(`/auctions/${auctionUuid}`)
}

export async function waitForDetailReady(page: Page): Promise<void> {
  await page
    .locator('[data-can_set_bet], [data-set-bet-cta="hero"]')
    .first()
    .waitFor({ state: 'visible', timeout: 20_000 })
}

export function setBetCta(page: Page): Locator {
  return page.getByRole('button', { name: 'Установить ставку' })
}

export async function openSetBet(page: Page): Promise<void> {
  await setBetCta(page).first().click()
  await page
    .getByRole('heading', { name: 'Сделать ставку' })
    .waitFor({ state: 'visible' })
}

export function betPriceInput(page: Page): Locator {
  return page.locator('#set-bet-price')
}

export async function fillBetPrice(page: Page, value: string): Promise<void> {
  await betPriceInput(page).fill(value)
}

export async function submitBet(page: Page): Promise<void> {
  await page
    .getByRole('button', { name: 'Установить ставку' })
    .last()
    .click()
}

export function suggestionsTrigger(page: Page): Locator {
  return page.getByRole('button', { name: 'Подсказки по шагу ставки' })
}

/** Zod mirrors MSW rules — force 422 after a client-valid submit. */
export async function stubSetBetValidationError(
  page: Page,
  message = 'Сервер отклонил цену',
): Promise<void> {
  await page.evaluate((errorMessage) => {
    const originalFetch = window.fetch.bind(window)
    window.fetch = async (input, init) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof Request
            ? input.url
            : String(input)
      const method = (
        init?.method ??
        (input instanceof Request ? input.method : 'GET')
      ).toUpperCase()

      if (method === 'POST' && /\/api\/v1\/auctions\/[^/]+\/bets/.test(url)) {
        return new Response(
          JSON.stringify({
            code: 'validation_failed',
            title: 'Ошибка валидации',
            message: errorMessage,
            errors: [
              { field: 'price', message: errorMessage, code: 'invalid' },
            ],
          }),
          {
            status: 422,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      return originalFetch(input, init)
    }
  }, message)
}
