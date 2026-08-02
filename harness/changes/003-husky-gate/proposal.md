# Proposal: 003-husky-gate

## Goal

Поставить Husky pre-commit: каждый `git commit` гоняет полный `pnpm verify`
по всему проекту; red (exit ≠ 0) прерывает commit.

## In scope

- DevDependency `husky`; script `prepare` для установки hooks после `pnpm i`
- `.husky/pre-commit` → `pnpm verify` (typecheck + lint + fsd + test на всём дереве)
- Кратко в README: что хук делает и как обойти локально (`HUSKY=0` / `--no-verify`
  только как escape hatch, не рекомендовать по умолчанию)
- Убедиться что при green verify коммит проходит, при искусственном red — нет

## Out of scope

- lint-staged и любой «только изменённые/staged файлы» scope проверок
  (в hook всегда полный `pnpm verify`, не подмножество файлов)
- commit-msg / pre-push / CI
- Продуктовый код, FSD-слайсы, роуты, MSW handlers
- Смена состава `verify` (оставить как после 002-fsd)

## Acceptance

- После `pnpm i` husky hooks установлены (`prepare` отрабатывает)
- Триггер: `git commit` вызывает `.husky/pre-commit` → полный `pnpm verify`
  (весь проект; не фильтр по index/staged paths)
- Red `pnpm verify` → commit не создаётся (exit ≠ 0 у hook)
- Green `pnpm verify` → commit проходит (при прочих равных)
- README упоминает pre-commit gate
- `pnpm verify` green на текущем дереве
