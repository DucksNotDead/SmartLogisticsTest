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
  pages/      # auction-list (пока только заголовок)
  widgets/    # app-shell (header + content + footer)
  entities/   # auction / bet — public API поверх codegen
  shared/
    api/      # HTTP mutator, errors, OpenAPI codegen, MSW mocks
    ui/       # UI-kit (button/input)
    lib/      # cn и прочие утилиты
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
  `/auctions`)
- сгенерированное дерево: `src/app/routeTree.gen.ts` (в git; не править руками)
- `RouterProvider` + `createRouter` в `app/`

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

В `pnpm dev` worker стартует из `app/main.tsx`. Для unit-тестов тот же store/handlers через `setupServer` (`vitest.setup.ts`).

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
2. `pnpm dev` — `/` редиректит на `/auctions`; видны header, заголовок
   «Аукционы», footer; MSW отвечает на `/api/v1/...`.
3. Адаптив: ~375px и desktop без горизонтального scroll; кнопка «Разработчик»
   и ссылки footer открываются корректно.
4. После смены OpenAPI: `pnpm api:gen`, затем снова `pnpm verify`.
