# Proposal: 011-bet-create

## Goal

Форма «Сделать ставку» (bottomsheet): RHF + Zod, mutation
`POST /auctions/{auctionUuid}/bets`, инвалидация list/detail/bets,
мутация MSW-store, toast и UX после успеха (check → вкладка «Ставки» →
highlight). Все React UI set-bet / detail CTA — `*.component.tsx`.

## In scope

- Feature `features/set-bet`: форма в bottomsheet (`Sheet` side=bottom),
  крупная и удобная; CTA «Установить ставку» на карточке detail
  (`PriceHero`) и во вкладке «Ставки», только если `trading.canSetBet`
- React Hook Form + Zod: `price` обязателен и `> 0`; динамические
  ограничения `min` / `max` / `step` из detail VM, только если поле
  не `null`/`undefined`
- Подсказка доступной цены и шага; UI-kit автокомплит/пикер
  предложенных шагов (на базе `available` / `step` / границ)
- Real-time валидация: сообщение под полем, **без** shake
- На 422 (`ValidationProblem.errors[]`): shake неверного поля + плавное
  появление объяснения снизу; error toast
- Mutation через `useSetBet` / `POST .../bets`; после успеха —
  invalidate list + detail + bets queries
- Success UX: крупный зелёный checked в sheet → через ~1s закрыть
  bottomsheet → открыть вкладку «Ставки» → ~1.5s выделить созданную
  ставку; success toast
- MSW `applySetBet` уже есть: не ломать обновление current price /
  status_mobile / your / bets; при необходимости точечно донастроить
  под UI-кейсы
- Unit-тесты Zod-схемы ставки (min/max/step / nullable bounds / >0)
- Нейминг: React UI в `features/set-bet` и связанные CTA/sheet на
  detail — `*.component.tsx`
- README + черновик в `AI_USAGE.md` (set-bet; 422 shake vs realtime;
  post-success highlight; void response)

## Out of scope

- Auth / 401 UX; Orval regen без нужды; E2E
- Изменение контракта `SetBetRequest` / ответ 200 (остаётся void)
- Список аукционов CTA set-bet; `features/change-bet` как отдельный flow
- Пиксель-перфект UL; framer-motion
- Переработка вкладки bets (кроме CTA, controlled tab, highlight prop)

## Acceptance

- При `canSetBet=false` CTA и форма недоступны; при `true` — кнопка на
  карточке и во вкладке «Ставки»
- Форма в bottomsheet; RHF+Zod; price > 0; min/max/step учитываются
  только если есть в detail
- Подсказка цены/шага + пикер/автокомплит предложенных значений
- Real-time: ошибка текстом без shake; 422: shake + плавное сообщение
- Mutation `POST .../bets`; после успеха invalidate list/detail/bets
- MSW меняет цену, статус пользователя, список ставок
- Success: зелёный checked → закрытие sheet (~1s) → таб «Ставки» →
  highlight созданной ставки (~1.5s); success/error toast
- React-компоненты set-bet зоны — `*.component.tsx`
- `pnpm verify` green; README + пункт в `AI_USAGE.md`
