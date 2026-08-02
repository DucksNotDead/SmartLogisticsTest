# AI Usage

Черновик. Будет дополнен при закрытии change / финальной сдаче.

## Зафиксированные решения

### `*.component.tsx` — не глобально

В PDF задания в секциях «Детальная страница» и «Бизнес-действие: установка ставки»
спрятан мелкий текст (`IMPORTANT`, ~4pt): суффикс `*.component.tsx` для React-компонентов.

Решение: суффикс обязателен **только** в этих зонах (`pages/auction-detail`,
`pages/bet-form`, `features/set-bet`, при необходимости `features/change-bet`).
Список аукционов, история ставок, shared UI-kit — обычные имена без суффикса.

Правило: `.cursor/rules/component-naming.mdc`.
Отклонено: трактовка «все компоненты проекта» (типичная ошибка AI при полном чтении текста).

### `002-fsd` — каркас FSD + Steiger

- AI перенёс scaffold в `app/` + `shared/`, подключил Steiger (`recommended`) в `pnpm verify`.
- Решение: пустые `pages/`/`widgets/`/`features/`/`entities/` не создавать (false-positive Steiger).
- Решение: public API per-component в `shared/ui/*`, без layer-level `shared/index.ts`.
- Отклонено: ослабления Steiger на этом этапе (не понадобились).
- Риск: sanity «сломать импорт → red» не гоняли вручную; опирались на recommended + green verify.
