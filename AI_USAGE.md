# AI Usage

Саммари для сдачи. Детальный лог по change — ниже, в [Полный лог](#полный-лог).

## Подход к работе с AI

Работали не «промпт → весь проект», а через локальный harness-протокол
(`harness/`, rule `.cursor/rules/harness-protocol.mdc`):

- фича режется на маленькие change (`001`…`012`) с явным in/out scope;
- на change: `proposal` → `design` → `tasks` → `verify`; оператор approve scope,
  AI исполняет tasks;
- критичные шаги помечены `*` (один task за вызов, стоп перед ними);
- после task — механический gate `pnpm verify`; red не пропускали;
- перед закрытием: `/review-change`, затем `/close-change` + commit
  `type(change-id): summary`;
- спорные места и trade-off фиксировали в `design.md` / этом файле, а не
  выбирали молча.

Роли: оператор держит scope и решения; AI пишет код и стоп-репортит
(`VERIFY_RED`, `TRADEOFF`, `CRITICAL_TASK_AHEAD`, `DONE`). Так проще держать
OpenAPI/FSD в рамках и не раздувать change.

## Какие части делались с AI

- Bootstrap, FSD-каркас + Steiger, husky pre-commit → `pnpm verify`.
- CSS-токены темы по ul.su, shell + TanStack Router (`widgets/app-shell`, routes).
- Codegen OpenAPI (`openapi-typescript` + Orval) и каркас MSW; дальше AI писал
  handlers/store и UI по change.
- Список аукционов, фильтры (Zod search, drawer, пресеты), детальная страница,
  вкладка ставок, форма set-bet (Zod + RHF, bottomsheet, 422/shake, инвалидация).
- Playwright e2e (filters + set-bet + smoke), wiring UI-kit (Select, Sheet, Tabs,
  Combobox, Sonner).
- Черновики harness (`proposal` / `design` / `tasks`) и правки README по ходу.

## Какие решения кандидат принял сам

- Суффикс `*.component.tsx` только в зонах detail / set-bet из PDF (`IMPORTANT`),
  не на весь проект.
- Codegen = types + react-query client; MSW store/handlers вручную
  (`Orval mock: false`), чтобы mutations реально меняли состояние.
- Pre-commit = полный `pnpm verify` (не lint-staged / не только lint).
- Тема: primary `#F9C21D`, accent `#FF7610` с ul.su; шрифт Open Sans с сайта
  не брали (оставили Geist).
- Фильтры списка вынесены из list-change в отдельную; Zod search сначала только
  `page` / `per_page`, потом полный filter schema.
- Flat-route detail `auctions_.$auctionUuid`, чтобы `Link` не требовал search
  списка; tab detail в URL (`?tab=info|bets`).
- Фильтры: draft + Save/Cancel в drawer, не live-apply и не localStorage.
- E2e на Playwright, вне `pnpm verify` / husky (чтобы pre-commit не тормозил).
- Узкие UI-решения: sticky chrome, compact title (Zustand + IntersectionObserver),
  mobile pagination collapse, visibility-флаги только через ViewModel.

## Какие AI-предложения были отклонены

- `*.component.tsx` на все React-компоненты проекта.
- Ослабления Steiger «на всякий случай» на старте FSD.
- Pre-push вместо pre-commit; урезание gate до одного lint.
- Пиксель-перфект лендинга ul.su / смена UI-kit ради темы.
- Orval `mock: true` как единственный источник MSW.
- Буква «М»/«УЛ» и «яйцеобразный» favicon.
- Минимальные фильтры «заодно» в list-change; later-поля OpenAPI; live-apply;
  localStorage фильтров; hide filters on pagination expand.
- `next-themes` из shadcn sonner scaffold; flat dump CLI в `shared/ui/*.tsx`
  (переложено в per-component folders).
- E2e внутри `pnpm verify`, матрица всех filter keys, multi-browser, CI YAML
  в первой e2e-change.

## Какие места кандидат проверял особенно внимательно

- Соответствие DTO / enum / nullable / кодов ошибок OpenAPI
  (`AuctionListItemTrading` vs `AuctionShowTrading`, `status` vs `statuses`).
- MSW после `setBet`: цена, статус пользователя, список ставок; инвалидация
  list/detail/bets.
- 422 `ValidationProblem.errors[]` и клиентский Zod vs серверные правила
  (в e2e 422 через stub `fetch`, т.к. клиент не пускает заведомо битую цену).
- Флаги: `can_set_bet`, `hide_bets_history`, `hide_points_address_and_contacts`,
  `no_view_cargo_price`, `hide_places` — деградация UI, не падение.
- Zod search params со безопасными fallback.
- FSD границы (pages не импортируют `generated/`; Steiger в verify).
- Ручной smoke husky: green commit проходит, `exit 1` в hook abort'ит commit.
- E2e: filters apply/cancel/presets; set-bet success path и 422 UI.

## Какие риски остались

- Seed/store MSW объёмны из-за полноты `AuctionShowResponse`; логика мутации
  компактнее fixture.
- `routeTree.gen.ts` в git шумит в diff.
- Leave-анимация detail только на шевроне (browser Back без CSS leave).
- Highlight ставки по `price` может коллизить при одинаковой цене; floating `%`
  step на нецелых ценах.
- Короткий список на mobile → пагинация сразу expanded; длинная форма фильтров
  в drawer на узком экране.
- E2e только chromium, не в pre-commit; без CI YAML.
- Pre-commit = полный verify со временем станет медленнее; escape hatch легко
  злоупотребить.
- Participants на bets = unique `organization_id` (поля в ответе нет);
  склонение «участник…» упрощённое.

## Что бы кандидат улучшил при наличии ещё одного дня

- Вынести MSW seed в отдельные fixtures; ужать/разбить store.
- CI job: `pnpm verify` + `pnpm test:e2e` (хотя бы chromium).
- Расширить e2e: deep-link `?tab=`, browser Back с detail, больше filter keys /
  комбинаций, multi-browser smoke.
- Подтянуть a11y (фокус-трапы drawer/bottomsheet, live regions для ошибок ставки).
- Уточнить leave-навигацию detail и коллизии highlight после ставки.
- Дописать unit на краевые Zod search / suggest-prices / step с `%`.
- При необходимости: i18n склонений, визуальный polish списка на очень узких
  ширинах.

---

## Полный лог

Черновик по change. Дополнялся при закрытии change.

### Зафиксированные решения

#### `*.component.tsx` — не глобально

В PDF задания в секциях «Детальная страница» и «Бизнес-действие: установка ставки»
спрятан мелкий текст (`IMPORTANT`, ~4pt): суффикс `*.component.tsx` для React-компонентов.

Решение: суффикс обязателен **только** в этих зонах (`pages/auction-detail`,
`pages/bet-form`, `features/set-bet`, при необходимости `features/change-bet`).
Список аукционов, история ставок, shared UI-kit — обычные имена без суффикса.

Правило: `.cursor/rules/component-naming.mdc`.
Отклонено: трактовка «все компоненты проекта» (типичная ошибка AI при полном чтении текста).

#### `002-fsd` — каркас FSD + Steiger

- AI перенёс scaffold в `app/` + `shared/`, подключил Steiger (`recommended`) в `pnpm verify`.
- Решение: пустые `pages/`/`widgets/`/`features/`/`entities/` не создавать (false-positive Steiger).
- Решение: public API per-component в `shared/ui/*`, без layer-level `shared/index.ts`.
- Отклонено: ослабления Steiger на этом этапе (не понадобились).
- Риск: sanity «сломать импорт → red» не гоняли вручную; опирались на recommended + green verify.

#### `003-husky-gate` — pre-commit = полный `pnpm verify`

- AI поставил husky + `prepare`, hook `.husky/pre-commit` → `pnpm verify`, секцию в README.
- Решение (trade-off): полный verify на каждый commit, не lint-staged / не только staged files.
- Отклонено: pre-push вместо pre-commit; урезание gate до одного lint.
- Риск: на больших деревьях pre-commit станет медленным; escape hatch есть, но им легко злоупотребить.
- Проверено вручную: green commit проходит; `exit 1` в hook abort'ит commit.

#### `004-theme-config` — тема с ul.su

- Источник: публичный сайт [ul.su](https://ul.su/); токены в `src/app/styles.css`.
- Решение: primary = жёлтый `#F9C21D` (CTA сайта), accent = оранжевый `#FF7610`;
  `primary-foreground` тёмный на жёлтом для контраста.
- Решение: шрифт Open Sans с сайта не подключали — оставили Geist из bootstrap.
- Отклонено: пиксель-перфект лендинга / смена UI-kit; только CSS tokens + smoke.

#### `005-api` — codegen + ручной MSW

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

#### `006-layout` — shell + file-based router

- AI: `@tanstack/router-plugin`, `app/routes` + `routeTree.gen.ts` в git,
  `widgets/app-shell` (header/content/footer), stub `pages/auction-list`,
  redirect `/` → `/auctions`, favicon/title/description.
- Решение: без sidebar / footer-nav (один раздел); credit-footer и кнопка
  «Разработчик» в scope по запросу оператора.
- Решение: steiger/eslint ignore для `routeTree.gen.ts` и `app/routes`.
- Отклонено: буква «М»/«УЛ» в favicon и «яйцеобразная» форма; итог — мягкий
  жёлтый треугольник без букв.
- Риск: gen в git шумит в diff; detail/bet routes ещё не заведены.

#### `007-list` — список без фильтров

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
- MSW delay ~1s на все handlers вне Vitest (`MOCK_DELAY_MS`); shell entrance CSS
  stagger header → content/footer без framer-motion.
- Mobile compact title: brand-slot swap («Тестовое задание» ↔ «Аукционы»),
  не center overlay; `md+` center compact сохранён. Pagination mobile
  default collapsed summary; expand также при доскролле до конца списка
  (IntersectionObserver на sentinel), collapse при уходе вверх; tap
  expand/collapse сохранён.
- Риск: короткий список всегда «у конца» → пагинация сразу expanded на
  mobile; фильтры ещё не в URL schema.

#### `008-filters` — фильтры списка

- AI: Zod search + `toListRequest`; `widgets/auction-filters` (draft/Save/
  Cancel, пресеты, drawer); MSW filter/sort; `entities/city`; sheet UI-kit;
  skeleton ×12 + scroll lock.
- Оператор: chrome pivot — drawer right/bottom + кнопки в sticky
  pagination (не sidebar, не sticky toolbar у h1); mobile filters остаются
  при expand пагинации.
- Отклонено: later-поля OpenAPI; live-apply; localStorage; hide filters on
  expand.
- Риск: длинная форма в drawer; на узком экране lg-кнопка Фильтры рядом с
  summary пагинации; пресет «Под мой кузов» только открывает секцию.

#### `009-detail-page` — детальная страница (без bets/set-bet)

- AI: `mapAuctionDetail` в `entities/auction/model`; `shared/ui/tabs`;
  `pages/auction-detail` с `*.component.tsx`; MSW contacts/routes + flag
  fixtures (index 1–4); иерархия Инфо (hero → маршрут → grid); CSS
  enter/leave без framer-motion.
- Решение: tab state локальный (не `?tab=`); bets tab только placeholder /
  hide_bets_history; back через delayed navigate для leave-анимации.
- Решение: флаги нормализуются в VM (`visibility.*`); UI читает VM, не
  сырые DTO-флаги порознь.
- Out of scope: `listBets`, форма set-bet, инвалидация после ставки.
- Риск: leave-анимация только на шевроне (browser Back без CSS leave);
  шеврон делает `history.back()` при наличии history, иначе fallback
  `/auctions`; deep-link на таб «Ставки» нет.

#### `010-bets-tab` — вкладка ставок

- AI: `mapBetItem` / `mapBetList` в `entities/bet/model`; `BetsTab` +
  `BetCard` в `pages/auction-detail` (`*.component.tsx`); MSW seed
  multi/empty/rejected/win; query `all=true` для отменённых.
- Решение: participants = unique `organization_id` (нет поля в
  `BetListResponse`); при `hide_bets_history` query `enabled: false`;
  `hide_places` скрывает place на карточке.
- Решение: тесты hide_* через `renderToStaticMarkup` (без RTL deps).
- Out of scope: форма set-bet, инвалидация после mutation, отдельный
  route `/bets`.
- Риск: без `all=true` rejected ставки не видны (MSW/API фильтр);
  склонение «участник/участника/участников» упрощённое.

#### `011-bet-create` — форма ставки

- AI: `features/set-bet` (Zod schema, suggest-prices, mutation wrapper,
  bottomsheet UI `*.component.tsx`); sonner Toaster; Combobox
  (Popover+Command); wiring CTA на PriceHero / BetsTab; controlled tabs;
  post-success highlight.
- Решение: Zod на string input + `parseBetPriceInput` (удобнее RHF, чем
  coerce number); step-валидация относительно `current` (как MSW).
- Решение: highlight по `price` после void 200 (не менять OpenAPI);
  при `hide_bets_history` tab открывается, highlight пропускается.
- Решение: realtime без shake; shake только на 422 server errors.
- Решение: табы detail в URL — `?tab=info|bets` (`parseAuctionDetailSearch`
  + `validateSearch`); битый/пустой → `info`; смена таба и post-success
  → `navigate({ search.tab })` (`replace: true`).
- Отклонено: `next-themes` из shadcn sonner scaffold; flat `shared/ui/*.tsx`
  dump CLI - переложено в per-component folders.
- Риск: коллизия highlight при одинаковой цене; floating `%` step на
  нецелых ценах; toast + checked дублируют success-сигнал.

#### `012-e2e` — Playwright фильтры + set-bet

- AI: `@playwright/test`, `playwright.config.ts` + webServer, `e2e/`
  (fixtures/helpers + filters/set-bet/smoke specs), script `pnpm test:e2e`.
- Решение: **Playwright**, не Cypress (webServer built-in, меньше tooling).
- Решение: e2e **вне** `pnpm verify` / husky — иначе pre-commit слишком
  медленный; gate остаётся typecheck+lint+fsd+unit.
- Решение: chromium only; селекторы role/text, без массовых testid.
- Решение: кейс 422 в UI — stub `window.fetch` поверх MSW (клиентский Zod
  зеркалит правила MSW и не даёт отправить заведомо битую цену).
- Отклонено: e2e внутри матрицы всех filter keys / multi-browser / CI YAML.
