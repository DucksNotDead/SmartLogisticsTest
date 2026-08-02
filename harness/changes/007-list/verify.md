# Verify: 007-list

## Auto

- `pnpm verify` (= typecheck + lint + fsd + test)
- Route `/auctions` имеет Zod `validateSearch` для `page` / `per_page`
- Страница использует `useListAuctions`; есть prefetch через
  `getGetAuctionQueryOptions`
- Есть stub `auctions_.$auctionUuid` (URL `/auctions/$uuid`); `routeTree.gen.ts` актуален
- MSW seed позволяет пагинацию (≥2 страницы при `per_page=20`)

## Change acceptance

### Auto / structural

- [x] `pnpm verify` green
- [x] List через TanStack Query; нет фильтров UI / filter search keys
- [x] Zod fallback для битых `page`/`per_page`
- [x] UI ветки skeleton / empty / error(+retry) присутствуют в коде
- [x] Prefetch detail на intent карточки
- [x] Stub detail route; typed navigation со списка
- [x] README + `AI_USAGE.md` отражают scope (фильтры вынесены)
- [x] `per_page` Zod/UI: только 5/10/15/20; иное → 20
- [x] `per_page` через `shared/ui/select` (не native `<select>`)
- [x] Sticky: header/footer shell + pagination на списке
- [x] Сетка: `lg` 2 колонки карточек
- [x] Compact title завязан на visibility page-h1
- [x] Mobile compact: «Аукционы» на месте «Тестовое задание» (brand-slot)
- [x] Пагинация: отдельные rounded blur-элементы
- [x] Груз в карточке: badges под датами
- [x] MSW list delay ~2s в browser; Vitest без задержки
- [x] Skeleton при pending (`AuctionListSkeleton`)
- [x] Shell entrance: header → content+footer (CSS)
- [x] Mobile pagination: default collapsed summary; `md+` expanded

### Manual

- [x] `pnpm dev` → `/auctions`: skeleton виден ~2s, затем данные
- [x] При загрузке app: сначала плавно header, затем content и footer
- [x] Смена страницы пагинации меняет URL (`?page=`) и контент
- [x] Выбор `per_page` 5/10/15/20 (UI-kit Select) меняет URL и размер; page → 1
- [x] `?page=abc` / `?per_page=7` → безопасный fallback, страница не падает
- [x] При скролле списка header, footer и пагинация остаются на месте
- [x] ~375 скролл: «Тестовое задание» → плавно «Аукционы» в том же месте;
      скролл вверх → обратно
- [x] Пагинация выглядит как отдельные blur-чипы с зазорами
- [x] ~375: пагинация по умолчанию свёрнута в summary; tap раскрывает
- [x] `md+`: пагинация сразу развёрнута
- [x] В карточке груз - badges под датами (не строка через «·»)
- [x] Hover по карточке: в Network/cache уходит (или есть) prefetch
      `GET /auctions/{uuid}`
- [x] Клик → stub `/auctions/{uuid}`
- [x] Viewport ~375: 1 колонка; `lg+`: 2 колонки; нет horizontal scroll
- [x] Фильтров на странице нет
