# Proposal: 002-fsd

## Goal

Перевести scaffold на Feature-Sliced Design и встроить жёсткий архитектурный gate
(Steiger) в `pnpm verify`, чтобы любой новый код проверялся на слои/слайсы/публичный API.

## In scope

- Каркас слоёв FSD в `src/`: минимум `app/` и `shared/` (сегменты по назначению)
- Перенос текущего scaffold:
  - entry/shell → `app/`
  - shadcn UI (`button`, `input`) → `shared/ui`
  - `cn`/utils → `shared/lib`
  - глобальные стили → `app/` (или сегмент styles в `app`)
- Публичные API сегментов/компонентов (`index.ts`, без `export *`)
- Обновить aliases: Vite, TS, `components.json` (shadcn пишет в `shared/ui`)
- Steiger + `@feature-sliced/steiger-plugin`, `steiger.config.*` (recommended)
- Script `fsd` (или `lint:fsd`) и включение в `verify`
- README: кратко про FSD-layout и что `verify` включает FSD-gate
- Smoke shell остаётся рабочим (`dev`/`build`/`verify` green)

## Out of scope

- Продуктовые слайсы `pages/*`, `widgets/*`, `features/*`, `entities/*` (list/detail/bet)
- Wiring TanStack Router / Query / MSW worker start / API-клиент / OpenAPI types
- `@x`-cross-imports между entities (нет entities)
- Полноценный UI-kit сверх уже существующих smoke-компонентов
- CI/E2E/Docker
- Смена Zustand → MobX

## Acceptance

- Дерево `src/` соответствует FSD (`app`, `shared`; нет legacy `src/components`, `src/lib`)
- Импорты UI/utils идут через публичный API `shared`
- `pnpm fsd` (или аналог) падает на нарушении слоёв/cross-import/public-api sidestep
- `pnpm verify` = typecheck + lint + **fsd** + test, green на текущем каркасе
- `pnpm dev` / `pnpm build` не падают
- Продуктовых страниц/роутов/handlers по-прежнему нет
