# AI Usage

Черновик. Будет дополнен при закрытии change / финальной сдаче.

## Зафиксированные решения

### `*.component.tsx` — не глобально

В PDF задания в секциях «Детальная страница» и «Бизнес-действие: установка ставки»
спрятан мелкий текст (`IMPORTANT`, ~4pt): суффикс `*.component.tsx` для React-компонентов.

Решение: суффикс обязателен **только** в этих зонах (`pages/auction-detail`,
`pages/bet-form`, `features/set-bet`, при необходимости `features/change-bet`).
Список аукционов, история ставок, shared UI-kit — обычные имена без суффикса.

Правило: `.cursor/rules/component-naming.mdc`.
Отклонено: трактовка «все компоненты проекта» (типичная ошибка AI при полном чтении текста).

### `002-fsd` — каркас FSD + Steiger

- AI перенёс scaffold в `app/` + `shared/`, подключил Steiger (`recommended`) в `pnpm verify`.
- Решение: пустые `pages/`/`widgets/`/`features/`/`entities/` не создавать (false-positive Steiger).
- Решение: public API per-component в `shared/ui/*`, без layer-level `shared/index.ts`.
- Отклонено: ослабления Steiger на этом этапе (не понадобились).
- Риск: sanity «сломать импорт → red» не гоняли вручную; опирались на recommended + green verify.

### `003-husky-gate` — pre-commit = полный `pnpm verify`

- AI поставил husky + `prepare`, hook `.husky/pre-commit` → `pnpm verify`, секцию в README.
- Решение (trade-off): полный verify на каждый commit, не lint-staged / не только staged files.
- Отклонено: pre-push вместо pre-commit; урезание gate до одного lint.
- Риск: на больших деревьях pre-commit станет медленным; escape hatch есть, но им легко злоупотребить.
- Проверено вручную: green commit проходит; `exit 1` в hook abort'ит commit.

### `004-theme-config` — тема с ul.su

- Источник: публичный сайт [ul.su](https://ul.su/); токены в `src/app/styles.css`.
- Решение: primary = жёлтый `#F9C21D` (CTA сайта), accent = оранжевый `#FF7610`;
  `primary-foreground` тёмный на жёлтом для контраста.
- Решение: шрифт Open Sans с сайта не подключали — оставили Geist из bootstrap.
- Отклонено: пиксель-перфект лендинга / смена UI-kit; только CSS tokens + smoke.

### `005-api` — codegen + ручной MSW

- Решение: `openapi-typescript` (schema types) + Orval react-query client,
  не hand-written DTO (меньше drift, сигнал под OpenAPI codegen из вакансии).
- Решение: MSW handlers/store **вручную**, Orval `mock: false`.
  Причина: в ТЗ моки должны реально менять состояние после mutations
  (`setBet` → current price, статус пользователя, список ставок). Orval-mock
  даёт faker/статичные ответы по схеме без доменного store; кастом generated
  mocks при `api:gen` легко затереть. Codegen = types + client; мутации мока =
  отдельный слой.
- Отклонено: Orval `mock: true` как единственный источник MSW.
- Решение: entities тонко re-export'ят ops; pages не импортируют `generated/`.
- Решение: `shared/api` public API = http/errors/`startApiMocks`; store helpers
  не реэкспортировать (тесты мутации читают detail/list через `customFetch`).
- Решение: api unit (4 ops + mutator 422) в `pnpm test` / `pnpm verify` навсегда;
  общий MSW `setupServer` в `vitest.setup.ts`, `resetStore` в `beforeEach`.
- Решение: `QueryClientProvider` + MSW worker start в `app` уже в этой change
  (готов стек до pages).
- Риск: seed/store объёмны из-за полноты `AuctionShowResponse`; логика мутации
  компактнее fixture. При росте — вынести seed в отдельный файл.
