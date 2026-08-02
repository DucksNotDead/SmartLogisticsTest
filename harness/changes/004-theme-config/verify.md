# Verify: 004-theme-config

## Auto

- `pnpm verify` green
- В `src/app/styles.css` primary завязан на brand yellow (ul.su), не дефолтный
  нейтральный shadcn primary

## Change acceptance

### Auto / structural

- [x] `pnpm verify` green
- [x] `:root` содержит brand primary/accent (соответствие палитре из `design.md`)
- [x] `.dark` адаптирован (не оставлен чужим purple sidebar-primary из default)
- [x] README или `AI_USAGE.md` упоминает ul.su как источник темы

### Manual

- [x] `pnpm dev`: smoke Button default выглядит жёлтым/брендовым; текст на кнопке
      читаемый (тёмный на жёлтом)
- [x] Светлая тема — основной сценарий; dark (если переключить класс) не «ломает»
      контраст primary
