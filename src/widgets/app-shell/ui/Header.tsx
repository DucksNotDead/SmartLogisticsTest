import { Button } from '@/shared/ui/button'

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src="/favicon.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          <p className="truncate text-sm font-semibold tracking-tight">
            УЛ Лайт - Тестовое задание
          </p>
        </div>
        <Button asChild variant="default" size="sm">
          <a
            href="https://dev.holuenko.ru"
            target="_blank"
            rel="noopener noreferrer"
          >
            Разработчик
          </a>
        </Button>
      </div>
    </header>
  )
}
