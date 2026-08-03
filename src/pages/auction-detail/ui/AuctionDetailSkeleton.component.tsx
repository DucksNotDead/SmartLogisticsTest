export function AuctionDetailSkeleton() {
  return (
    <div
      className="flex min-w-0 flex-col gap-4"
      data-testid="auction-detail-skeleton"
      aria-busy="true"
      aria-label="Загрузка аукциона"
    >
      <div className="flex items-start gap-1">
        <div className="mt-0.5 size-8 shrink-0 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="mt-1 h-8 w-48 max-w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-20 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-8 w-20 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="space-y-3">
        <div className="h-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-28 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  )
}
