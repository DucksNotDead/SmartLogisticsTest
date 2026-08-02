# Tasks: 006-layout

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] Page `pages/auction-list`: только заголовок «Аукционы» + public API
      `index.ts` (без list API / фильтров / карточек).
      check: `test -f src/pages/auction-list/index.ts && pnpm verify`

- [x] `widgets/app-shell`: Header + frame под Outlet; адаптивные отступы
      (mobile/desktop, без horizontal overflow); без sidebar / footer-nav /
      nav-items.
      check: `test -f src/widgets/app-shell/index.ts && pnpm verify`

- [x] * File-based TanStack Router: devDep `@tanstack/router-plugin` в Vite
      (до react); `app/routes` (`__root` + redirect `/` + `auctions`);
      `routeTree.gen.ts` в git; `createRouter` + `RouterProvider`; shell на
      root; eslint/steiger ignore для gen. QueryClient/MSW в `main.tsx`.
      check: `test -f src/app/routeTree.gen.ts && rg -q 'RouterProvider|routeTree' src/app && pnpm verify`

- [x] Header: справа primary-кнопка «Разработчик» →
      `https://dev.holuenko.ru` в новом окне (`target="_blank"`,
      `rel="noopener noreferrer"`); бренд слева без изменений.
      check: `rg -q 'dev.holuenko.ru' src/widgets/app-shell && pnpm verify`

- [x] Footer (не tab-bar): текст «Разработано с глубоким уважением для ООО
      Умная логистика» + контакты: Telegram `https://t.me/DucksNotDead`,
      визитка `https://dev.holuenko.ru`, почта `mailto:zerogormy@mail.ru`
      (внешние ссылки в новом окне; mailto — обычный). Встроить в
      `widgets/app-shell` (header → content → footer).
      check: `rg -q 'Умная логистика|DucksNotDead|zerogormy' src/widgets/app-shell && pnpm verify`

- [x] README: shell (header + content + footer), адаптив mobile/desktop,
      file-based routes / `routeTree.gen`, где `widgets/app-shell`, кнопка
      «Разработчик» и блок контактов в футере.
      check: `pnpm verify`

- [x] Favicon + icon в header: заменить Vite-дефолт `public/favicon.svg` на
      брендовый mark (цвета УЛ: primary `#F9C21D` / ink); тот же asset
      показать в header слева от названия (`img`/`svg`, alt пустой или
      «УЛ Лайт»). Не тащить иконку в `app/ui`.
      check: `rg -q 'favicon\\.svg' index.html src/widgets/app-shell && pnpm verify`

- [x] Document title + meta description в `index.html` (и `lang="ru"`):
      title `УЛ Лайт - грузовые аукционы`; description
      `SPA для работы с грузовыми аукционами. Тестовое задание для ООО Умная логистика.`;
      убрать `vite-scaffold-tmp`. README: одна строка про favicon/title.
      check: `rg -q 'УЛ Лайт - грузовые аукционы' index.html && rg -q 'meta name="description"' index.html && pnpm verify`
