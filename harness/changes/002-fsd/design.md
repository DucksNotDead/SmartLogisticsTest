# Design: 002-fsd

## Approach

1. Поставить Steiger + FSD-plugin, зафиксировать `steiger.config.ts` на
   `fsd.configs.recommended`.
2. Собрать минимальный FSD-каркас (`app` + `shared`), перенести bootstrap-файлы.
3. Включить `fsd` в `verify` — gate обязателен для любого следующего кода.
4. Пустые продуктовые слои/слайсы не создавать: иначе Steiger ругается на
   `no-segmentless-slices` / `insignificant-slice`. Слайсы появятся в следующих changes.

## FSD layout (целевой минимум)

```text
src/
  app/
    styles.css          # бывший index.css (tailwind entry)
    App.tsx             # smoke shell (кнопка/инпут)
    main.tsx            # createRoot → App (Vite entry)
  shared/
    ui/
      button/
        button.tsx
        index.ts        # явный re-export (не export *)
      input/
        input.tsx
        index.ts
    lib/
      utils.ts          # cn()
      index.ts          # export { cn }
  smoke.test.ts         # можно оставить в src/ или shared/lib — без бизнес-слайсов
```

Не создавать сейчас: `pages/`, `widgets/`, `features/`, `entities/`, `processes/`.

Vite `index.html` → `src/app/main.tsx` (или тонкий `src/main.tsx`, который только
реэкспортирует `app/main` — предпочтение: entry сразу в `app/`, без orphan-файлов
вне слоёв; если Steiger/Vite потребуют исключение — зафиксировать в steiger ignores).

## Aliases

- Сохранить `@/*` → `src/*` (Vite + tsconfig).
- `components.json`:
  - `ui` → `@/shared/ui`
  - `utils` → `@/shared/lib/utils` (или `@/shared/lib`)
  - `lib` → `@/shared/lib`
  - `components` → `@/shared/ui` (или оставить согласованно с shadcn CLI)
- Импорты в коде: `@/shared/ui/button`, `@/shared/lib` — не deep-import внутренних
  модулей слайса в обход `index.ts`.

## Steiger gate

```ts
// steiger.config.ts
import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  // точечные ослабления только если recommended ломает легитимный shared/ui layout;
  // каждое ослабление — запись в Trade-offs / AI_USAGE
])
```

Scripts:

```json
"fsd": "steiger ./src",
"verify": "pnpm typecheck && pnpm lint && pnpm fsd && pnpm test"
```

Жёсткость: нарушения слоёв, cross-import слайсов, public-api sidestep = fail verify.
Не дублировать вторым ESLint boundaries-плагином в этом change.

## Public API policy (этот change)

| Место | Политика |
|---|---|
| `shared/ui/<component>/index.ts` | явный export компонента |
| `shared/lib/index.ts` | явный export утилит (`cn`) |
| layer-level `shared/index.ts` / `app/index.ts` | **не создавать** (`fsd/no-layer-public-api`) |

## App shell

- Без RouterProvider / QueryClientProvider / MSW start (это следующие changes).
- `App.tsx` продолжает smoke-рендер Button+Input из `shared/ui`.
- Сегмент `ui` на слое `app` **запрещён** (`fsd/no-ui-in-app`).

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Steiger vs eslint-plugin-boundaries | официальный FSD-linter, правила слоёв/API | отдельный tool в verify | **Steiger** |
| Пустые `pages/`/`entities/` сейчас | «видны слои» | false-positive Steiger, мёртвый каркас | **не создавать** |
| Entry в `app/main.tsx` vs `src/main.tsx` | всё под слоями | правка index.html | **предпочтительно `app/main.tsx`** |
| Barrel `shared/ui/index.ts` на весь UI-kit | один импорт | тащит неиспользуемое | **per-component index** (как в `fsd-structure.mdc`) |
| Ослаблять `fsd/public-api` на shared | проще миграция | дырявый gate | **не ослаблять без доказанной боли** |

## Progressive verify

После появления script `fsd` в `verify` — каждый task → `pnpm verify`.
До включения `fsd` в verify: `pnpm fsd` отдельно + `pnpm typecheck`/`lint`/`test` по смыслу task.
