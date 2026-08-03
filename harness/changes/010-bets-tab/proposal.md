# Proposal: 010-bets-tab

## Goal

Заполнить вкладку «Ставки» на detail: `GET /auctions/{auctionUuid}/bets`,
иерархичный UI (не плоский список), статусы цветом. Учесть
`hide_bets_history`, empty и отменённые ставки с причиной.

## In scope

- Заменить `BetsTabPlaceholder` на полноценный `BetsTab` во вкладке
  «Ставки» (`pages/auction-detail`): данные через `useListBets`
  (public API `entities/bet`)
- Запрос с `all=true`, чтобы в UI попадали отменённые/отклонённые ставки
  (`is_rejected` + `cancel_reason`); без `all` MSW/API их отфильтрует
- При `hide_bets_history` (уже в detail VM): текст «история скрыта»,
  **без** `useListBets` / fetch
- Показать:
  - список ставок
  - количество участников (деривация: уникальные `organization_id`
    среди полученных bets; в `BetListResponse` поля нет)
  - цену с НДС / без НДС (`price_with_vat` / `price_no_vat`, fallback
    `price_info.*` если корневые пусты)
  - перевозчика (`organization_name`, при пустом - fallback на contact)
  - место в рейтинге (`place`); при `hide_places` из detail - не показывать
  - признак победителя (`is_win`)
  - признак отменённой ставки (`is_rejected`) и `cancel_reason`, если не пуст
  - empty state при `bets=[]`
- Вёрстка: не вертикальный список одинаковых строк; цена / место /
  статусы (win / rejected) - крупнее и акцентнее; перевозчик и мета -
  вторичнее; статусные признаки - цвет (success / destructive / muted)
- ViewModel-маппер `BetItem` → bet VM (+ summary participants) в
  `entities/bet/model` + unit-тесты (rejected+reason, win, place null,
  empty org name, participants count)
- Тесты на `hide_*`: при `hide_bets_history` список/fetch не показываются;
  при `hide_places` место (`place`) не показывается (unit и/или UI-тест
  видимости)
- UI states вкладки: pending (skeleton), error (+ retry), empty, success
- MSW seed: ≥2 ставки на одном аукционе; кейс empty bets; кейс
  `is_rejected=true` + непустой `cancel_reason`; кейс `is_win=true`;
  места в рейтинге согласованы
- Нейминг: React UI в `pages/auction-detail` - `*.component.tsx`
  (зона detail)
- Адаптив без horizontal overflow
- README + черновик в `AI_USAGE.md` (bets tab; `all=true`; participants
  derived; set-bet out)

## Out of scope

- Форма «Сделать ставку» / `POST .../bets` / RHF+Zod / toast 422 /
  инвалидация после mutation (следующая change)
- Отдельный route `/bets` (остаёмся на вкладке detail)
- Prefetch bets с списка; auth / 401 UX; Orval regen без нужды; E2E
- Пиксель-перфект UL; смешивание list/detail DTO
- framer-motion

## Acceptance

- Вкладка «Ставки» грузит bets через `useListBets` с `all=true`
  (когда история не скрыта)
- При `hide_bets_history` - сообщение скрытия, без fetch bets
- Видны: участники (count), цены с/без НДС, перевозчик, место
  (если не `hide_places`), win, rejected + reason
- Есть тесты: `hide_bets_history` / `hide_places` → соответствующее
  скрыто
- Empty при пустом списке; skeleton / error(+retry) на вкладке
- Вёрстка иерархичная; статусы цветом; не плоский список строк
- `pnpm verify` green; README + пункт в `AI_USAGE.md`
