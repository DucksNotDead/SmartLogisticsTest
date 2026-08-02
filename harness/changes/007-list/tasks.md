# Tasks: 007-list

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] Zod search schema `page`/`per_page` (fallback 1 / 20) + `validateSearch`
      на route `/auctions`; page читает search и передаёт в query.
      check: `rg -q 'validateSearch|per_page' src/app/routes/auctions.tsx src/pages/auction-list && pnpm verify`

- [x] MSW seed: ≥21 auction list items + meta pagination; GET detail для
      uuid из seed не 404 (чтобы prefetch/stub имели данные). Фильтры request
      по-прежнему игнор/не требуются.
      check: `pnpm test` (list meta / multi-page) && `pnpm verify`

- [x] `AuctionListPage`: `useListAuctions` + skeleton / empty / error(+retry)
      + пагинация (search sync). Без фильтров UI.
      check: `rg -q 'useListAuctions' src/pages/auction-list && pnpm verify`

- [x] List item UI + `Link` на `/auctions/$auctionUuid` + prefetch
      `getGetAuctionQueryOptions` на hover/focus.
      check: `rg -q 'prefetchQuery|getGetAuctionQueryOptions' src/pages/auction-list && pnpm verify`

- [x] Stub route `auctions_.$auctionUuid` (flat path `/auctions/$uuid`,
      без inherit search родителя) + regen `routeTree.gen.ts` в git.
      check: `test -f src/app/routes/auctions_.\\$auctionUuid.tsx && pnpm verify`

- [x] Адаптив списка (mobile ~375 / desktop): без horizontal overflow; README
      (list, URL params, states, prefetch; фильтры out) + строка в
      `AI_USAGE.md`.
      check: `pnpm verify`

- [x] Sticky chrome: закрепить header и footer в `widgets/app-shell`
      (`sticky`/`fixed` + scroll только у main); на `/auctions` закрепить
      блок пагинации (низ viewport / низ main), список скроллится между ними.
      check: `rg -q 'sticky|fixed' src/widgets/app-shell src/pages/auction-list && pnpm verify`

- [x] Выбор `per_page`: UI 5 / 10 / 15 / 20 (search sync); Zod принимает
      только эти значения, иначе fallback `20`; смена размера сбрасывает
      `page` на `1`.
      check: `rg -q 'per_page|5.*10.*15.*20' src/pages/auction-list && pnpm verify`

- [x] Сетка карточек: 1 колонка на mobile, 2 колонки на больших экранах
      (`lg+`); skeleton в той же сетке; без horizontal overflow.
      check: `rg -q 'grid-cols-2|lg:grid' src/pages/auction-list && pnpm verify`

- [x] Compact title в header: когда page-заголовок «Аукционы» (+ subtitle)
      уходит под header (IntersectionObserver на sentinel/h1), в центре
      header плавно появляется меньший «Аукционы»; при возврате плавно
      пропадает (opacity/transform transition). Не ломать brand слева и
      кнопку справа.
      check: `rg -q 'IntersectionObserver|compact|Аукционы' src/widgets/app-shell src/pages/auction-list && pnpm verify`

- [x] Пагинация: разнести controls на отдельные скруглённые blur-элементы
      (info / per_page / prev / next) с отступом друг от друга; sticky bar
      без сплошной «ленты» на всю ширину (или прозрачный контейнер).
      check: `rg -q 'backdrop-blur|rounded' src/pages/auction-list/ui/AuctionListPagination.tsx && pnpm verify`

- [x] Карточка: блок груза (имя / вес / объём / кузов) отдельными badges
      под датами маршрута (не строка через «·»; не прижимать к низу карточки).
      check: `rg -q 'badge|Badge|rounded-full|rounded-md' src/pages/auction-list/ui/AuctionListItem.tsx && pnpm verify`

- [x] `per_page`: native `<select>` → `shared/ui/select` (shadcn/radix UI-kit);
      public API `shared/ui/select`.
      check: `rg -q 'shared/ui/select|SelectTrigger' src/pages/auction-list && test -f src/shared/ui/select/index.ts && pnpm verify`

- [x] MSW: задержка ответа list ~2s в browser (чтобы был виден skeleton);
      в Vitest delay = 0 / не тормозить `pnpm test`.
      check: `rg -q 'delay|2000|LIST_.*DELAY' src/shared/api/mocks && pnpm verify`

- [x] Skeleton: убедиться что при pending показывается `AuctionListSkeleton`
      (сетка как у списка); structural/manual check + при необходимости узкий
      тест/комментарий в README про 2s delay.
      check: `rg -q 'isPending|AuctionListSkeleton' src/pages/auction-list && pnpm verify`

- [x] Entrance motion shell: плавное появление header → затем content + footer
      (stagger opacity/translate, CSS/transition; без тяжёлых lib). Не ломать
      sticky/scroll.
      check: `rg -q 'animate|transition|opacity|@keyframes' src/widgets/app-shell && pnpm verify`

- [x] Compact title на mobile: при уходе page-h1 под header «Аукционы»
      плавно появляется **на месте** текста «Тестовое задание» (crossfade /
      swap в brand-слоте слева, не отдельный center title); при возврате
      обратно «Тестовое задание». `md+`: прежнее поведение (center) или
      тот же brand-swap - выбрать единообразно, mobile обязателен.
      check: `rg -q 'Тестовое задание|compact|showCompact' src/widgets/app-shell/ui/Header.tsx && pnpm verify`

- [x] Пагинация на mobile: **по умолчанию свёрнута** в summary (напр.
      «Стр. N из M · K на стр.»); tap раскрывает полный блок
      (info / per_page / prev / next); `md+` всегда развёрнута.
      Sticky/blur-чипы сохранить.
      check: `rg -q 'summary|collapse|expanded|md:|details' src/pages/auction-list/ui/AuctionListPagination.tsx && pnpm verify`

- [x] Пагинация на mobile: при доскролливании списка до конца раскрывается
      (полный блок controls); при уходе вверх снова можно свернуть /
      поведение согласовать с tap-expand.
      check: `rg -q 'IntersectionObserver|scroll|expanded|end' src/pages/auction-list && pnpm verify`
