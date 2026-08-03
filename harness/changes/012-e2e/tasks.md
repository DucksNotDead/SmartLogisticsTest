# Tasks: 012-e2e

Gate: `pnpm verify`. После появления specs — ещё `pnpm test:e2e`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] DevDep `@playwright/test`; `playwright.config.ts` (chromium,
      baseURL, webServer → `pnpm dev`); script `"test:e2e"`;
      `pnpm exec playwright install chromium` (документировать в README
      позже). Каркас `e2e/` + smoke «/auctions рендерится».
      check: `test -f playwright.config.ts && grep -q 'test:e2e' package.json && pnpm verify`

- [x] Helpers + fixtures: seed uuid / cargo_num / cannot-set-bet uuid;
      openFilters / save / cancel / reset; openSetBet. Точечные
      `data-testid` в UI только если без них flake.
      check: `test -d e2e/helpers && pnpm verify`

- [x] * Specs фильтров: cargo_num Save → URL+list; draft без Save;
      Cancel; Reset; пресет Save; города; status/statuses; битый
      query → fallback. Green `pnpm test:e2e` на filter-файле.
      check: `pnpm exec playwright test e2e/filters.spec.ts && pnpm verify`

- [x] * Specs set-bet: success flow (CTA→sheet→submit→bets/highlight);
      no CTA на cannot-set-bet; realtime invalid; 422; picker →
      success. Green полный `pnpm test:e2e`.
      check: `pnpm test:e2e && pnpm verify`

- [x] README (как ставить browsers + `pnpm test:e2e`) + строка в
      `AI_USAGE.md` (Playwright vs Cypress; e2e вне verify).
      check: `rg -q 'test:e2e|playwright' README.md AI_USAGE.md && pnpm verify && pnpm test:e2e`
