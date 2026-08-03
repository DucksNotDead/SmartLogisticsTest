# Design: 011-bet-create

## Approach

1. **Slice `features/set-bet`** (бизнес-действие):
   - `model/bet-price.schema.ts` — фабрика Zod от
     `{ min?, max?, step?, available? }` (nullable → правило не
     применяется). Unit-тесты.
   - `model/suggest-prices.ts` — список предложений шагов
     (от `available` / `current - n*step` в пределах min/max).
   - `api/use-set-bet-mutation.ts` — обёртка над `useSetBet`:
     onSuccess → invalidate
     `getListAuctionsQueryKey` / `getGetAuctionQueryKey(uuid)` /
     `getListBetsQueryKey(uuid, …)`; toast success/error.
   - `ui/SetBetSheet.component.tsx` — bottomsheet (`Sheet` `side="bottom"`),
     крупная форма, success overlay (зелёный checked).
   - `ui/BetPriceField.component.tsx` — RHF field + realtime message +
     shake на 422 + Combobox/пикер подсказок.
   - Public API `features/set-bet`.

2. **Доступность**: CTA рендерятся только при `detail.trading.canSetBet`.
   На карточке (`PriceHero`) и в `BetsTab` — одна и та же open-action
   (callback / shared trigger из page).

3. **Форма**:
   - RHF + `@hookform/resolvers/zod`, `mode: 'onChange'` для realtime.
   - Realtime: `formState.errors` → текст под полем, класс shake **не**
     вешать.
   - Submit → mutation; на `ApiError` 422 с `ValidationProblem.errors[]`:
     `setError('price', …)` + CSS shake + плавный appear сообщения
     (grid/height или opacity/translate); error toast.
   - Подсказка: «доступно / шаг» из `prices.available` / `prices.step`.

4. **UI-kit**:
   - Bottomsheet: существующий `shared/ui/sheet` (`side="bottom"`).
   - Toast: `sonner` (+ `shared/ui/sonner` / Toaster в app shell).
   - Пикер шагов: shadcn Combobox (`Popover` + `Command`) в
     `shared/ui`, если ещё нет; свободный ввод цены остаётся.
   - Анимации: CSS (`animate-in` / keyframes), без framer-motion.

5. **Post-success flow** (таймеры в feature/page, clear on unmount):
   1. Показать крупный зелёный checked в sheet.
   2. ~1000ms → закрыть sheet.
   3. Переключить `DetailTabs` на `bets` (controlled `value`).
   4. После refetch bets выделить созданную ставку ~1500ms.
   - Ответ setBet **void** (OpenAPI): идентификация ставки по
     отправленному `price` (+ наша org / place=1 после MSW).
     Highlight prop в `BetCard` / `BetsTab` (`highlightPrice` или
     matched `id` после появления в списке).
   - Если `hideBetsHistory`: вкладку всё равно открыть (hidden UI);
     highlight пропустить.

6. **MSW**: `applySetBet` уже мутирует store; не ломать. При нужде —
   стабильный id новой ставки для highlight (уже есть `nextBetId`).

7. README + `AI_USAGE.md`.

## FSD layout

```text
src/
  features/set-bet/
    ui/
      SetBetSheet.component.tsx
      BetPriceField.component.tsx
      SetBetSuccess.component.tsx      # зелёный checked
    model/
      bet-price.schema.ts
      bet-price.schema.test.ts
      suggest-prices.ts
    api/
      use-set-bet-mutation.ts
    index.ts
  pages/auction-detail/ui/
    PriceHero.component.tsx            # CTA → open sheet
    BetsTab.component.tsx              # CTA + highlight prop
    BetCard.component.tsx              # highlight styles
    DetailTabs.component.tsx           # controlled value
    AuctionDetailPage.component.tsx    # sheet host + tab/highlight state
  shared/ui/
    sonner/                            # toast
    popover/ command/                  # combobox pieces (если нет)
  app/                                 # <Toaster />
```

Не создавать: отдельный route `/bet-form`, `features/change-bet`.

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Toast: sonner vs самописный | стандарт shadcn, быстро | dep | **sonner** |
| Пикер: Combobox vs чипы Select | автокомплит + ввод | чуть больше UI | **Combobox (Popover+Command)** |
| Highlight: price match vs менять API 200 | без ломки OpenAPI | коллизии цен редки в моке | **match по price после invalidate** |
| Tabs: controlled vs URL search | shareable deep-link | чуть больше wiring | **URL `?tab=info|bets`** |
| Success: только check vs check+toast | ТЗ хочет toast | дубль сигнала | **check в sheet + success toast** |
| Анимации: CSS vs framer | как в 009/010 | | **CSS only** |

## Progressive verify

Каждый task → `pnpm verify`.
