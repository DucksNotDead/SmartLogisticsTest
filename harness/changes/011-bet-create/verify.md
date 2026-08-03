# Verify: 011-bet-create

## Auto

- `pnpm verify` (= typecheck + lint + fsd + test)
- Unit-тесты Zod-схемы ставки (min/max/step / nullable / >0)
- Mutation инвалидирует list / detail / bets
- React UI `features/set-bet` (и set-bet CTA/sheet на detail):
  `*.component.tsx`
- CTA завязаны на `canSetBet`

## Change acceptance

### Auto / structural

- [x] `pnpm verify` green
- [x] Форма RHF+Zod в bottomsheet; price > 0; min/max/step условно
- [x] Подсказка available/step + пикер/автокомплит
- [x] Realtime без shake; 422 → shake + сообщение + mapping errors[]
- [x] POST `.../bets`; invalidate list/detail/bets после успеха
- [x] Toast success/error; success checked overlay
- [x] CTA на карточке и вкладке bets только при `canSetBet`
- [x] Post-success: close → tab bets → highlight ~1.5s
- [x] README + `AI_USAGE.md` отражают scope

### Manual

- [x] `pnpm dev` → detail с `can_set_bet=true` → «Установить ставку»
      на карточке открывает bottomsheet
- [x] То же CTA во вкладке «Ставки»
- [x] `can_set_bet=false` → кнопок ставки нет / форма недоступна
- [x] Невалидная цена realtime: текст ошибки, поле не трясётся
- [x] Сабмит цены вне правил MSW → 422: shake + объяснение + error toast
- [x] Успешная ставка: зелёный checked → sheet закрывается → таб
      «Ставки» → новая ставка подсвечена ~1.5s; цена/статус обновились
- [x] Пикер предлагает шаги; можно выбрать и отправить
- [x] Viewport ~375: sheet и форма без horizontal scroll
