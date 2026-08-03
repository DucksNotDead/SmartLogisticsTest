# Verify: 009-detail-page

## Auto

- `pnpm verify` (= typecheck + lint + fsd + test)
- Route `/auctions/$auctionUuid` рендерит page с `useGetAuction`
- Mapper detail + unit-тесты в `entities/auction`
- Есть `shared/ui/tabs`; на detail - табы «Инфо» / «Ставки»
- В `pages/auction-detail` нет React-компонентов без `.component.tsx`
- Нет `useListBets` / формы set-bet на detail page

## Change acceptance

### Auto / structural

- [x] `pnpm verify` green
- [x] Detail через TanStack Query (`useGetAuction`); DTO/VM - Show, не List
- [x] Chevron назад слева от заголовка; табы «Инфо» / «Ставки»
- [x] «Инфо»: иерархичный layout (не плоский список); секции присутствуют
- [x] «Ставки»: placeholder / hide_bets_history; без fetch bets
- [x] CSS enter/exit transition на detail page
- [x] Mapper покрывает nullable prices и флаги видимости
- [x] Ограничения `can_set_bet`, `hide_bets_history`,
      `hide_points_address_and_contacts`, `no_view_cargo_price` отражены в UI
- [x] Нет set-bet form
- [x] Все React-компоненты detail: `*.component.tsx`
- [x] Skeleton / error(+retry) / 404
- [x] README + `AI_USAGE.md` отражают scope

### Manual

- [x] `pnpm dev` → клик с списка: detail плавно появляется; назад -
      плавно уходит / list снова ок
- [x] Шеврон слева от заголовка ведёт на `/auctions`
- [x] Табы «Инфо» / «Ставки» переключаются; «Ставки» пустая (или
      «история скрыта»)
- [x] На «Инфо» цена/статус/своя ставка визуально доминируют над
      вторичными блоками (не одинаковый список строк)
- [x] Аукцион с `hide_points_address_and_contacts`: контакты и адреса
      точек скрыты
- [x] Аукцион с `no_view_cargo_price`: цена груза не показана
- [x] `can_set_bet=false`: видно, что ставка недоступна; формы нет
- [x] Несуществующий uuid → 404 UX
- [x] Viewport ~375: без horizontal scroll
