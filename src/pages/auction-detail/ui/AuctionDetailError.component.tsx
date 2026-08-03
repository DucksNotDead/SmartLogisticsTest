import { Link } from '@tanstack/react-router'

import { Button } from '@/shared/ui/button'

type AuctionDetailErrorProps = {
  kind: 'not-found' | 'error'
  onRetry?: () => void
}

export function AuctionDetailError({ kind, onRetry }: AuctionDetailErrorProps) {
  if (kind === 'not-found') {
    return (
      <div
        className="rounded-lg border border-border px-4 py-8 text-center"
        role="alert"
      >
        <p className="text-base font-medium">Аукцион не найден</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Возможно, ссылка устарела или аукцион удалён.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/auctions" search={{ page: 1, per_page: 20 }}>
            К списку аукционов
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-8 text-center"
      role="alert"
    >
      <p className="text-base font-medium text-destructive">
        Не удалось загрузить аукцион
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Проверьте соединение и попробуйте снова.
      </p>
      {onRetry ? (
        <Button className="mt-4" type="button" variant="outline" onClick={onRetry}>
          Повторить
        </Button>
      ) : null}
    </div>
  )
}
