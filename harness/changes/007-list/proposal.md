# Proposal: 007-list

## Goal

Собрать страницу списка аукционов: данные через TanStack Query, пагинация
и Zod search params (`page` / `per_page`), skeleton / empty / error, prefetch
detail по hover/intent, адаптив desktop/mobile. **Фильтры не делаем**
(отдельная change).

## In scope

- Страница `pages/auction-list`: список карточек из `POST /auctions/list` через
  `useListAuctions` (public API `entities/auction`)
- Zod-валидация search params маршрута `/auctions`: только `page`, `per_page`
  с безопасными fallback (`page=1`, `per_page=20`); `per_page` ∈
  `{5,10,15,20}`; sync с URL
- Пагинация UI по `AuctionListMeta` (`current_page`, `last_page`, `total`, …);
  смена страницы пишет search params; UI выбора `per_page` (5/10/15/20) через
  `shared/ui/select` (не native `<select>`), при смене размера `page` → `1`
- Sticky: header + footer в shell; блок пагинации на списке закреплён;
  скролл контента списка между ними
- Compact title: при уходе page-h1 «Аукционы» под header на mobile
  «Аукционы» плавно появляется на месте «Тестовое задание» (brand-слот);
  при возврате обратно. Desktop: center или тот же swap
- Пагинация: отдельные скруглённые blur-чипы (не одна сплошная полоса);
  на mobile **по умолчанию** свёрнута в summary, раскрывается по tap;
  `md+` развёрнута
- UI states: skeleton (pending), empty (`data=[]`), error (query error + retry)
- MSW delay ~2s на `POST /auctions/list` в browser (skeleton заметен); Vitest
  без задержки
- Entrance: плавное появление shell - сначала header, затем content + footer
- Карточка list item: ключевые поля из `AuctionListItem` / trading (номер,
  тип, статусы, маршрут, даты, груз как badges под датами, цена / ₽/км,
  флаг своей ставки, primary action disabled или link «Смотреть» - без set-bet)
- Prefetch detail: на hover/focus/intent карточки -
  `queryClient.prefetchQuery(getGetAuctionQueryOptions(uuid))`
- Тонкий stub-route `/auctions/$auctionUuid` (flat `auctions_.$auctionUuid`,
  заголовок/uuid), чтобы typed `Link` работал без search списка; полноценный
  detail UI - не здесь
- MSW seed: достаточно элементов для ≥2 страниц при `per_page=20` (и meta)
- Адаптив списка: 1 колонка mobile, 2 колонки на `lg+`; без horizontal overflow
- README: как открыть список, пагинация/URL/`per_page`, sticky, states,
  prefetch; без фильтров
- Черновик в `AI_USAGE.md`: почему фильтры вынесены; Zod только pagination

## Out of scope

- Фильтры UI и поля `AuctionListRequest` кроме `page` / `per_page`
  (`cargo_num`, `status`, `statuses`, `auc_type`, города, даты, цены,
  `is_available`, `is_bidder`, sort, …) и sync фильтров в URL/localStorage
- Полноценная detail / bets / set-bet (формы, история, ограничения DTO)
- ViewModel/мапперы detail; Zod формы ставки
- Auth / 401 UX; E2E; Orval regen без нужды
- Пиксель-перфект клон UL

## Acceptance

- `/auctions` грузит список через TanStack Query (`useListAuctions`)
- Search params: невалидные `page`/`per_page` → fallback; валидные уходят в
  request body list
- Пагинация меняет URL и перезапрашивает список; meta отражается в UI
- Можно выбрать `per_page` 5/10/15/20 через UI-kit Select; иное в URL →
  fallback 20; смена размера сбрасывает на page 1
- Header, footer и пагинация списка закреплены; скроллится список
- После скролла page-title под header на mobile: в brand-слоте вместо
  «Тестовое задание» плавно «Аукционы»; скролл вверх возвращает текст
- Пагинация: отдельные rounded blur-элементы с зазорами; на mobile по
  умолчанию summary (collapsed), на `md+` полный UI
- В карточке груз (имя/вес/объём/кузов) - badges под датами маршрута
- Видны skeleton / empty / error (error с возможностью повторить); при
  первом load списка skeleton держится ~2s (MSW delay в browser)
- При открытии app: header появляется раньше, затем content и footer
  плавно входят
- Hover/focus на карточке префетчит `getAuction` в Query cache
- Клик по карточке ведёт на `/auctions/$uuid` (stub, не полный detail)
- Фильтров на странице нет
- Адаптив: mobile 1 колонка, `lg+` 2 колонки; без horizontal scroll
- `pnpm verify` green; README + пункт в `AI_USAGE.md` про scope фильтров
