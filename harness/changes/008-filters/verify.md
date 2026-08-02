# Verify: 008-filters

## Auto

- `pnpm verify` (= typecheck + lint + fsd + test)
- Route `/auctions`: Zod search включает pagination + filter keys
- List request строится из search (`toListRequest` / эквивалент)
- MSW list применяет filter/sort до pagination
- Есть `widgets/auction-filters`, `shared/ui/sheet`, `entities/city`
- Desktop: filters в pagination + drawer right; mobile: row + drawer bottom
- Skeleton ×12; `useLockScrollWhile` при pending

## Change acceptance

### Auto / structural

- [x] `pnpm verify` green
- [x] Desktop: Фильтры после «На странице»; drawer `side=right`; нет sticky toolbar у h1
- [x] Mobile: filters и пагинация в одном ряду; остаются при expanded; drawer bottom
- [x] Scroll не у конца списка → pagination summary
- [x] Save/Cancel в один ряд (в т.ч. mobile); Reset при active, размер = Фильтры
- [x] Пресеты toggle; секции сворачиваемые кроме пресетов / номера / сортировки
- [x] Must/Should keys + 4 пресета в UI
- [x] Нет `mobile_statuses` / later-полей в UI
- [x] MSW filter покрыт тестами (хотя бы 2–3 кейса)
- [x] Skeleton ×12; scroll locked while pending
- [x] README + `AI_USAGE.md` отражают scope

### Manual

- [x] Desktop: кнопка Фильтры после «На странице»; drawer справа
- [x] Desktop Save/Cancel/Reset; URL sync
- [x] Mobile ~375: Фильтры и пагинация в одном ряду; drawer снизу
- [x] Mobile: expand pagination → фильтры остаются; Свернуть/scroll → summary
- [x] Scroll в середине списка после ручного expand → снова summary
- [x] Правки без Save не меняют список/URL
- [x] Пресеты toggle + города + битый query param
- [x] Сворачиваемые секции; пресеты/номер/сортировка всегда видны
- [x] Pending: 12 skeleton, скролл не двигается
