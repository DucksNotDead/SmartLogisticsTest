# Verify: 002-fsd

## Auto

- `pnpm verify` (= typecheck + lint + **fsd**/Steiger + test)
- `pnpm build` не падает

## Change acceptance

- [x] В `src/` есть `app/` и `shared/`; нет `src/components/`, `src/lib/`
- [x] Нет продуктовых слайсов pages/widgets/features/entities
- [x] shadcn smoke (button/input) импортируется из `shared/ui/*` через `index.ts`
- [x] `components.json` указывает на `shared/ui` / `shared/lib`
- [x] `pnpm fsd` / шаг `fsd` внутри `verify` — fail на нарушении слоёв (ручная
      sanity: временно сломать импорт → red → откатить; либо довериться recommended
      + зелёному прогону на корректном дереве)
- [x] `pnpm verify` green
- [x] README описывает FSD + gate

## Manual (по желанию оператора)

- `pnpm dev` — smoke shell с Input/Button на экране
