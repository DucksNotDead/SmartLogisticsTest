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
  pages/      # auction-list (Query + pagination + filters wiring)
  widgets/    # app-shell, auction-filters (toolbar / drawer / form)
  entities/   # auction / bet / city — public API поверх codegen
  shared/
    api/      # HTTP mutator, errors, OpenAPI codegen, MSW mocks
    ui/       # UI-kit (button/input/select/sheet)
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
  `/auctions`, stub `/auctions/$auctionUuid`)
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
- в `pnpm dev` MSW держит `POST /auctions/list` ~2s, чтобы skeleton был
  заметен (в `pnpm test` задержки нет)
- hover/focus по карточке префетчит `GET /auctions/{uuid}` в Query cache
- клик ведёт на stub detail (`/auctions/$auctionUuid`); полный detail UI позже
- адаптив: 1 колонка mobile, 2 колонки на `lg+`; без horizontal overflow

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

В `pnpm dev` worker стартует из `app/main.tsx`. List-handler намеренно
отвечает с задержкой ~2s (`LIST_DELAY_MS`), чтобы на `/auctions` был виден
skeleton. В Vitest (`import.meta.env.MODE === 'test'`) delay = 0.

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
2. `pnpm dev` — `/` → `/auctions?page=1&per_page=20`; ~2s skeleton, затем список.
3. Пагинация / `per_page` меняют URL и контент; при скролле chrome и
   пагинация на месте; hover → prefetch detail; клик → stub `/auctions/{uuid}`.
4. Desktop: Фильтры после «На странице»; drawer справа; Save/Cancel/Reset.
5. Mobile ~375: Фильтры и пагинация в одном ряду; expand не прячет фильтры;
   scroll не у конца → summary; draft без Save не меняет список.
6. Pending: 12 skeleton, скролл заблокирован; пресеты toggle; секции
   формы сворачиваются (кроме пресетов / номера / сортировки).
7. Адаптив: ~375px 1 колонка, `lg+` 2 колонки; без горизонтального scroll.
8. После смены OpenAPI: `pnpm api:gen`, затем снова `pnpm verify`.
