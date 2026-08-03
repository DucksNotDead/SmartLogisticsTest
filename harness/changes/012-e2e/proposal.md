# Proposal: 012-e2e

## Goal

Покрыть Playwright e2e ключевые пользовательские сценарии фильтрации
списка и установки ставки (set-bet): happy-path и негативные кейсы
против MSW в браузере.

## In scope

- DevDep Playwright + конфиг (`playwright.config.ts`); скрипт
  `pnpm test:e2e` (webServer → `pnpm dev` / preview с MSW)
- Каталог `e2e/` (не FSD): helpers + specs
- Стабильные селекторы: role/label/text; `data-testid` только где
  role/text хрупки (точечно в UI)
- **Фильтры (`/auctions`):**
  - open drawer → `cargo_num` → Save → URL + список обновились
  - draft без Save не меняет URL/список; Cancel discard
  - Reset при active → defaults + URL
  - пресет (не `body`) → Save → applied в URL
  - города load/unload → Save → список сужается
  - `status` (торговый) и/или `statuses` (аукцион) → Save
  - битый query param → безопасный fallback без краша
- **Set-bet (detail, seed `SEED_AUCTION_UUID` / index 0):**
  - `can_set_bet=true`: CTA → bottomsheet → валидная цена → success
    (checked → close → tab bets → highlight / ставка в списке)
  - `can_set_bet=false` (seed index 4): CTA нет
  - невалидная цена: realtime текст, без shake
  - цена вне правил MSW → 422: shake / сообщение / error toast
  - выбор цены из пикера предложений → успешный submit
- README: как гонять e2e; черновик в `AI_USAGE.md`

## Out of scope

- Полный матричный прогон всех filter keys / всех seed fixtures
- Visual regression / Percy; a11y axe suite; CI pipeline YAML
- Включение e2e в `pnpm verify` / husky pre-commit
- Auth / 401 UX; Orval regen; пиксель-перфект UL
- Новые продуктовые фичи (только точечные testid / a11y hooks)

## Acceptance

- `pnpm test:e2e` green на локальном webServer с MSW
- Specs покрывают фильтры (save/cancel/reset/preset/города/status)
  и set-bet (success / no-CTA / realtime / 422 / picker)
- `pnpm verify` green (unit gate без e2e)
- README + `AI_USAGE.md` обновлены
