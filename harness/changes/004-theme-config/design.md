# Design: 004-theme-config

## Approach

1. Снять ключевые цвета с [ul.su](https://ul.su/) (HTML/CSS лендинга) и зафиксировать
   рабочую палитру ниже.
2. Перевести hex → oklch (формат текущего `styles.css`) и прописать в `:root`.
3. Адаптировать `.dark`: тёмный фон + тот же brand primary/accent (не трогать
   продуктовую вёрстку).
4. Smoke shell: убедиться что default `Button` читается на brand primary;
   при необходимости лёгкий текст/подложка в `App.tsx` (без новых слайсов).
5. Документировать источник темы в README / пункт для `AI_USAGE.md`.

### Brand tokens (источник: ul.su)

| Role | Hex | Назначение |
|---|---|---|
| Ink | `#202020` | основной текст / foreground |
| Surface | `#FFFFFF` | background / card |
| Soft cream | `#FFEEBD` | muted / soft accent surfaces |
| Brand yellow | `#F9C21D` | **primary** (CTA на сайте) |
| Brand yellow deep | `#886A0F` | hover/pressed primary (или mix) |
| Brand orange | `#FF7610` / `#FCB448` | **accent** / chart accents |
| Muted gray | `#B3B3B9` / `#C4C4C4` | muted-foreground / borders soft |
| Slate | `#404051` | secondary text / sidebar-ish |

Контраст: на кнопках primary текст тёмный (`#202020` или близкий), не белый на
жёлтом (иначе слабый contrast на `#F9C21D`).

Шрифт сайта: Open Sans. В этом change **не меняем** уже подключённый Geist
(см. Trade-offs).

## FSD layout

n/a для новых слайсов — правка только:

```text
src/app/styles.css     # CSS variables / theme
src/app/App.tsx        # опционально smoke preview brand
README.md              # источник темы
AI_USAGE.md            # черновик решения (по желанию в том же task)
```

`shared/ui/*` не расширяем; токены подхватываются через существующие `bg-primary` и т.п.

## Trade-offs

| Option | Pros | Cons | Decision |
|---|---|---|---|
| Primary = `#F9C21D` (жёлтый) | главный CTA-цвет лендинга | нужен тёмный label на кнопке | **yellow primary** |
| Primary = `#FF7610` (оранж) | сильнее contrast с белым текстом | на сайте скорее вторичный акцент | accent / chart, не primary |
| Сменить Geist → Open Sans | ближе к сайту | лишний dep + вне «тема = tokens» | **оставить Geist** |
| Drop `.dark` | проще, сайт light-first | shadcn/dark variant останется битым | **адаптировать `.dark`** под бренд |
| Только tokens vs полный UI-kit | узкий scope, сразу польза для следующих pages | визуал страниц позже | **только tokens + smoke** |

## Progressive verify

Каждый task → `pnpm verify`.
