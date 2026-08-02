# Tasks: 003-husky-gate

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] DevDep `husky`; script `"prepare": "husky"`; `pnpm i` / init hooks
      (директория `.husky/` появляется).
      check: `test -d .husky && grep -q '"prepare"' package.json && pnpm verify`

- [x] * `.husky/pre-commit` → `pnpm verify`; убедиться что файл executable /
      husky его вызывает; green verify на текущем дереве.
      check: `test -f .husky/pre-commit && grep -q 'pnpm verify' .husky/pre-commit && pnpm verify`

- [x] README: pre-commit гоняет `pnpm verify`, red блокирует commit; кратко
      escape hatch (`HUSKY=0` или `--no-verify`).
      check: `pnpm verify`
