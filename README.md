# Smart Logistics Test (УЛ Лайт)

SPA для работы с грузовыми аукционами (тестовое задание).

## Требования

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+

## Установка

```bash
pnpm install
```

## Структура (FSD)

Код в `src/` разложен по Feature-Sliced Design:

```text
src/
  app/       # entry, shell, глобальные стили
  shared/    # UI-kit (button/input), lib (cn)
```

Продуктовые слои (`pages`, `widgets`, `features`, `entities`) появятся в следующих шагах.

## Тема UI

Цветовые токены shadcn/Tailwind в `src/app/styles.css` взяты с публичного сайта бренда
[ul.su](https://ul.su/) (жёлтый primary `#F9C21D`, оранжевый accent, тёмный ink).
Цель — узнаваемый аккуратный UI для проверки, не пиксель-перфект клон лендинга.

## Скрипты

```bash
pnpm dev      # локальный dev-сервер
pnpm build    # production-сборка
pnpm fsd      # архитектурный gate (Steiger)
pnpm verify   # typecheck + lint + fsd + test
```

`pnpm verify` включает Steiger (`@feature-sliced/steiger-plugin`, recommended): нарушения слоёв, cross-import слайсов и обход public API валят проверку.

## Pre-commit

После `pnpm install` Husky ставит git hook `.husky/pre-commit`: каждый `git commit` гоняет полный `pnpm verify` по всему проекту. Red (exit ≠ 0) блокирует commit.

Обойти локально только как escape hatch: `HUSKY=0 git commit ...` или `git commit --no-verify`.

## Проверка

После установки достаточно `pnpm verify`. На текущем этапе в приложении только smoke shell с shadcn (button/input) из `shared/ui`, без страниц аукционов и MSW-handlers.
