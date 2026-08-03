# Tasks: 010-bets-tab

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] Mapper `BetItem` / `BetListResponse` → bet VM + `participantsCount`
      в `entities/bet/model` (+ unit-тесты: win, rejected+reason, place null,
      empty org name, unique participants). Public API entities/bet.
      check: `rg -q 'mapBet|participantsCount|BetViewModel' src/entities/bet && pnpm verify`

- [x] * MSW seed bets: на одном аукционе ≥2 ставки с местами; отдельный
      кейс empty `bets=[]`; кейс `is_rejected=true` + непустой
      `cancel_reason`; кейс `is_win=true`. Handler `all` не ломать.
      check: `rg -q 'is_rejected|cancel_reason|is_win' src/shared/api/mocks/store.ts && pnpm verify`

- [x] `BetsTab.component.tsx`: при `hideBetsHistory` - скрыто без fetch;
      иначе `useListBets(uuid, { all: true })` + skeleton / error(+retry) /
      empty / success. Заменить placeholder в `AuctionDetailPage`.
      Все новые React UI detail - `*.component.tsx`.
      Тест: `hide_bets_history` → нет списка / query disabled.
      check: `rg -q 'useListBets|all:\\s*true|all:\\s*!0|hideBetsHistory|hide_bets' src/pages/auction-detail && pnpm verify`

- [x] Иерархичный UI карточек + summary участников: цена акцентнее;
      win/rejected цветом; place (если не `hidePlaces`); перевозчик;
      `cancel_reason` при наличии. Не плоский список label/value.
      Тест: `hide_places` → place не рендерится (при `place` в данных).
      check: `rg -q 'hidePlaces|hide_places|isRejected|participants' src/pages/auction-detail && pnpm verify`

- [x] Адаптив без horizontal overflow; README (bets tab, `all=true`,
      participants derived, hide_bets / empty / statuses; set-bet out) +
      строка в `AI_USAGE.md`. Structural: React-компоненты bets UI в
      `pages/auction-detail` - `*.component.tsx`.
      check: `find src/pages/auction-detail -name '*.tsx' ! -name '*.component.tsx' | grep -q . && exit 1 || true; pnpm verify`
