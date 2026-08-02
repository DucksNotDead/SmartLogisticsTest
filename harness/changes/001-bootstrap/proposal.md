# Proposal: 001-bootstrap

## Goal

Инициализировать Vite/React/TS проект: зависимости стека (включая shadcn/radix),
глобальные скрипты и gate `verify`. Без страниц, роутов и бизнес-логики.

## In scope

- Scaffold Vite (React + TypeScript) в корне, `pnpm`
- Базовый tooling: TypeScript strict-ish, path alias `@/*` → `src/*`
- Зависимости:
  - React
  - TanStack Router, TanStack Query
  - React Hook Form + Zod
  - Zustand (точечный UI-state; смена на MobX — отдельное решение позже)
  - MSW (пакет + `msw init`, без продуктовых handlers)
  - Tailwind + shadcn/ui на базе Radix (инициализация CLI, 1–2 smoke-компонента из registry для проверки setup)
- ESLint (+ prettier по желанию), Vitest
- Scripts: `dev`, `build`, `typecheck`, `lint`, `test`, **`verify`**
- Минимальный `src/`: entry + пустой app shell (без FSD-страниц и routes map)
- Короткий README: install / dev / verify
- Заготовка `AI_USAGE.md` (1–2 строки)

## Out of scope

- FSD-слайсы pages/widgets/features/entities (кроме пустых папок — **не делать**, отложить)
- Маршруты и page-компоненты (list/detail/bet)
- Провайдеры Router/Query «под фичи», MSW start в app, API-клиент, OpenAPI types
- Любая логика аукционов, фильтры, ставки, fixtures
- Полноценный UI-kit набор компонентов (только bootstrap shadcn + smoke)
- E2E, Docker, CI, workspaces

## Acceptance

- `pnpm i` и `pnpm verify` green
- `pnpm dev` / `pnpm build` не падают на пустом shell
- В проекте подключены заявленные библиотеки (есть в `package.json` + конфиги)
- shadcn/radix инициализированы (components.json / папка ui), smoke-компонент собирается
- Нет routes, pages аукционов, OpenAPI/MSW handlers бизнес-эндпоинтов
