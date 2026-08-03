# Verify: 010-bets-tab

## Auto

- `pnpm verify` (= typecheck + lint + fsd + test)
- Mapper bet + unit-тесты в `entities/bet`
- Вкладка «Ставки» использует `useListBets` с `all=true` (когда не скрыто)
- При `hide_bets_history` нет активного fetch bets
- Тесты `hide_*`: `hide_bets_history` / `hide_places` → скрыто
- React-компоненты bets UI в `pages/auction-detail`: `*.component.tsx`
- Нет формы set-bet / `useSetBet` на вкладке

## Change acceptance

### Auto / structural

- [x] `pnpm verify` green
- [x] Bets через TanStack Query (`useListBets`); query param `all=true`
- [x] Mapper: participants derived; win / rejected / reason / prices
- [x] `hide_bets_history` → сообщение, без списка; тест покрывает
- [x] `hide_places` → place не показан; тест покрывает
- [x] Empty / skeleton / error(+retry) на вкладке
- [x] Иерархичная вёрстка + цвет статусов (не плоский список)
- [x] Нет set-bet form
- [x] README + `AI_USAGE.md` отражают scope

### Manual

- [x] `pnpm dev` → detail → таб «Ставки»: видны ставки, участники, цены
- [x] Аукцион с несколькими ставками: места / перевозчики читаемы;
      цена визуально доминирует
- [x] Winner и rejected выделены цветом; у rejected видна причина
- [x] Аукцион с `hide_bets_history`: «история скрыта», сети bets нет
- [x] Аукцион с `hide_places`: место в рейтинге на ставках не видно
- [x] Аукцион без ставок: empty state
- [x] Viewport ~375: без horizontal scroll

