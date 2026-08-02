# Verify: 003-husky-gate

## Auto

- `pnpm verify` green
- Есть `.husky/pre-commit` с `pnpm verify`
- В `package.json` есть `"prepare": "husky"` (или актуальный эквивалент husky)

## Change acceptance

### Auto / structural

- [x] `husky` в `devDependencies`
- [x] `prepare` script установлен
- [x] `.husky/pre-commit` вызывает `pnpm verify`
- [x] `pnpm verify` green
- [x] README описывает pre-commit gate

### Manual

- [x] `git commit` → в выводе хука виден полный `pnpm verify`; при green commit создаётся
- [x] Временно сломать verify (или `exit 1` в hook) → commit aborted; откатить поломку
- [x] Убедиться что hook не вызывает lint-staged / не фильтрует файлы по index
