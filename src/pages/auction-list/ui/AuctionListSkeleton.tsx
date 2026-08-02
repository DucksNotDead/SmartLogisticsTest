export function AuctionListSkeleton() {
  return (
    <ul
      data-testid="auction-list-skeleton"
      className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2"
      aria-busy="true"
      aria-label="Загрузка списка аукционов"
    >
      {Array.from({ length: 12 }, (_, index) => (
        <li
          key={index}
          className="h-36 animate-pulse rounded-lg bg-neutral-200 lg:h-40 dark:bg-neutral-700"
        />
      ))}
    </ul>
  )
}
