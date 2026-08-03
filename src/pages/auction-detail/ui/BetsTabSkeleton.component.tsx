export function BetsTabSkeleton() {
  return (
    <div
      className="flex min-w-0 flex-col gap-3"
      data-bets-state="pending"
      data-testid="bets-tab-skeleton"
      aria-busy="true"
      aria-label="Загрузка ставок"
    >
      <div className="h-5 w-36 max-w-full animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-28 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-28 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
    </div>
  )
}
