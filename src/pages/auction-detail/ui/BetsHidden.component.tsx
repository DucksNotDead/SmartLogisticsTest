export function BetsHidden() {
  return (
    <div
      className="min-w-0 rounded-lg border border-border px-4 py-8 text-center"
      data-hide_bets_history="true"
      data-bets-state="hidden"
    >
      <p className="text-sm font-medium">История ставок скрыта</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Организатор скрыл историю ставок для этого аукциона.
      </p>
    </div>
  )
}
