# Harness

Локальный протокол AI-разработки. Rule: `.cursor/rules/harness-protocol.mdc`.

Skills (Agent → `/`):

| Skill | Назначение |
|---|---|
| `/next-task` | исполнить task(и): обычные пачкой до `*`/red; `*` — по одному |
| `/review-change` | ревью без кода по proposal/OpenAPI/rules |
| `/close-change` | verify → `done` → commit по ГОСТу → очистить ACTIVE.md + черновик AI_USAGE |

## Дерево

```text
harness/
  ACTIVE.md              # одна строка: имя active change
  STATUS.md           # сводная таблица статусов
  README.md
  changes/
    _template/
    001-.../
```

## Новая change (без AI)

```bash
./scripts/new-change.sh bootstrap
./scripts/new-change.sh 003-auction-list
./scripts/new-change.sh --activate auction-list
```

Копирует `harness/changes/_template`, ставит `status: draft`, добавляет строку в `STATUS.md`.
`--activate` → `active` + запись в `ACTIVE.md` (предыдущую active снимает в `draft`).

## Активировать существующую change

```bash
./scripts/activate-change.sh 1
./scripts/activate-change.sh 001
./scripts/activate-change.sh 001-bootstrap
```

Ставит `status: active`, пишет имя в `ACTIVE.md`, предыдущую active снимает в `draft`.
Нельзя активировать `done` / `cancelled`.

## Жизненный цикл change

1. `./scripts/new-change.sh <slug|NNN-slug>`
2. Заполнить proposal / design / tasks / verify
3. Approve → `./scripts/activate-change.sh <NNN>` (или сразу `--activate` при создании)
4. `/next-task` → `/review-change` → `/close-change`
5. `status: done`, git commit `type(NNN-slug): summary`, `ACTIVE.md` очищен

### Commit на close (ГОСТ)

```text
<type>(<change-id>): <summary>
```

Пример: `feat(001-bootstrap): scaffold Vite React TS app with verify gate`

## tasks.md и `*`

```text
- [ ] обычный шаг (можно пачкой в одном /next-task)
- [ ] * критичный шаг (стоп перед ним; выполнить одним /next-task)
```

## Файлы change

| Файл | Содержание |
|---|---|
| proposal.md | зачем, in/out scope, acceptance |
| design.md | техплан, trade-off’ы |
| tasks.md | чеклист шагов, `*` = critical |
| verify.md | DoD всей change + `pnpm verify` |
| status.md | draft \| active \| blocked \| done \| cancelled |
