---
name: next-task
description: >-
  Выполнить следующий task(и) active harness change: обычные подряд до *
  или red; task с * — только один. Краткие ответы.
disable-model-invocation: true
---

# next-task

Режим executor по `harness-protocol`. Без воды.

## Шаги

1. Прочитай `harness/ACTIVE.md`. Если пусто — стоп, спроси оператора.
2. Открой `harness/changes/<ACTIVE>/` и прочитай: status, proposal, design, tasks, verify.
3. Убедись что `status` = `active`.
4. Найди первый `- [ ]` в `tasks.md`.

### Если task с `*` (критичный)

- Сделай только этот task.
- Запусти verify (`pnpm verify` или аналог).
- Green → `[x]`. Red → ≤2 узких fix; иначе STOP_REASON: VERIFY_RED.
- Стоп. Даже при green не бери следующий.

### Если task без `*`

Цикл:

1. Сделай текущий обычный task.
2. Verify. Green → `[x]`. Red → ≤2 fix; иначе STOP_REASON: VERIFY_RED и выход.
3. Посмотри следующий `[ ]`:
   - нет → STOP_REASON: DONE
   - есть `*` → STOP_REASON: CRITICAL_TASK_AHEAD (не начинай)
   - обычный → продолжай цикл
4. SCOPE_ESCAPE / TRADEOFF / AMBIGUITY / MANUAL_CHECK → стоп по протоколу.

## Отчёт при стопе

Формат (строго):

```text
STOP_REASON: <CODE>
Done: <краткий список>
Next: <что нужно от оператора или следующий шаг>
```

Без вступлений и повторов контекста.
