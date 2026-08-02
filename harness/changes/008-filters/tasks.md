# Tasks: 008-filters

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] Расширить Zod search (`page`/`per_page` + must/should filter keys)
      с безопасными fallback; `validateSearch` на `/auctions`; хелперы
      `hasActiveFilters` + `toListRequest(search)`.
      check: `rg -q 'cargo_num|hasActiveFilters|toListRequest' src/pages/auction-list && pnpm verify`

- [x] `entities/city`: мок-словарь городов + public API; использовать в
      select load/unload (даже до полного drawer — export готов).
      check: `test -f src/entities/city/index.ts && pnpm verify`

- [x] `shared/ui/sheet`: drawer primitive (right/bottom), public API.
      check: `test -f src/shared/ui/sheet/index.ts && pnpm verify`

- [x] * MSW: filter+sort list по in-scope полям request; pagination после
      filter; seed с разнообразием (города, статусы, типы, цены, кузов,
      stop_time, is_available/is_bidder); узкие тесты filter helper.
      check: `rg -q 'filter|sort' src/shared/api/mocks && pnpm test && pnpm verify`

- [x] Базовый draft UI (toolbar/drawer/form/presets) — основа для chrome
      pivot ниже.
      check: `rg -q 'FiltersDrawer|FiltersToolbar|is_available|body_types' src/widgets/auction-filters && pnpm verify`

- [x] Desktop: кнопка Фильтры(+Reset) после «На странице»; drawer
      `side=right`; убрать sticky toolbar у заголовка / sidebar.
      check: `rg -q 'desktopFiltersSlot|FiltersDrawer' src/pages/auction-list src/widgets/auction-filters && pnpm verify`

- [x] Mobile chrome: Фильтры(+Reset) в одном ряду с пагинацией; остаются
      при expanded; sheet bottom; scroll не у конца → summary.
      check: `rg -q 'filtersSlot|summary|expanded' src/pages/auction-list && pnpm verify`

- [x] Form polish: пресеты toggle; сворачиваемые секции (кроме пресетов /
      номера / сортировки); Save/Cancel в ряд; toolbar lg.
      check: `rg -q 'toggleFilterPreset|StaticSection|flex-row' src/widgets/auction-filters && pnpm verify`

- [x] Loading: skeleton ×12; lock scroll на `isPending`.
      check: `rg -q 'length: 12|useLockScrollWhile' src/pages/auction-list && pnpm verify`

- [x] README + `AI_USAGE.md` под финальный chrome/form/loading.
      check: `rg -q 'фильтр|filter|drawer' README.md AI_USAGE.md && pnpm verify`
