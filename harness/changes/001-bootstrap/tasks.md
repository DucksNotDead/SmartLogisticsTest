# Tasks: 001-bootstrap

Gate: нет `verify` script → `check:` из task; иначе → `pnpm verify`.

---

- [x] Vite React-TS scaffold в корне; pnpm; `.gitignore`
      check: `test -f package.json && test -f vite.config.ts`

- [x] * Path alias `@/*` → `src/*` (vite + tsconfig); строгий TS достаточно для scaffold;
      scripts `dev`, `build`, `typecheck`, **`verify`** (= typecheck); `pnpm i` + `pnpm verify`
      check: `pnpm verify`

- [x] ESLint flat config; добавить `lint` в `verify`; green
      check: `pnpm verify`

- [x] Vitest + smoke test; `test` в `verify`; green
      check: `pnpm verify`

- [x] * Runtime deps: `@tanstack/react-router`, `@tanstack/react-query`,
      `react-hook-form`, `@hookform/resolvers`, `zod`, `zustand`, `msw`
      (без wiring провайдеров/роутов/handlers). `msw init public --save`.
      check: `pnpm verify`

- [x] Tailwind + shadcn init (Radix); 1–2 smoke-компонента (button/input);
      импорт smoke в пустом `App` только чтобы typecheck/build видели setup
      (без страниц и бизнес-UI).
      check: `pnpm verify`

- [x] README (install/dev/verify) + заготовка `AI_USAGE.md`
      check: `pnpm verify`
