# Proposal: 005-api

## Goal

Собрать API-слой поверх `input/openapi.auctions.v0.json` через codegen
(`openapi-typescript` + Orval): типы и TanStack Query-клиент без drift от схемы,
HTTP mutator с разбором ошибок, MSW-моки с мутацией после `setBet`.

## In scope

- Codegen pipeline:
  - `openapi-typescript` → TS schema types из OpenAPI
  - Orval (`client: 'react-query'`) → fetchers / query+mutation hooks для 4 ops
  - scripts (`api:types`, `api:client` или единый `api:gen`); generated в git
    или явная команда в README + verify/typecheck опирается на актуальный output
- Custom mutator в `shared/api`: base `/api/v1/`, fetch + JSON, typed errors
  (`ProblemDetail`, `ValidationProblem` / `ValidationError`, `ApiError`)
- Операции (из Orval, public re-export через entities):
  - `listAuctions` → `POST /auctions/list`
  - `getAuction` → `GET /auctions/{auctionUuid}`
  - `listBets` → `GET /auctions/{auctionUuid}/bets` (`all?`)
  - `setBet` → `POST /auctions/{auctionUuid}/bets` (`price`)
- Ручные MSW handlers на 4 эндпоинта (не Orval-mock); in-memory store;
  после `setBet` обновляются current price / user trading status / bets list
- Старт MSW worker в `app` (dev); минимальный `QueryClientProvider` в `app`
- Unit-тесты на **все 4 метода** (happy path + ключевые ошибки) через MSW
  `setupServer` / тот же store; входят в `pnpm test` → каждый `pnpm verify`
  (и husky pre-commit) далее постоянно
- Отдельно: разбор 422/`ValidationProblem` в mutator; `setBet` мутирует store
- README: codegen (`pnpm api:gen`), FSD-обёртки entities, MSW mutable, api tests
- Черновик решения в `AI_USAGE.md`: почему codegen (`openapi-typescript` + Orval);
  почему MSW вручную, а не Orval-mock

## Out of scope

- Pages / widgets / features UI (list, detail, bet-form), роуты TanStack Router
- Zod search params списка, Zod-схема формы ставки, ViewModel-мапперы под UI
- Ручные DTO «1:1 со схемой» вместо codegen; Orval `mock: true` / faker fixtures
- Runtime Zod-parse каждого response (Zod позже для forms/search params)
- Реальный backend / auth / 401 UX-flow сверх типизированной ошибки
- E2E (Playwright/Cypress); `@x`-связи сверх необходимости

## Acceptance

- Единственный источник контракта: `input/openapi.auctions.v0.json`;
  types/client сгенерированы, не набраны вручную
- List/detail модели из схемы раздельно (нет ручного merge trading DTO)
- Клиент бьёт в `/api/v1/...`; 401/404/503 → `ProblemDetail`; 422 →
  `ValidationProblem` с `errors[]`
- Четыре операции доступны через public API `entities/auction` / `entities/bet`
  (re-export codegen, без deep-import generated из pages)
- MSW: list/detail/bets читают store; `setBet` мутирует цену/статус/ставки
- `setBet` 200 без схемы в OpenAPI → клиент не требует body
- Unit-тесты покрывают `listAuctions`, `getAuction`, `listBets`, `setBet`;
  гоняются в `pnpm test` как часть `pnpm verify`
- `pnpm verify` green; README описывает `api:gen` + API + MSW + тесты
