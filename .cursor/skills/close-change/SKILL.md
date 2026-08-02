---
name: close-change
description: >-
  Закрыть active harness change: verify, status=done, STATUS/ACTIVE,
  git commit, черновик AI_USAGE. Без новой change и без лишнего кода.
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
4. Git commit всей работы change (обязательный шаг close):
   - `git status` / `git diff` / `git log` — как в user rule committing-changes
   - stage релевантные файлы change (не секреты: `.env`, credentials и т.п.)
   - если нечего коммитить (чистое дерево) — не делать пустой commit; в ответе `Commit: skipped (clean tree)`
   - иначе один commit с сообщением (см. ниже)
   - после commit: `git status` для проверки
5. Черновик для `AI_USAGE.md` (3–5 пуль): что сделал AI, что отклонили/trade-off, риски. Запиши в `AI_USAGE.md` только если файл есть или оператор просил; иначе выведи блок `AI_USAGE_DRAFT` в ответе.

## Commit message

Conventional Commits + id change:

```text
<type>(<change-id>): <summary>
```

- `change-id` — имя из `ACTIVE.md` на момент close, напр. `001-bootstrap`
- `type`: `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `build` — по сути change (обычно `feat` / `chore`)
- `summary` — императив, ~≤72 символов, из Goal/`proposal.md` (почему/что закрыли), без точки в конце
- body опционален (1–2 предложения), через пустую строку; фокус на why
- сообщение передавать через HEREDOC

Пример:

```bash
git commit -m "$(cat <<'EOF'
feat(001-bootstrap): scaffold Vite React TS app with verify gate

EOF
)"
```

## Формат ответа

```text
CLOSE: <change-name>
Verify: green | red <кратко>
Manual: none | pending: ... | confirmed
Status: done
ACTIVE: cleared
Commit: <sha-short> <subject> | skipped (clean tree) | failed <кратко>
AI_USAGE_DRAFT:
- ...
Next: выбрать следующую change → ACTIVE + status=active
```

Не стартуй следующую change. Вне `/close-change` коммиты по-прежнему только по просьбе оператора.
