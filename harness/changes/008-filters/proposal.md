# Proposal: 008-filters

## Goal

Добавить фильтры списка аукционов: desktop/mobile кнопка в sticky
pagination + drawer (right / bottom); draft Save/Cancel; sync в URL
search params (Zod fallback). Минимум ТЗ + should (кузов, ₽/км, sort,
пресеты).

## In scope

- **Desktop (`md+`):** кнопка «Фильтры» (+ Reset при active) после контрола
  «На странице» в sticky pagination; форма в sheet `side="right"`.
  Sticky toolbar у заголовка и sidebar не используем.
- **Mobile (`<md`):** «Фильтры» (+ Reset) и пагинация (summary / controls)
  в одном горизонтальном ряду sticky bottom; при развороте пагинации
  фильтры остаются; форма в sheet `side="bottom"`.
- Пагинация mobile: при прокрутке, если список не у конца, сворачивается
  в summary (даже после ручного expand).
- Draft vs applied: правки формы не пишут URL до Save; Cancel discard;
  Reset сбрасывает applied → URL defaults; Save/Reset → `page: 1`
- Форма: пресеты toggle (повторный клик снимает); сворачиваемые секции
  кроме пресетов / номера заявки / сортировки; Save/Cancel в один ряд
  на mobile и desktop
- Toolbar: «Фильтры» и «Сбросить» одного крупного размера
- Список: 12 skeleton items; на время `isPending` скролл `main` locked
- Zod `validateSearch` на `/auctions`: `page` / `per_page` + filter keys
  с безопасными fallback
- Applied filters → `POST /auctions/list` через `useListAuctions`
- **Must (ТЗ):** `cargo_num`, `status`, `statuses` (1–7), `auc_type`,
  `load_city`, `unload_city`, `load_date_from/to`, `is_available`,
  `is_bidder`, `current_price_from/to`
- **Should:** `body_types`, `price_per_km_*`, `sort`, `stop_time_*`,
  4 пресета (draft until Save)
- Мок-словарь городов: `entities/city`
- MSW: реальная фильтрация/сортировка; разнообразный seed
- UI-kit: `shared/ui/sheet` (drawer right/bottom)
- README + `AI_USAGE.md`

## Out of scope

- Later: radius, favorite, customer, weight/volume, unload/create/start
  dates, contractor, auction_ids, form_type, international,
  `mobile_statuses`, `replace_external_pads`
- localStorage для filter keys; live-apply без Save; сохранённые подборки
- Desktop sidebar / collapsible rail
- Detail / bets / set-bet; auth UX; Orval regen без нужды; E2E
- Пиксель-перфект UL

## Acceptance

- Desktop: Фильтры после «На странице»; drawer справа; Save/Cancel в ряд;
  Reset при active (тот же размер, что Фильтры)
- Mobile: Фильтры и пагинация в одном ряду; при expanded фильтры
  остаются; scroll не у конца → summary; drawer снизу
- Пресеты toggle; секции формы сворачиваемые (кроме пресетов / номера /
  сортировки)
- Draft не меняет URL/список до Save; Cancel discard
- Skeleton ×12; scroll locked while pending
- Must/Should end-to-end; города из словаря; `status` ≠ `statuses`
- `pnpm verify` green; README + `AI_USAGE.md` обновлены
