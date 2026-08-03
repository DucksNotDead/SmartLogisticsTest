type BetsTabPlaceholderProps = {
  hideBetsHistory: boolean
}

export function BetsTabPlaceholder({
  hideBetsHistory,
}: BetsTabPlaceholderProps) {
  if (hideBetsHistory) {
    return (
      <div
        className="min-w-0 rounded-lg border border-border px-4 py-8 text-center"
        data-hide_bets_history="true"
      >
        <p className="text-sm font-medium">История ставок скрыта</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Организатор скрыл историю ставок для этого аукциона.
        </p>
      </div>
    )
  }

  return (
    <div className="min-w-0 rounded-lg border border-dashed border-border px-4 py-8 text-center">
      <p className="text-sm font-medium">Ставки</p>
      <p className="mt-1 text-sm text-muted-foreground">
        История ставок появится в следующей версии.
      </p>
    </div>
  )
}
