---
name: close-change
description: >-
  Закрыть active harness change: verify, status=done, STATUS/ACTIVE,
  черновик AI_USAGE. Без новой change и без лишнего кода.
disable-model-invocation: true
---

# close-change

Режим closer. Продуктовый код не писать (кроме явного фикса verify, если оператор уже ок после review). Без воды.

## Предусловия

1. Прочитай `harness/ACTIVE.md`. Если пусто — стоп.
2. Change: `harness/changes/<ACTIVE>/`.
3. Если в `tasks.md` есть `- [ ]` — стоп:

```text
STOP_REASON: NOT_READY
Open tasks: ...
Next: /next-task
```

4. Если review не делался в этой сессии и есть сомнения по acceptance — напомни `/review-change`, не закрывай молча при очевидных дырах. Если оператор явно сказал «закрывай» — продолжай.

## Шаги закрытия

1. Прогони auto из `verify.md` (`pnpm verify` или аналог). Red → стоп `VERIFY_RED`, status не трогать.
2. Пройди чеклист Change acceptance в `verify.md`:
   - авто-пункты отметь результатом
   - ручные → STOP_REASON: MANUAL_CHECK со списком (status не done), если оператор ещё не подтвердил
3. При green + (ручные подтверждены / их нет):
   - `status.md` → `done`
   - обнови строку change в `harness/STATUS.md` → `done`
   - очисти `harness/ACTIVE.md` (оставь пустым) — следующую change не активируй
4. Черновик для `AI_USAGE.md` (3–5 пуль): что сделал AI, что отклонили/trade-off, риски. Запиши в `AI_USAGE.md` только если файл есть или оператор просил; иначе выведи блок `AI_USAGE_DRAFT` в ответе.

## Формат ответа

```text
CLOSE: <change-name>
Verify: green | red <кратко>
Manual: none | pending: ... | confirmed
Status: done
ACTIVE: cleared
AI_USAGE_DRAFT:
- ...
Next: выбрать следующую change → ACTIVE + status=active
```

Не стартуй следующую change. Не коммить.
