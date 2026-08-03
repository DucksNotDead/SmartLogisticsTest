# Design: 009-detail-page

## Approach

1. Route `auctions_.$auctionUuid`: убрать stub; рендерить
   `AuctionDetailPage` из `@/pages/auction-detail`. Param `auctionUuid`
   → `useGetAuction(auctionUuid)`. Серверные данные только в Query.
2. Mapper (чистая функция) в `entities/auction/model`:
   `AuctionShowResponse` → `AuctionDetailViewModel`. Нормализует флаги
   (`hide_bets_history` с корня и/или `trading`), nullable цены, видимость
   контактов/адресов/цены груза. Unit-тесты на mapper. Не смешивать с
   list DTO / list VM.
3. Page chrome:
   - ряд: chevron-back (`Link`/`navigate` → `/auctions`) + `h1` (номер /
     короткий title из `main`)
   - под ним `shared/ui/tabs`: «Инфо» | «Ставки»
   - default tab = «Инфо»; tab state локальный (не URL, пока не нужно)
4. Tab «Инфо» - иерархичный layout (не dl-список):
   - **Hero / primary:** текущая + available цена, статус торгов,
     своя ставка / `can_set_bet` - крупная типографика, акцент
   - **Secondary band:** маршрут (точки) + ключевые даты/тип
   - **Supporting grid:** груз/ТС, оплата, организатор, контакты,
     settings - компактнее, 1–2 колонки на `md+`
5. Tab «Ставки»:
   - если `hide_bets_history` → сообщение «История ставок скрыта»
   - иначе → пустой placeholder («Скоро» / empty); **без** `listBets`
6. Page UI ветки:
   - pending → skeleton (chrome + tabs shape)
   - error: 404 → NotFound; иное → сообщение + retry
   - success → chrome + active tab
7. Page transition: mount fade/slide-in; unmount / route leave -
   fade/slide-out (CSS `@keyframes` / transition на корне page;
   согласовать с shell scroll). Без framer-motion. Цель: заметный
   enter и leave при nav list↔detail.
8. Ограничения на «Инфо»:
   - `hide_points_address_and_contacts` → нет contacts; адреса точек скрыты
   - `no_view_cargo_price` → нет `cargo.price`
   - `can_set_bet` → статус в primary; optional disabled CTA без action
   - `hide_places` → не показывать места
9. Цены: `current`, `available`, `min`, `max`, `step` (+ `_no_vat`).
   `null` → «—» / скрыть поле.
10. MSW: контакты, ≥2 routes; flag fixtures.
11. UI-kit: добавить `shared/ui/tabs` (shadcn/radix), public API
    `shared/ui/tabs`.
12. Нейминг: все React-компоненты detail - `*.component.tsx`.
13. README + `AI_USAGE.md`.

## FSD layout

```text
src/
  app/routes/
    auctions_.$auctionUuid.tsx
  pages/auction-detail/
    ui/
      AuctionDetailPage.component.tsx      # chrome + transition + tabs
      AuctionDetailSkeleton.component.tsx
      DetailHeader.component.tsx           # chevron + title
      DetailTabs.component.tsx             # Инфо / Ставки
      InfoTab.component.tsx                # иерархичный layout
      BetsTabPlaceholder.component.tsx     # empty / hide_bets_history
      PriceHero.component.tsx              # accent prices + your/can_set
      RoutePoints.component.tsx
      Cargo.component.tsx
      Payment.component.tsx
      Organizer.component.tsx
      Contacts.component.tsx
      TradingParams.component.tsx
      …
    index.ts
  entities/auction/model/                  # detail mapper + tests
  shared/ui/tabs/                          # shadcn Tabs
  shared/api/mocks/store.ts
```

Не создавать: `features/set-bet`, полноценный bets list, форму ставки.

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Mapper в `entities` vs `pages` | FSD, reuse | больше файлов | **`entities/auction/model`** |
| Tab state: local vs search `?tab=` | проще | deep-link нет | **local state** |
| hide_bets на Инфо vs таб Ставки | ближе к UX ставок | | **таб «Ставки»** |
| Layout: flat list vs hierarchy | быстрее | хуже скан | **hierarchy (hero → band → grid)** |
| Transition: CSS vs framer | без deps | leave сложнее | **CSS enter/leave** |
| Tabs: новый ui-kit vs raw Radix | единообразие | чуть работы | **`shared/ui/tabs`** |

## Progressive verify

Каждый task → `pnpm verify`.
