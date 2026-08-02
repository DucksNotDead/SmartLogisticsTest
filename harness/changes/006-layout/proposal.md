# Proposal: 006-layout

## Goal

Подключить TanStack Router (file-based + `routeTree.gen`) и собрать простой
app-shell: header сверху, контент текущей страницы ниже. Раздел по сути один
(«Аукционы»), поэтому sidebar и mobile footer-nav **не делаем**. Контент пока —
только заголовок страницы (без продуктового UI).

## In scope

- DevDep `@tanstack/router-plugin` (Vite, до `@vitejs/plugin-react`); генерация
  `routeTree.gen.ts`; file-based route files; gen в git (чтобы verify был
  зелёным без предварительного `dev`)
- Wiring TanStack Router в `app/` (`RouterProvider` + generated `routeTree`)
- App-shell: top→bottom: `header` → `content` (outlet) → `footer` (кредиты,
  не tab-bar)
- Header: справа primary-кнопка «Разработчик» → `https://dev.holuenko.ru`
  в новом окне
- Footer: «Разработано с глубоким уважением для ООО Умная логистика» +
  контакты (Telegram, визитка/портфолио, почта)
- Адаптив shell (без смены навигационной модели): читаемый layout на
  mobile (~375px) и desktop; без горизонтального скролла страницы; адекватные
  отступы header/content/footer (`md`+ можно шире)
- Страница «Аукционы»: **только заголовок** (без list/filters/API/форм)
- Redirect корня `/` → `/auctions`
- README: shell (header/content/footer), адаптив, file-based routes /
  `routeTree.gen`
- Favicon (вкладка) + та же иконка в header рядом с брендом
- `index.html`: title + meta description под продукт (не scaffold-заглушка)

## Out of scope

- Sidebar / desktop side-menu / mobile footer-nav (tab bar) — отменено:
  один раздел, навигация между разделами не нужна
- Реальные страницы list / detail / bets / set-bet (данные, фильтры, формы)
- Zod search params списка, prefetch по hover, MSW UI-сценарии ставки
- Auth / 401 UX, тема/токены (уже `004`), API/codegen (уже `005`)
- Detail/bet nested routes (`/auctions/$uuid`, …) — следующие page-changes
- Пиксель-перфект клон UL / маркетинговый лендинг

## Acceptance

- Есть header + область контента с outlet + footer с кредитами; нет sidebar и
  footer-nav (tab bar)
- В header справа primary «Разработчик» открывает `dev.holuenko.ru` в новом окне
- В footer: уважение к ООО Умная логистика + ссылки Telegram / визитка / почта
- **Адаптив:** на mobile (~375px) и desktop (≥`md`) видны header + контент +
  footer; нет горизонтального overflow у страницы; отступы не «прилипают» к краям
- File-based routing: plugin в Vite, есть `routeTree.gen.ts`, `RouterProvider`
  использует generated tree
- `/` → `/auctions`; страница рендерит только заголовок «Аукционы»
- Layout-chrome не в `app/ui` (Steiger); shell в `widgets/*`, page UI в
  `pages/*`; route-файлы — тонкие адаптеры
- Favicon не Vite-дефолт; иконка видна во вкладке и в header
- Title/description в `index.html` про УЛ Лайт / аукционы
- `pnpm verify` green; README: shell + адаптив + file-based routes
