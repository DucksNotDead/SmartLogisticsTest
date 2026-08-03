# Tasks: 009-detail-page

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] Mapper `AuctionShowResponse` → detail VM в `entities/auction/model`
      (+ unit-тесты: nullable `price.*`, флаги видимости контактов/адресов/
      цены груза / hide_bets_history). Public API entities при необходимости.
      check: `rg -q 'AuctionDetail|mapAuction|toDetail' src/entities/auction && pnpm verify`

- [x] `shared/ui/tabs` (shadcn/radix) + public API; page shell: stub →
      `AuctionDetailPage.component.tsx` + `useGetAuction` + skeleton /
      error(+retry) / 404; chrome: шеврон назад слева от `h1` + табы
      «Инфо» / «Ставки». Все React UI detail - `*.component.tsx`.
      check: `test -f src/shared/ui/tabs/index.ts && rg -q 'useGetAuction|Tabs|chevron|Chevron' src/pages/auction-detail && pnpm verify`

- [x] * MSW seed detail: контакты, ≥2 точки `routes`; минимум по одному
      кейсу с `hide_points_address_and_contacts`, `no_view_cargo_price`,
      `hide_bets_history`, `can_set_bet=false` (и согласованный list item).
      check: `rg -q 'hide_points_address_and_contacts|no_view_cargo_price|hide_bets_history' src/shared/api/mocks && pnpm verify`

- [x] Tab «Инфо»: иерархичный layout (hero цены/статус/своя ставка →
      маршрут → supporting: cargo/ТС, payment, organizer, contacts,
      trading params/settings). Nullable-safe prices. Не плоский список
      одинаковых строк.
      check: `rg -q 'Price|YourBet|Route|Cargo|Payment|Organizer' src/pages/auction-detail && pnpm verify`

- [x] Флаги на «Инфо»: `hide_points_address_and_contacts`,
      `no_view_cargo_price`, `can_set_bet` (статус / disabled CTA без формы).
      check: `rg -q 'hide_points|no_view_cargo|can_set_bet' src/pages/auction-detail && pnpm verify`

- [x] Tab «Ставки»: placeholder; при `hide_bets_history` - «история
      скрыта»; без `listBets` / bets UI.
      check: `rg -q 'hide_bets_history|Ставки' src/pages/auction-detail && ! rg -q 'useListBets|listBets' src/pages/auction-detail && pnpm verify`

- [x] Page enter/exit: плавное появление и уход (CSS transition/
      keyframes на корне detail page; без framer-motion). Не ломать
      shell scroll.
      check: `rg -q 'animate|@keyframes|transition|opacity' src/pages/auction-detail && pnpm verify`

- [x] Адаптив без horizontal overflow; README (detail, tabs, chevron,
      hierarchy, transition, флаги, out bets/set-bet, `*.component.tsx`)
      + строка в `AI_USAGE.md`. Structural: все `*.tsx` React-компонентов
      в `pages/auction-detail` - суффикс `.component.tsx`.
      check: `find src/pages/auction-detail -name '*.tsx' ! -name '*.component.tsx' | grep -q . && exit 1 || true; pnpm verify`
