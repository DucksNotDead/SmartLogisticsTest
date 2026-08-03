# Smart Logistics Test (УЛ Лайт)

SPA для работы с грузовыми аукционами (тестовое задание).

## Требования

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+

## Установка

```bash
pnpm install
```

## Структура (FSD)

```text
src/
  app/        # entry, QueryClientProvider, MSW, RouterProvider, file-based routes
  pages/      # auction-list, auction-detail
  widgets/    # app-shell, auction-filters (toolbar / drawer / form)
  features/   # set-bet (форма ставки в bottomsheet)
  entities/   # auction / bet / city — public API поверх codegen
  shared/
    api/      # HTTP mutator, errors, OpenAPI codegen, MSW mocks
    ui/       # UI-kit (button/input/select/sheet/tabs/sonner/command/popover)
    lib/      # cn и прочие утилиты
    model/    # точечный UI-state (compact title store)
```

## App shell и роутинг

Shell в `widgets/app-shell`: сверху header, ниже outlet страницы, внизу footer
с кредитами (не tab-bar). Одна модель на mobile (~375px) и desktop (`md`+):
меняются отступы/ширина, без sidebar и нижней навигации.

- Header: favicon-mark + бренд слева; справа primary-кнопка «Разработчик» →
  [dev.holuenko.ru](https://dev.holuenko.ru) в новом окне
- Footer: «Разработано с глубоким уважением для ООО Умная логистика» +
  Telegram / визитка / почта
- Document meta: `index.html` (`lang="ru"`, title/description) и
  `public/favicon.svg` (вкладка + header)

File-based TanStack Router:

- plugin `@tanstack/router-plugin` в `vite.config.ts` (до `react()`)
- route-файлы: `src/app/routes/` (`__root`, `/` → redirect на `/auctions`,
  `/auctions`, `/auctions/$auctionUuid`)
- сгенерированное дерево: `src/app/routeTree.gen.ts` (в git; не править руками)
- `RouterProvider` + `createRouter` в `app/`

## Список аукционов

Страница `/auctions` (`pages/auction-list`):

- данные через TanStack Query (`useListAuctions` → `POST /auctions/list`)
- пагинация по `meta`; `page` и `per_page` в URL; выбор размера
  5 / 10 / 15 / 20 через `shared/ui/select` (смена → `page=1`)
- Zod search: `page` / `per_page` + filter keys; битые значения → безопасный
  fallback (`page=1`, `per_page=20`, неизвестные фильтры отбрасываются)
- sticky chrome: header/footer shell + пагинация списка; скролл у main;
  при mount плавно: header, затем content + footer
- при скролле page-title под header: на mobile «Аукционы» плавно на месте
  «Тестовое задание»; на `md+` compact в центре header
- пагинация: blur-чипы; на mobile по умолчанию summary (tap раскрывает);
  на `md+` сразу развёрнута; груз в карточке - badges под датами
- UI states: skeleton ×12 / empty / error (+ «Повторить»); skeleton в той
  же сетке, что и карточки (`lg:grid-cols-2`); на `isPending` скролл main
  заблокирован
- в `pnpm dev` MSW держит ответы ~1s (`MOCK_DELAY_MS`), чтобы skeleton был
  заметен (в `pnpm test` задержки нет)
- hover/focus по карточке префетчит `GET /auctions/{uuid}` в Query cache
- клик ведёт на detail (`/auctions/$auctionUuid`)
- адаптив: 1 колонка mobile, 2 колонки на `lg+`; без horizontal overflow

## Детальная страница

Страница `/auctions/$auctionUuid` (`pages/auction-detail`):

- данные через TanStack Query (`useGetAuction` → `GET /auctions/{uuid}`)
- DTO/VM: `AuctionShow*` / `mapAuctionDetail` (не list DTO)
- chrome: шеврон назад слева от `h1` → список; табы `shared/ui/tabs`
  «Инфо» | «Ставки» в URL (`?tab=info|bets`, Zod fallback → `info`)
- «Инфо»: иерархия hero (цена / статус / своя ставка) → маршрут →
  supporting grid (груз/ТС, оплата, организатор, контакты, параметры)
- «Ставки»: `useListBets` → `GET /auctions/{uuid}/bets?all=true`
  (отменённые ставки видны); mapper `mapBetList` + derived
  `participantsCount` (unique org)
- при `hide_bets_history` - «История ставок скрыта», без fetch bets
- карточки иерархичные: цена крупнее; place / win / rejected цветом;
  перевозчик и дата вторичнее; `cancel_reason` при отмене
- `hide_places` скрывает место в рейтинге на карточке ставки
- empty / skeleton / error(+retry) на вкладке
- флаги: `can_set_bet`, `hide_bets_history`, `hide_places`,
  `hide_points_address_and_contacts`, `no_view_cargo_price`
- UI states detail: skeleton / error (+ retry) / 404
- enter/exit: CSS fade/slide на корне page (без framer-motion)
- все React-компоненты detail / set-bet: суффикс `*.component.tsx`
- адаптив: `min-w-0` / `overflow-x-hidden`; supporting 1→2 колонки на `md+`

### Установка ставки

Feature `features/set-bet` + CTA на detail:

- кнопка «Установить ставку» на карточке (PriceHero) и во вкладке
  «Ставки», только при `trading.can_set_bet`
- форма в bottomsheet (`Sheet side=bottom`): RHF + Zod; цена > 0;
  min / max / step / current учитываются, если есть в detail
- подсказка «доступно / шаг» + Combobox-пикер предложенных шагов
- realtime-валидация: текст ошибки без shake; на 422 - shake поля +
  плавное сообщение + error toast (`ValidationProblem.errors[]`)
- `POST /auctions/{uuid}/bets` → invalidate list / detail / bets;
  MSW обновляет current price, `status_mobile`, `your`, список ставок
- success: зелёный checked → через ~1s закрыть sheet → таб «Ставки» →
  ~1.5s highlight созданной ставки (match по price; ответ API void)

### Фильтры списка

- URL = applied filters; правки формы живут в draft до Save
- Save → URL + `page=1` + список; Cancel discard; Reset → defaults в URL
- Desktop (`md+`): «Фильтры» (+ «Сбросить») после «На странице» в
  пагинации; форма в drawer справа; sticky toolbar у заголовка нет
- Mobile (`<md`): «Фильтры» (+ «Сбросить») и пагинация в одном
  горизонтальном ряду; при развороте пагинации фильтры остаются; drawer
  снизу
- «Фильтры» / «Сбросить» одного крупного размера; Save/Cancel в форме
  всегда в один ряд
- Scroll не у конца списка → pagination снова summary (даже после ручного
  expand)
- Пресеты toggle (повторный клик снимает): «Можно ставить», «Мои
  активные», «Скоро закроются», «Под мой кузов»
- В форме всегда видны: пресеты, номер заявки, сортировка; остальные
  секции сворачиваемые
- Города из мок-словаря `entities/city`; MSW реально фильтрует/сортирует

Примеры:

- `/auctions` или `/auctions?page=1&per_page=20`
- `/auctions?page=2&per_page=10`
- `/auctions?is_available=true&load_city=Москва&sort_field=stop_time&sort_dir=asc`
- битые params (`page=abc`, `per_page=7`, неизвестный `status`) → fallback

## API и codegen

Единственный источник контракта: `input/openapi.auctions.v0.json`.

```bash
pnpm api:types   # openapi-typescript → shared/api/generated/schema.d.ts
pnpm api:client  # Orval react-query client → shared/api/generated/
pnpm api:gen     # types + client
```

Сгенерированные файлы в git; после правки OpenAPI пересоберите `pnpm api:gen`.

Публичный доступ к операциям — через entities, не deep-import `generated/`:

- `entities/auction` — `listAuctions`, `getAuction`
- `entities/bet` — `listBets`, `setBet`

HTTP: base `/api/v1`, mutator в `shared/api` (ошибки 401/404/503 → `ProblemDetail`, 422 → `ValidationProblem`).

## MSW

Ручные handlers + in-memory store в `shared/api/mocks` (не Orval-mock): после `setBet` обновляются текущая цена, `status_mobile` и список ставок; list item синхронизируется с detail.

В `pnpm dev` worker стартует из `app/main.tsx`. Все MSW handlers отвечают
с задержкой ~1s (`MOCK_DELAY_MS`), чтобы были видны skeleton / loading.
В Vitest (`import.meta.env.MODE === 'test'`) delay = 0.

Для unit-тестов тот же store/handlers через `setupServer` (`vitest.setup.ts`).

## Тема UI

Цветовые токены shadcn/Tailwind в `src/app/styles.css` взяты с публичного сайта бренда
[ul.su](https://ul.su/) (жёлтый primary `#F9C21D`, оранжевый accent, тёмный ink).
Цель — узнаваемый UI для проверки, не пиксель-перфект клон лендинга.

## Скрипты

```bash
pnpm dev       # Vite + MSW (dev)
pnpm build     # production-сборка
pnpm api:gen   # пересборка types/client из OpenAPI
pnpm fsd       # Steiger (FSD)
pnpm test      # Vitest (в т.ч. api unit на 4 ops + mutator)
pnpm verify    # typecheck + lint + fsd + test
```

`pnpm verify` включает api unit-тесты: они часть постоянного gate (и husky pre-commit).

## Pre-commit

После `pnpm install` Husky ставит `.husky/pre-commit` → полный `pnpm verify`. Red блокирует commit.

Escape hatch: `HUSKY=0 git commit ...` или `git commit --no-verify`.

## Проверка

1. `pnpm verify` — green (typecheck, lint, FSD, api tests).
2. `pnpm dev` — `/` → `/auctions?page=1&per_page=20`; ~1s skeleton, затем список.
3. Пагинация / `per_page` меняют URL и контент; при скролле chrome и
   пагинация на месте; hover → prefetch detail; клик → detail page.
4. Detail: шеврон назад; табы Инфо/Ставки (`?tab=`); hero цены
   доминирует; CSS enter/exit; 404 на неизвестный uuid.
5. Seed fixtures (list page 1): index 1 hide points/contacts; 2 no cargo
   price; 3 hide bets history; 4 can_set_bet=false; 5 empty bets;
   6 winner bet (`is_win`); 7 hide places; index 0 — ≥2 ставки +
   rejected с reason.
6. Detail → «Ставки»: участники, цены с/без НДС, статусы цветом;
   hide bets / hide places / empty / win / rejected.
7. Set-bet (`can_set_bet=true`): CTA на карточке и во вкладке ставок →
   bottomsheet; пикер шага; успех → checked → таб «Ставки» + highlight;
   невалидная цена → 422 shake; `can_set_bet=false` → CTA нет.
8. Desktop: Фильтры после «На странице»; drawer справа; Save/Cancel/Reset.
9. Mobile ~375: Фильтры и пагинация в одном ряду; detail/bets/sheet без
   horizontal scroll; draft без Save не меняет список.
10. Pending list: 12 skeleton, скролл заблокирован; пресеты toggle.
10. После смены OpenAPI: `pnpm api:gen`, затем снова `pnpm verify`.
