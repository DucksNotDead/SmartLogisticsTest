export function BetsEmpty() {
  return (
    <div
      className="min-w-0 rounded-lg border border-dashed border-border px-4 py-8 text-center"
      data-bets-state="empty"
    >
      <p className="text-sm font-medium">Ставок пока нет</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Когда участники сделают ставки, они появятся здесь.
      </p>
    </div>
  )
}
