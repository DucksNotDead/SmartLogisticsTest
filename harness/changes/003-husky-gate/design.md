# Design: 003-husky-gate

## Approach

1. Поставить `husky` (devDep), `pnpm exec husky init` (или эквивалент актуальной CLI).
2. `package.json`: `"prepare": "husky"` — hooks ставятся после install.
3. `.husky/pre-commit` содержит только `pnpm verify` (без lint-staged).
4. README: одна секция про local git gate.

Поведение: `git commit` → pre-commit → полный `pnpm verify` (весь проект,
не список staged paths); non-zero exit → commit aborted.

## FSD layout

n/a — tooling/git hooks, `src/` не трогаем.

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Full `pnpm verify` в pre-commit | тот же gate что CI-локально; просто | медленнее на больших деревьях | **full verify** |
| lint-staged (только staged) | быстрее | другой набор проверок ≠ `verify`; typecheck/fsd часто нужен весь проект | **не в этом change** |
| pre-push вместо pre-commit | реже гоняется | можно накопить red-коммиты локально | **pre-commit** |
| Только `lint` в hook | быстрее | слабее текущего `verify` | **нет** |

## Progressive verify

Каждый task → `pnpm verify` (hook ещё не обязателен для gate task’ов harness).
Ручная проверка блокировки commit — в `verify.md` Manual.
