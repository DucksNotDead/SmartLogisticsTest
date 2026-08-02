import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib'
import { useChromeTitleStore } from '@/shared/model'

const BRAND_PREFIX = 'УЛ Лайт - '
const BRAND_DEFAULT_SUFFIX = 'Тестовое задание'

export function Header() {
  const title = useChromeTitleStore((state) => state.title)
  const compactVisible = useChromeTitleStore((state) => state.compactVisible)
  const showCompact = Boolean(title) && compactVisible
  const compactLabel = title ?? 'Аукционы'

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-border bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="z-10 flex min-w-0 items-center gap-2">
          <img
            src="/favicon.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          <div className="relative min-w-0">
            <p
              className={cn(
                'truncate text-sm font-semibold tracking-tight transition-opacity duration-200 ease-out md:opacity-100',
                showCompact ? 'opacity-0 md:opacity-100' : 'opacity-100',
              )}
            >
              {BRAND_PREFIX}
              {BRAND_DEFAULT_SUFFIX}
            </p>
            <p
              data-compact-title
              aria-hidden={!showCompact}
              className={cn(
                'absolute inset-0 truncate text-sm font-semibold tracking-tight transition-opacity duration-200 ease-out md:hidden',
                showCompact ? 'opacity-100' : 'opacity-0',
              )}
            >
              {BRAND_PREFIX}
              {compactLabel}
            </p>
          </div>
        </div>

        <p
          data-compact-title-desktop
          aria-hidden={!showCompact}
          className={cn(
            'pointer-events-none absolute inset-x-0 mx-auto hidden max-w-[40%] truncate text-center text-sm font-semibold tracking-tight transition-[opacity,transform] duration-200 ease-out md:block',
            showCompact
              ? 'translate-y-0 opacity-100'
              : '-translate-y-1 opacity-0',
          )}
        >
          {compactLabel}
        </p>

        <div className="z-10 shrink-0">
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
      </div>
    </header>
  )
}
