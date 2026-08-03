# Smart Logistics Test (УЛ Лайт)

SPA для грузовых аукционов: список, фильтры, детальная карточка, история ставок,
установка ставки. Тестовое задание Frontend Developer.

Подробнее про работу с AI: [`AI_USAGE.md`](./AI_USAGE.md).

## Запуск

Требования: Node.js 20+, [pnpm](https://pnpm.io/) 10+.

```bash
pnpm install
pnpm dev
```

Открыть [http://127.0.0.1:5173](http://127.0.0.1:5173) — редирект на `/auctions`.
API в dev отвечает MSW (`/api/v1`), отдельный бэкенд не нужен.

Полезные команды:

```bash
pnpm verify    # typecheck + lint + FSD (Steiger) + unit-тесты
pnpm test:e2e  # Playwright (нужен chromium, см. ниже)
pnpm build     # production-сборка
pnpm api:gen   # пересборка types/client из OpenAPI
```

Один раз для e2e:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Pre-commit (husky) гоняет полный `pnpm verify`. E2e в husky не входят.
Escape hatch: `HUSKY=0 git commit ...`.

## Основные технические решения

| Тема | Решение |
|---|---|
| Контракт API | Единственный источник: `input/openapi.auctions.v0.json` |
| Codegen | `openapi-typescript` (schema) + Orval (react-query client) |
| MSW | Handlers + in-memory store **вручную**; после `setBet` меняются цена, статус, bets, list item. Orval-mock не используем |
| Серверные данные | TanStack Query; Zustand только для точечного UI-state (compact title) |
| Роутинг | TanStack Router, file-based (`src/app/routes/`) |
| Формы / URL | React Hook Form + Zod; search params списка и `?tab=` на detail с безопасным fallback |
| Архитектура | Feature-Sliced Design + Steiger в `pnpm verify` |
| UI | shadcn/Radix + токены с [ul.su](https://ul.su/) (primary `#F9C21D`) |
| Именование | `*.component.tsx` только в detail / set-bet (как в PDF задания) |

Структура `src/`:

```text
app/        # entry, providers, MSW start, routes
pages/      # auction-list, auction-detail
widgets/    # app-shell, auction-filters
features/   # set-bet
entities/   # auction / bet / city (public API поверх codegen)
shared/     # api (codegen + mocks), ui-kit, lib, model
```

Публичный доступ к API - через entities (`listAuctions`, `getAuction`, `listBets`,
`setBet`), не deep-import `generated/`.

Не смешивать DTO списка (`AuctionListItemTrading`) и detail (`AuctionShowTrading`).
Фильтр `status`/`mobile_statuses` (торговый статус пользователя) ≠ `statuses`
(статус аукциона 1–7).

## Как проверял

### Автоматические gate

- `pnpm verify` на каждом task и в pre-commit: typecheck, ESLint, Steiger, Vitest.
- `pnpm test:e2e` отдельно: фильтры списка + установка ставки + smoke.

### Ручные сценарии (через `pnpm dev`)

1. Список: `/` → `/auctions`; ~1s skeleton (MSW delay), пагинация и `per_page`
   меняют URL и контент; sticky chrome; hover по карточке префетчит detail.
2. Фильтры: draft не меняет список до Save; Cancel discard; Reset → defaults;
   пресеты toggle; города; `status` / `statuses`; битый query → fallback.
   Desktop: drawer справа; mobile ~375: фильтры + пагинация в одном ряду.
3. Detail: шеврон назад; табы Инфо / Ставки (`?tab=`); иерархия hero → маршрут
   → grid; 404 на неизвестный uuid.
4. Флаги visibility (seed page 1): hide points/contacts, no cargo price,
   hide bets history, `can_set_bet=false`, empty bets, winner, hide places.
5. Ставки: `all=true` (видны rejected); участники; place скрыт при
   `hide_places`.
6. Set-bet при `can_set_bet`: CTA → bottomsheet → успех → invalidate → таб
   «Ставки» + highlight; realtime-ошибка без shake; 422 → shake + toast;
   без CTA если ставить нельзя.

Примеры URL:

- `/auctions?page=2&per_page=10`
- `/auctions?is_available=true&load_city=Москва&sort_field=stop_time&sort_dir=asc`
- `/auctions/<uuid>?tab=bets`

### Ограничения

- Бэкенд моковый (MSW); seed/store объёмные из-за полного `AuctionShowResponse`.
- E2e только chromium, не в `pnpm verify` / husky, без CI YAML.
- Leave-анимация detail только на шевроне (browser Back без CSS leave).
- Highlight созданной ставки по `price` (ответ set-bet void) - возможна
  коллизия при одинаковой цене.
- Participants на bets = unique `organization_id` (поля в API нет).
- Короткий список на mobile → пагинация может сразу быть expanded.

## Тесты

### Unit (Vitest, входят в `pnpm verify`)

```bash
pnpm test
```

Покрывают чистую логику из ТЗ и контрактный слой:

| Область | Где |
|---|---|
| Search params списка / detail tab | `pages/auction-list/model/search.test.ts`, `pages/auction-detail/model/search.test.ts` |
| List filter / sort (MSW) | `shared/api/mocks/list-filter.test.ts` |
| ViewModel-мапперы | `entities/auction/model/map-auction-detail.test.ts`, `entities/bet/model/map-bet.test.ts` |
| Zod schema ставки | `features/set-bet/model/bet-price.schema.test.ts` |
| 4 API ops + mutator 422 | `entities/auction/api/auctions.test.ts`, `entities/bet/api/bets.test.ts`, `shared/api/http.test.ts` |
| Mutation invalidate / hide_* UI | `features/set-bet/api/use-set-bet-mutation.test.ts`, `pages/auction-detail/ui/BetsTab.hide.test.ts` |

### E2E (Playwright, вне verify)

```bash
pnpm exec playwright install chromium   # один раз
pnpm test:e2e
```

Конфиг: `playwright.config.ts` (chromium, `webServer` → `pnpm dev` с MSW).
Если порт 5173 уже занят dev-сервером, он переиспользуется.

| Spec | Что проверяет |
|---|---|
| `e2e/smoke.spec.ts` | список открывается |
| `e2e/filters.spec.ts` | Save / Cancel / Reset, пресет, города, status/statuses, битый query |
| `e2e/set-bet.spec.ts` | success + highlight, no-CTA, realtime, 422 (stub `fetch`), пикер шага |
