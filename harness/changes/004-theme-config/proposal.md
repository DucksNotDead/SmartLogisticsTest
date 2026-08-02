# Proposal: 004-theme-config

## Goal

Привести CSS theme tokens (shadcn/Tailwind) к визуальному концепту бренда
«Умная логистика» с публичного сайта [ul.su](https://ul.su/), чтобы дальнейший UI
аукционов выглядел узнаваемо и аккуратно, без пиксель-перфект клона маркетинга.

## In scope

- Референс-палитра с ul.su → CSS variables в `src/app/styles.css` (`:root`, при
  необходимости адаптированный `.dark`)
- Маппинг на shadcn-токены: `primary`, `accent`, `foreground`, `background`,
  `muted`, `border`, `ring`, `destructive` (и связанные `*-foreground`)
- Smoke shell (`app/App.tsx` + `shared/ui/button`) визуально отражает brand
  primary (без новых продуктовых экранов)
- Краткая фиксация источника темы: README и/или черновик пункта в `AI_USAGE.md`

## Out of scope

- Страницы list/detail/bet, роуты, фильтры, MSW handlers, OpenAPI-типы
- Расширение UI-kit (новые shadcn-компоненты сверх уже существующих smoke)
- Пиксель-перфект вёрстка лендинга ul.su, анимации/hero маркетинга
- Логотип/фавикон/копирайт ассеты с сайта (если понадобятся — отдельная change)
- Смена стека (Tailwind/shadcn/Geist → другая библиотека)

## Acceptance

- В `styles.css` primary/accent завязаны на бренд-цвета ul.su (не дефолтный
  нейтральный shadcn black/gray primary)
- `:root` light-first; `.dark` либо адаптирован под ту же палитру, либо явно
  оставлен согласованным (не «чужой» purple/indigo default)
- Smoke `Button` variant default использует brand primary
- `pnpm verify` green
- README или `AI_USAGE.md` упоминает источник темы (ul.su)
