---
name: fill-change
description: >-
  Предзаполнить active harness change по короткому промпту: proposal,
  design, tasks, verify. Без продуктового кода. Краткие ответы.
disable-model-invocation: true
---

# fill-change

Режим planner. Продуктовый код не писать. Status/`ACTIVE.md` не менять
(кроме явного create+activate ниже). Без воды.

## Вход

Короткий промпт оператора: цель change в 1–3 предложениях (можно со slug).

Примеры:

```text
/fill-change husky pre-commit: pnpm verify на staged, не коммитить при red
/fill-change auction-list: страница списка + Zod search params + MSW list
```

## Шаги

1. Прочитай `harness/ACTIVE.md`, `harness/STATUS.md`, шаблон
   `harness/changes/_template/*`, 1–2 соседних done-change как стиль.
2. Разреши цель change:

   | Ситуация | Действие |
   |---|---|
   | ACTIVE не пуст | заполняй `harness/changes/<ACTIVE>/` |
   | ACTIVE пуст + в промпте есть slug (`auction-list` / `004-…`) | `./scripts/new-change.sh --activate <slug>`, затем заполняй |
   | ACTIVE пуст, slug нет | стоп: спроси slug или имя change |

3. Если `proposal.md` / `tasks.md` уже заполнены не шаблоном — стоп:

```text
STOP_REASON: ALREADY_FILLED
Change: <name>
Next: подтверди overwrite или правь вручную
```

Перезаписывай только после явного «overwrite» / «перезапиши».

4. Заполни четыре файла по структуре шаблона (заголовки секций сохранить).
   Ориентир стиля: `001-bootstrap`, `002-fsd`.
5. Не трогай `status.md` (остаётся `active`/`draft` как было).
6. Код / deps / конфиги не меняй. После fill — стоп на approve оператора.

## Как писать документы

### proposal.md

- **Goal** — 1–3 предложения, зачем change.
- **In scope** — конкретный список; без «и т.д.».
- **Out of scope** — короткий анти-магнит (соседние changes / то, что уйдёт дальше).
- **Acceptance** — проверяемые пункты (команды, структура, поведение).

Источник приоритетов при споре: OpenAPI для контрактов, текст задания для UX
(см. `project-context`). Спорные места — явный вопрос оператору, не молчаливый выбор.

### design.md

- **Approach** — короткий техплан (шаги/слои/ключевые решения).
- **FSD layout** — пути слоёв/слайсов; если change не про FSD — `n/a` + почему.
- **Trade-offs** — таблица только где есть реальный выбор; Decision пустой или
  `TBD` → тогда STOP_REASON: TRADEOFF в ответе (документы всё равно можно
  заполнить с пометкой TBD).

### tasks.md

- Мелкие проверяемые шаги под `/next-task`.
- Обычные `- [ ]` пачкой; `*` только на опасные/крупные (deps wiring, миграции,
  MSW state, публичные API breaking).
- У каждого task одна строка `check:` (команда или явный structural check).
- Не раздувать: 4–10 tasks типично; больше — подозревай scope creep.

### verify.md

- **Auto**: `pnpm verify` (+ узкие команды change, если нужны).
- **Change acceptance**: авто + manual/structural по acceptance из proposal.
- Не дублировать per-task матрицу — DoD всей change.

## Стоп без fill

- SCOPE_ESCAPE — промпт тянет соседнюю фичу → предложи A урезать / B stub / C новая change.
- AMBIGUITY — цитата OpenAPI/задания; ждать выбора.
- TRADEOFF — 2–3 варианта в ответе; в design можно TBD до записи решения.

## Формат ответа

```text
FILL: <change-name>
Prompt: <кратко>
Wrote: proposal, design, tasks (N), verify
Trade-offs: none | TBD: ...
Next: оператор approve → /next-task
```

При стопе:

```text
STOP_REASON: <CODE>
...
Next: ...
```

## Запреты

- Не вызывать `/next-task` сам и не начинать tasks.
- Не ставить `done`, не коммитить.
- Не расширять scope сверх промпта «на всякий случай».
- Не менять `proposal` acceptance после approve без оператора (это уже другая правка).
