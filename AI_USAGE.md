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

### `006-layout` — shell + file-based router

- AI: `@tanstack/router-plugin`, `app/routes` + `routeTree.gen.ts` в git,
  `widgets/app-shell` (header/content/footer), stub `pages/auction-list`,
  redirect `/` → `/auctions`, favicon/title/description.
- Решение: без sidebar / footer-nav (один раздел); credit-footer и кнопка
  «Разработчик» в scope по запросу оператора.
- Решение: steiger/eslint ignore для `routeTree.gen.ts` и `app/routes`.
- Отклонено: буква «М»/«УЛ» в favicon и «яйцеобразная» форма; итог — мягкий
  жёлтый треугольник без букв.
- Риск: gen в git шумит в diff; detail/bet routes ещё не заведены.

### `007-list` — список без фильтров

- Scope по оператору: фильтры UI / sync в URL|localStorage **не делаем** в
  этой change (уйдут отдельно). Zod search params только `page` / `per_page`
  с fallback `1` / `20`.
- Решение: stub detail как flat-route `auctions_.$auctionUuid` (URL
  `/auctions/$uuid`), а не child `auctions.$auctionUuid` — иначе typed `Link`
  требовал search params списка.
- Prefetch только `getAuction` на hover/focus; bets не трогаем.
- MSW seed расширен до 25 items (≥2 страницы при `per_page=20`); GET detail
  для всех seed uuid.
- Отклонено: тянуть минимальные фильтры из ТЗ «заодно» в эту change.
- Дополнение scope: sticky header/footer/pagination; `per_page` enum
  5/10/15/20 + select; сетка `lg:grid-cols-2`.
- Compact title: Zustand в `shared/model` + IntersectionObserver на page h1
  (root = `main[data-app-scroll]`); в header absolute center.
- Пагинация: отдельные rounded blur-chips; груз - badges под датами (не
  `mt-auto`).
- `per_page`: native select заменён на `shared/ui/select` (shadcn/radix),
  в структуре как `button`/`input` (`shared/ui/select/`).
- MSW list delay 2s только вне Vitest (`LIST_DELAY_MS`); shell entrance CSS
  stagger header → content/footer без framer-motion.
- Mobile compact title: brand-slot swap («Тестовое задание» ↔ «Аукционы»),
  не center overlay; `md+` center compact сохранён. Pagination mobile
  default collapsed summary; expand также при доскролле до конца списка
  (IntersectionObserver на sentinel), collapse при уходе вверх; tap
  expand/collapse сохранён.
- Риск: короткий список всегда «у конца» → пагинация сразу expanded на
  mobile; фильтры ещё не в URL schema.
