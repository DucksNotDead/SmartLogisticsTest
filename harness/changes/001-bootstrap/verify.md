# Verify: 001-bootstrap

## Auto (per-task)

1. Есть script `verify` → `pnpm verify`
2. Иначе → `check:` текущего task
3. Red не пропускать

## Change acceptance

### Auto

- [ ] `pnpm verify` green
- [ ] `pnpm build` green

### Manual / structural

- [ ] В `package.json` есть: tanstack router/query, rhf, zod, zustand, msw
- [ ] Есть shadcn setup (`components.json` или эквивалент) + smoke ui-компонент
- [ ] `public/mockServiceWorker.js` (после msw init) существует
- [ ] Нет route tree / pages аукционов / OpenAPI client / бизнес MSW handlers

## Notes

Wiring Router/Query/MSW worker и FSD-страницы — следующие changes.
