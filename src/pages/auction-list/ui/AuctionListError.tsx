import { Button } from '@/shared/ui/button'

type AuctionListErrorProps = {
  onRetry: () => void
}

export function AuctionListError({ onRetry }: AuctionListErrorProps) {
  return (
    <div
      className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-8 text-center"
      role="alert"
    >
      <p className="text-base font-medium text-destructive">
        Не удалось загрузить список
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Проверьте соединение и попробуйте снова.
      </p>
      <Button className="mt-4" type="button" variant="outline" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  )
}
