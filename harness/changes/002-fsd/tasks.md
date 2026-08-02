# Tasks: 002-fsd

Gate: `pnpm verify` (после включения `fsd` в script). До этого — `pnpm fsd` + остальные
части verify по смыслу шага.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] DevDeps `steiger` + `@feature-sliced/steiger-plugin`; `steiger.config.ts` на
  ```
  `fsd.configs.recommended`; script `"fsd": "steiger ./src"` (ещё **не** в verify).
  check: `pnpm fsd` отрабатывает на текущем дереве (допускается red до миграции —
  тогда зафиксировать вывод; цель шага — пакет + конфиг + script)
  ```

- [x] Перенос UI/utils в FSD `shared/`: `shared/ui/{button,input}` + per-component
  ```
  `index.ts`; `shared/lib` + `index.ts`; обновить `components.json` aliases;
  удалить legacy `src/components`, `src/lib`. Импорты только через public API.
  check: `pnpm typecheck && pnpm lint && pnpm test`
  ```

- [x] Перенос shell в `app/`: styles + `App.tsx` + Vite entry (`app/main.tsx` /
  ```
  правка `index.html`); убрать orphan-файлы вне слоёв; smoke shell жив.
  check: `pnpm typecheck && pnpm build && pnpm test`
  ```

- [x] Включить `fsd` в `verify` (`typecheck && lint && fsd && test`); добить green
  ```
  Steiger (точечные ignores/rule overrides только с записью в design/AI_USAGE).
  check: `pnpm verify`
  ```

- [x] README: FSD-layout (`app`/`shared`) + что `verify` гоняет Steiger.
  ```
  check: `pnpm verify`
  ```
