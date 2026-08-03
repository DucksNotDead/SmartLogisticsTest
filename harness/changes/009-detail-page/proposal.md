# Proposal: 009-detail-page

## Goal

Собрать детальную страницу аукциона на `GET /auctions/{auctionUuid}`:
секции из ТЗ, ограничения DTO, UI на `AuctionShow*` (не list DTO).
Chrome: шеврон назад + табы «Инфо» / «Ставки»; плавный enter/exit;
иерархичная вёрстка (не плоский список). Все React-компоненты -
`*.component.tsx`.

## In scope

- Заменить stub `auctions_.$auctionUuid` на полноценную страницу
  `pages/auction-detail` через `useGetAuction` (public API `entities/auction`)
- Header страницы: шеврон (назад на `/auctions`) слева от главного
  заголовка; под заголовком табы UI-kit: **«Инфо»** | **«Ставки»**
- Вкладка «Инфо»: блоки из `AuctionShowResponse` / `AuctionShowTrading`
  (см. ниже). Вкладка «Ставки»: пустой placeholder (контент bets -
  следующая change); при `hide_bets_history` - текст «история скрыта»,
  без `listBets`
- Показать на «Инфо»:
  - основные данные (`main`)
  - организатор (`organizer`)
  - контакты (`contacts`) - только если не скрыты
  - маршрут со всеми точками (`routes`)
  - груз и требования к ТС (`cargo` / точки / assembly по наличию полей)
  - условия оплаты (`payment`)
  - параметры торгов (`trading`: статус, времена, тип ставки, settings)
  - цены: current / available / min / max / step (+ no_vat при наличии);
    все ценовые поля nullable - UI не падает при `null`
  - состояние своей ставки (`trading.your`)
- Вёрстка «Инфо»: не вертикальный список label/value одинакового веса;
  важнее (цена, статус/своей ставки, маршрут) - крупнее и акцентнее;
  вторичное (оплата, organizer details, settings) - компактнее
- Page transition: плавное появление при входе и уход при уходе
  (CSS opacity/translate; без framer-motion)
- UI-kit: `shared/ui/tabs` (shadcn/radix), если ещё нет в репо
- Ограничения DTO в UI:
  - `trading.can_set_bet` - доступность ставки (без формы set-bet)
  - `trading.hide_bets_history` / корневой `hide_bets_history` - на табе
    «Ставки» (без списка bids)
  - `trading.hide_points_address_and_contacts` - скрыть контакты и адреса точек
  - `trading.no_view_cargo_price` - не показывать цену груза
  - `trading.hide_places` - не показывать места/рейтинг, если UI их выводит
- ViewModel-маппер `AuctionShowResponse` → detail VM в `entities/auction/model`
  + unit-тесты (nullable price, флаги)
- UI states: pending (skeleton), error (+ retry), 404 NotFound
- MSW seed: у detail есть контакты, ≥2 точки маршрута; минимум по одному
  кейсу с включёнными флагами скрытия / `can_set_bet=false`
- Нейминг: **все** файлы React-компонентов в зоне detail -
  суффикс `*.component.tsx` (см. `component-naming.mdc` / IMPORTANT в ТЗ)
- Адаптив без horizontal overflow
- README + черновик в `AI_USAGE.md` (detail scope; bets/set-bet вынесены;
  табы; `*.component.tsx`)

## Out of scope

- Заполнение вкладки «Ставки» списком (`GET .../bets`) - кроме placeholder /
  hide_bets_history
- Форма «Сделать ставку» / mutation set-bet / RHF+Zod ставки / toast 422
- Prefetch bets; инвалидация после ставки (следующая change)
- Фильтры списка; auth / 401 UX; Orval regen без нужды; E2E
- Пиксель-перфект UL; смешивание `AuctionListItemTrading` и `AuctionShowTrading`
- framer-motion / тяжёлые анимационные lib

## Acceptance

- `/auctions/$auctionUuid` грузит detail через `useGetAuction`
- Слева от заголовка - шеврон назад на список
- Под заголовком табы «Инфо» / «Ставки» через `shared/ui/tabs`
- «Инфо» показывает секции; «Ставки» пустая (или «история скрыта» при флаге);
  без fetch bets
- Вёрстка иерархичная: ключевые блоки visually dominant, не плоский список
- Enter/exit страницы плавные (CSS)
- Nullable `price.*` не ломают рендер
- Флаги `can_set_bet`, `hide_bets_history`,
  `hide_points_address_and_contacts`, `no_view_cargo_price` (+ `hide_places`
  если есть UI мест) отражаются в UI
- Нет формы set-bet
- Все React-компоненты detail именуются `*.component.tsx`
- Есть skeleton / error(+retry) / 404
- `pnpm verify` green; README + пункт в `AI_USAGE.md`
