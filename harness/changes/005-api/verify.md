# Verify: 005-api

## Auto

- `pnpm verify` (= typecheck + lint + fsd + **test**)
- `pnpm test` обязан включать unit по всем 4 методам + mutator 422
  (далее каждый verify / pre-commit)

## Change acceptance

- [x] Types/client из codegen (`openapi-typescript` + Orval), не ручные DTO;
      scripts `api:gen` (или эквивалент) задокументированы
- [x] List/detail schema types разделены схемой (нет ручного merge trading)
- [x] Четыре операции через `entities/auction` / `entities/bet`; путь `/api/v1/...`
- [x] Ошибки 401/404/503 → `ProblemDetail`; 422 → `ValidationProblem.errors[]`
- [x] MSW handlers (ручные) покрывают list / get / listBets / setBet; mutation
      не static; Orval mock не используется как источник правды store
- [x] Unit-тесты: `listAuctions`, `getAuction` (в т.ч. 404), `listBets`,
      `setBet` (200 + мутация store + 422); mutator 422
- [x] `setBet` клиент не требует response body
- [x] Нет pages/router/UI ставок; Steiger green (generated ignored/совместим)
- [x] `pnpm verify` green (api-тесты не исключены из suite)
- [x] README + `AI_USAGE.md` описывают codegen, ручной MSW, api unit в verify

## Manual

- [x] `pnpm api:gen` после правки OpenAPI пересобирает types/client
- [x] `pnpm dev` → MSW отвечает на вызов сгенерированного клиента — не блокер
  close, если auto-тесты green
