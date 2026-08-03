# Design: 010-bets-tab

## Approach

1. Mapper (чистая функция) в `entities/bet/model`:
   `BetItem` → `BetViewModel`; `BetListResponse` → `{ bets, participantsCount }`.
   `participantsCount` = число уникальных `organization_id` (fallback
   `subscriber_id`, если org отсутствует). Цены: корень
   `price_with_vat` / `price_no_vat`, иначе `price_info`. Отмена:
   `isRejected = is_rejected`; `cancelReason` только если непустая строка.
   Unit-тесты. Public API `entities/bet`.
2. Tab «Ставки» в `AuctionDetailPage`:
   - если `detail.hideBetsHistory` → только сообщение (как сейчас),
     **enabled: false** / не вызывать query
   - иначе → `useListBets(auctionUuid, { all: true })`
3. UI ветки вкладки:
   - pending → skeleton карточек
   - error → сообщение + retry (`refetch`)
   - success + `bets.length === 0` → empty
   - success → summary (участники) + иерархичный список карточек
4. Карточка ставки (не плоская dl-строка):
   - **Primary:** цена с НДС крупно; без НДС вторичнее рядом/ниже;
     badge места (`place`) если не `hidePlaces`
   - **Status band:** `is_win` (accent success), `is_rejected`
     (destructive) + `cancel_reason` при наличии
   - **Secondary:** перевозчик (`organization_name` / contact), дата
     создания компактно
5. Цвета статусов через существующие theme tokens
   (`text-destructive`, success/muted), без новых deps.
6. `hide_places` из detail VM: не рендерить `place` (флаг уже в
   `AuctionDetailViewModel`). Тесты видимости:
   - `hideBetsHistory=true` → hidden UI, query disabled / нет списка
   - `hidePlaces=true` → в карточке нет place (при наличии `place` в DTO)
7. MSW: расширить seed - multi-bets, empty, rejected+reason, winner;
   handler `all` уже есть; seed с `hide_places` / `hide_bets_history`
   (часть уже есть с 009).
8. Удалить/заменить `BetsTabPlaceholder` на `BetsTab.component.tsx`
   (+ subcomponents при необходимости). Все React UI в
   `pages/auction-detail` - `*.component.tsx`.
9. README + `AI_USAGE.md`.

## FSD layout

```text
src/
  pages/auction-detail/
    ui/
      BetsTab.component.tsx              # query gate + states
      BetCard.component.tsx              # иерархичная карточка
      BetsTabSkeleton.component.tsx
      BetsEmpty.component.tsx            # optional
      BetsHidden.component.tsx           # hide_bets_history (из placeholder)
    …
  entities/bet/
    model/
      map-bet.ts                         # BetItem → VM + summary
      map-bet.test.ts
    api/bets.ts                          # уже useListBets
    index.ts                             # + mapper exports
  shared/api/mocks/store.ts              # seed bets cases
```

Не создавать: `features/set-bet`, отдельный `pages/bets`, форму ставки.

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Participants: unique org vs `bets.length` | ближе к «участники» | деривация | **unique `organization_id`** |
| Query `all=true` vs default | видны rejected | чуть больше данных | **`all=true`** |
| UI в tab detail vs отдельный route | уже chrome/табы | | **вкладка detail** |
| `hide_places` скрывает place на bets | согласовано с DTO | ТЗ bets всегда хочет place | **скрывать при флаге** |
| Layout: flat list vs hierarchy | быстрее | хуже скан | **hierarchy + color status** |

## Progressive verify

Каждый task → `pnpm verify`.
