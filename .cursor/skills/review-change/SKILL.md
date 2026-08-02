---
name: review-change
description: >-
  Ревью active harness change без правок кода: сверка со спекой, scope,
  OpenAPI, rules. Краткие findings.
disable-model-invocation: true
---

# review-change

Режим reviewer. Код не писать. Файлы harness/status не менять. Без воды.

## Шаги

1. Прочитай `harness/ACTIVE.md`. Если пусто — стоп.
2. Открой `harness/changes/<ACTIVE>/`: status, proposal, design, tasks, verify.
3. Сверь реализацию (diff / затронутые файлы в `src/` и тестах) с:
   - acceptance и out of scope из `proposal.md`
   - `design.md`
   - все ли tasks `[x]` (если нет — укажи открытые)
   - `Input/openapi.auctions.v0.json` (если change трогает API/DTO/MSW)
   - `.cursor/rules/*` (FSD, component-naming: `.component.tsx` только detail/set-bet, project-context)
4. Не чини. Только findings.

## Формат ответа

```text
REVIEW: <ACTIVE>
Tasks: <all [x] | open: ...>
Verdict: PASS | PASS_WITH_NOTES | FAIL

Findings:
- [severity|major|minor] <path>: <суть> | expect: <по спеке>
```

Если findings нет:

```text
Findings: none
```

Максимум по делу. Без вступлений.

## Severity

- critical — ломает контракт/acceptance/security-видимость флагов
- major — scope creep, неверный слой FSD, нет инвалидации/MSW state, нейминг (`.component.tsx` вне/без scope из `component-naming.mdc`)
- minor — стиль, мелочи не блокирующие close

FAIL если есть critical/major. Иначе PASS или PASS_WITH_NOTES (только minor).
