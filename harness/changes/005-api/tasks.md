# Tasks: 005-api

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] DevDeps `openapi-typescript` + `orval`; `orval.config.ts` (react-query,
      `mock: false`, mutator → `shared/api`); scripts `api:types` / `api:client` /
      `api:gen`; `shared/api` http mutator + error types/guards; первый
      `pnpm api:gen` → `shared/api/generated/` (schema + client).
      check: generated есть, `pnpm typecheck` не падает на output

- [x] Entities public API: `entities/auction` + `entities/bet` re-export 4 ops
      (listAuctions, getAuction, listBets, setBet) и нужные schema types;
      pages не импортируют `generated/` напрямую; steiger/eslint ignores на
      generated при необходимости.
      check: `pnpm verify`

- [x] Mutator: base `/api/v1`, 401/404/503 → `ProblemDetail`, 422 →
      `ValidationProblem`; unit на разбор 422; `setBet` 200 без body.
      check: `pnpm verify`

- [x] * MSW: in-memory store + handlers на 4 эндпоинта (не Orval-mock);
      `setBet` мутирует price / status_mobile / bets (+ sync list item);
      404/422 по контракту; seed типизирован generated schema;
      `setupServer` для Vitest (те же handlers).
      check: `pnpm verify`

- [x] Unit-тесты на все 4 метода через public API entities + MSW server:
      listAuctions / getAuction (200+404) / listBets / setBet (200+mutation+422);
      reset store в `beforeEach`; тесты в `pnpm test` (= часть verify навсегда).
      check: `pnpm test` гоняет все api-кейсы && `pnpm verify`

- [x] `app`: MSW worker start (dev) + `QueryClientProvider`; smoke shell без pages.
      check: `pnpm verify`

- [x] README: `pnpm api:gen`, слой shared/api + entities, MSW mutable, что api
      unit-тесты в `pnpm verify`; пункт в `AI_USAGE.md` (codegen; MSW вручную).
      check: `pnpm verify`
