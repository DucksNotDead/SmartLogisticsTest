# Design: 001-bootstrap

## Approach

Только tooling + deps + gate. Продуктовый каркас (FSD pages, router tree, MSW handlers)
— следующие changes.

1. Vite React-TS в корне репо.
2. Tailwind v4 или v3 — как требует актуальный shadcn init; не изобретать свой CSS stack.
3. `pnpm dlx shadcn@latest init` + добавить 1–2 примитива (например `button`, `input`) в
   `src/shared/ui` или путь, который задаст CLI — потом при необходимости перенесём под FSD.
4. Поставить остальные libs без wiring в app (можно не создавать RouterProvider/QueryClient
   до change с app shell / pages).
5. `verify` = typecheck + lint + test; нарастить сразу после появления scripts.

## Целевой минимум файлов src

```text
src/
  main.tsx          # mount пустого shell
  App.tsx           # или app/App — без роутера
  index.css         # tailwind entry
  shared/ui/        # shadcn components (путь уточнить по components.json)
```

Без `pages/`, без route tree, без mocks handlers.

## Dependencies (обязательно поставить)

- react, react-dom
- @tanstack/react-router, @tanstack/react-query
- react-hook-form, @hookform/resolvers, zod
- zustand
- msw
- tailwind + shadcn/radix peer deps (как поставит init)
- vitest, eslint (и необходимые parsers/plugins)

## Scripts

```json
"dev": "vite",
"build": "tsc -b && vite build",
"typecheck": "tsc -b --pretty",
"lint": "eslint .",
"test": "vitest run",
"verify": "pnpm typecheck && pnpm lint && pnpm test"
```

## Trade-offs

| Option | Decision |
|---|---|
| pnpm | да |
| Zustand vs MobX | Zustand сейчас |
| shadcn path | путь CLI по умолчанию / `src/shared/ui` если init позволит |
| Router/Query wiring | **не в этом change** — только dependency |
| MSW worker start | **не в этом change** — только пакет + `msw init public` |
| FSD folders | **не создавать** в bootstrap |

## Progressive verify

- До script `verify`: `check:` в task
- После: каждый task → `pnpm verify`
