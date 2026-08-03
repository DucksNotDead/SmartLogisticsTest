# Tasks: 011-bet-create

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] Zod-схема цены (фабрика от min/max/step nullable) + unit-тесты
      (`>0`, границы, step, отсутствие nullable-полей). Suggest-prices
      helper для пикера. Public model exports в `features/set-bet`.
      check: `rg -q 'betPriceSchema|createBetPriceSchema' src/features/set-bet && pnpm verify`

- [x] UI-kit: Toaster (`sonner`) в app shell; Combobox-примитивы
      (`Popover`/`Command` или эквивалент) в `shared/ui` для пикера шагов.
      check: `rg -q 'Toaster|sonner' src/app src/shared/ui && pnpm verify`

- [x] * Mutation wrapper `useSetBetMutation`: POST через `useSetBet`;
      onSuccess invalidate list/detail/bets; success/error toast;
      прокидка 422 `ValidationProblem.errors[]` (через `ApiError`).
      MSW `applySetBet` не ломать (цена / status_mobile / bets).
      check: `rg -q 'invalidateQueries|getGetAuctionQueryKey|getListBetsQueryKey|getListAuctionsQueryKey' src/features/set-bet && pnpm verify`

- [x] `SetBetSheet.component.tsx` + `BetPriceField`: RHF+Zod, крупная
      форма в `Sheet side=bottom`; подсказка available/step; Combobox
      пикер; realtime ошибки без shake; на 422 — shake + плавное
      сообщение. Success overlay (зелёный checked). Все React UI
      feature — `*.component.tsx`.
      check: `rg -q 'useForm|SetBetSheet|side=\"bottom\"|side=.bottom' src/features/set-bet && pnpm verify`

- [x] Wiring на detail: CTA «Установить ставку» в `PriceHero` и
      `BetsTab` при `canSetBet`; host sheet на page; controlled
      `DetailTabs`; post-success: ~1s close → tab bets → ~1.5s
      highlight созданной ставки (match по price). При
      `!canSetBet` CTA нет. Highlight styles на `BetCard`.
      check: `rg -q 'canSetBet|SetBetSheet|highlight' src/pages/auction-detail src/features/set-bet && pnpm verify`

- [x] README (set-bet flow, 422, MSW mutate, highlight) + строка в
      `AI_USAGE.md`. Structural: React в `features/set-bet` и новые
      set-bet UI на detail — `*.component.tsx`.
      check: `find src/features/set-bet -name '*.tsx' ! -name '*.component.tsx' 2>/dev/null | grep -q . && exit 1 || true; pnpm verify`
