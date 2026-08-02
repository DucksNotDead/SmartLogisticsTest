export function AuctionListEmpty() {
  return (
    <div
      className="rounded-lg border border-dashed border-border px-4 py-10 text-center"
      role="status"
    >
      <p className="text-base font-medium">Аукционов не найдено</p>
      <p className="mt-1 text-sm text-muted-foreground">
        На этой странице пока нет записей.
      </p>
    </div>
  )
}
