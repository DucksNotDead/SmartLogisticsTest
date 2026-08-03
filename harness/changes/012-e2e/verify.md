# Verify: 012-e2e

## Auto

- `pnpm verify` (= typecheck + lint + fsd + test) — без e2e
- `pnpm test:e2e` green (Playwright + webServer + MSW)
- Есть `playwright.config.ts`, script `test:e2e`, каталог `e2e/`

## Change acceptance

### Auto / structural

- [x] `pnpm verify` green
- [x] `pnpm test:e2e` green
- [x] Filter specs: Save/Cancel/Reset/preset/города/status + bad query
- [x] Set-bet specs: success / no-CTA / realtime / 422 / picker
- [x] e2e **не** в husky/`pnpm verify`
- [x] README + `AI_USAGE.md` отражают scope

### Manual

- [x] Локально: свежий `pnpm exec playwright install chromium` →
      `pnpm test:e2e` проходит без уже запущенного dev (webServer сам)
- [ ] При желании: `pnpm dev` + reuseExistingServer — specs тоже green
      (optional; skipped at close)
