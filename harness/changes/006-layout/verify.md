# Verify: 006-layout

## Auto

- `pnpm verify` green
- Есть `@tanstack/router-plugin` в Vite и `src/app/routeTree.gen.ts`
- `RouterProvider` + generated `routeTree` в `app`
- Есть `src/widgets/app-shell` и `src/pages/auction-list` с public API

## Change acceptance

### Auto / structural

- [x] `pnpm verify` green
- [x] File-based: `app/routes` + `routeTree.gen.ts`; `/` → `/auctions`
- [x] Страница рендерит только заголовок «Аукционы»
- [x] Нет sidebar / footer-nav / nav-items в shell
- [x] Shell UI не в `app/ui` (Steiger green с ignore gen)
- [x] README: shell + адаптив + file-based routes / gen
- [x] Header: кнопка «Разработчик» → `dev.holuenko.ru` (новое окно)
- [x] Footer: текст про ООО Умная логистика + TG / визитка / почта
- [x] Favicon брендовый; иконка в header рядом с названием
- [x] `index.html`: title «УЛ Лайт - …» + meta description


### Manual

- [x] `pnpm dev`: header сверху, ниже заголовок «Аукционы» на `/auctions`,
      footer с кредитами внизу
- [x] `/` редиректит на `/auctions`
- [x] Кнопка «Разработчик» открывает `https://dev.holuenko.ru` в новой вкладке
- [x] Ссылки в footer (Telegram, визитка, почта) рабочие
- [x] Во вкладке браузера свой favicon (не Vite); title «УЛ Лайт - …»
- [x] В header видна иконка слева от бренда
- [x] Sidebar и нижний tab-bar отсутствуют (desktop и mobile)

### Manual — адаптив

- [x] Viewport ~375px: header + заголовок + footer читаемы, нет горизонтального
      scroll
- [x] Viewport ≥ `md`: header + контент + footer с нормальными отступами, layout
      не «ломается» и не требует horizontal scroll
- [x] Модель одна на всех ширинах: header → content → footer (без появления
      sidebar / footer-nav при ресайзе)
