# Design: 012-e2e

## Approach

1. **Playwright** (не Cypress): `@playwright/test`, chromium first;
   `playwright.config.ts` с `webServer: { command: 'pnpm dev', url,
   reuseExistingServer }`. BaseURL `http://127.0.0.1:5173` (Vite default).
2. **MSW в браузере** уже стартует в `pnpm dev` — e2e бьёт в тот же
   mock store (мутации set-bet видны в UI). Не поднимать отдельный
   node-MSW server.
3. **Layout тестов** (вне `src/`, FSD не трогаем):
   ```text
   e2e/
     fixtures/          # константы: SEED uuid, cargo_num из seed
     helpers/           # openFilters, saveFilters, openSetBet…
     filters.spec.ts
     set-bet.spec.ts
   playwright.config.ts
   ```
4. **Селекторы**: `getByRole` / `getByLabel` / placeholder; точечный
   `data-testid` только если иначе flake (skeleton, highlight, sheet).
5. **Тайминги**: MSW delay ~1s в dev (`MOCK_DELAY_MS`) — ждать
   networkidle / отсутствие skeleton / explicit locators, не
   фиксированные sleep без нужды. Для success highlight (~1.5s) —
   assert появления, затем опционально исчезновения.
6. **Fixtures**:
   - happy set-bet: `SEED_AUCTION_UUID` (index 0, `can_set_bet=true`)
   - no CTA: uuid index 4 (`SEED_FLAG_CANNOT_SET_BET`)
   - filter: известные `cargo_num` / города из seed store
7. **Скрипты**: `"test:e2e": "playwright test"`; `verify` **не**
   расширять. Pre-commit остаётся быстрым.
8. README + `AI_USAGE.md`.

## FSD layout

n/a — e2e вне FSD (`e2e/` в корне). Точечные `data-testid` в
существующих UI pages/widgets/features допустимы без новых слайсов.

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Playwright vs Cypress | быстрее, webServer built-in | новый tool | **Playwright** |
| e2e в `verify` vs отдельный script | полный gate | тормозит husky | **`pnpm test:e2e` отдельно** |
| Chromium only vs multi-browser | меньше CI/setup | уже coverage | **chromium first** |
| role/text vs testid everywhere | ближе к a11y | flake на copy | **role/text + точечный testid** |

## Progressive verify

Каждый task → `pnpm verify` (+ `pnpm test:e2e` после появления specs).
