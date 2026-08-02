# Design: 006-layout

## Approach

1. DevDep `@tanstack/router-plugin`; в `vite.config` — `tanstackRouter({ target:
   'react', autoCodeSplitting: true, routesDirectory, generatedRouteTree })`
   **до** `react()`.
2. File-based routes в `src/app/routes/`:
   - `__root.tsx` — layout shell (header + outlet)
   - `index.tsx` — redirect → `/auctions`
   - `auctions.tsx` — page «Аукционы» (только заголовок)
3. Генерация `src/app/routeTree.gen.ts`; `createRouter({ routeTree })` в `app`;
   `App.tsx` → `RouterProvider`. Gen коммитить в git.
4. ESLint/Steiger: ignore `routeTree.gen.ts` (и при необходимости сегмент
   `routes` в app — точечный ignore + запись в AI_USAGE).
5. UI chrome в `widgets/app-shell`: **Header + frame с Outlet + Footer**.
   Sidebar / FooterNav (tab bar) / `nav-items` **не делать** (один раздел).
6. Header: слева бренд «УЛ Лайт»; справа `Button` (variant primary / default)
   «Разработчик» как `<a href="https://dev.holuenko.ru" target="_blank"
   rel="noopener noreferrer">` (через `asChild` у shared Button, если есть).
7. Footer (контентный, не навигация):
   - текст: «Разработано с глубоким уважением для ООО Умная логистика»
   - контакты (из портфолио):
     - Telegram: `https://t.me/DucksNotDead` (`target="_blank"`)
     - Визитка: `https://dev.holuenko.ru` (`target="_blank"`)
     - Почта: `mailto:zerogormy@mail.ru`
8. Адаптив (одна модель header→content→footer на всех ширинах):
   - fluid width, `min-h-svh`, горизонтальные padding с усилением на `md+`
   - header / content / footer не дают горизонтальный scroll на ~375px
   - при необходимости `max-w-*` + центрирование на широком экране
9. Page UI в `pages/auction-list`: компонент с одним заголовком.
   Route-файл — `createFileRoute` + рендер через public API.
10. QueryClient/MSW в `main.tsx` без изменений по смыслу `005`. Smoke
    Button/Input с корневого экрана убрать.
11. Brand assets / document meta:
    - `public/favicon.svg` — простой mark в цветах темы (не фиолетовый Vite)
    - header: `<img src="/favicon.svg" …>` слева от текста бренда
    - `index.html`: `lang="ru"`,
      `<title>УЛ Лайт - грузовые аукционы</title>`,
      `<meta name="description" content="SPA для работы с грузовыми аукционами. Тестовое задание для ООО Умная логистика." />`

### Layout схема

```text
Mobile (~375) / Desktop (md+): одна модель
┌─────────────────────────────────────┐
│ header: [icon] brand … [Разработчик]│
├─────────────────────────────────────┤
│ outlet: <h1>Аукционы</h1>           │
├─────────────────────────────────────┤
│ footer: уважение + TG / визитка / ✉ │
└─────────────────────────────────────┘
```

Без смены навигации между breakpoints; только spacing/ширина.

### Routes

| Path | Контент |
|---|---|
| `/` | redirect → `/auctions` |
| `/auctions` | только заголовок «Аукционы» |

Detail/bet (`/auctions/$uuid`, …) — не в этом change.

## FSD layout

```text
src/
  app/
    main.tsx
    App.tsx                 # RouterProvider
    router.tsx              # createRouter({ routeTree }) + type registration
    routeTree.gen.ts        # generated (git), lint/fsd ignore
    routes/
      __root.tsx            # AppShell + Outlet
      index.tsx             # redirect
      auctions.tsx          # → pages/auction-list
    styles.css
  widgets/
    app-shell/
      ui/                   # Header, Footer, AppShell (header + outlet + footer)
      index.ts
  pages/
    auction-list/
      ui/                   # только <h1>Аукционы</h1>
      index.ts
```

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| File-based plugin vs code-based | typed tree, рост роутов, плюс в портфолио | gen + steiger/eslint ignore | **file-based** |
| `app/routes` vs `src/routes` | всё под слоем app | нестандартный сегмент app | **`src/app/routes`** |
| Gen в git vs только на CI/dev | verify без предварительного generate | шум в diff | **в git** |
| Shell в `widgets/app-shell` | не UI-kit, композиция продукта | слайс | **widgets/app-shell** |
| Sidebar + footer-nav vs header+footer | богаче chrome | tab-bar не нужен при одном разделе | **header + content + credit footer** |

## Progressive verify

Каждый task → `pnpm verify`.
