# Design: 005-api

## Approach

1. Codegen от `input/openapi.auctions.v0.json`:
   - `openapi-typescript` → schema types (`shared/api/generated/schema.d.ts`
     или соседний путь; не править руками)
   - Orval → React Query client (`client: 'react-query'`, `mock: false`)
     с custom mutator из `shared/api`
2. `shared/api` mutator: `BASE_URL = '/api/v1'`, fetch/JSON, map status →
   `ApiError` + `ProblemDetail` | `ValidationProblem`.
3. Entities только тонкие public API: re-export нужных hooks/functions/types
   из generated (auction vs bet по operationId / tag `Auctions`).
4. MSW вручную в `shared/api/mocks` (mutable store) — Orval mocks не использовать.
   Причина: ТЗ требует моки, которые **реально меняют состояние** после
   mutations (`setBet` → current price, status пользователя, список ставок).
   Orval `mock: true` даёт faker/статичные handlers по схеме, без доменного
   store; кастомизация generated mocks ≈ ручной код + риск затереть при
   `api:gen`. Codegen остаётся для types + RQ client.
5. `app`: MSW start (dev) + `QueryClientProvider`; Router/pages не трогаем.
6. Unit-тесты на все 4 ops + mutator errors; прогон всегда через `pnpm test`
   внутри `pnpm verify` (и pre-commit).

### Unit tests (обязательно, постоянный gate)

| Method | Минимум кейсов |
|---|---|
| `listAuctions` | 200 + форма `data`/`meta`; при необходимости пустой список |
| `getAuction` | 200 detail; 404 неизвестный uuid |
| `listBets` | 200 `bets[]`; опционально `all` |
| `setBet` | 200 + мутация store (price / status_mobile / bets / sync list); 422 невалидная цена |
| mutator | 422 → `ValidationProblem.errors[]` |

Инфра: Vitest + MSW `setupServer` на тех же handlers/store, что и browser worker
(или общий `handlers` + reset store в `beforeEach`). Тесты рядом с api/mocks
(`*.test.ts`), не E2E. Новые api-тесты не выключать из `verify`.

### Codegen wiring

```text
input/openapi.auctions.v0.json
        │
        ├─ openapi-typescript  →  shared/api/generated/schema.d.ts
        │
        └─ orval (react-query) →  shared/api/generated/auctions*.ts
                                  (+ schemas если Orval пишет модели отдельно)
                                        │
                              mutator: shared/api/http.ts
                                        │
                    entities/auction|bet  (public re-export)
```

Scripts (имена зафиксировать в `package.json`):

```json
"api:types": "openapi-typescript input/openapi.auctions.v0.json -o src/shared/api/generated/schema.d.ts",
"api:client": "orval --config orval.config.ts",
"api:gen": "pnpm api:types && pnpm api:client"
```

Orval: `override.mutator` → `shared/api` http helper; generated файлы
пометить header «do not edit»; eslint/steiger ignore на `generated/` при необходимости
(`fsd` не должен падать на codegen layout).

### Контракт (кратко)

| op | method path | req | 200 |
|---|---|---|---|
| listAuctions | POST `/auctions/list` | `AuctionListRequest?` | `AuctionListResponseBase` |
| getAuction | GET `/auctions/{uuid}` | — | `AuctionShowResponse` |
| listBets | GET `/auctions/{uuid}/bets` | `all?` | `BetListResponse` |
| setBet | POST `/auctions/{uuid}/bets` | `SetBetRequest` | schema нет → void / ignore body |

Фильтры: `status` / `mobile_statuses` ≠ `statuses` (числовые ID аукциона).
List trading ≠ Show trading — гарантирует схема + codegen, не ручной merge.

### MSW store (минимум)

- Seed: ≥1 auction list item + matching show + bets (типы из generated schema).
- `setBet(price)`: append bet; обновить `trading.price.current` (+ no_vat если есть);
  выставить `your.bet` / `last_bet`; сдвинуть `status_mobile` в Leading/Losing
  осмысленно для seed; list item синхронизировать с detail.
- Ошибки: неизвестный uuid → 404 `ProblemDetail`; невалидная цена → 422
  `ValidationProblem` (хотя бы одно поле в `errors[]`).

## FSD layout

```text
src/
  app/
    main.tsx                      # QueryClientProvider + MSW start (dev) → App
    App.tsx                       # smoke shell (без pages)
  shared/
    api/
      http.ts                     # mutator для Orval + BASE_URL
      errors.ts                   # ProblemDetail, ValidationProblem, ApiError
      generated/                  # openapi-typescript + orval output (no hand edit)
      mocks/
        store.ts
        handlers.ts
        browser.ts              # setupWorker (dev)
        server.ts               # setupServer (vitest), те же handlers
      *.test.ts                 # mutator / error parse (или рядом)
      index.ts                  # http + error types (не весь generated)
  entities/
    auction/
      index.ts                  # re-export listAuctions/getAuction (+ types)
      api/*.test.ts             # unit listAuctions, getAuction (допустимо)
    bet/
      index.ts                  # re-export listBets/setBet (+ types)
      api/*.test.ts             # unit listBets, setBet (допустимо)
orval.config.ts                   # корень репо
```

Не создавать: `pages/`, `widgets/`, `features/`, ручные `types.ts` DTO,
ViewModel `model/` (следующая change).
Layer-level `shared/index.ts` / `entities/index.ts` — не создавать.

Публичный API:

| Место | Export |
|---|---|
| `shared/api` | http/mutator, error types/guards |
| `entities/auction` | list/get ops + нужные schema types |
| `entities/bet` | listBets/setBet + нужные schema types |
| `shared/api/generated/*` | только через entity public API / mutator wiring |
| `shared/api/mocks/*` | app bootstrap / тесты |

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Hand-written DTO vs codegen | меньше tooling | drift, слабый сигнал под вакансию | **codegen** |
| Только Orval vs `openapi-typescript` + Orval | один tool | слабее разделение schema types / client | **оба**: oapi-ts = schema types, Orval = RQ client |
| Orval mocks vs ручной MSW store | быстрые stubs по схеме | нет mutable store; не закрывает ТЗ («реально меняют состояние» / обновление price+status+bets); regen затирает кастом | **ручной MSW**, `mock: false` — Orval только client; мутации пишем сами |
| Zod parse response vs types-only | runtime safety | шум + дубль | **types-only**; Zod позже (forms/search) |
| QueryClientProvider сейчас vs с pages | готов стек Query | провайдер без UI | **подключить сейчас** |
| setBet 200 body | — | схемы нет | **void / ignore body** (как сгенерирует Orval) |
| Generated в `shared/api` vs сразу в entities | один output, FSD-обёртки тонкие | entities без «своих» api-файлов | **generated → shared/api**; entities = re-export |

## Progressive verify

После появления scripts: при смене OpenAPI гонять `pnpm api:gen`, затем
каждый task → `pnpm verify`.
