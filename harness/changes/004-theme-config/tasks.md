# Tasks: 004-theme-config

Gate: `pnpm verify`.

Обычный `- [ ]` — можно пачкой в `/next-task`.
Префикс `*` — критичный: стоп перед ним, выполнять одним `/next-task`.

---

- [x] Переписать CSS variables в `src/app/styles.css` (`:root` + `.dark`) по
      brand-палитре из `design.md` (ul.su → primary/accent/foreground/…);
      primary-foreground тёмный на жёлтом.
      check: `rg -q 'F9C21D|#F9C21D|oklch' src/app/styles.css && pnpm verify`

- [x] Smoke `App.tsx`: default Button на brand primary читается; при необходимости
      короткий label/фон без новых FSD-слайсов и без продуктовых страниц.
      check: `pnpm verify`

- [x] README (+ при необходимости пункт в `AI_USAGE.md`): источник темы ul.su,
      что токены в `styles.css`, пиксель-перфект лендинга не цель.
      check: `pnpm verify`
