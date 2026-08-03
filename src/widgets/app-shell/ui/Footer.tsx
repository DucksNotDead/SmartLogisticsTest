const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-20 shrink-0 border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
        <p className="min-w-0 md:max-w-xl">
          Разработано с глубоким уважением для "ООО Умная логистика"
        </p>
        <nav
          aria-label="Контакты разработчика"
          className="flex flex-wrap gap-x-4 gap-y-2 md:shrink-0 md:justify-end"
        >
          <a href="https://t.me/DucksNotDead" {...externalLinkProps} className="underline-offset-4 hover:text-foreground hover:underline">
            Telegram
          </a>
          <a href="https://dev.holuenko.ru" {...externalLinkProps} className="underline-offset-4 hover:text-foreground hover:underline">
            Сайт
          </a>
          <a href="mailto:zerogormy@mail.ru" className="underline-offset-4 hover:text-foreground hover:underline">
            Почта
          </a>
        </nav>
      </div>
    </footer>
  )
}
