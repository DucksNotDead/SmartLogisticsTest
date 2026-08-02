# Design: 008-filters

## Approach

1. **URL = applied filters.** `auctionListSearchSchema` + `toListRequest` /
   `hasActiveFilters`.
2. **Draft vs applied.** Snapshot applied → draft; Save → navigate
   `page: 1` + close drawer; Cancel discard; Reset → defaults.
3. **Desktop (`md+`):** кнопка Фильтры (+ Reset) после «На странице» в
   sticky pagination; `FiltersDrawer` sheet `side="right"`.
   Sticky toolbar у h1 и sidebar не используем.
4. **Mobile (`<md`):** Filters (+ Reset) и блок пагинации в одном
   горизонтальном ряду (`flex` row). Summary/controls анимируются;
   фильтры не прячутся при expand. Drawer `side="bottom"`.
5. **Pagination collapse:** IO + scroll: sentinel вне viewport →
   `expanded=false`.
6. **Form UX (оператор, после chrome pivot):**
   - Пресеты / номер заявки / сортировка всегда раскрыты.
   - Остальные секции - `<details>` (default open если поле уже в draft).
   - Пресеты toggle (`isFilterPresetActive` / `clearFilterPreset`).
   - Save/Cancel всегда `flex-row`.
7. **Toolbar:** «Фильтры» primary `size=lg`; «Сбросить» outline того же
   размера.
8. **Loading:** skeleton ×12; `useLockScrollWhile(isPending)` на
   `[data-app-scroll]`.

### Layout

```text
Desktop pagination:
[ Стр. … ] [ На странице ▾ ] [Фильтры][Сбросить?]   [Назад][Вперёд]
                                              └ drawer right

Mobile (summary / expanded — один ряд):
[Фильтры][Сбросить?]  [ summary ▲  |  controls… Свернуть ]
         └ drawer bottom
```

## FSD layout

```text
widgets/auction-filters/
  ui/FiltersForm.tsx         # static + collapsible sections, presets toggle
  ui/FiltersToolbar.tsx      # Фильтры + Сбросить
  ui/FiltersDrawer.tsx       # sheet right (md+) / bottom (<md)
  model/draft.ts             # presets apply/clear/toggle
  model/filters-ui-store.ts  # open (sheet)
pages/auction-list/
  ui/AuctionListPage.tsx
  ui/AuctionListPagination.tsx   # filtersSlot | desktopFiltersSlot
  ui/AuctionListSkeleton.tsx     # ×12
  lib/use-expand-pagination-on-list-end.ts
  lib/use-lock-scroll-while.ts
```

## Trade-offs

| Option | Decision |
|---|---|
| Sticky header toolbar vs pagination chrome | **pagination chrome** (оператор) |
| Desktop sidebar vs drawer | **drawer right** (оператор; sidebar отменён) |
| Hide filters on mobile expand | **оставить** (оператор) |
| Filters vs pagination stack | **один горизонтальный ряд** (оператор) |
| Live-apply vs Save/Cancel | **draft + Save** |
| URL vs localStorage | **URL applied** |

## Progressive verify

Каждый task → `pnpm verify`.
