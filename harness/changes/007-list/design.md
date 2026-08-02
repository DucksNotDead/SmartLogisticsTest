# Design: 007-list

## Approach

1. Route `/auctions`: `validateSearch` через Zod (`page`, `per_page` only).
   Невалидное / отсутствующее → `{ page: 1, per_page: 20 }`. Типы search
   связать с `createFileRoute` (TanStack Router + Zod).
2. Page: `useListAuctions({ page, per_page })` из `@/entities/auction`.
   Серверные данные только в Query, не в Zustand/MobX.
3. UI ветки:
   - `isPending` / `isLoading` → skeleton-список (`AuctionListSkeleton`,
     та же сетка что список)
   - `isError` → сообщение + retry (`refetch`)
   - success + `data.length === 0` → empty
   - success + items → список + пагинация
4. MSW list delay: в browser handler `POST .../auctions/list` ждать ~2000ms
   до ответа (`await delay(2000)` / аналог). В Vitest - 0ms (env `VITEST` /
   отдельная константа), чтобы `pnpm test` не тормозил. Detail/bets/setBet
   без обязательной задержки.
5. Пагинация: prev/next; disabled на краях по `meta`; `navigate({ search })`;
   селектор `per_page` ∈ `{5,10,15,20}` → URL; при смене → `page: 1`.
   UI: ряд отдельных pill/chip (`rounded-full` + `backdrop-blur`) с `gap-*`;
   без сплошной full-width ленты. Выбор размера: `shared/ui/select`
   (Radix/shadcn), не native `<select>`.
   Mobile (`<md`): по умолчанию свёрнуто в один summary-chip
   («Стр. {page} из {last} · {per_page}»); tap/toggle раскрывает полный
   набор чипов. `md+`: всегда expanded (summary скрыт или не нужен).
   Реализация: local state / `<details>` / кнопка + `aria-expanded`.
6. Sticky chrome: shell `h-svh` + sticky header/footer; `main` scroll.
   List pagination sticky bottom внутри main.
   Entrance (mount): header fade/slide-in первым; с небольшой задержкой
   (~100–200ms) одновременно content (`main`) и footer. CSS transitions /
   `@keyframes` / `animation-delay`; без framer-motion. Sticky/scroll не
   ломать.
7. Compact header title (только list intent):
   - page: `h1` + `IntersectionObserver` (root = `main[data-app-scroll]`)
   - visible → compact off; not visible → compact on
   - связь page→header: Zustand `shared/model` (`useChromeTitleStore`);
     сброс при unmount страницы
   - **mobile:** в brand-слоте слева crossfade «Тестовое задание» ↔
     «Аукционы» (на том же месте, не center overlay); иконка бренда
     остаётся; CTA справа без изменений
   - **md+:** center compact title (desktop); brand text без swap
8. Mobile pagination default collapsed → summary chip; expand on tap;
   collapse control «Свернуть»; `md+` всегда expanded.
   Доп.: IntersectionObserver на sentinel в конце списка (root =
   `main[data-app-scroll]`) → при доскролле до конца expand; при уходе
   вверх collapse. Tap expand/collapse согласованы (observer пишет state
   только на смене intersection).
9. List item: груз как badges под датами (имя, `N т`, `N м³`, кузов);
   пустые поля не рендерить; позиция как у прежней строки груза (не
   `mt-auto` к низу карточки).
10. Prefetch: hover/focus → `getGetAuctionQueryOptions`. Stub flat-route.
11. MSW seed ≥21; сетка `lg:grid-cols-2`.
12. README + `AI_USAGE.md`: фильтры out; sticky; per_page Select; compact
    title (mobile brand-swap); 2s list delay + skeleton; shell entrance;
    mobile pagination summary.

### Search params (Zod)

| Param | Type | Fallback | В request |
|---|---|---|---|
| `page` | positive int | `1` | `AuctionListRequest.page` |
| `per_page` | enum `5\|10\|15\|20` (coerce) | `20` | `AuctionListRequest.per_page` |

Фильтры из ТЗ - не в схеме search этого change.

### Prefetch / navigation

```text
List card hover/focus → prefetchQuery(getAuction)
List card click     → /auctions/$uuid (stub page)
```

## FSD layout

```text
src/
  app/routes/
    auctions.tsx                    # validateSearch + AuctionListPage
    auctions_.$auctionUuid.tsx      # stub (flat, без search родителя)
  pages/auction-list/
    model/                          # zod search schema (+ PER_PAGE_OPTIONS)
    lib/                            # useCompactHeaderTitle
    ui/
      AuctionListPage.tsx
      AuctionListItem.tsx           # badges груза под датами
      AuctionListPagination.tsx     # blur-chips + shared/ui/select
      AuctionListSkeleton.tsx
      …Empty / …Error
    index.ts
  widgets/app-shell/                # sticky header/footer + compact title
  shared/
    model/                          # useChromeTitleStore (Zustand)
    ui/select/                      # shadcn/radix Select
    api/mocks/store.ts              # seed 25 items
```

Не создавать: `widgets/auction-filters`, filter feature, detail page slice.

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Фильтры сейчас vs отдельная change | полное ТЗ сразу | большой scope | **отдельная change** (оператор) |
| Zod: только pagination vs сразу все filter keys | узкий scope, fallback проще | позже расширять schema | **только `page`/`per_page`** |
| Card в `widgets/` vs `pages/` | reuse | преждевременно | **`pages/auction-list`** |
| Stub detail route vs Link без route | typed Link, smoke nav | маленький chrome | **stub flat-route** (`auctions_.$uuid`, не child list search) |
| Prefetch только getAuction vs + bets | быстрее hover | bets всё равно на detail | **только getAuction** |
| Seed 1 item vs ≥21 | проще store | нельзя проверить page 2 | **≥21 items** |
| `per_page` any int vs enum 5/10/15/20 | гибкость | шум URL / UX | **enum + UI select** |
| Native `<select>` vs `shared/ui/select` | быстрее | вне UI-kit | **`shared/ui/select`** |
| Sticky shell vs только pagination | единый chrome | shell трогает все pages | **header+footer+pagination sticky** |
| Compact title: Zustand vs context shell | page+widgets | лишний store | **`shared/model` Zustand** |
| Пагинация: одна лента vs blur-chips | проще | хуже UX | **отдельные blur-chips** |
| Badges `mt-auto` vs под датами | выравнивание grid | «опущены» зря | **под датами** |
| Delay list только browser vs все handlers | тесты быстрые | сложнее ветка | **list ~2s browser; Vitest 0** |
| Entrance CSS vs framer-motion | без deps | меньше контроля | **CSS stagger shell** |
| Mobile pagination: always open vs summary | проще | тесно на 375 | **summary default → expand** |
| Compact mobile: center vs brand-slot swap | меньше правок | не «на месте» | **brand-slot swap** |

## Progressive verify

Каждый task → `pnpm verify`.
